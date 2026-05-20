import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const moodOptions = [
  { mood: 'happy', emoji: '😄' },
  { mood: 'sad', emoji: '😢' },
  { mood: 'angry', emoji: '😡' },
  { mood: 'neutral', emoji: '😐' },
  { mood: 'anxious', emoji: '😰' },
];

export default function MoodTrackerScreen({ navigation }) {
  const [selectedMood, setSelectedMood] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [userKey, setUserKey] = useState('default_user');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get user email (or username) from AsyncStorage saved at login
        const email = await AsyncStorage.getItem('userEmail');
        if (!email) return;

        setUserKey(email); // Use email as unique key

        const storageKey = `moodProgress_${email}`;
        const stored = await AsyncStorage.getItem(storageKey);
        if (stored) setMoodHistory(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to load moods:', err);
      }
    };
    loadUserData();
  }, []);

  const submitMood = async () => {
    if (!selectedMood) return Alert.alert('Pick a mood first 🧐');
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const timestamp = new Date().toISOString();
      const newEntry = { mood: selectedMood, timestamp };

      // Save to user-specific local storage
      const updatedHistory = [...moodHistory, newEntry];
      const storageKey = `moodProgress_${userKey}`;
      setMoodHistory(updatedHistory);
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedHistory));

      Alert.alert('Saved', `Mood '${selectedMood}' logged successfully!`);
      setSelectedMood('');
    } catch (error) {
      console.error('Mood submission failed:', error);
      Alert.alert('Error', error.message || 'Could not save your mood 😔');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMoodItem = ({ item }) => {
    const option = moodOptions.find(opt => opt.mood === item.mood);
    return (
      <View style={styles.historyItem}>
        <Text style={styles.historyText}>{option?.emoji || '❓'} {item.mood}</Text>
        <Text style={styles.historyTime}>{new Date(item.timestamp).toLocaleString()}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>🧘🏽</Text>
        </View>
        <Text style={styles.title}>How are you feeling today?</Text>
        <Text style={styles.subtitle}>Tap to log your mood 🗓️</Text>
      </View>

      <View style={styles.moodGrid}>
        {moodOptions.map(({ mood, emoji }) => (
          <TouchableOpacity
            key={mood}
            style={[styles.moodButton, selectedMood === mood && styles.selected]}
            onPress={() => setSelectedMood(mood)}
          >
            <Text style={styles.moodText}>{emoji} {mood}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={submitMood}
        disabled={isSubmitting}
      >
        {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Save Mood</Text>}
      </TouchableOpacity>

      <View style={styles.historyContainer}>
        <Text style={styles.historyHeader}>Mood Progress 📈</Text>
        {moodHistory.length === 0 ? (
          <Text style={styles.noHistory}>No moods logged yet</Text>
        ) : (
          <FlatList
            data={moodHistory.slice().reverse()}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderMoodItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#e0f7f9', flex: 1, padding: 16 },
  header: { alignItems: 'center', marginBottom: 10 },
  iconCircle: { backgroundColor: '#b2f5ea', padding: 12, borderRadius: 50 },
  icon: { fontSize: 28 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#134e4a', marginTop: 8 },
  subtitle: { color: '#2c7a7b', fontSize: 13, marginTop: 4 },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 },
  moodButton: { backgroundColor: '#fff', borderColor: '#81e6d9', borderWidth: 1, borderRadius: 12, padding: 12, margin: 8 },
  selected: { backgroundColor: '#b2f5ea', borderColor: '#134e4a' },
  moodText: { fontSize: 16, color: '#134e4a', fontWeight: '600' },
  saveButton: { marginTop: 30, backgroundColor: '#134e4a', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, alignSelf: 'center' },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  historyContainer: { marginTop: 30, flex: 1 },
  historyHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#134e4a' },
  noHistory: { color: '#0f172a', fontStyle: 'italic' },
  historyItem: { backgroundColor: '#b2f5ea', padding: 12, borderRadius: 10, marginBottom: 10 },
  historyText: { fontSize: 16, fontWeight: '600', color: '#134e4a' },
  historyTime: { fontSize: 12, color: '#0f172a', marginTop: 4 },
});
