import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { auth } from '../src/firebaseConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.wrapper}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🧠</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to continue your MentalHealthApp journey</Text>
        </View>
        <View style={styles.formBox}>
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888" value={email} onChangeText={setEmail} autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#888" secureTextEntry value={password} onChangeText={setPassword} />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Register')}>
            <Text style={styles.secondaryButtonText}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#e0f7f9', flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  wrapper: { width: '100%', alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 20 },
  iconCircle: { backgroundColor: '#b2f5ea', padding: 10, borderRadius: 50, marginBottom: 10 },
  icon: { fontSize: 30 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#134e4a', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#2c7a7b', textAlign: 'center', marginTop: 4 },
  formBox: { width: '100%', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#81e6d9', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12, fontSize: 16, color: '#333' },
  button: { backgroundColor: '#8E44AD', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  secondaryButton: { marginTop: 16, alignItems: 'center' },
  secondaryButtonText: { color: '#319795', fontSize: 14 },
});
