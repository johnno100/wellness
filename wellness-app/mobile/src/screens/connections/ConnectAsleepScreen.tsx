import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import AsleepApiAdapter from '../../services/api/AsleepApiAdapter';
import { theme } from '../../config/theme';

const ASLEEP_CLIENT_ID = 'YOUR_ASLEEP_CLIENT_ID';
const ASLEEP_CLIENT_SECRET = 'YOUR_ASLEEP_CLIENT_SECRET';
const REDIRECT_URL = 'wellnessapp://asleep-auth';

const ConnectAsleepScreen = ({ navigation }: any) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize Asleep API adapter
    AsleepApiAdapter.initialize(ASLEEP_CLIENT_ID, ASLEEP_CLIENT_SECRET);
    
    // Check if already authenticated
    setIsConnected(AsleepApiAdapter.isAuthenticated());

    // Set up deep link handler
    const handleDeepLink = async (event: { url: string }) => {
      const { url } = event;
      if (url.includes('wellnessapp://asleep-auth')) {
        setIsConnecting(true);
        const code = url.split('code=')[1].split('&')[0];
        const success = await AsleepApiAdapter.exchangeCodeForToken(code);
        setIsConnected(success);
        setIsConnecting(false);
      }
    };

    // Add event listener for deep links
    Linking.addEventListener('url', handleDeepLink);

    // Check for initial URL (app opened via deep link)
    Linking.getInitialURL().then((url) => {
      if (url && url.includes('wellnessapp://asleep-auth')) {
        handleDeepLink({ url });
      }
    });

    return () => {
      // Remove event listener
      Linking.removeAllListeners('url');
    };
  }, []);

  const handleConnect = async () => {
    const authUrl = AsleepApiAdapter.getAuthUrl(
      REDIRECT_URL,
      'read,sleep:read'
    );
    await Linking.openURL(authUrl);
  };

  const handleDisconnect = () => {
    AsleepApiAdapter.logout();
    setIsConnected(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect to Asleep</Text>
      <Text style={styles.description}>
        Connect your Asleep account to track your sleep patterns and quality.
      </Text>

      {isConnecting ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Connecting to Asleep...</Text>
        </View>
      ) : isConnected ? (
        <View style={styles.connectedContainer}>
          <Text style={styles.connectedText}>Connected to Asleep</Text>
          <Button
            mode="outlined"
            onPress={handleDisconnect}
            style={styles.disconnectButton}
          >
            Disconnect
          </Button>
        </View>
      ) : (
        <Button
          mode="contained"
          onPress={handleConnect}
          style={styles.connectButton}
          icon="sleep"
        >
          Connect to Asleep
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 32,
    color: '#666',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  connectedContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  connectedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.success,
    marginBottom: 16,
  },
  connectButton: {
    marginTop: 32,
    paddingVertical: 8,
  },
  disconnectButton: {
    marginTop: 16,
  },
});

export default ConnectAsleepScreen;
