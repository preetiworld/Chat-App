import { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { io } from 'socket.io-client';

// Message interface
interface Message {
  id: string;
  user: string;
  userId: string;
  message: string;
  time: string;
}

// Server URL - change this to your server IP address when testing on a device
const SERVER_URL = 'http://192.168.1.6:5000'; // For physical devices
// If the above doesn't work, try these alternatives:
// const SERVER_URL = 'http://10.0.2.2:5000'; // For Android emulator
// const SERVER_URL = 'http://localhost:5000'; // For web or iOS simulator

export default function ChatScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const [error, setError] = useState('');
  
  // Socket reference
  const socketRef = useRef<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize socket connection
  useEffect(() => {
    // Create socket connection
    socketRef.current = io(SERVER_URL);
    
    // Handle connection
    socketRef.current.on('connect', () => {
      setConnected(true);
      socketRef.current.emit('user_join', username);
    });
    
    // Handle connection error
    socketRef.current.on('connect_error', (err: any) => {
      console.error('Connection error:', err);
      setError('Failed to connect to the server. Please try again later.');
    });
    
    // Handle new messages
    socketRef.current.on('receive_message', (data: Message) => {
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: `${data.userId}-${Date.now()}`,
          user: data.user,
          userId: data.userId,
          message: data.message,
          time: data.time
        }
      ]);
    });
    
    // Handle user typing
    socketRef.current.on('user_typing', (user: string) => {
      setTypingUser(user);
      
      // Clear typing indicator after 2 seconds
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        setTypingUser('');
      }, 2000);
    });
    
    // Clean up
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [username]);

  // Handle sending message
  const sendMessage = () => {
    if (!message.trim()) return;
    
    if (socketRef.current && connected) {
      socketRef.current.emit('send_message', { message });
      setMessage('');
    }
  };

  // Handle typing indicator
  const handleTyping = (text: string) => {
    setMessage(text);
    
    if (socketRef.current && connected) {
      socketRef.current.emit('typing');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>Chat Room</Text>
          {connected ? (
            <View style={styles.onlineIndicator} />
          ) : (
            <ActivityIndicator size="small" color="#2196F3" />
          )}
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          style={styles.messageList}
          renderItem={({ item }) => (
            <View style={[
              styles.messageBubble,
              item.userId === socketRef.current?.id ? 
                styles.myMessage : 
                styles.otherMessage
            ]}>
              {item.userId !== socketRef.current?.id && (
                <Text style={styles.messageUser}>{item.user}</Text>
              )}
              <Text style={styles.messageContent}>{item.message}</Text>
              <Text style={styles.messageTime}>{item.time}</Text>
            </View>
          )}
        />

        {typingUser ? (
          <Text style={styles.typingIndicator}>{typingUser} is typing...</Text>
        ) : null}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={handleTyping}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton,
              (!connected || !message.trim()) && styles.disabledButton
            ]} 
            onPress={sendMessage}
            disabled={!connected || !message.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
  },
  errorContainer: {
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 5,
    margin: 10,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#e3f2fd',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
  },
  messageUser: {
    fontWeight: 'bold',
    marginBottom: 2,
    fontSize: 12,
    color: '#555',
  },
  messageContent: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 10,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  typingIndicator: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#2196F3',
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: '#B0BEC5',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 