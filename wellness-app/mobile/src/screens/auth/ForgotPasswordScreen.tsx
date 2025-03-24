import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, TextInput, Button, Surface } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { theme } from '../../config/theme';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    // Reset states
    setError('');
    setSuccess(false);

    // Validate email
    if (!email) {
      setError('Email is required');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would call an API to send a password reset email
      // For demo purposes, we'll simulate a successful request
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
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
        
        <Text style={styles.title}>Reset Password</Text>
        
        {error ? <Text style={styles.error}>{error}</Text> : null}
        
        {success ? (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>
              Password reset instructions have been sent to your email.
            </Text>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('Login')} 
              style={styles.button}
            >
              Back to Login
            </Button>
          </View>
        ) : (
          <>
            <Text style={styles.instructions}>
              Enter your email address and we'll send you instructions to reset your password.
            </Text>
            
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Button 
              mode="contained" 
              onPress={handleResetPassword} 
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              Send Reset Instructions
            </Button>
            
            <View style={styles.footer}>
              <Button 
                mode="text" 
                onPress={() => navigation.navigate('Login')}
                compact
              >
                Back to Login
              </Button>
            </View>
          </>
        )}
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
  instructions: {
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
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
  successContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  successText: {
    color: theme.colors.success,
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;
