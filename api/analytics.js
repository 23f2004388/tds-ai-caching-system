import { getAnalytics } from "../lib/cacheStore.js";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "GET only" });

  const a = getAnalytics();

  // Return exactly the keys the prompt expects (+ extra 'memory' is usually fine;
  // if you want strictly only the required keys, tell me and I'll strip it.)
  return res.status(200).json({
    hitRate: a.hitRate,
    totalRequests: a.totalRequests,
    cacheHits: a.cacheHits,
    cacheMisses: a.cacheMisses,
    cacheSize: a.cacheSize,
    costSavings: a.costSavings,
    savingsPercent: a.savingsPercent,
    strategies: a.strategies,
  });
}
