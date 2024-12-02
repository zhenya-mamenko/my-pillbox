import { ComponentProps, } from 'react';
import { Pressable, StyleSheet, View, } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import useThemeColor from '@/hooks/useThemeColor';


interface Props extends ComponentProps<any> {
  icon: any;
  onPress: () => void;
}

export default function CircleButton({ icon, onPress }: Props) {

  const styles = StyleSheet.create({
    circleButtonContainer: {
      borderColor: useThemeColor('borderDim'),
      borderRadius: 21,
      borderWidth: 1,
      height: 42,
      margin: 5,
      padding: 3,
      width: 42,
    },
    circleButton: {
      alignItems: 'center',
      backgroundColor: useThemeColor('background'),
      borderRadius: 21,
      flex: 1,
      justifyContent: 'center',
    },
  });

  return (
    <View style={styles.circleButtonContainer}>
      <Pressable style={styles.circleButton} onPress={onPress}>
        <MaterialIcons
          color={ useThemeColor('secondary') }
          name={icon}
          size={18}
        />
      </Pressable>
    </View>
  );
}
