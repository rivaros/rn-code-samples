import { StackHeaderProps } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from './BackButton';
import Box from 'components/common/Box';

const CommonHeader = ({ navigation, back }: StackHeaderProps) => (
  <SafeAreaView edges={['top', 'left', 'right']}>
    <Box ph={16} height={28} flexDirection="row" justifyContent="center">
      {back && (
        <Box l={16} t={0} position="absolute" pt={8} pb={4}>
          <BackButton onPress={navigation.goBack} />
        </Box>
      )}
    </Box>
  </SafeAreaView>
);

export default CommonHeader;
