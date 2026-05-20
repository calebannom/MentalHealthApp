import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const counselors = [
  { name: 'Mrs. Bernice Serwaa Ofosuhene Peasah', email: 'ama.mensah@example.com', phone: '024-123-4567', expertise: ['anxiety', 'stress', 'depression'] },
  { name: 'Mr. Kwame Owusu', email: 'kwame.owusu@example.com', phone: '024-987-6543', expertise: ['career', 'motivation', 'study stress'] },
  { name: 'Ms. Abena Boateng', email: 'abena.boateng@example.com', phone: '024-456-7890', expertise: ['relationships', 'self-esteem', 'loneliness'] },
];

export default function CounselorReferralScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendedCounselor, setRecommendedCounselor] = useState(null);

  const handleSubmit = async () => {
    if (!name || !email || !reason) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    setRecommendedCounselor(null);

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('User not logged in');

      const response = await fetch('http://10.132.196.1:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: `A user named ${name} needs a counselor. Reason: "${reason}".
            From this list of counselors, suggest the best match and provide only:
            Name, Email, Phone. List: ${counselors.map(c => `${c.name} (${c.expertise.join(', ')})`).join('; ')}. 
            Respond strictly with the counselor's contact info in text format like:
            Name: ..., Email: ..., Phone: ...`,
        }),
      });

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Unexpected response: ${text}`);
      }

      if (!response.ok) throw new Error(data.error || 'Server error');

      // --- FIXED PARSING ---
      let counselor = { name: 'Unknown', email: '', phone: '' };
      const nameMatch = data.response.match(/name[:\-]\s*(.*)/i);
      const emailMatch = data.response.match(/email[:\-]\s*(.*)/i);
      const phoneMatch = data.response.match(/phone[:\-]\s*(.*)/i);

      if (nameMatch) counselor.name = nameMatch[1].trim();
      if (emailMatch) counselor.email = emailMatch[1].trim();
      if (phoneMatch) counselor.phone = phoneMatch[1].trim();

      setRecommendedCounselor(counselor);

    } catch (error) {
      console.error('Referral failed:', error);
      alert(error.message || 'Failed to refer counselor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailPress = (email) => {
    Linking.openURL(`mailto:${email}`).catch(err => console.error('Error opening mail:', err));
  };

  const handlePhonePress = (phone) => {
    Linking.openURL(`tel:${phone}`).catch(err => console.error('Error opening dialer:', err));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Refer a Counselor via MentalHealthApp AI</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name *"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email *"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Reason for Referral *"
          value={reason}
          onChangeText={setReason}
          multiline
        />

        <TouchableOpacity
          style={[styles.button, isSubmitting && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit Referral</Text>}
        </TouchableOpacity>

        {recommendedCounselor && (
          <View style={styles.counselorCard}>
            <Text style={styles.counselorTitle}>Recommended Counselor</Text>
            <Text style={styles.counselorText}>Name: {recommendedCounselor.name}</Text>

            <Text style={[styles.counselorText, styles.link]} onPress={() => handleEmailPress(recommendedCounselor.email)}>
              Email: {recommendedCounselor.email}
            </Text>

            <Text style={[styles.counselorText, styles.link]} onPress={() => handlePhonePress(recommendedCounselor.phone)}>
              Phone: {recommendedCounselor.phone}
            </Text>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f0f4f7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#134e4a',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  counselorCard: {
    marginTop: 30,
    backgroundColor: '#b2f5ea',
    padding: 20,
    borderRadius: 12,
  },
  counselorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#134e4a',
  },
  counselorText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#0f172a',
  },
  link: {
    color: '#1d4ed8',
    textDecorationLine: 'underline',
  },
});
