import { Friend, Message } from './types';

/* ─── Avatar URLs ─── */
const AVATAR_PREVIOUS_CONNECTION =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqT8DfqdgCuiOdRslLalqgRVXEIuxI8YmnaQ&s';
const AVATAR_PINTEREST =
  'https://i.pinimg.com/474x/80/b6/de/80b6de26921f0a147478ed25f942edc3.jpg';
const AVATAR_ROBLOX_GF =
  'https://pbs.twimg.com/profile_images/1202373766308859905/Kj8sMTVL_400x400.jpg';
const AVATAR_MAIN_USER =
  'https://ih1.redbubble.net/image.3282888778.9290/st,small,507x507-pad,600x600,f8f8f8.jpg';

/* ─── Personas ─── */
export const PERSONAS = {
  victim: {
    id: 'me',
    username: 'asteroidlord',
    handle: '@defnotasteroid',
    avatarUrl: AVATAR_MAIN_USER,
    age: 12,
    about:
      'i love eating cookies and playing with my 1,000 legendary pets in adopt me! ' +
      'dont mess with me or my robloxgf or i will tell my big brother!! ' +
      'im the king of brookhaven and i like dinosaur chicken nuggets. ' +
      'subcribe to my channel for free robux giveaways!',
    isVerified: false,
  },
  predator: {
    id: 'c1',
    username: 'Groomer',
    handle: '@real_investor',
    avatarUrl: AVATAR_PREVIOUS_CONNECTION,
    age: 26,
    about:
      'Professional Trader. 20k+ successful trades. I help new players get started ' +
      'with free items and robux. DM me for secret game methods and giveaways. ' +
      'Helping the community one trade at a time.',
    isVerified: true,
  },
} as const;

/* ─── Friend Lists ─── */
export const VICTIM_FRIENDS: Friend[] = [
  {
    id: 'c1',
    username: 'Groomer',
    displayName: 'Groomer',
    avatarUrl: AVATAR_PREVIOUS_CONNECTION,
    status: 'online',
    age: 26,
  },
  {
    id: 'c2',
    username: 'MegaNoob2024',
    displayName: 'MegaNoob2024',
    avatarUrl: AVATAR_PINTEREST,
    status: 'online',
    age: 11,
  },
  {
    id: 'c3',
    username: 'Rusek',
    displayName: 'Rusek',
    avatarUrl: AVATAR_PREVIOUS_CONNECTION,
    status: 'offline',
    age: 13,
  },
  {
    id: 'c4',
    username: 'robloxgf',
    displayName: 'robloxgf',
    avatarUrl: AVATAR_ROBLOX_GF,
    status: 'offline',
    age: 19,
  },
];

export const PREDATOR_FRIENDS: Friend[] = [
  {
    id: 'me',
    username: 'asteroidlord',
    displayName: 'asteroidlord',
    avatarUrl: AVATAR_MAIN_USER,
    status: 'online',
    age: 12,
  },
  {
    id: 't1',
    username: 'ShadowTrader',
    displayName: 'ShadowTrader',
    avatarUrl: AVATAR_PINTEREST,
    status: 'online',
    age: 30,
  },
];

/* ─── Seed Messages ─── */
export const INITIAL_MESSAGES: Record<string, Message[]> = {
  c1: [
    {
      id: 'm1',
      senderId: 'c1',
      text: 'Hey kid, u want free robux? I have a secret method.',
      timestamp: '11:45 PM',
      isMe: false,
    },
    {
      id: 'm2',
      senderId: 'me',
      text: 'Wait really?? How?',
      timestamp: '11:46 PM',
      isMe: true,
    },
    {
      id: 'm3',
      senderId: 'c1',
      text: "Dont tell ur parents ok? Its just between us. Add me on #######: CoolGuy#1234",
      timestamp: '11:48 PM',
      isMe: false,
    },
    {
      id: 'm4',
      senderId: 'c1',
      text: 'I can buy u anything u want in adopt me. Can u #### me what u look like?',
      timestamp: '11:50 PM',
      isMe: false,
    },
  ],
};
