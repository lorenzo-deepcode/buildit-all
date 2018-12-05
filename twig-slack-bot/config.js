const config = {
  apiUrl: 'http://staging.twig-api.riglet/v2',
  token: process.env.TOKEN,
  totalInterval: 60 * 60 * 24,
  interval: 60 * 60,
  name: 'slack-demo',
  email: 'ben.hernandez@corp.riglet.io',
  password: 'Z3nB@rnH3n',
  chatRooms: {
    group: {
      'engineering-usa': {
        activeMembers: {
          failureIfUnder: 7,
          happinessIfOver: 20,
        },
        messages: {
          failureIfUnder: 2,
          happinessIfOver: 4,
        },
        category: 'studio',
      },
      buildit: {
        activeMembers: {
          failureIfUnder: 50,
          happinessIfOver: 80,
        },
        messages: {
          failureIfUnder: 5,
          happinessIfOver: 10,
        },
        category: 'studio',
      },
    },
    channel: {
      'digital-delivery': {
        activeMembers: {
          failureIfUnder: 10,
          happinessIfOver: 45,
        },
        messages: {
          failureIfUnder: 3,
          happinessIfOver: 6,
        },
        category: 'tribe',
      },
      'platform-engineering': {
        activeMembers: {
          failureIfUnder: 12,
          happinessIfOver: 50,
        },
        messages: {
          failureIfUnder: 5,
          happinessIfOver: 10,
        },
        category: 'tribe',
      },
      'tribe-front-end-engin': {
        activeMembers: {
          failureIfUnder: 10,
          happinessIfOver: 45,
        },
        messages: {
          failureIfUnder: 3,
          happinessIfOver: 6,
        },
        category: 'tribe' },
      'tribe-mobile': {
        activeMembers: {
          failureIfUnder: 7,
          happinessIfOver: 20,
        },
        messages: {
          failureIfUnder: 2,
          happinessIfOver: 4,
        },
        category: 'tribe' },
      'creative-tech': {
        activeMembers: {
          failureIfUnder: 9,
          happinessIfOver: 35,
        },
        messages: {
          failureIfUnder: 3,
          happinessIfOver: 6,
        },
        category: 'tribe' },
      'denver-pod': {
        activeMembers: {
          failureIfUnder: 3,
          happinessIfOver: 7,
        },
        messages: {
          failureIfUnder: 2,
          happinessIfOver: 4,
        },
        category: 'studio' },
      'dublin-pod': {
        activeMembers: {
          failureIfUnder: 8,
          happinessIfOver: 25,
        },
        messages: {
          failureIfUnder: 2,
          happinessIfOver: 4,
        },
        category: 'studio' },
      'london-pod': {
        activeMembers: {
          failureIfUnder: 50,
          happinessIfOver: 80,
        },
        messages: {
          failureIfUnder: 5,
          happinessIfOver: 10,
        },
        category: 'studio' },
      'london-wework-pod': {
        activeMembers: {
          failureIfUnder: 10,
          happinessIfOver: 45,
        },
        messages: {
          failureIfUnder: 3,
          happinessIfOver: 6,
        },
        category: 'studio' },
      nycfolks: {
        activeMembers: {
          failureIfUnder: 3,
          happinessIfOver: 8,
        },
        messages: {
          failureIfUnder: 2,
          happinessIfOver: 4,
        },
        category: 'studio' },
      edinburgh: {
        activeMembers: {
          failureIfUnder: 9,
          happinessIfOver: 33,
        },
        messages: {
          failureIfUnder: 3,
          happinessIfOver: 6,
        },
        category: 'studio' },
    },
  },
};

module.exports = config;
