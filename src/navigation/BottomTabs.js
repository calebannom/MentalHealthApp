import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../../screens/HomeScreen';
import ChatScreen from '../../screens/ChatScreen';
import JournalScreen from '../../screens/JournalScreen';
import MoodTrackerScreen from '../../screens/MoodTrackerScreen';
import CounselorReferralScreen from '../../screens/CounselorReferralScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#e0f7f9',
          height: 60,       // slightly taller tab bar
          paddingBottom: 8, // lift icons a bit
        },
        tabBarShowLabel: false, // hide text labels
        tabBarActiveTintColor: '#134e4a',
        tabBarInactiveTintColor: '#555',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color, marginBottom: -4 }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color, marginBottom: -4 }}>💬</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color, marginBottom: -4 }}>📓</Text>
          ),
        }}
      />
      <Tab.Screen
        name="MoodTracker"
        component={MoodTrackerScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color, marginBottom: -4 }}>😊</Text>
          ),
        }}
      />
      <Tab.Screen
        name="CounselorReferral"
        component={CounselorReferralScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color, marginBottom: -4 }}>🩺</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
