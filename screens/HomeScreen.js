import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        const email = await AsyncStorage.getItem('userEmail');
        setUserName(name || '');
        setUserEmail(email || '');
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userName');
    await AsyncStorage.removeItem('userEmail');
    navigation.replace('Login'); // Make sure your navigator has 'Login'
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#134e4a" />
      </View>
    );
  }

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    const first = parts[0]?.[0] || '';
    const last = parts[1]?.[0] || '';
    return (first + last).toUpperCase();
  };

  return (
    <View style={styles.container}>
      {/* Profile at top right */}
      {userName ? (
        <TouchableOpacity style={styles.profileCircle} onPress={handleLogout}>
          <Text style={styles.profileInitials}>{getInitials(userName)}</Text>
        </TouchableOpacity>
      ) : null}

      {/* Centered content */}
      <View style={styles.centerContent}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>🌿</Text>
        </View>
        <Text style={styles.title}>Welcome to MentalHealthApp</Text>
        <Text style={styles.subtitle}>Use the tabs below to navigate 💚</Text>

        <View style={styles.content}>
          <Text style={styles.infoText}>
            🌟 Chat with your AI companion{"\n"}
            📓 Check your journals{"\n"}
            😊 Track your mood{"\n"}
            🩺 Refer to a counselor
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e0f7f9', padding: 24 },
  profileCircle: {
    position: 'absolute',
    top: 24,
    right: 24,
    backgroundColor: '#8E44AD',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  profileInitials: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  iconCircle: { backgroundColor: '#b2f5ea', padding: 20, borderRadius: 50, marginBottom: 10 },
  icon: { fontSize: 36 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#134e4a', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#2c7a7b', textAlign: 'center', marginBottom: 20 },
  content: { marginTop: 20 },
  infoText: { fontSize: 16, color: '#134e4a', textAlign: 'center', lineHeight: 28 },
});
