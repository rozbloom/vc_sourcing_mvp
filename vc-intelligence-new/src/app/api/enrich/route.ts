// app/api/enrich/route.ts
import { liveEnrich } from "../../../lib/enrich-companies";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url || typeof url !== "string") {
            return NextResponse.json(
                { error: "Valid website URL is required" },
                { status: 400 }
            );
        }

        // Call the multi-source enrichment (handles cleaning, scraping /blog, /careers, etc.)
        const result = await liveEnrich(url);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Enrichment error:", error);

        return NextResponse.json(
            {
                error: error.message || "Live enrichment failed",
                details: process.env.NODE_ENV === "development" ? error.stack : undefined,
            },
            { status: 500 }
        );
    }
}