// app/api/substack/route.ts
import { NextResponse } from "next/server";

const HASHNODE_GQL_ENDPOINT = "https://gql.hashnode.com/";
const BLOG_HOST = process.env.HASHNODE_BLOG_HOST || "nikhil-baskar.hashnode.dev";
const CACHE_TTL_MS = Number(process.env.HASHNODE_CACHE_TTL_MS ?? 1000 * 60 * 60); // 1h

const SMALL_FALLBACK = [
  {
    title: "My Hashnode Blog",
    description: "Feed is temporarily unavailable. Visit my Hashnode directly.",
    url: `https://${BLOG_HOST}/`,
    date: "",
    image: undefined,
  },
];

type CacheRecord = { ts: number; data: any };

// per-instance cache
declare global {
  // eslint-disable-next-line no-var
  var __HASHNODE_GQL_CACHE__: CacheRecord | undefined;
}
if (!globalThis.__HASHNODE_GQL_CACHE__) globalThis.__HASHNODE_GQL_CACHE__ = undefined;

function mapPostsFromGraphQL(edges: any[]) {
  return (edges || [])
    .map((edge: any) => edge?.node)
    .filter(Boolean)
    .slice(0, 9)
    .map((post: any) => ({
      title: post.title || "Untitled Post",
      description: post.brief || "No description available.",
      url: `https://${BLOG_HOST}/${post.slug}`,
      date: post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "No date",
      image: post.coverImage?.url || undefined,
    }));
}

export async function GET() {
  const cache = globalThis.__HASHNODE_GQL_CACHE__;
  if (cache && Date.now() - cache.ts < CACHE_TTL_MS) {
    console.log("Serving posts from in-memory cache");
    return NextResponse.json(cache.data, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=60" },
    });
  }

  const query = `
    query GetPublication($host: String!) {
      publication(host: $host) {
        id
        title
        posts(first: 10) {
          edges {
            node {
              title
              brief
              slug
              coverImage {
                url
              }
              publishedAt
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(HASHNODE_GQL_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables: { host: BLOG_HOST } }),
    });

    const json = await res.json();

    if (json.errors) {
      console.error("GraphQL returned errors:", JSON.stringify(json.errors, null, 2));
      return NextResponse.json(
        { error: "GraphQL errors", details: json.errors },
        { status: 502 }
      );
    }

    const edges = json?.data?.publication?.posts?.edges;
    if (!Array.isArray(edges)) {
      console.warn("GraphQL returned unexpected shape:", json?.data);
      return NextResponse.json(SMALL_FALLBACK, { status: 200 });
    }

    const mapped = mapPostsFromGraphQL(edges);

    globalThis.__HASHNODE_GQL_CACHE__ = { ts: Date.now(), data: mapped };
    console.log(`Fetched ${mapped.length} posts from Hashnode GraphQL and cached.`);

    return NextResponse.json(mapped, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=60" },
    });
  } catch (err: any) {
    console.error("Unexpected error fetching Hashnode GraphQL:", err);
    if (cache) {
      return NextResponse.json(cache.data, {
        headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=60" },
      });
    }
    return NextResponse.json(SMALL_FALLBACK, { status: 200 });
  }
}

export const revalidate = 1800;
