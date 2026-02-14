import { handleQuery } from "../lib/cacheStore.js";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const t0 = Date.now();

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
    const query = body.query;
    const application = body.application || "document summarizer";

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Missing 'query' string" });
    }

    const out = await handleQuery({ query, application });

    // Ensure response schema requested
    return res.status(200).json({
      answer: out.answer,
      cached: Boolean(out.cached),
      latency: out.latency ?? (Date.now() - t0),
      cacheKey: out.cacheKey,
    });
  } catch (e) {
    return res.status(200).json({
      answer: "Error handled gracefully: summarizer unavailable for this request.",
      cached: false,
      latency: Date.now() - t0,
      cacheKey: "error",
    });
  }
}
