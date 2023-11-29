/* eslint-disable react/jsx-props-no-spreading */
import {
  EventArg,
  ParamListBase,
  StackActionHelpers,
  StackActions,
  StackNavigationState,
  StackRouterOptions,
  createNavigatorFactory,
  useNavigationBuilder,
} from '@react-navigation/native';
import {
  StackNavigationEventMap,
  StackNavigationOptions,
  StackView,
} from '@react-navigation/stack';
import { StackHeaderMode } from '@react-navigation/stack/lib/typescript/src/types';
import { useEffect } from 'react';
import { RootRouter } from 'navigation/routers/RootRouter';

function RootNavigator({
  id,
  initialRouteName,
  children,
  screenListeners,
  screenOptions,
  ...rest
}) {
  const mode = rest.mode as 'card' | 'modal' | undefined;

  const headerMode = rest.headerMode as StackHeaderMode | 'none' | undefined;

  const { keyboardHandlingEnabled } = rest;

  const defaultScreenOptions: StackNavigationOptions = {
    presentation: mode,
    headerShown: headerMode ? headerMode !== 'none' : true,
    headerMode: headerMode && headerMode !== 'none' ? headerMode : undefined,
    keyboardHandlingEnabled,
  };
  const { state, descriptors, navigation, NavigationContent } = useNavigationBuilder<
    StackNavigationState<ParamListBase>,
    StackRouterOptions,
    StackActionHelpers<ParamListBase>,
    StackNavigationOptions,
    StackNavigationEventMap
  >(RootRouter, {
    id,
    initialRouteName,
    children,
    screenOptions,
    screenListeners,
    defaultScreenOptions,
  });

  useEffect(
    () =>
      // @ts-expect-error: there may not be a tab navigator in parent
      navigation.addListener?.('tabPress', e => {
        const isFocused = navigation.isFocused();

        // Run the operation in the next frame so we're sure all listeners have been run
        // This is necessary to know if preventDefault() has been called
        requestAnimationFrame(() => {
          if (
            state.index > 0 &&
            isFocused &&
            !(e as unknown as EventArg<'tabPress', true>).defaultPrevented
          ) {
            // When user taps on already focused tab and we're inside the tab,
            // reset the stack to replicate native behaviour
            navigation.dispatch({
              ...StackActions.popToTop(),
              target: state.key,
            });
          }
        });
      }),
    [navigation, state.index, state.key],
  );

  return (
    <NavigationContent>
      <StackView state={state} navigation={navigation} descriptors={descriptors} {...rest} />
    </NavigationContent>
  );
}

export const createRootNavigator = createNavigatorFactory<
  StackNavigationState<ParamListBase>,
  StackNavigationOptions,
  StackNavigationEventMap,
  typeof RootNavigator
>(RootNavigator);
