import { Router } from 'express';
import auth from '../middleware/auth.js';
import History from '../models/History.js';
import { getDailyHoroscope } from '../utils/horoscopes.js';
import { startOfUTCDay } from '../utils/zodiac.js';

const router = Router();

router.get('/today', auth, async (req, res) => {
  try {
    const todayUTC = startOfUTCDay(new Date());
    const text = getDailyHoroscope(req.user.zodiacSign, todayUTC);

    await History.findOneAndUpdate(
      { user: req.user._id, servedForDate: todayUTC },
      { user: req.user._id, zodiacSign: req.user.zodiacSign, text, servedForDate: todayUTC },
      { upsert: true }
    );

    return res.json({
      date: todayUTC.toISOString().slice(0, 10),
      zodiacSign: req.user.zodiacSign,
      text
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/history', auth, async (req, res) => {
  try {
    const today = startOfUTCDay(new Date());
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setUTCDate(today.getUTCDate() - 7);

    const rows = await History.find({
      user: req.user._id,
      servedForDate: { $gte: sevenDaysAgo }
    })
      .sort({ servedForDate: -1 })
      .lean();

    const byDay = new Map();
    for (const r of rows) {
      const dayKey = r.servedForDate.toISOString().slice(0, 10);
      byDay.set(dayKey, r);
    }

    const result = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setUTCDate(today.getUTCDate() - i);
      const dayKey = date.toISOString().slice(0, 10);

      if (byDay.has(dayKey)) {
        const r = byDay.get(dayKey);
        result.push({
          date: dayKey,
          zodiacSign: r.zodiacSign,
          text: r.text
        });
      } else {
        const text = getDailyHoroscope(req.user.zodiacSign, date);
        result.push({
          date: dayKey,
          zodiacSign: req.user.zodiacSign,
          text
        });
      }
    }

    return res.json({ items: result });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
