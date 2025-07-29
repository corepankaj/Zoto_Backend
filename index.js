import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import dotenv from 'dotenv';
import cors from 'cors';
import Campaign from './models/Campaign.js';

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;

const app = express();
app.use(cors());
app.use(express.json());

// Multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Connect MongoDB
mongoose.connect(MONGO_URL)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Create Campaign
app.post('/api/campaigns', upload.array('creatives'), async (req, res) => {
  try {
    let channels = [];
    let segments = [];

    if (req.body.channels) {
      channels = JSON.parse(req.body.channels);
    }
    if (req.body.segments) {
      segments = JSON.parse(req.body.segments);
    }

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
    res.status(500).json({ error: err.message });
  }
});

// Get Campaigns
app.get('/api/campaigns', async (req, res) => {
  try {
    const cdata = await Campaign.find();
    res.json(cdata);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
