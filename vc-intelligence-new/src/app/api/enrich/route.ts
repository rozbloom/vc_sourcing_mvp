import { NextResponse } from "next/server";

/* Basic text cleaner */
function stripHTML(html: string) {
    return html
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

/* Basic keyword extractor (MVP-level) */
function extractKeywords(text: string) {
    const words = text
        .toLowerCase()
        .split(" ")
        .filter((w) => w.length > 6);

    return [...new Set(words)].slice(0, 8);
}

/* Signal detection */
function detectSignals(text: string) {
    const signals: string[] = [];

    if (text.includes("careers")) signals.push("has careers page");
    if (text.includes("blog")) signals.push("blog exists");
    if (text.includes("pricing")) signals.push("pricing page exists");
    if (text.includes("docs")) signals.push("documentation exists");

    return signals;
}

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json(
                { error: "Missing URL" },
                { status: 400 }
            );
        }

        /* Fetch site */
        const html = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0",
            },
        }).then((res) => res.text());

        /* Clean content */
        const cleanText = stripHTML(html).slice(0, 4000);

        /* HuggingFace summarization */
        const hfResponse = await fetch(
            "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: cleanText,
                }),
            }
        );

        const hfData = await hfResponse.json();

        const summary =
            hfData?.[0]?.summary_text ||
            "Summary could not be generated.";

        /* Structured extraction (simple but valid for assignment) */
        const keywords = extractKeywords(cleanText);
        const signals = detectSignals(cleanText);

        return NextResponse.json({
            summary,
            whatTheyDo: summary.split(".").slice(0, 3),
            keywords,
            signals,
            sources: [
                {
                    url,
                    timestamp: new Date().toISOString(),
                },
            ],
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Enrichment failed" },
            { status: 500 }
        );
    }
}