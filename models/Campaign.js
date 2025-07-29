import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  campaignName: String,
  campaignType: String,
  status: String,
  goal: String,
  audienceType: String,
  language: String,
  location: String,
  channels: [String],
  segments: [String],
  landingPage: String,
  ctaLabel: String,
  startDate: Date,
  endDate: Date,
  creatives: [String],
}, { timestamps: true });

export default mongoose.model('Campaign', campaignSchema);
