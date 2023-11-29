import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import { DevtoolsItemScreenParams } from 'devtools/DevToolsItemScreen';
import { CartSummaryScreensParams } from 'screens/CartSummaryScreen';
import { ManageOrderScreenParams } from 'screens/ManageOrderScreen';
import { MandatoryUpdateScreenParams } from 'screens/MandatoryUpdateScreen/types';
import { EditDeliveryAddressParams } from 'screens/MySubscriptionScreen/EditDeliveryAddressScreen';
import { NutritionLabelScreenParams } from 'screens/NutritionLabelScreen';
import { OptionalUpdateScreenParams } from 'screens/OptionalUpdateScreen/types';
import { OrderDetailsScreenParams } from 'screens/OrderDetailsScreen';
import { PayPalScreenParams } from 'screens/PaymentInformationScreen/PayPalScreen';
import { RecipeScreenParams } from 'screens/RecipeScreen';
import { WebViewScreenParams } from 'screens/WebViewScreen';

export enum Routes {
  // RootStackParamList
  LOADER = 'LOADER',
  LOGGEDIN = 'LOGGEDIN',
  PUBLIC = 'PUBLIC',
  GENERIC_MODAL = 'GENERIC_MODAL',
  MANAGE_ORDER_MODAL = 'MANAGE_ORDER_MODAL',
  CART_SUMMARY_MODAL = 'CART_SUMMARY_MODAL',
  EDUCATIONAL_MODAL = 'EDUCATIONAL_MODAL',
  OPTIONAL_UPDATE_MODAL = 'OPTIONAL_UPDATE_MODAL',
  MANDATORY_UPDATE_MODAL = 'MANDATORY_UPDATE_MODAL',
  WEEK_DATE_PICKER_MODAL = 'WEEK_DATE_PICKER_MODAL',
  NUTRITION_LABEL_MODAL = 'NUTRITION_LABEL_MODAL',
  RECIPE = 'RECIPE',
  DEVTOOLS = 'DEVTOOLS',
  DEVTOOLSITEM = 'DEVTOOLSITEM',
  WEBVIEW = 'WEBVIEW',
  EDIT_EMAIL = 'EDIT_EMAIL',
  EDIT_ADDRESS = 'EDIT_ADDRESS',
  PAUSE_SUBSCRIPTION = 'PAUSE_SUBSCRIPTION',
  PAYMENT_INFORMATION = 'PAYMENT_INFORMATION',
  PAYMENT_PAYPAL = 'PAYMENT_PAYPAL',
  EDIT_CREDIT_CARD = 'EDIT_CREDIT_CARD',
  MY_FAVORITES = 'MY_FAVORITES',
  MY_ORDERS = 'MY_ORDERS',
  ORDER_DETAILS = 'ORDER_DETAILS',

  // HomeStackParamList
  HOME = 'HOME',
  PRODUCT = 'PRODUCT',

  // ProfileStackParamList
  PROFILE = 'PROFILE',
  MY_ACCOUNT = 'MY_ACCOUNT',
  MY_SUBSCRIPTION = 'MY_SUBSCRIPTION',
  MY_ADDRESSES = 'MY_ADDRESSES',
  ACCOUNT_INFORMATION = 'ACCOUNT_INFORMATION',
  EDIT_PASSWORD = 'EDIT_PASSWORD',
  GIFTS = 'GIFTS',
  SETTINGS = 'SETTINGS',
  DEBUG = 'DEBUG',

  // TabParamList
  TAB_HOME = 'TAB_HOME',
  TAB_MENU = 'TAB_MENU',
  TAB_SCHEDULE = 'TAB_SCHEDULE',
  TAB_PROFILE = 'TAB_PROFILE',

  // AuthStackParamList
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
}

export type RootStackParamList = {
  [Routes.LOADER]: undefined;
  [Routes.LOGGEDIN]: NavigatorScreenParams<TabParamList>;
  [Routes.PUBLIC]: NavigatorScreenParams<AuthStackParamList>;
  [Routes.GENERIC_MODAL]: undefined;
  [Routes.MANAGE_ORDER_MODAL]: ManageOrderScreenParams;
  [Routes.CART_SUMMARY_MODAL]: CartSummaryScreensParams;
  [Routes.EDUCATIONAL_MODAL]: undefined;
  [Routes.OPTIONAL_UPDATE_MODAL]: OptionalUpdateScreenParams;
  [Routes.MANDATORY_UPDATE_MODAL]: MandatoryUpdateScreenParams;
  [Routes.WEEK_DATE_PICKER_MODAL]: undefined;
  [Routes.NUTRITION_LABEL_MODAL]: NutritionLabelScreenParams;
  [Routes.DEVTOOLS]: undefined;
  [Routes.DEVTOOLSITEM]: DevtoolsItemScreenParams;
  [Routes.RECIPE]: RecipeScreenParams;
  [Routes.WEBVIEW]: WebViewScreenParams;
  [Routes.EDIT_EMAIL]: undefined;
  [Routes.EDIT_PASSWORD]: undefined;
  [Routes.EDIT_ADDRESS]: EditDeliveryAddressParams;
  [Routes.PAUSE_SUBSCRIPTION]: undefined;
  [Routes.PAYMENT_INFORMATION]: undefined;
  [Routes.PAYMENT_PAYPAL]: PayPalScreenParams;
  [Routes.EDIT_CREDIT_CARD]: undefined;
  [Routes.MY_FAVORITES]: undefined;
  [Routes.MY_ORDERS]: undefined;
  [Routes.ORDER_DETAILS]: OrderDetailsScreenParams;
};

export type HomeStackParamList = {
  [Routes.HOME]: undefined;
  [Routes.PRODUCT]: undefined;
};

export type AuthStackParamList = {
  [Routes.LANDING]: undefined;
  [Routes.LOGIN]: undefined;
};

export type ProfileStackParamList = {
  [Routes.PROFILE]: undefined;
  [Routes.MY_ACCOUNT]: undefined;
  [Routes.MY_SUBSCRIPTION]: undefined;
  [Routes.MY_ADDRESSES]: undefined;
  [Routes.ACCOUNT_INFORMATION]: undefined;
  [Routes.MY_ORDERS]: undefined;
  [Routes.GIFTS]: undefined;
  [Routes.SETTINGS]: undefined;
  [Routes.DEBUG]: undefined;
};

export type TabParamList = {
  [Routes.TAB_HOME]: NavigatorScreenParams<HomeStackParamList>;
  [Routes.TAB_MENU]: undefined;
  [Routes.TAB_SCHEDULE]: undefined;
  [Routes.TAB_PROFILE]: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
  RootStackParamList,
  T
>;

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> = StackScreenProps<
  ProfileStackParamList,
  T
>;

export type PublicScreenProps<T extends keyof AuthStackParamList> = CompositeScreenProps<
  StackScreenProps<AuthStackParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

export type HomeStackScreenProps<T extends keyof HomeStackParamList> = CompositeScreenProps<
  BottomTabScreenProps<HomeStackParamList, T>,
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList, Routes.TAB_HOME>,
    RootStackScreenProps<keyof RootStackParamList>
  >
>;

export type ParamList = RootStackParamList &
  HomeStackParamList &
  AuthStackParamList &
  ProfileStackParamList &
  TabParamList;

export type ScreenName =
  | keyof RootStackParamList
  | keyof HomeStackParamList
  | keyof AuthStackParamList
  | keyof ProfileStackParamList
  | keyof TabParamList;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
