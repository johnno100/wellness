import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import PassioApiAdapter from '../../services/api/PassioApiAdapter';
import { theme } from '../../config/theme';

const PASSIO_CLIENT_ID = 'YOUR_PASSIO_CLIENT_ID';
const PASSIO_CLIENT_SECRET = 'YOUR_PASSIO_CLIENT_SECRET';
const REDIRECT_URL = 'wellnessapp://passio-auth';

const ConnectPassioScreen = ({ navigation }: any) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize Passio API adapter
    PassioApiAdapter.initialize(PASSIO_CLIENT_ID, PASSIO_CLIENT_SECRET);
    
    // Check if already authenticated
    setIsConnected(PassioApiAdapter.isAuthenticated());

    // Set up deep link handler
    const handleDeepLink = async (event: { url: string }) => {
      const { url } = event;
      if (url.includes('wellnessapp://passio-auth')) {
        setIsConnecting(true);
        const code = url.split('code=')[1].split('&')[0];
        const success = await PassioApiAdapter.exchangeCodeForToken(code);
        setIsConnected(success);
        setIsConnecting(false);
      }
    };

    // Add event listener for deep links
    Linking.addEventListener('url', handleDeepLink);

    // Check for initial URL (app opened via deep link)
    Linking.getInitialURL().then((url) => {
      if (url && url.includes('wellnessapp://passio-auth')) {
        handleDeepLink({ url });
      }
    });

    return () => {
      // Remove event listener
      Linking.removeAllListeners('url');
    };
  }, []);

  const handleConnect = async () => {
    const authUrl = PassioApiAdapter.getAuthUrl(
      REDIRECT_URL,
      'read,nutrition:read'
    );
    await Linking.openURL(authUrl);
  };

  const handleDisconnect = () => {
    PassioApiAdapter.logout();
    setIsConnected(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect to Passio</Text>
      <Text style={styles.description}>
        Connect your Passio account to track your nutrition and food intake.
      </Text>

      {isConnecting ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Connecting to Passio...</Text>
        </View>
      ) : isConnected ? (
        <View style={styles.connectedContainer}>
          <Text style={styles.connectedText}>Connected to Passio</Text>
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
          icon="food-apple"
        >
          Connect to Passio
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

export default ConnectPassioScreen;
