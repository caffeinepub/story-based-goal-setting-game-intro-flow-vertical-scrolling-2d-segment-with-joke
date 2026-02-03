export interface StoryStep {
  id: string;
  text: string;
  type: 'text' | 'button' | 'slider' | 'emphasized';
  buttonText?: string;
  darkening?: boolean;
}

export const storySteps: StoryStep[] = [
  {
    id: 'intro-1',
    type: 'text',
    text: "Ahh, January... The air is crisp. The slate is clean.\nNew year has just started.\nNew year, new you.\nYou'll build the best version of yourself.\nYou've seen the posts. 1% better every day. Simple math for a better life.",
  },
  {
    id: 'start-button',
    type: 'button',
    text: '',
    buttonText: 'Start now!',
  },
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
  {
    id: 'question',
    type: 'slider',
    text: 'Do you know how many people stick to their goals?',
    darkening: true,
  },
];

export const postSliderSteps: StoryStep[] = [
  {
    id: 'stat',
    type: 'emphasized',
    text: 'Only about 8% of people manage to fulfill their goals.',
  },
  {
    id: 'donald-1',
    type: 'text',
    text: "Well, meet Donald.\nDonald is very ambitious and aims to reach new highs this year.\nBut most of the time Donald gets lost on his way.\nHe gets tangled in his ambitions. He stumbles and fails to reach his goals.\nToday we'll follow Donald for a little while.\nDuring this short journey we'll examine how Donald ends up like that.\nAnd we'll see what happens to the 92% people who also fail to accomplish what they have promised to themselves.",
  },
];
