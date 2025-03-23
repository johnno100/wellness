import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import MentalHealthScreen from '../screens/mentalHealth/MentalHealthScreen';
import SleepScreen from '../screens/sleep/SleepScreen';
import NutritionScreen from '../screens/nutrition/NutritionScreen';
import FitnessScreen from '../screens/fitness/FitnessScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

// API Connection Screens
import ConnectSahhaScreen from '../screens/connections/ConnectSahhaScreen';
import ConnectStravaScreen from '../screens/connections/ConnectStravaScreen';
import ConnectAsleepScreen from '../screens/connections/ConnectAsleepScreen';
import ConnectPassioScreen from '../screens/connections/ConnectPassioScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

const DashboardStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
  </Stack.Navigator>
);

const MentalHealthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="MentalHealth" component={MentalHealthScreen} />
    <Stack.Screen name="ConnectSahha" component={ConnectSahhaScreen} />
  </Stack.Navigator>
);

const SleepStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Sleep" component={SleepScreen} />
    <Stack.Screen name="ConnectAsleep" component={ConnectAsleepScreen} />
  </Stack.Navigator>
);

const NutritionStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Nutrition" component={NutritionScreen} />
    <Stack.Screen name="ConnectPassio" component={ConnectPassioScreen} />
  </Stack.Navigator>
);

const FitnessStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Fitness" component={FitnessScreen} />
    <Stack.Screen name="ConnectStrava" component={ConnectStravaScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="DashboardTab" component={DashboardStack} options={{ title: 'Dashboard' }} />
    <Tab.Screen name="MentalHealthTab" component={MentalHealthStack} options={{ title: 'Mental' }} />
    <Tab.Screen name="SleepTab" component={SleepStack} options={{ title: 'Sleep' }} />
    <Tab.Screen name="NutritionTab" component={NutritionStack} options={{ title: 'Nutrition' }} />
    <Tab.Screen name="FitnessTab" component={FitnessStack} options={{ title: 'Fitness' }} />
    <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profile' }} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
