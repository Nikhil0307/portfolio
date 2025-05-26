// app/api/substack/route.ts (or your current route file name)
import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

interface CustomFeedItemEnclosure {
  url?: string;
  type?: string;
  length?: string;
}

interface CustomFeedItemItunes {
  image?: string; // For simple cases where itunes:image is just a URL string
}

interface CustomFeedItemMediaContent {
  $: {
    url: string;
    medium?: string; // e.g., 'image'
    type?: string;   // e.g., 'image/jpeg'
  };
}

interface CustomFeedItem {
  title?: string;
  link?: string;
  pubDate?: string;
  content?: string; // Full HTML content
  contentSnippet?: string; // Short text snippet
  guid?: string;
  isoDate?: string;
  enclosure?: CustomFeedItemEnclosure;
  itunes?: CustomFeedItemItunes; // Parsed by rss-parser for <itunes:image>
  "media:content"?: CustomFeedItemMediaContent[] | CustomFeedItemMediaContent; // For <media:content>
  // For custom parsed fields from rss-parser if configured, e.g. itunesImage
  itunesImage?: { href?: string };
}

interface CustomFeed {
  items: CustomFeedItem[];
}

const parser = new Parser({
  customFields: {
    item: [
      ['itunes:image', 'itunesImageParsed', {
        keepArray: false,
        parse: (value: any) => ({ href: value.$.href })
      }] as any,
      ['media:content', 'mediaContent', {
        keepArray: true
      }] as any
    ]    
  }
});


function extractImageFromHtml(htmlContent: string | undefined): string | undefined {
  if (!htmlContent) return undefined;
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = htmlContent.match(imgRegex);
  return match ? match[1] : undefined;
}

export async function GET() {
  const SUBSTACK_URL = 'https://nikhilbaskar.substack.com/feed';
  console.log(`Fetching Substack feed from: ${SUBSTACK_URL}`); // Log start

  try {
    const feed = await parser.parseURL(SUBSTACK_URL);
    console.log(`Successfully fetched and parsed feed. Found ${feed.items.length} items.`); // Log success

    const posts = feed.items.map((item: any, index: number) => { // Added 'any' for easier access to custom parsed fields initially
      console.log(`Processing item ${index + 1}: ${item.title}`); // Log each item
      let imageUrl: string | undefined = undefined;

      // 1. Try itunes:image (via custom field 'itunesImageParsed')
      if (item.itunesImageParsed?.href) {
        imageUrl = item.itunesImageParsed.href;
        console.log(`  Image from itunesImageParsed: ${imageUrl}`);
      }

      // 2. Try itunes:image (direct object, if not caught by custom field)
      //    Substack's <itunes:image href="..."/> often gets parsed directly by rss-parser into itunes.image as a string.
      if (!imageUrl && item.itunes?.image && typeof item.itunes.image === 'string') {
        imageUrl = item.itunes.image;
         console.log(`  Image from direct item.itunes.image: ${imageUrl}`);
      }


      // 3. Try media:content (via custom field 'mediaContent')
      if (!imageUrl && item.mediaContent) {
        const mediaContentArray = Array.isArray(item.mediaContent) ? item.mediaContent : [item.mediaContent];
        const imageMedia = mediaContentArray.find(
          (media: any) => media?.$?.medium === 'image' || media?.$?.type?.startsWith('image/')
        );
        if (imageMedia) {
          imageUrl = imageMedia.$.url;
          console.log(`  Image from mediaContent: ${imageUrl}`);
        }
      }
      
      // 4. Try enclosure URL if it's an image
      if (!imageUrl && item.enclosure?.url && item.enclosure?.type?.startsWith('image/')) {
        imageUrl = item.enclosure.url;
        console.log(`  Image from enclosure: ${imageUrl}`);
      }
      
      // 5. Fallback: extract from HTML content (item.content)
      if (!imageUrl) {
        imageUrl = extractImageFromHtml(item.content);
        if (imageUrl) console.log(`  Image from HTML content: ${imageUrl}`);
        else console.log(`  No image found through standard means or HTML for: ${item.title}`);
      }
      
      // Ensure description is a string
      let description = item.contentSnippet || '';
      if (description.length > 150) {
        description = description.substring(0, 147) + '...';
      } else if (!description && item.content) {
        // Basic strip HTML for snippet if contentSnippet is missing
        const textContent = item.content.replace(/<[^>]*>?/gm, '');
        description = textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '');
      }
      if (!description) {
        description = 'No description available.';
      }

      return {
        title: item.title || 'Untitled Post',
        description: description,
        url: item.link || '#',
        date: item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US', {
          year: 'numeric', month: 'short', day: 'numeric',
        }) : 'No date',
        image: imageUrl,
      };
    }).slice(0, 9); // Get latest 9 posts

    console.log("Processed posts:", posts.map(p => ({ title: p.title, image: p.image ? 'Yes' : 'No' }))); // Log processed posts info
    return NextResponse.json(posts);

  } catch (error: any) {
    console.error('Failed to fetch or parse Substack feed:', error);
    // Log the detailed error object
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json(
      { error: 'Failed to fetch or process Substack feed', details: error.message },
      { status: 500 }
    );
  }
}

// Optional: Revalidate data periodically (e.g., every hour)
export const revalidate = 3600; // 3600 seconds = 1 hour