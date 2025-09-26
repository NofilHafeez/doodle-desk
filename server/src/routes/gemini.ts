import express from "express";
import { askGemini } from "../services/gemini";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { prompt } = req.body;
    const text = await askGemini(prompt);
    res.json({ response: text });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
 