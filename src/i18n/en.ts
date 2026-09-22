import type { Dictionary } from './ar'

/**
 * English copy.
 *
 * Typed against the Arabic dictionary, so this file fails to compile the
 * moment a string is added there without a translation here. Platform names
 * and the product name stay as they are in both languages.
 */
export const en: Dictionary = {
  meta: {
    description: 'Every comment and message from Instagram, Facebook, TikTok and X in one inbox, sorted for you automatically.',
  },
  nav: {
    sections: 'Page links',
    how: 'How it works',
    compare: 'The difference',
    faq: 'FAQ',
    start: 'Get started',
    login: 'Log in',
    signup: 'Start free',
    switchLanguage: (name: string) => `Switch to ${name}`,
  },

  hero: {
    title: 'Every customer comment and message in one place',
    body: 'Every comment and message from Instagram, Facebook, TikTok and X in one inbox, sorted for you automatically.',
    secondary: 'See how it works',
  },

  channels: {
    title: 'Every channel in one place',
    body: 'Your customers reach you on every platform. Comment brings all of it into one inbox for your team.',
    strip: 'One inbox for all of these channels — your team replies from a single place.',
  },

  categories: {
    title: 'Every comment is sorted before you open it',
    incoming: 'New comment just arrived',
    labels: {
      sales_intent: 'Sales opportunity',
      customer_service: 'Customer service',
      negative: 'Negative comment',
      spam: 'Spam and abuse',
      other: 'Other',
    },
    descriptions: {
      sales_intent: 'A question about price, availability or an order — a customer close to buying.',
      customer_service: 'A question about an existing order, shipping, a return or a branch.',
      negative: 'A complaint or criticism worth handling before it grows.',
      spam: 'Ads, links and abuse that have nothing to do with your business.',
      other: 'Thanks, compliments and general comments that are not waiting on you.',
    },
    samples: {
      sales_intent: 'Are the Ethiopian beans in stock? I want to order a kilo.',
      customer_service: 'Something is broken on the site, I cannot finish my order.',
      negative: 'My order is two days late and nobody told me anything.',
      spam: 'Real followers at the lowest prices 🔥 DM us now.',
      other: 'The coffee arrived today and it smells incredible 🤎 thank you.',
    },
    hiding: {
      title: 'Spam and complaints disappear from your post, not from your inbox',
      body: 'They come off the post automatically so your other followers never see them, and they stay with you to read and answer whenever you want.',
    },
  },

  steps: {
    title: 'Three steps from connecting to your first reply',
    items: [
      {
        title: 'Connect your accounts',
        body: 'Sign in to each platform once and give Comment permission to read your comments and messages.',
      },
      {
        title: 'Receive everything in one place',
        body: 'New comments and messages land in a single inbox, each one carrying the platform and the account that received it.',
      },
      {
        title: 'Track and reply without switching',
        body: 'Read the post your customer commented on, reply from the same screen, and mark the conversation done so it does not come back.',
      },
    ],
  },

  comparison: {
    title: 'From chaos to one organised inbox',
    today: 'Today',
    withProduct: 'With',
    items: [
      {
        before: 'Switching between four apps all day',
        after: 'One inbox for every platform',
      },
      {
        before: 'Reading a hundred comments to find one buying question',
        after: 'Every interaction sorted before you open it',
      },
      {
        before: 'An abusive comment sitting under your post for everyone to see',
        after: 'Spam and complaints come off the post automatically',
      },
      {
        before: 'Replying to a comment without knowing which post it came from',
        after: 'The post or video is in front of you as you write',
      },
      {
        before: 'A comment going unanswered with nobody noticing',
        after: 'Every interaction carries a status until it is closed',
      },
    ],
  },

  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        question: 'Which platforms are supported?',
        answer:
          'Instagram, Facebook, TikTok and X in this version. We add platforms based on what shops actually need.',
      },
      {
        question: 'Can I reply from inside Comment?',
        answer:
          'Yes, wherever the platform itself allows it. Permissions differ between networks and by account type and access level, which is why Comment shows you what each platform does and does not allow before you connect it.',
      },
      {
        question: 'What happens if a platform does not support something?',
        answer:
          'We do not show a button that does nothing. If replying is unavailable, the reply box is replaced by a short explanation, and the interaction stays readable, trackable and open to a status change.',
      },
      {
        question: 'What happens to negative comments and spam?',
        answer:
          'They are sorted automatically and hidden from the post on Instagram and Facebook, so your other followers do not see them, while they stay in your inbox to read and answer whenever you want. On TikTok and X we sort them and mark them clearly for you, because neither network allows hiding comments from outside its own app.',
      },
      {
        question: 'Is my account data safe?',
        answer:
          'Access tokens are kept on the server and never reach the browser. You can disconnect any account at any time, access stops, and its interactions are removed from the inbox.',
      },
      {
        question: 'Is Comment right for the size of my business?',
        answer:
          'Yes, whatever that size is. It works for a shop run by one person and for a full customer service team, and new interactions arrive the moment they land, however many there are.',
      },
    ],
  },

  finalCta: {
    title: 'Start bringing your interactions together',
    body: 'Create an account and try the inbox on sample data before connecting anything real.',
  },

  errors: {
    notFoundTitle: 'Page not found',
    notFoundBody: 'The link you opened is wrong, or it has changed.',
    backHome: 'Back to the home page',
    unexpectedTitle: 'Something went wrong',
    unexpectedBody: 'This page could not be shown. Try reloading, or go back to your inbox.',
    reload: 'Reload the page',
    inbox: 'Inbox',
  },

  footer: {
    tagline: 'One inbox for the comments and messages your customers send you on social media.',
    commercialRegister: 'Commercial register',
    commercialRegisterAlt: 'Saudi commercial register emblem',
    product: 'Product',
    account: 'Account',
    policies: 'Policies',
    signup: 'Create account',
    privacy: 'Privacy policy',
    terms: 'Terms and conditions',
    dataDeletion: 'Data deletion',
    rights: 'All rights reserved.',
  },

  mockup: {
    org: 'Nawah Specialty Coffee',
    search: 'Search…',
    all: 'All',
    unread: 'Unread',
    platforms: 'Platforms',
    relatedPost: 'Related post',
    hidden: 'Hidden',
    hiddenNote: 'Hidden from the post — your other followers cannot see it, and it stays here for you.',
    send: 'Send',
    replyTo: (name: string) => `Write your reply to ${name}…`,
    minutesAgo: (minutes: number) => `${minutes} minutes ago`,
    minutesShort: (minutes: number) => `${minutes}m`,
    rows: [
      {
        name: 'Munira Al-Qahtani',
        text: 'Are the Ethiopian beans from the video in stock? I want to order a kilo.',
        post: 'A new batch just landed from Ethiopia — Yirgacheffe, light roast. Available now in the roastery and online.',
      },
      {
        name: 'Followers Store',
        text: 'Real followers and guaranteed engagement at the lowest prices 🔥 DM us.',
        post: 'A new batch just landed from Ethiopia — Yirgacheffe, light roast. Available now in the roastery and online.',
      },
      {
        name: 'Walid Al-Omari',
        text: 'Something is broken on the site, I cannot finish my order. Hope you can look at it.',
        post: 'Three steps for dialling in your grind before pulling an espresso.',
      },
      {
        name: 'Nouf Al-Shammari',
        text: 'My order is two days late and I never got a notification. This is the second time.',
        post: 'The Nakheel branch is open from 7am to 11pm every day of the week.',
      },
      {
        name: 'Salman Al-Fahd',
        text: 'Ordered yesterday and it arrived this morning. Excellent speed 👌',
        post: 'Orders placed before 2pm ship the same day within Riyadh.',
      },
    ],
  },
}
