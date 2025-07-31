import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import dotenv from 'dotenv';
import cors from 'cors';
import Campaign from './models/Campaign.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Use /tmp folder for uploads
const storage = multer.diskStorage({
  destination: '/tmp',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// ✅ MongoDB Connection (optimized for Vercel)
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URL);
  isConnected = true;
  console.log('✅ MongoDB Connected');
}
connectDB();

// ✅ Routes
app.post('/api/campaigns', upload.array('creatives'), async (req, res) => {
  try {
    const channels = req.body.channels ? JSON.parse(req.body.channels) : [];
    const segments = req.body.segments ? JSON.parse(req.body.segments) : [];

    const campaign = new Campaign({
      campaignName: req.body.campaignName,
      campaignType: req.body.campaignType,
      status: req.body.status,
      goal: req.body.goal,
      audienceType: req.body.audienceType,
      language: req.body.language,
      location: req.body.location,
      channels,
      segments,
      landingPage: req.body.landingPage,
      ctaLabel: req.body.ctaLabel,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      creatives: req.files.map(file => file.filename),
    });

    await campaign.save();
    res.json({ message: '✅ Campaign saved', campaign });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/campaigns', async (req, res) => {
  try {
    const cdata = await Campaign.find();
    res.json(cdata);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Export app for Vercel
export default app;
