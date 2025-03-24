import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import { login, loginSuccess } from '../../redux/slices/authSlice';
import { theme } from '../../config/theme';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store'; // Adjust the path to your store

const dispatch = useDispatch<AppDispatch>();

const RegisterScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    // Reset error
    setError('');

    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would call an API to register the user
      // For demo purposes, we'll simulate a successful registration
      setTimeout(() => {
        // After successful registration, log the user in
        dispatch(loginSuccess({
          user: {
            id: '123',
            name,
            email,
          },
          token: 'demo-token-123',
        }));
        
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://placeholder.com/wp-content/uploads/2018/10/placeholder.png' }} 
            style={styles.logo} 
          />
          <Text style={styles.appName}>Wellness App</Text>
        </View>
        
        <Text style={styles.title}>Create Account</Text>
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        <TextInput
          label="Full Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
          autoCapitalize="words"
        />
        
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          mode="outlined"
          secureTextEntry
        />
        
        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          mode="outlined"
          secureTextEntry
        />
        
        <Button 
          mode="contained" 
          onPress={handleRegister} 
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Register
        </Button>
        
        <View style={styles.footer}>
          <Text>Already have an account? </Text>
          <Button 
            mode="text" 
            onPress={() => navigation.navigate('Login')}
            compact
          >
            Login
          </Button>
        </View>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  surface: {
    padding: 24,
    borderRadius: 8,
    elevation: 4,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  appName: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  error: {
    color: theme.colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default RegisterScreen;
