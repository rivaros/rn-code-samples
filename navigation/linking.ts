import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList, Routes } from './types';
import { deepLinkingScheme } from 'core/env';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [deepLinkingScheme],
  config: {
    screens: {
      [Routes.LOGGEDIN]: {
        screens: {
          [Routes.TAB_HOME]: {
            screens: {
              [Routes.HOME]: 'home',
            },
          },
          [Routes.TAB_SCHEDULE]: 'schedule',
          [Routes.TAB_MENU]: 'menu',
          [Routes.TAB_PROFILE]: 'profile',
        },
      },
      [Routes.MY_FAVORITES]: 'favorites',
      [Routes.WEBVIEW]: {
        path: 'web/:url',
        parse: {
          url: (url: string) => `${url}`,
        },
      },
      [Routes.RECIPE]: {
        path: 'recipe/:slug',
        parse: {
          slug: (slug: string) => `${slug}`,
        },
      },
    },
  },
};
