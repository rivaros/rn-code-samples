import {
  NavigationAction,
  StackActions,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { ParamList, RootStackParamList, Routes } from './types';

/**
 * Read the following docs to get the idea behind:
 * https://reactnavigation.org/docs/navigating-without-navigation-prop
 * https://reactnavigation.org/docs/typescript/#annotating-ref-on-navigationcontainer
 */

export const navigationRef = createNavigationContainerRef();

// TODO: fix TS errors to enable navigate method
// const navigate = (
//   name: ScreenName,
//   params?: ValueOf<ParamList> | { screen?: ScreenName; params?: ValueOf<ParamList> },
//   key?: string,
// ) => {
//   if (navigationRef.isReady()) {
//     navigationRef.navigate({ name, key, params });
//   }
// };

const push = (name: keyof ParamList, params?: ValueOf<RootStackParamList>) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(name, params));
  }
};

const goBack = () => {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
};

const replaceRoot = (name: keyof ParamList, params?: ValueOf<RootStackParamList>) => {
  if (navigationRef.isReady()) {
    navigationRef.reset({ index: 0, routes: [{ name, params }] });
  }
};

const getCurrentRoute = (): Routes | undefined => {
  if (navigationRef.isReady()) {
    return navigationRef.current.getCurrentRoute()?.name as Routes | undefined;
  }
};

const insideTabNavigator = () => {
  if (navigationRef.isReady()) {
    const index = navigationRef.current.getState()?.index;
    const parentRoute = navigationRef.current.getState()?.routes[index];
    return parentRoute?.name === Routes.LOGGEDIN;
  }
};

const getNavigationState = () => {
  if (navigationRef.isReady()) {
    return navigationRef.current.getState();
  }
};

const dispatch = (action: NavigationAction) => {
  if (navigationRef.isReady()) {
    navigationRef.current.dispatch(action);
  }
};

export const navigation = {
  // navigate,
  push,
  goBack,
  replaceRoot,
  getCurrentRoute,
  insideTabNavigator,
  getNavigationState,
  dispatch,
};
