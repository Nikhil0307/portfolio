// app/api/substack/route.ts
import { NextResponse } from "next/server";
import Parser from "rss-parser";

interface CustomFeedItemEnclosure {
  url?: string;
  type?: string;
  length?: string | number;
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
  // fields from customFields parser config
  itunesImageParsed?: { href?: string };
  mediaContent?: CustomFeedItemMediaContent[] | CustomFeedItemMediaContent;
}

const parser = new Parser({
  customFields: {
    item: [
      // try to capture itunes image formats if present (defensive)
      ["itunes:image", "itunesImageParsed", {
        keepArray: false,
        parse: (value: any) => ({ href: value?.$.href ?? value })
      }] as any,
      // capture media:content into mediaContent
      ["media:content", "mediaContent", { keepArray: true }] as any,
    ],
  },
});

function extractImageFromHtml(htmlContent: string | undefined): string | undefined {
  if (!htmlContent) return undefined;
  const imgRegex = /<img[^>]+src=["']([^"'>]+)["']/i;
  const match = htmlContent.match(imgRegex);
  return match ? match[1] : undefined;
}

export async function GET() {
  // Default to the Hashnode RSS URL for your Hashnode account.
  // You can override this by setting HASHNODE_RSS_URL in your environment.
  const HASHNODE_RSS_URL = process.env.HASHNODE_RSS_URL || "https://nikhil-baskar.hashnode.dev/rss.xml";

  console.log(`Fetching Hashnode feed from: ${HASHNODE_RSS_URL}`);

  try {
    const feed = await parser.parseURL(HASHNODE_RSS_URL);
    console.log(`Successfully fetched and parsed feed. Found ${feed.items.length} items.`);

    const posts = feed.items.map((item: CustomFeedItem, index: number) => {
      console.log(`Processing item ${index + 1}: ${item.title}`);

      let imageUrl: string | undefined = undefined;

      // 1. try custom parsed itunes image
      if (item.itunesImageParsed?.href) {
        imageUrl = item.itunesImageParsed.href;
        console.log(`  Image from itunesImageParsed: ${imageUrl}`);
      }

      // 2. try common itunes.image field
      if (!imageUrl && item.itunes?.image && typeof item.itunes.image === "string") {
        imageUrl = item.itunes.image;
        console.log(`  Image from item.itunes.image: ${imageUrl}`);
      }

      // 3. try media:content (parsed into mediaContent)
      if (!imageUrl && (item.mediaContent || item["media:content"])) {
        const mediaArray = Array.isArray(item.mediaContent) ? item.mediaContent : (item.mediaContent ? [item.mediaContent] : (Array.isArray(item["media:content"]) ? item["media:content"] : item["media:content"] ? [item["media:content"]] : []));
        const imageMedia = (mediaArray as any[]).find(
          (m) => m?.$?.medium === "image" || m?.$?.type?.startsWith?.("image/")
        );
        if (imageMedia) {
          imageUrl = imageMedia.$.url;
          console.log(`  Image from mediaContent/media:content: ${imageUrl}`);
        }
      }

      // 4. try enclosure
      if (!imageUrl && item.enclosure?.url && item.enclosure?.type?.startsWith?.("image/")) {
        imageUrl = item.enclosure.url;
        console.log(`  Image from enclosure: ${imageUrl}`);
      }

      // 5. fallback: try to extract first <img> from content (Hashnode often embeds images in content)
      if (!imageUrl) {
        imageUrl = extractImageFromHtml(item.content);
        if (imageUrl) console.log(`  Image extracted from HTML content: ${imageUrl}`);
        else console.log(`  No image found for item: ${item.title}`);
      }

      // build a short description/snippet
      let description = item.contentSnippet ?? "";
      if (!description && item.content) {
        // simple strip HTML fallback
        const text = item.content.replace(/<[^>]*>?/gm, "");
        description = text.substring(0, 150) + (text.length > 150 ? "..." : "");
      }
      if (!description) description = "No description available.";

      return {
        title: item.title || "Untitled Post",
        description,
        url: item.link || "#",
        date: item.pubDate
          ? new Date(item.pubDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
          : "No date",
        image: imageUrl,
      };
    }).slice(0, 9); // latest 9 posts

    console.log("Processed posts info:", posts.map(p => ({ title: p.title, hasImage: !!p.image })));
    return NextResponse.json(posts);
  } catch (error: any) {
    console.error("Failed to fetch or parse Hashnode feed:", error);
    console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json(
      { error: "Failed to fetch or process Hashnode feed", details: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}

export const revalidate = 3600;
