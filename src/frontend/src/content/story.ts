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
    text: "You've seen the posts. 1% better every day. Simple math for a better life.",
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
    text: 'So much that you get lost thinking where to start.',
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
    text: 'What if something else comes up.',
    darkening: true,
  },
  {
    id: 'goals-8',
    type: 'text',
    text: 'What if you fail. Or stop.',
    darkening: true,
  },
];

export const goalsBlockBContinue: StoryStep = {
  id: 'goals-b-continue',
  type: 'continue',
  text: '',
  clearBefore: true,
};

// Question
export const sliderQuestion: StoryStep = {
  id: 'question',
  type: 'slider',
  text: 'Do you know how many people stick to their goals?',
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

// Donald narrative - Block 1
export const donaldBlockA: string[] = [
  'Well, meet Donald.',
  'Donald is very ambitious and aims to reach new highs this year.',
  'But most of the time Donald gets lost on his way.',
  'He gets tangled in his ambitions. He stumbles and fails to reach his goals.',
];

// Donald narrative - Block 2
export const donaldBlockB: string[] = [
  "Today we'll follow Donald for a little while.",
  "During this short journey we'll examine how Donald ends up like that.",
  "And we'll see what happens to the 92% people who also fail to accomplish what they have promised to themselves.",
];
