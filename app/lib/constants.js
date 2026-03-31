// Action mappings for student activities — using PNG icon images
export const ACTIONS = [
  { id: 'dancing', icon: '/icons/dancing.png', label: 'Dancing', color: '#ec4899' },
  { id: 'cricket', icon: '/icons/cricket.png', label: 'Cricket', color: '#f59e0b' },
  { id: 'reading', icon: '/icons/reading.png', label: 'Reading', color: '#8b5cf6' },
  { id: 'painting', icon: '/icons/painting.png', label: 'Painting', color: '#06b6d4' },
  { id: 'singing', icon: '/icons/singing.png', label: 'Singing', color: '#10b981' },
  { id: 'football', icon: '/icons/football.png', label: 'Football', color: '#84cc16' },
  { id: 'gaming', icon: '/icons/gaming.png', label: 'Gaming', color: '#6366f1' },
  { id: 'cooking', icon: '/icons/cooking.png', label: 'Cooking', color: '#f97316' },
  { id: 'swimming', icon: '/icons/swimming.png', label: 'Swimming', color: '#0ea5e9' },
  { id: 'yoga', icon: '/icons/yoga.png', label: 'Yoga', color: '#a855f7' },
  { id: 'cycling', icon: '/icons/cycling.png', label: 'Cycling', color: '#14b8a6' },
  { id: 'drawing', icon: '/icons/drawing.png', label: 'Drawing', color: '#e11d48' },
];

// Song lyrics
export const SONG_LYRICS = [
  "Jump in, jump out,",
  "Turn yourselves around,",
  "Jump in, jump out,",
  "And introduce yourself!"
];

// Phase configuration — wizard flow
export const PHASES = {
  WELCOME: 'welcome',
  SONG: 'song',
  ADD_STUDENT: 'add-student',
  SPOTLIGHT: 'spotlight',
  MEMORY_CHAIN: 'memory-chain',
  FINALE: 'finale',
};

// Content images (prefixed with skillizee domain)
export const CONTENT_IMAGES = {
  step1: 'https://login.skillizee.io/s/articles/69c62240e597d784a8d11714/images/image-20260327115255-1.png',
  step2: 'https://login.skillizee.io/s/articles/69c62240e597d784a8d11714/images/image-20260327115256-2.png',
  step3: 'https://login.skillizee.io/s/articles/69c62240e597d784a8d11714/images/image-20260327115256-3.png',
  step4: 'https://login.skillizee.io/s/articles/69c62240e597d784a8d11714/images/image-20260327115256-4.png',
};

// YouTube video
export const VIDEO_URL = 'https://www.youtube.com/embed/OlPA54vHmpI?list=PLvEb8AA7B8J_-p-YsARyZUyogz0X9aNyX';

// Appreciation messages (10 windows)
export const APPRECIATIONS = [
  { emoji: '🌟', title: 'Superstar!', message: 'You shine brighter than a thousand stars! Keep being amazing!', color: '#FFD700' },
  { emoji: '🚀', title: 'Sky\'s the Limit!', message: 'You\'re reaching for the stars and beyond! Nothing can stop you!', color: '#2196F3' },
  { emoji: '🦁', title: 'Brave Heart!', message: 'You faced every challenge with courage today. So proud of you!', color: '#FF9800' },
  { emoji: '🎨', title: 'Creative Genius!', message: 'Your ideas are so unique and wonderful. The world needs your creativity!', color: '#9C27B0' },
  { emoji: '💪', title: 'Never Give Up!', message: 'Even when it gets tough, you keep trying. That\'s real strength!', color: '#E91E63' },
  { emoji: '🤝', title: 'Best Team Player!', message: 'You helped your friends and made everyone feel included. True champion!', color: '#00BCD4' },
  { emoji: '📚', title: 'Knowledge Explorer!', message: 'Your curiosity is your superpower. Keep asking questions and learning!', color: '#4CAF50' },
  { emoji: '😊', title: 'Kindness King!', message: 'Your smile and kind words made everyone\'s day better. Keep spreading joy!', color: '#F44336' },
  { emoji: '🏆', title: 'Champion Effort!', message: 'It\'s not about winning — it\'s about trying your best. And you did!', color: '#FF5722' },
  { emoji: '🌈', title: 'You\'re Awesome!', message: 'Remember: there\'s no one else like YOU. The world is lucky to have you!', color: '#673AB7' },
];
