import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import AdminDashboard from '../screens/AdminDashboard';
import VideoManagerScreen from '../screens/VideoManagerScreen';
import StudentDashboard from '../screens/StudentDashboard';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import VideoRecorderScreen from '../screens/VideoRecorderScreen';
import { useAuth } from '../context/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();
const AuthStackNav = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
  return (
    <AuthStackNav.Navigator>
      <AuthStackNav.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <AuthStackNav.Screen name="Signup" component={SignupScreen} options={{ title: 'Sign up' }} />
    </AuthStackNav.Navigator>
  );
}

function AppTabs() {
  const { user } = useAuth();
  const isAdminOrFaculty = user?.type === 'admin' || user?.type === 'faculty';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home',
            Dashboard: 'grid',
            Notifications: 'notifications',
            Profile: 'person',
            Record: 'videocam',
          };
          const name = icons[route.name] || 'ellipse';
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Dashboard"
        component={isAdminOrFaculty ? VideoManagerScreen : StudentDashboard}
        options={{ title: isAdminOrFaculty ? 'Admin' : 'Student' }}
      />
      <Tab.Screen name="Record" component={VideoRecorderScreen} options={{ title: 'Record' }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isLoading, token } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoading ? (
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : token ? (
        <Stack.Screen name="Main" component={AppTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
