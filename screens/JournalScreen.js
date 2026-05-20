import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function JournalScreen() {
  const [journalEntries, setJournalEntries] = useState([]);

  useEffect(() => {
    const loadJournalEntries = async () => {
      const entries = JSON.parse(await AsyncStorage.getItem('journalEntries')) || [];
      setJournalEntries(entries.reverse()); // latest on top
    };

    loadJournalEntries();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>📓</Text>
        </View>
        <Text style={styles.title}>MentalHealthApp Journal</Text>
        <Text style={styles.subtitle}>Your saved reflections 💭</Text>
      </View>

      <FlatList
        data={journalEntries}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.entryContainer}>
            <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
            <Text style={styles.summary}>{item.summary}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e0f7f9',
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    backgroundColor: '#b2f5ea',
    padding: 12,
    borderRadius: 50,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#134e4a',
    marginTop: 8,
  },
  subtitle: {
    color: '#2c7a7b',
    fontSize: 13,
    marginTop: 4,
  },
  entryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 5,
    borderLeftColor: '#81e6d9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timestamp: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 4,
  },
  summary: {
    fontSize: 15,
    color: '#134e4a',
  },
});
