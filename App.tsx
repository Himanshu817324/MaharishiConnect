import 'react-native-gesture-handler';
import 'react-native-screens';
import React from 'react';
import { useColorScheme } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { store } from './src/store';
import ThemeProvider from './src/theme';
import CustomStatusBar from './src/components/atoms/ui/StatusBar';
import RootNavigator from './src/navigation/RootNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <ThemeProvider>
        <SafeAreaProvider>
          <CustomStatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <RootNavigator />
          <Toast />
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
