import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { RootStackParamList } from '../types/navigation'; 

// Import navigation stacks
import AuthStack from './auth/AuthStack';
import MainStack from './main/MainStack';
import OnboardingStack from './onboarding/OnboardingStack';

// Import screens
import SplashScreen from '../screens/SplashScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const profileCompleted = useSelector((state: RootState) => state.auth.profileCompleted);
  const hasSeenOnboarding = useSelector((state: RootState) => state.auth.hasSeenOnboarding);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        {!hasSeenOnboarding && (
          <Stack.Screen name="OnboardingStack" component={OnboardingStack} />
        )}
        {hasSeenOnboarding && !isLoggedIn && (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        )}
        {hasSeenOnboarding && isLoggedIn && !profileCompleted && (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        )}
        {hasSeenOnboarding && isLoggedIn && profileCompleted && (
          <Stack.Screen name="MainStack" component={MainStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
