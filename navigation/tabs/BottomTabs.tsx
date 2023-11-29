import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import useHandleCartChanges from 'logic/meals/useHandleCartChanges';
import LoggedInWrapper from 'logic/wrappers/LoggedInWrapper';
import HomeStack from 'navigation/stacks/HomeStack';
import ProfileStack from 'navigation/stacks/ProfileStack';
import BottomTabBar from 'navigation/tabs/BottomTabBar';
import { Routes, TabParamList } from 'navigation/types';
import MenuScreen from 'screens/MenuScreen';
import ScheduleScreen from 'screens/ScheduleScreen';

const { Navigator, Screen } = createBottomTabNavigator<TabParamList>();

const BottomTabBarNester = (props: BottomTabBarProps) => {
  // Implement the BottomTabBar functionality here
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <BottomTabBar {...props} />;
};

const BottomTabs = () => {
  const { handleDiscardSave, hasChanged } = useHandleCartChanges();

  const listeners = ({ navigation, route }) => ({
    tabPress: e => {
      if (hasChanged()) {
        e.preventDefault();
        handleDiscardSave({
          onSave: () => navigation.navigate(route),
          onDiscard: () => navigation.navigate(route),
        });
      }
    },
  });

  return (
    // LoggedInWrapper - approach with wrapping navigators
    <LoggedInWrapper>
      <Navigator
        screenOptions={{
          headerShown: false,
        }}
        screenListeners={listeners}
        tabBar={BottomTabBarNester}>
        <Screen name={Routes.TAB_HOME} component={HomeStack} />
        <Screen name={Routes.TAB_SCHEDULE} component={ScheduleScreen} />
        <Screen name={Routes.TAB_MENU} component={MenuScreen} />
        <Screen name={Routes.TAB_PROFILE} component={ProfileStack} />
      </Navigator>
    </LoggedInWrapper>
  );
};

export default BottomTabs;
