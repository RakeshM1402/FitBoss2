import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import { useAppStore } from '../context/store';
import { colors } from '../theme';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import OnboardingSurveyScreen from '../screens/OnboardingSurveyScreen';
import AddFoodScreen from '../screens/AddFoodScreen';
import WorkoutModeScreen from '../screens/WorkoutModeScreen';

export type RootStackParamList = {
  Login: undefined;
  Onboarding: undefined;
  MainTabs: undefined;
  AddFood: undefined;
  WorkoutMode: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => {
          let iconName = 'circle';
          if (route.name === 'Dashboard') iconName = 'activity';
          else if (route.name === 'Leaderboard') iconName = 'award';
          else if (route.name === 'Profile') iconName = 'user';
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={UserProfileScreen} />
    </Tab.Navigator>
  );
};

export default function AppNavigator() {
  const { isAuthenticated, profile } = useAppStore();

  return (
    <NavigationContainer theme={{
      dark: true,
      colors: {
        primary: colors.primary,
        background: colors.background,
        card: colors.card,
        text: colors.text,
        border: colors.border,
        notification: colors.danger,
      },
      fonts: DefaultTheme.fonts
    }}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : !profile?.onboardingCompleted ? (
          <Stack.Screen name="Onboarding" component={OnboardingSurveyScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="AddFood" component={AddFoodScreen} options={{ presentation: 'modal', headerShown: true, title: 'Add Food', headerStyle: { backgroundColor: colors.card }, headerTintColor: colors.text }} />
            <Stack.Screen name="WorkoutMode" component={WorkoutModeScreen} options={{ presentation: 'fullScreenModal' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
