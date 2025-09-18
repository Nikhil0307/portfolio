// app/api/substack/route.ts
import { NextResponse } from "next/server";
import Parser from "rss-parser";

type Maybe<T> = T | undefined;

interface CustomFeedItemEnclosure {
  url?: string;
  type?: string;
  length?: string | number; // accept both number (rss-parser) and string
}

interface CustomFeedItemItunes {
  image?: string;
}

interface CustomFeedItemMediaContent {
  $: {
    url: string;
    medium?: string;
    type?: string;
  };
}

interface CustomFeedItem {
  title?: string;
  link?: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  guid?: string;
  isoDate?: string;
  enclosure?: CustomFeedItemEnclosure;
  itunes?: CustomFeedItemItunes;
  "media:content"?: CustomFeedItemMediaContent[] | CustomFeedItemMediaContent;
  itunesImage?: { href?: string };
  itunesImageParsed?: { href?: string };
  mediaContent?: CustomFeedItemMediaContent[] | CustomFeedItemMediaContent;
}

const parser = new Parser({
  customFields: {
    item: [
      [
        "itunes:image",
        "itunesImageParsed",
        {
          keepArray: false,
          parse: (value: any) => ({ href: value?.$.href ?? value }),
        },
      ] as any,
      ["media:content", "mediaContent", { keepArray: true }] as any,
    ],
  },
});

// Simple in-memory cache per serverless instance
type CacheRecord = { ts: number; data: any };
declare global {
  // eslint-disable-next-line no-var
  var __HASHNODE_RSS_CACHE__: Maybe<CacheRecord>;
}
if (!globalThis.__HASHNODE_RSS_CACHE__) {
  globalThis.__HASHNODE_RSS_CACHE__ = undefined;
}

function extractImageFromHtml(htmlContent: string | undefined): string | undefined {
  if (!htmlContent) return undefined;
  const imgRegex = /<img[^>]+src=["']([^"'>]+)["']/i;
  const match = htmlContent.match(imgRegex);
  return match ? match[1] : undefined;
}

async function fetchWithRetry(url: string, attempts = 4, baseDelay = 1000) {
  let lastErr: any = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          // set a friendly user-agent so some servers don't reject anonymous serverless requests
          "User-Agent": "NikhilPortfolio/1.0 (+https://nkhil-baskar.github.io)",
          Accept: "application/rss+xml, application/xml, text/xml",
        },
        // you can set a reasonable timeout using AbortController if desired
      });

      if (res.status === 429) {
        // Respect Retry-After header if provided
        const ra = res.headers.get("retry-after");
        let wait = baseDelay * Math.pow(2, i); // exponential backoff
        if (ra) {
          const raSec = parseInt(ra, 10);
          if (!Number.isNaN(raSec)) wait = Math.max(wait, raSec * 1000);
        }
        lastErr = new Error(`Status code 429`);
        // wait and then retry
        await new Promise((r) => setTimeout(r, wait));
        continue;
      }

      if (!res.ok) {
        lastErr = new Error(`Status code ${res.status}`);
        // for other 5xx/4xx we may still retry a few times
        await new Promise((r) => setTimeout(r, baseDelay * Math.pow(2, i)));
        continue;
      }

      const text = await res.text();
      return text;
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, baseDelay * Math.pow(2, i)));
    }
  }

  throw lastErr ?? new Error("Failed to fetch after retries");
}

export async function GET() {
  const HASHNODE_RSS_URL =
    process.env.HASHNODE_RSS_URL || "https://nikhil-baskar.hashnode.dev/rss.xml";
  const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour cache per instance

  console.log(`Fetching Hashnode feed from: ${HASHNODE_RSS_URL}`);

  // serve cached if fresh
  const cache = globalThis.__HASHNODE_RSS_CACHE__;
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) {
    console.log("Serving feed from in-memory cache");
    return NextResponse.json(cache.data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=60",
      },
    });
  }

  try {
    // fetch RSS text with retry/backoff
    const rssText = await fetchWithRetry(HASHNODE_RSS_URL, 4, 1000);
    const feed = await parser.parseString(rssText);

    console.log(`Successfully fetched and parsed feed. Found ${feed.items.length} items.`);

    const posts = feed.items
      .map((item: any, index: number) => {
        let imageUrl: string | undefined = undefined;

        if (item.itunesImageParsed?.href) {
          imageUrl = item.itunesImageParsed.href;
        }

        if (!imageUrl && item.itunes?.image && typeof item.itunes.image === "string") {
          imageUrl = item.itunes.image;
        }

        if (
          !imageUrl &&
          (item.mediaContent || item["media:content"])
        ) {
          const mediaArray = Array.isArray(item.mediaContent)
            ? item.mediaContent
            : item.mediaContent
            ? [item.mediaContent]
            : Array.isArray(item["media:content"])
            ? item["media:content"]
            : item["media:content"]
            ? [item["media:content"]]
            : [];
          const imageMedia = (mediaArray as any[]).find(
            (m) => m?.$?.medium === "image" || m?.$?.type?.startsWith?.("image/")
          );
          if (imageMedia) {
            imageUrl = imageMedia.$.url;
          }
        }

        if (!imageUrl && item.enclosure?.url && item.enclosure?.type?.startsWith?.("image/")) {
          imageUrl = item.enclosure.url;
        }

        if (!imageUrl) {
          imageUrl = extractImageFromHtml(item.content);
        }

        let description = item.contentSnippet ?? "";
        if (!description && item.content) {
          const text = item.content.replace(/<[^>]*>?/gm, "");
          description = text.substring(0, 150) + (text.length > 150 ? "..." : "");
        }
        if (!description) description = "No description available.";

        return {
          title: item.title || "Untitled Post",
          description,
          url: item.link || "#",
          date: item.pubDate
            ? new Date(item.pubDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "No date",
          image: imageUrl,
        };
      })
      .slice(0, 9);

    // update cache
    globalThis.__HASHNODE_RSS_CACHE__ = { ts: Date.now(), data: posts };

    return NextResponse.json(posts, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=60",
      },
    });
  } catch (error: any) {
    console.error("Failed to fetch or parse Hashnode feed:", error);
    // if we have stale cache, return it instead of error
    if (cache) {
      console.log("Returning stale cached data due to fetch error.");
      return NextResponse.json(cache.data, {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=60",
        },
      });
    }

    return NextResponse.json(
      { error: "Failed to fetch or process Hashnode feed", details: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}

export const revalidate = 3600;
