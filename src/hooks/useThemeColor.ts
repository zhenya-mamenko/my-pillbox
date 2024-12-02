import { ColorValue } from 'react-native';
import useDynamicColorScheme from './useDynamicColorScheme';
import palette from '@/constants/palette';


const useThemeColor = (colorName: keyof typeof palette.light): ColorValue =>{
  const theme = useDynamicColorScheme() || 'light';

  return palette[theme][colorName];
}

export default useThemeColor;
