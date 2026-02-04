/**
 * Centralized takeaways content used by both the in-app modal and the certificate PDF.
 * Each takeaway includes a title, body text, and optional article link.
 */

export interface TakeawayLink {
  url: string;
  text: string;
}

export interface TakeawayContent {
  title: string;
  body: string;
  link?: TakeawayLink;
}

export const TAKEAWAYS: TakeawayContent[] = [
  {
    title: 'Set clear and specific goals',
    body: 'Replace vague and ambiguous targets with ultra-specific, measurable outcomes. Specific goals focus attention and help track progress. Define exactly what "done" looks like so your brain doesn\'t have to guess (e.g., "Save €300/month for 6 months").',
    link: {
      url: 'https://www.eval.fr/wp-content/uploads/2020/01/S.M.A.R.T-Way-Management-Review-eval.fr_.pdf',
      text: 'Learn more from S.M.A.R.T. study by George T. Doran'
    }
  },
  {
    title: 'Adopt a flexible, progress-focused mindset',
    body: 'Abandon "All-or-Nothing" for "Always Something." Adopt a "never miss twice" rule. If you can\'t do a 60-minute workout, do 5 minutes. instead Consistency always beats intensity',
    link: {
      url: 'https://www.ucl.ac.uk/news/2009/aug/how-long-does-it-take-form-habit#:~:text=What%20exactly%20takes%2066%20days,good%20fit)%20was%2066%20days.',
      text: 'Learn more from this UCL study'
    }
  },
  {
    title: 'Rely on systems, not just initial motivation',
    body: 'Motivation fluctuates over time, so systems protect you when excitement fades. Having a system means packing your sports bag the previous evening for the morning workout. Not taking your phone to bedroom when going to bed. The purpose of a system is to increase friction for activities we want to avoid or decrease friction for activities we want to encourage.',
    link: {
      url: 'https://jamesclear.com/choice-architecture',
      text: 'Learn more about systems and environment design'
    }
  },
  {
    title: 'Less is more',
    body: 'Setting fewer, more reachable goals prevents "cognitive overload," allowing you to focus your limited energy on one target rather than spreading it too thin. Achieving these smaller milestones builds "self-efficacy," creating a winning streak that motivates you to take on larger challenges'
  },
  {
    title: 'Choose personal and intrinsic goals',
    body: 'Ensure the goal is intrinsic, not conformist. Ask yourself why you want this. If the answer is "to impress people," the chances of quitting are much higher, than in case where the answer is personal growth or joy.',
    link: {
      url: 'https://selfdeterminationtheory.org/theory/',
      text: 'Read more about how intrinsic motivation increases your performance'
    }
  },
  {
    title: 'Your identity has to grow with your goals',
    body: 'See your goals as part of who you are becoming, not separate from who you currently are. Reinforce new behaviors with self-perceptions like "I am a runner" or "I am someone who learns consistently".  When identity and habits align, motivation deepens and behavior change becomes more durable',
    link: {
      url: 'https://jamesclear.com/identity-based-habits',
      text: 'Learn more about identity-based habits'
    }
  },
  {
    title: 'Set realistic expectations & pace yourself',
    body: 'Unrealistic targets and unsustainable paces lead to burnout and abandonment. Match your goals with a pace that fits your life. Build in rest, buffer for setbacks, and adjust when priorities shift.'
  }
];
