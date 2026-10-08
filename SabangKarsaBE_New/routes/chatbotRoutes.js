const express = require("express");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.post("/", verifyToken, async (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message || message.length > 4000) {
    return res.status(400).json({ message: "Pesan harus berisi 1 sampai 4000 karakter." });
  }
  if (!process.env.GROK_API_KEY) {
    return res.status(503).json({ message: "Chatbot belum dikonfigurasi." });
  }

  try {
    const upstream = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROK_MODEL || "grok-4-1-fast-non-reasoning",
        messages: [
          { role: "system", content: "Anda adalah Nila, asisten SabangKarsa. Jawab dalam bahasa pengguna dengan ramah dan ringkas. Jangan mengarang harga, ketersediaan, atau informasi layanan SabangKarsa yang tidak diketahui." },
          { role: "user", content: message },
        ],
      }),
      signal: AbortSignal.timeout(30000),
    });
    if (!upstream.ok) {
      console.error("Grok API status:", upstream.status);
      return res.status(502).json({ message: "Layanan chatbot sedang bermasalah. Silakan coba lagi." });
    }
    const data = await upstream.json();
    const answer = data.choices?.[0]?.message?.content;
    if (typeof answer !== "string" || !answer.trim()) {
      return res.status(502).json({ message: "Chatbot tidak memberikan jawaban. Silakan coba lagi." });
    }
    return res.json({ response: answer });
  } catch (error) {
    console.error("Grok request failed:", error.message);
    return res.status(502).json({ message: "Layanan chatbot tidak dapat dihubungi. Silakan coba lagi." });
  }
});

module.exports = router;
