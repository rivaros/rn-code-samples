import { Insets } from 'react-native';
import GenericButton from 'components/common/GenericButton';
import { Icon, icons } from 'components/common/Icon';
import { colorsPalette } from 'core/theme';

type Props = {
  onPress: () => void;
  hitSlop?: number | Insets;
};

const BackButton = ({ onPress, hitSlop }: Props) => (
  <GenericButton onPress={onPress} hitSlop={hitSlop || 50}>
    <Icon
      width={13}
      height={13}
      stroke={colorsPalette.greys._444444}
      icon={icons.nav.chevronLeft}
    />
  </GenericButton>
);

export default BackButton;
