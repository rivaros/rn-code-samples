import { createStackNavigator } from '@react-navigation/stack';
import CommonHeader from 'navigation/headers/CommonHeader';
import { AuthStackParamList, Routes } from 'navigation/types';
import LandingScreen from 'screens/LandingScreen';
import LoginScreen from 'screens/LoginScreen';

const { Screen, Navigator } = createStackNavigator<AuthStackParamList>();

const AuthStack = () => (
  <Navigator
    screenOptions={{
      header: CommonHeader,
    }}>
    <Screen name={Routes.LANDING} component={LandingScreen} options={{ headerShown: false }} />
    <Screen name={Routes.LOGIN} options={{ headerTransparent: true }} component={LoginScreen} />
  </Navigator>
);

export default AuthStack;
