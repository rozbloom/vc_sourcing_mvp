// lib/enrich-company.ts
const CANDIDATE_PATHS = [
    "",
    "/blog",
    "/careers",
    "/about",
    "/company",
    "/docs",
    "/products",
];

function cleanHtml(html: string): string {
    return html
        // Remove scripts, styles, nav, footer, etc.
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
        .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
        .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "")
        // Strip all HTML tags
        .replace(/<[^>]+>/g, " ")
        // Normalize whitespace
        .replace(/\s+/g, " ")
        .trim();
}

async function scrapePage(baseUrl: string, path: string) {
    try {
        const url = baseUrl.replace(/\/$/, "") + (path === "" ? "" : path);
        const res = await fetch(url, {
            headers: { "User-Agent": "VC-Discovery/1.0 (+https://yourportfolio.com)" },
            signal: AbortSignal.timeout(8000),
        });

        if (!res.ok) return null;

        const html = await res.text();
        const cleanText = cleanHtml(html);

        return {
            url,
            content: cleanText.length > 50 ? cleanText : null, // ignore tiny pages
        };
    } catch {
        return null;
    }
}

export async function liveEnrich(websiteUrl: string) {
    const sources: any[] = [];
    let combinedText = "";

    for (const path of CANDIDATE_PATHS) {
        const page = await scrapePage(websiteUrl, path);
        if (page && page.content) {
            sources.push({
                url: page.url,
                timestamp: new Date().toISOString(),
            });
            combinedText += page.content + "\n\n";
        }
    }

    if (combinedText.length < 100) {
        throw new Error("Could not extract meaningful content");
    }

    // ← YOUR LLM CALL GOES HERE (Groq, OpenAI, Together, etc.)
    // Example prompt (paste your existing one, just change the input):
    const prompt = `You are a senior VC analyst. Analyze this website content and return ONLY valid JSON (no markdown, no extra text):

${combinedText.slice(0, 14000)}

{
  "summary": "1-2 crisp sentences about the company",
  "whatTheyDo": ["bullet 1 starting with verb", "bullet 2", ...], // 3-6 bullets
  "keywords": ["keyword1", "keyword2", ...], // 5-10
  "signals": [
    {"label": "Founding year detected", "source": "https://...", "timestamp": "ISO"},
    ...
  ]
}`;

    // ← CALL YOUR LLM HERE (replace with your actual code)
    // const llmResponse = await groq.chat.completions.create({...});
    // const parsed = JSON.parse(llmResponse.choices[0].message.content!);

    // Fallback mock for testing (delete once your LLM works)
    const parsed = {
        summary: "AI-powered platform that helps VCs discover and track startups in real-time.",
        whatTheyDo: [
            "Scrapes and enriches company websites automatically",
            "Builds live signals timeline from public pages",
            "Enables saving companies to custom VC lists",
            "Provides structured data for investment decisions",
        ],
        keywords: ["venture capital", "startup discovery", "enrichment", "signals", "lists"],
        signals: [],
    };

    // Add detected pages as signals
    const pageSignals = sources.map((s, i) => ({
        id: `page-${Date.now()}-${i}`,
        label: `${s.url.split("/").pop() || "Homepage"} page detected`,
        source: s.url,
        timestamp: s.timestamp,
    }));

    return {
        summary: parsed.summary,
        whatTheyDo: parsed.whatTheyDo,
        keywords: parsed.keywords,
        signals: [...(parsed.signals || []), ...pageSignals],
    };
}