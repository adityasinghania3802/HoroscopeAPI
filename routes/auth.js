import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getZodiacSign } from '../utils/zodiac.js';

const router = Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, birthdate } = req.body || {};
    if (!name || !email || !password || !birthdate) {
      return res.status(400).json({ error: 'name, email, password, birthdate are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const dob = new Date(birthdate);
    const zodiacSign = getZodiacSign(dob);

    const user = await User.create({ name, email, password, birthdate: dob, zodiacSign });

    const token = jwt.sign({ id: user._id }, 'dev_secret', { expiresIn: '7d' });
    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, zodiacSign: user.zodiacSign }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, 'dev_secret', { expiresIn: '7d' });
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, zodiacSign: user.zodiacSign }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
