import { createStackNavigator } from '@react-navigation/stack';
import { HomeStackParamList, Routes } from 'navigation/types';
import HomeScreen from 'screens/HomeScreen';
import ProductScreen from 'screens/ProductScreen';

const { Screen, Navigator } = createStackNavigator<HomeStackParamList>();

const HomeStack = () => (
  <Navigator>
    <Screen
      options={{
        headerShown: false,
      }}
      name={Routes.HOME}
      component={HomeScreen}
    />
    <Screen name={Routes.PRODUCT} component={ProductScreen} />
  </Navigator>
);

export default HomeStack;
