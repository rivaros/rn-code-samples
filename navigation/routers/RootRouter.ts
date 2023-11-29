import { StackRouter, StackRouterOptions } from '@react-navigation/native';
import { Routes } from 'navigation/types';

export const RootRouter = (routerOptions: StackRouterOptions) => {
  const router = StackRouter(routerOptions);

  return {
    ...router,
    getStateForAction(state, action, options) {
      const result = router.getStateForAction(state, action, options);

      if (result != null && result.index > state.index) {
        const currentRouteName = state.routes[state.index].name;
        const newRouteName = result.routes[result.index].name;

        if (
          [Routes.DEVTOOLS, Routes.DEVTOOLSITEM].includes(currentRouteName) &&
          newRouteName === Routes.GENERIC_MODAL
        ) {
          return state;
        }

        // Returning the current state means that the action has been handled, but we don't have a new state
        return result;
      }

      return result;
    },
  };
};
