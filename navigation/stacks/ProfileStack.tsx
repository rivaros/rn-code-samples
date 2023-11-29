import { createStackNavigator } from '@react-navigation/stack';
import { ProfileStackParamList, Routes } from 'navigation/types';
import AccountInformationScreen from 'screens/AccountInformationScreen';
import GiftsScreen from 'screens/GiftsScreen';
import MyAccountScreen from 'screens/MyAccountScreen';
import MySubscriptionScreen from 'screens/MySubscriptionScreen';
import UserAddressScreen from 'screens/MySubscriptionScreen/UserAddressScreen';
import ProfileScreen from 'screens/ProfileScreen';
import SettingsScreen from 'screens/SettingsScreen';

const { Screen, Navigator } = createStackNavigator<ProfileStackParamList>();

const ProfileStack = () => (
  <Navigator>
    <Screen
      options={{
        headerShown: false,
      }}
      name={Routes.PROFILE}
      component={ProfileScreen}
    />
    <Screen
      options={{
        headerShown: false,
      }}
      name={Routes.MY_ACCOUNT}
      component={MyAccountScreen}
    />

    <Screen
      options={{
        headerShown: false,
      }}
      name={Routes.MY_SUBSCRIPTION}
      component={MySubscriptionScreen}
    />

    <Screen
      options={{
        headerShown: false,
      }}
      name={Routes.MY_ADDRESSES}
      component={UserAddressScreen}
    />

    <Screen
      options={{
        headerShown: false,
      }}
      name={Routes.ACCOUNT_INFORMATION}
      component={AccountInformationScreen}
    />

    <Screen
      options={{
        headerShown: false,
      }}
      name={Routes.GIFTS}
      component={GiftsScreen}
    />
    <Screen name={Routes.SETTINGS} component={SettingsScreen} />
  </Navigator>
);

export default ProfileStack;
