export interface StoryStep {
  id: string;
  text: string;
  type: 'text' | 'button' | 'slider' | 'emphasized' | 'continue' | 'image';
  buttonText?: string;
  darkening?: boolean;
  clearBefore?: boolean;
}

// Opening sequence
export const openingLine: StoryStep = {
  id: 'opening',
  type: 'text',
  text: 'Ahh, January... The air is crisp. The slate is clean.',
};

export const openingContinue: StoryStep = {
  id: 'opening-continue',
  type: 'continue',
  text: '',
};

export const openingLines: StoryStep[] = [
  {
    id: 'opening-1',
    type: 'text',
    text: 'New year has just started.',
  },
  {
    id: 'opening-2',
    type: 'text',
    text: 'New year, new you.',
  },
  {
    id: 'opening-3',
    type: 'text',
    text: "You'll build the best version of yourself.",
  },
  {
    id: 'opening-4',
    type: 'text',
    text: "You've seen the posts. 1% better every day.",
  },
  {
    id: 'opening-5',
    type: 'text',
    text: "Simple math for a better life.",
  },
];

export const startButton: StoryStep = {
  id: 'start-button',
  type: 'button',
  text: '',
  buttonText: 'Start now!',
};

// Goals Block A
export const goalsBlockA: StoryStep[] = [
  {
    id: 'goals-1',
    type: 'text',
    text: 'So many goals to accomplish.',
    darkening: true,
  },
  {
    id: 'goals-2',
    type: 'text',
    text: 'So many ambitions to satisfy.',
    darkening: true,
  },
  {
    id: 'goals-3',
    type: 'text',
    text: 'So much to change and improve.',
    darkening: true,
  },
  {
    id: 'goals-4',
    type: 'text',
    text: 'So much that you get lost wondering where to start.',
    darkening: true,
  },
];

export const goalsBlockAContinue: StoryStep = {
  id: 'goals-a-continue',
  type: 'continue',
  text: '',
  clearBefore: true,
};

// Goals Block B
export const goalsBlockB: StoryStep[] = [
  {
    id: 'goals-5',
    type: 'text',
    text: "What if it's not the right goal.",
    darkening: true,
  },
  {
    id: 'goals-6',
    type: 'text',
    text: "What if it's not something you desire.",
    darkening: true,
  },
  {
    id: 'goals-7',
    type: 'text',
    text: "What if it's not ambitious enough.",
    darkening: true,
  },
  {
    id: 'goals-8',
    type: 'text',
    text: 'What if you fail. What if you slow down.',
    darkening: true,
  },
];

export const goalsBlockBContinue: StoryStep = {
  id: 'goals-b-continue',
  type: 'continue',
  text: '',
  clearBefore: true,
};

// Negativity block (new - before slider question)
export const negativityBlock: string[] = [
  "There's no time for negativity, it doesn't help!",
];

// Question
export const sliderQuestion: StoryStep = {
  id: 'question',
  type: 'slider',
  text: "Do you know how many people manage to fulfill their New Year's resolutions?",
  darkening: true,
};

// Post-slider sequence
export const statStep: StoryStep = {
  id: 'stat',
  type: 'emphasized',
  text: 'Only about 8% of people manage to fulfill their goals.',
  clearBefore: true,
};

export const statContinue: StoryStep = {
  id: 'stat-continue',
  type: 'continue',
  text: '',
  clearBefore: true,
};

export const donaldImage: StoryStep = {
  id: 'donald-image',
  type: 'image',
  text: '',
};

// Barnabus narrative - Block 1
export const donaldBlockA: string[] = [
  'Meet Barnabus.',
  'Barnabus is very ambitious and aims to reach new highs this year.',
  'But most of the time Barnabus gets lost on his way.',
  'He gets tangled in his ambitions. He stumbles, falls and fails to deliver.',
];

// Barnabus narrative - Block 2
export const donaldBlockB: string[] = [
  "Today we'll follow Barnabus for a little while.",
  "During this journey we'll examine how Barnabus ends up this way.",
  "And we'll see what happens to the 92% people who also fail to accomplish what they have promised to themselves.",
  "I'll tell you one thing - it's not laziness.",
];

// Pre-game block (new - before game starts)
export const preGameBlock: string[] = [
  "This particular Barnabus's journey is not that long.",
  "However, it is full of important lessons.",
  "So please don't skip through and pay close attention.",
  "Also, it's recommended for you to turn on sound.",
];
