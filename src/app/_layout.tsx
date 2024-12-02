import { Stack } from 'expo-router';
import useThemeColor from '@/hooks/useThemeColor';
import t from '@/helpers/localization';


export default function RootLayout() {
  return <Stack>
    <Stack.Screen
      name='index'
      options={{
        headerStyle: {
          backgroundColor: useThemeColor('primary') as string,
        },
        headerTintColor: useThemeColor('textOnPrimary') as string,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: true,
        title: t('app_title'),
      }}
    />
  </Stack>;
}
