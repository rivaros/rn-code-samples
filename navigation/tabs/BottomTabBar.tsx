/* eslint-disable react/jsx-props-no-spreading */
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Box from 'components/common/Box';
import GenericButton from 'components/common/GenericButton';
import GenericText from 'components/common/GenericText';
import { Icon, IconData, SvgColoring, icons } from 'components/common/Icon';
import { colorsPalette } from 'core/theme';
import { useSafeAreaInsets } from 'core/utils/insets';
import { FlowNames, buildTestID } from 'core/utils/testing';
import { Routes } from 'navigation/types';

const labelMap: { [key: string]: string } = {
  [Routes.TAB_HOME]: 'Home',
  [Routes.TAB_MENU]: 'Menu',
  [Routes.TAB_PROFILE]: 'Profile',
  [Routes.TAB_SCHEDULE]: 'Schedule',
};

const iconMap: { [key: string]: { icon: IconData; normal: SvgColoring; selected: SvgColoring } } = {
  [Routes.TAB_HOME]: {
    icon: icons.nav.tabs.home,
    normal: { stroke: colorsPalette.darkSilver },
    selected: { stroke: colorsPalette.purple },
  },
  [Routes.TAB_MENU]: {
    icon: icons.nav.tabs.menu,
    normal: { fill: colorsPalette.darkSilver },
    selected: { fill: colorsPalette.purple },
  },
  [Routes.TAB_SCHEDULE]: {
    icon: icons.nav.tabs.schedule,
    normal: { fill: colorsPalette.darkSilver },
    selected: { fill: colorsPalette.purple },
  },
  [Routes.TAB_PROFILE]: {
    icon: icons.nav.tabs.profile,
    normal: { fill: colorsPalette.darkSilver },
    selected: { fill: colorsPalette.purple },
  },
};

const BottomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <Box
      flexDirection="row"
      pb={insets.bottom}
      height={50 + insets.bottom}
      pt={14}
      justifyContent="space-around"
      backgroundColor={colorsPalette.white}
      shadowOpacity={0.1}
      shadowOffsetX={0}
      shadowOffsetY={-1}
      shadowRadius={7}
      zIndex={2}
      shadowColor={colorsPalette.black}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const { icon, normal, selected } = iconMap[route.name];
        const styles = isFocused ? selected : normal;

        const onPress = () => {
          if (isFocused) return;

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <GenericButton
            testID={buildTestID(labelMap[route.name], FlowNames.NavigationBar)}
            key={route.key}
            alignItems="center"
            onPress={onPress}
            hitSlop={{
              left: 30,
              right: 30,
              top: 10,
              bottom: 30,
            }}>
            <Icon icon={icon} height={19} width={19} mb={40} {...styles} />
            <GenericText type="h6" color={isFocused ? 'purple' : 'primary'}>
              {labelMap[route.name]}
            </GenericText>
          </GenericButton>
        );
      })}
    </Box>
  );
};
export default BottomTabBar;
