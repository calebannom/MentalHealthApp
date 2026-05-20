import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatScreen({ navigation }) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (message.trim().length === 0 || isTyping) return;

    const userMessage = { role: 'user', content: message.trim() };
    setChat(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Token not found');

      const response = await fetch('http://10.132.196.1:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage.content }),
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

      const aiReply = { role: 'assistant', content: data.response };
      setChat(prev => [...prev, aiReply]);
    } catch (error) {
      console.error('Sending message failed:', error);
      Alert.alert('Error', error.message || 'Could not send message');
    } finally {
      setIsTyping(false);
    }
  };

  const sendFinalMessage = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch('http://10.132.196.1:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: 'make a summary of the conversation in less than 10 words',
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

      const summary = data.response;
      const timestamp = new Date().toISOString();
      const entries = JSON.parse(await AsyncStorage.getItem('journalEntries')) || [];
      const updated = [...entries, { timestamp, summary }];

      await AsyncStorage.setItem('journalEntries', JSON.stringify(updated));
      navigation.navigate('Journal');
    } catch (error) {
      Alert.alert('Error', 'Could not save the conversation summary.');
      console.error('Final message failed:', error);
    }
  };

  const handleBackPress = useCallback(() => {
    Alert.alert('Leave Chat', 'Save a short summary of this conversation?', [
      { text: 'Cancel', style: 'cancel', onPress: () => navigation.goBack() },
      { text: 'Yes', onPress: sendFinalMessage },
    ]);
    return true;
  }, [navigation]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => sub.remove();
  }, [handleBackPress]);

  const renderMessageContent = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <Text
            key={index}
            style={[styles.messageText, styles.linkText]}
            onPress={() => Linking.openURL(part)}
          >
            {part}
          </Text>
        );
      } else {
        return (
          <Text key={index} style={styles.messageText}>
            {part}
          </Text>
        );
      }
    });
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageBubble,
        item.role === 'user' ? styles.userBubble : styles.botBubble,
      ]}
    >
      {renderMessageContent(item.content)}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>🧠</Text>
        </View>
        <Text style={styles.title}>Talk to MentalHealthApp</Text>
        <Text style={styles.subtitle}>You're not alone. Let’s talk 💬</Text>
      </View>

      <FlatList
        data={chat}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {isTyping && (
        <View style={[styles.messageBubble, styles.botBubble]}>
          <Text style={styles.messageText}>MentalHealthApp is typing...</Text>
        </View>
      )}

      <View style={styles.inputSection}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
          placeholderTextColor="#94a3b8"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
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
  messageBubble: {
    maxWidth: '80%',
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: '#d1fae5',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#b2f5ea',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 15,
    color: '#134e4a',
  },
  linkText: {
    color: '#1d4ed8',
    textDecorationLine: 'underline',
  },
  inputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#81e6d9',
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
    color: '#0f172a',
  },
  sendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#134e4a',
    borderRadius: 8,
    marginLeft: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
