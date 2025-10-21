import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/client";

export async function GET(request: NextRequest) {
  try {
    // Get environment from request or default to production
    const environment = process.env.NODE_ENV === "production" ? "production" : "staging";
    
    // Fetch robots.txt configuration from Sanity
    const robotsConfig = await client.fetch(`
      *[_type == "robotsTxt" && environment == $environment && isActive == true][0]
    `, { environment });

    if (!robotsConfig) {
      // Default robots.txt if no configuration found
      return new NextResponse(`User-agent: *
Disallow: /admin
Disallow: /studio
Disallow: /api/
Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'}/sitemap.xml`, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    // Build robots.txt content
    let robotsContent = "";
    
    // Add user agent rules
    if (robotsConfig.userAgents?.length) {
      for (const userAgent of robotsConfig.userAgents) {
        robotsContent += `User-agent: ${userAgent.name}\n`;
        
        if (userAgent.disallow?.length) {
          for (const path of userAgent.disallow) {
            robotsContent += `Disallow: ${path}\n`;
          }
        }
        
        if (userAgent.allow?.length) {
          for (const path of userAgent.allow) {
            robotsContent += `Allow: ${path}\n`;
          }
        }
        
        if (userAgent.crawlDelay) {
          robotsContent += `Crawl-delay: ${userAgent.crawlDelay}\n`;
        }
        
        robotsContent += "\n";
      }
    }
    
    // Add sitemap
    if (robotsConfig.sitemap) {
      robotsContent += `Sitemap: ${robotsConfig.sitemap}\n`;
    }
    
    // Add additional directives
    if (robotsConfig.additionalDirectives?.length) {
      for (const directive of robotsConfig.additionalDirectives) {
        robotsContent += `${directive.directive}\n`;
      }
    }

    return new NextResponse(robotsContent, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("Error generating robots.txt:", error);
    
    // Fallback robots.txt
    return new NextResponse(`User-agent: *
Disallow: /admin
Disallow: /studio
Disallow: /api/`, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}
