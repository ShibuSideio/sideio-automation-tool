import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// --- API ENDPOINT: Generate Strategy ---
app.post('/api/create-campaign', async (req, res) => {
  try {
    const { topic, audience, tone } = req.body;
    console.log(`⚡ Generating campaign for: ${topic}`);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    const prompt = `
      Act as a Senior Social Media Strategist.
      Topic: ${topic}
      Target Audience: ${audience}
      Tone: ${tone}

      Generate a JSON response with 3 distinct posts:
      1. "linkedin": A professional, thought-leadership post (structured, bullet points).
      2. "twitter": A thread starter (punchy, under 280 chars, hashtags).
      3. "instagram": A visual concept description + caption.
      
      Output ONLY raw JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json/g, '').replace(/```/g, ''); // Clean AI noise
    
    res.json(JSON.parse(text));

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "AI Strategy Failed", details: error.message });
  }
});

// Health Check
app.get('/', (req, res) => {
  res.send('Sideio Social Engine is Online 🚀');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Engine running on port ${PORT}`);
});
