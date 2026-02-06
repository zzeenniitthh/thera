export const LANGUAGE = {
  nav: {
    compass: 'Compass',
    explore: 'Explore',
    journey: 'Journey',
    newHorizon: 'New Horizon',
  },

  goalCreation: {
    heading: 'What horizon are you drawn to?',
    titlePlaceholder: 'Name this horizon...',
    descriptionPrompt: 'What makes this direction interesting to you?',
    descriptionPlaceholder: 'Share a bit more if you like...',
    submit: 'Illuminate my path',
    generating: 'Mapping the cosmos...',
  },

  compass: {
    emptyState: 'Your cosmos awaits. What direction calls to you?',
    generateButton: 'Discover directions',
    addManual: 'Add a direction',
    centerButton: 'Return to center',
  },

  direction: {
    whyConnects: 'Why this direction connects',
    beginExploring: 'Begin exploring',
    markExplored: 'This feels explored',
    revisit: 'Revisit this direction',
    generateSub: 'What possibilities branch from here?',
    notesPlaceholder: 'What are you noticing?',
  },

  exploration: {
    timeSpent: (minutes: number) =>
      minutes === 1 ? '1 minute exploring' : `${minutes} minutes exploring`,
    pause: 'Pause',
    wrapUp: 'Wrap up for now',
    notePrompt: "What's catching your attention?",
  },

  journey: {
    emptyState: 'Your journey begins with a single direction.',
    heading: 'Your path so far',
  },

  status: {
    undiscovered: 'Undiscovered',
    exploring: 'Exploring',
    explored: 'Explored',
  },

  home: {
    tagline: 'Navigate your horizons',
    subtitle: 'A compass for exploration, not a checklist for completion.',
    begin: 'Begin',
    welcome: 'Welcome back, explorer.',
  },

  errors: {
    aiUnavailable: 'The cosmos is quiet right now. Would you like to try again?',
    generic: 'Something unexpected happened. Take a breath and try again.',
  },

  transitions: {
    afterExploration: 'Interesting journey. The compass is here when you\'re ready.',
    switchingDirection: 'Curiosity has no wrong turns.',
    whereNext: 'Where will you explore today?',
  },
} as const;
