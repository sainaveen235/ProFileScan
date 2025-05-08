import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/analyze-resume";
import { RateLimiter } from "@/lib/rate-limiter";

const rateLimiter = new RateLimiter();

export async function POST(req: NextRequest) {
  try {
    // Get client IP
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    const isLimited = await rateLimiter.isRateLimited(ip);
    if (isLimited) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Validate token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || authHeader !== `Bearer ${process.env.API_TOKEN}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { resumeText } = await req.json();

    if (!resumeText) {
      return NextResponse.json(
        { error: "Resume text is required" },
        { status: 400 }
      );
    }

    // Analyze resume
    const analysis = await analyzeResume(resumeText);

    // Add remaining requests to response headers
    const remaining = await rateLimiter.getRemainingRequests(ip);
    const response = NextResponse.json(analysis);
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    
    return response;
  } catch (error: any) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
} 