import { TransitionPresets } from '@react-navigation/stack';
import AuthStack from './AuthStack';
import Box from 'components/common/Box';
import { colorsPalette } from 'core/theme';
import { addAlpha } from 'core/theme/colorsPalette';
import { DevtoolsItemScreen } from 'devtools/DevToolsItemScreen';
import DevToolsScreen from 'devtools/DevToolsScreen';
import { forFade } from 'navigation/animation/interpolators';
import { commonTiming } from 'navigation/animation/transitions';
import { createRootNavigator } from 'navigation/navigators/createRootNavigator';
import BottomTabs from 'navigation/tabs/BottomTabs';
import { RootStackParamList, Routes } from 'navigation/types';
import CartSummaryScreen from 'screens/CartSummaryScreen';
import EditEmailScreen from 'screens/EditEmailScreen';
import EditPasswordScreen from 'screens/EditPasswordScreen';
import EducationalScreen from 'screens/EducationalScreen';
import LegacyMyOrdersScreen from 'screens/LegacyMyOrdersScreen';
import LoaderScreen from 'screens/LoaderScreen';
import ManageOrderScreen from 'screens/ManageOrderScreen';
import MandatoryUpdateScreen from 'screens/MandatoryUpdateScreen';
import ModalScreen from 'screens/ModalScreen';
import MyFavoritesScreen from 'screens/MyFavoritesScreen';
import MyOrdersScreen from 'screens/MyOrdersScreen';
import EditDeliveryAddressScreen from 'screens/MySubscriptionScreen/EditDeliveryAddressScreen';
import PauseSubscriptionScreen from 'screens/MySubscriptionScreen/PauseSubscriptionScreen';
import NutritionLabelScreen from 'screens/NutritionLabelScreen';
import OptionalUpdateScreen from 'screens/OptionalUpdateScreen';
import OrderDetailsScreen from 'screens/OrderDetailsScreen';
import PaymentInformationScreen from 'screens/PaymentInformationScreen';
import EditCreditCardScreen from 'screens/PaymentInformationScreen/EditCreditCardScreen';
import PayPalScreen from 'screens/PaymentInformationScreen/PayPalScreen';
import RecipeScreen from 'screens/RecipeScreen';
import WebViewScreen from 'screens/WebViewScreen';
import WeekDatePickerScreen from 'screens/WeekDatePickerScreen';
import { useAppSelector } from 'store';

const { Screen, Navigator, Group } = createRootNavigator<RootStackParamList>();

const CardOverlay = () => {
  return <Box flex={1} backgroundColor={addAlpha(colorsPalette.black, 0.5)} />;
};

const RootStack = () => {
  const { isAuthenticated, authState } = useAppSelector(state => state.auth);
  const { flag_menu_native_orders } = useAppSelector(state => state.ff.featureFlags);
  const inTransition = authState !== 'idle';
  const showPublicScreens = !isAuthenticated || inTransition;
  const showPrivateScreens = isAuthenticated || inTransition;

  return (
    <Navigator>
      <Group screenOptions={{ headerShown: false }}>
        <Screen name={Routes.LOADER} component={LoaderScreen} />
        <Screen name={Routes.WEBVIEW} component={WebViewScreen} />
        <Screen name={Routes.DEVTOOLS} component={DevToolsScreen} />
        <Screen name={Routes.DEVTOOLSITEM} component={DevtoolsItemScreen} />
      </Group>

      {showPublicScreens && (
        <Group screenOptions={{ headerShown: false }}>
          <Screen
            name={Routes.PUBLIC}
            component={AuthStack}
            options={{
              transitionSpec:
                authState === 'logOffInProgress'
                  ? undefined
                  : {
                      open: commonTiming,
                      close: commonTiming,
                    },
              cardStyleInterpolator: authState === 'logOffInProgress' ? undefined : forFade,
            }}
          />
        </Group>
      )}

      {showPrivateScreens && (
        <Group screenOptions={{ headerShown: false }}>
          <Screen
            name={Routes.LOGGEDIN}
            component={BottomTabs}
            options={{
              transitionSpec: {
                open: commonTiming,
                close: commonTiming,
              },
              cardStyleInterpolator: forFade,
            }}
          />
          <Screen name={Routes.RECIPE} component={RecipeScreen} />
          <Screen
            options={{
              headerShown: false,
            }}
            name={Routes.EDIT_EMAIL}
            component={EditEmailScreen}
          />
          <Screen name={Routes.EDIT_PASSWORD} component={EditPasswordScreen} />
          <Screen name={Routes.EDIT_ADDRESS} component={EditDeliveryAddressScreen} />
          <Screen name={Routes.PAUSE_SUBSCRIPTION} component={PauseSubscriptionScreen} />
          <Screen name={Routes.PAYMENT_INFORMATION} component={PaymentInformationScreen} />
          <Screen name={Routes.PAYMENT_PAYPAL} component={PayPalScreen} />
          <Screen name={Routes.EDIT_CREDIT_CARD} component={EditCreditCardScreen} />
          <Screen name={Routes.MY_FAVORITES} component={MyFavoritesScreen} />
          <Screen
            options={{
              headerShown: false,
            }}
            name={Routes.MY_ORDERS}
            component={flag_menu_native_orders ? MyOrdersScreen : LegacyMyOrdersScreen}
          />
          <Screen name={Routes.ORDER_DETAILS} component={OrderDetailsScreen} />
        </Group>
      )}
      <Group screenOptions={{ presentation: 'transparentModal', headerShown: false }}>
        <Screen name={Routes.GENERIC_MODAL} component={ModalScreen} />
      </Group>
      <Group screenOptions={{ presentation: 'transparentModal', headerShown: false }}>
        <Screen name={Routes.OPTIONAL_UPDATE_MODAL} component={OptionalUpdateScreen} />
      </Group>
      <Group screenOptions={{ presentation: 'transparentModal', headerShown: false }}>
        <Screen
          name={Routes.MANAGE_ORDER_MODAL}
          component={ManageOrderScreen}
          options={{
            gestureEnabled: true,
            gestureResponseDistance: 600,
            cardOverlayEnabled: true,
            cardOverlay: CardOverlay,
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />
        <Screen
          name={Routes.MANDATORY_UPDATE_MODAL}
          component={MandatoryUpdateScreen}
          options={{
            cardOverlayEnabled: true,
            cardOverlay: CardOverlay,
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />

        <Screen
          name={Routes.EDUCATIONAL_MODAL}
          component={EducationalScreen}
          options={{
            gestureEnabled: true,
            gestureResponseDistance: 600,
            cardOverlayEnabled: true,
            cardOverlay: CardOverlay,
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />

        <Screen
          name={Routes.CART_SUMMARY_MODAL}
          component={CartSummaryScreen}
          options={{
            cardOverlayEnabled: true,
            gestureEnabled: true,
            cardOverlay: CardOverlay,
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />

        <Screen
          name={Routes.WEEK_DATE_PICKER_MODAL}
          component={WeekDatePickerScreen}
          options={{
            gestureEnabled: true,
            gestureResponseDistance: 600,
            cardOverlayEnabled: true,
            cardOverlay: CardOverlay,
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />
        <Screen
          name={Routes.NUTRITION_LABEL_MODAL}
          component={NutritionLabelScreen}
          options={{
            gestureEnabled: true,
            gestureResponseDistance: 600,
            cardOverlayEnabled: true,
            cardOverlay: CardOverlay,
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />
      </Group>
    </Navigator>
  );
};

export default RootStack;
