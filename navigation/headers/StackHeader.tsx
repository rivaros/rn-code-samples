import { useNavigation } from '@react-navigation/native';
import Box, { BoxProps } from 'components/common/Box';
import GenericText from 'components/common/GenericText';
import { colorsPalette } from 'core/theme';
import { useSafeAreaInsets } from 'core/utils/insets';
import BackButton from 'navigation/headers/BackButton';

interface StackHeaderProps extends BoxProps {
  title: string;
  backButtonHitSlop?: number;
}

const StackHeader = ({ title, backButtonHitSlop, ...props }: StackHeaderProps) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <Box
      backgroundColor={colorsPalette.white}
      pt={insets.top}
      zIndex={1}
      shadowColor={colorsPalette.azureishWhite}
      shadowOpacity={props.shadowOpacity !== undefined ? props.shadowOpacity : 1}
      shadowRadius={props.shadowRadius !== undefined ? props.shadowRadius : 4}
      justifyContent="space-between"
      alignItems="center"
      flexDirection="row"
      shadowOffsetX={0}
      shadowOffsetY={4}
      height={insets.top + 53}>
      <Box ml={17}>
        <BackButton hitSlop={backButtonHitSlop} onPress={() => navigation.goBack()} />
      </Box>
      <GenericText type="h3">{title}</GenericText>
      <Box width={13} mr={17} />
    </Box>
  );
};

export default StackHeader;
