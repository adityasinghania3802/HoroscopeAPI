const BASE = {
  aries:   'Trust your instincts and take the first step.',
  taurus:  'Patience and steady effort bring results.',
  gemini:  'Conversations open unexpected doors.',
  cancer:  'Nurture close ties; your intuition guides you.',
  leo:     'Lead with warmth; recognition follows.',
  virgo:   'Small habits compound into big wins.',
  libra:   'Seek balance; a fair compromise appears.',
  scorpio: 'Focus sharpens—protect your energy.',
  sagittarius: 'Explore boldly; a new path inspires you.',
  capricorn:   'Structure sets you free—plan, then act.',
  aquarius: 'Share your odd ideas; they spark change.',
  pisces:   'Creativity flows—trust your inner tide.'
};

export function getDailyHoroscope(sign, forDate = new Date()) {
  const base = BASE[sign] || 'Have a grounded day.';
  const day = forDate.getUTCDate();
  const lucky = (forDate.getUTCFullYear() + forDate.getUTCMonth() + day) % 9 + 1;
  return `${base} Lucky number: ${lucky}.`;
}
