import mongoose from 'mongoose';

const historySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    zodiacSign: { type: String, required: true, lowercase: true, trim: true },
    text: { type: String, required: true },
    servedForDate: { type: Date, required: true }
  },
  { timestamps: true }
);

historySchema.index({ user: 1, servedForDate: 1 }, { unique: true });

export default mongoose.model('History', historySchema);
