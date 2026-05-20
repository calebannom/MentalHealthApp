import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from '@firebase/auth';
import { doc, setDoc } from '@firebase/firestore';
import { auth, db } from '../src/firebaseConfig';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistration = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please enter your name, email, and password.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
      });
      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert('Registration Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.wrapper}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>🌿</Text>
          </View>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>Begin your MentalHealthApp journey today</Text>
        </View>
        <View style={styles.formBox}>
          <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#888" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#888" value={email} onChangeText={setEmail} autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#888" secureTextEntry value={password} onChangeText={setPassword} />
          <TouchableOpacity style={styles.button} onPress={handleRegistration}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.privacyBox}>
          <Text style={styles.privacyText}>🔒 We value your privacy.</Text>
          <Text style={styles.privacyText}>By signing up, you agree to our Terms of Service and Privacy Policy.</Text>
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
  privacyBox: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginTop: 30, width: '100%' },
  privacyText: { fontSize: 12, textAlign: 'center', color: '#319795' },
});
