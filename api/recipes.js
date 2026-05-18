import Anthropic from "@anthropic-ai/sdk";
const client = new Anthropic();

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  
  const { calories, protein, culture, diet, goal } = req.body;
  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      messages: [{ role: "user", content: `Give 4 specific ${culture} ${diet} recipes for ${calories} cal/day and ${protein}g protein. Goal: ${goal}. Return ONLY JSON array: [{"name":"string","calories":number,"protein":number,"description":"1-2 sentences"}]. No markdown.` }]
    });
    const recipes = JSON.parse(message.content[0].text.replace(/```json|```/g,"").trim());
    return res.status(200).json({ recipes });
  } catch (e) {
    return res.status(500).json({ error: "Failed" });
  }
}
