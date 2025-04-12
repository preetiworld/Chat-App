import { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!username.trim()) {
      setError('Username cannot be empty');
      return;
    }
    
    // Store username and navigate to chat
    router.push({
      pathname: '/chat',
      params: { username }
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Chat App</Text>
        <Text style={styles.subtitle}>Enter your username to join</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            if (error) setError('');
          }}
          autoCapitalize="none"
        />
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Join Chat</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  loginContainer: {
    width: '80%',
    alignSelf: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 