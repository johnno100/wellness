import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, List, Divider, Button, TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { theme } from '../../config/theme';

const PrivacySettingsScreen = ({ navigation }: any) => {
  const [dataSharing, setDataSharing] = useState({
    sahha: true,
    strava: true,
    asleep: true,
    passio: true
  });
  
  const handleSaveSettings = () => {
    // In a real app, this would save the privacy settings to the backend
    // For demo purposes, we'll just navigate back
    navigation.goBack();
  };
  
  const toggleDataSharing = (service) => {
    setDataSharing({
      ...dataSharing,
      [service]: !dataSharing[service]
    });
  };
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Data Sharing</Title>
          <Text style={styles.description}>
            Control which services can access and share your health data.
          </Text>
          
          <List.Item
            title="Sahha"
            description="Mental health data"
            left={props => <List.Icon {...props} icon="brain" />}
            right={() => (
              <Button
                mode={dataSharing.sahha ? "contained" : "outlined"}
                onPress={() => toggleDataSharing('sahha')}
                style={styles.toggleButton}
              >
                {dataSharing.sahha ? "Enabled" : "Disabled"}
              </Button>
            )}
          />
          <Divider />
          
          <List.Item
            title="Strava"
            description="Fitness activity data"
            left={props => <List.Icon {...props} icon="run" />}
            right={() => (
              <Button
                mode={dataSharing.strava ? "contained" : "outlined"}
                onPress={() => toggleDataSharing('strava')}
                style={styles.toggleButton}
              >
                {dataSharing.strava ? "Enabled" : "Disabled"}
              </Button>
            )}
          />
          <Divider />
          
          <List.Item
            title="Asleep"
            description="Sleep data"
            left={props => <List.Icon {...props} icon="sleep" />}
            right={() => (
              <Button
                mode={dataSharing.asleep ? "contained" : "outlined"}
                onPress={() => toggleDataSharing('asleep')}
                style={styles.toggleButton}
              >
                {dataSharing.asleep ? "Enabled" : "Disabled"}
              </Button>
            )}
          />
          <Divider />
          
          <List.Item
            title="Passio"
            description="Nutrition data"
            left={props => <List.Icon {...props} icon="food-apple" />}
            right={() => (
              <Button
                mode={dataSharing.passio ? "contained" : "outlined"}
                onPress={() => toggleDataSharing('passio')}
                style={styles.toggleButton}
              >
                {dataSharing.passio ? "Enabled" : "Disabled"}
              </Button>
            )}
          />
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Data Retention</Title>
          <Text style={styles.description}>
            Control how long your data is stored in the app.
          </Text>
          
          <List.Item
            title="Health Data"
            description="Store health metrics and activity data"
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {/* Open data retention options */}}
          />
          <Divider />
          
          <List.Item
            title="Usage Data"
            description="Store app usage statistics"
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {/* Open usage data options */}}
          />
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Export Data</Title>
          <Text style={styles.description}>
            Export your data in various formats.
          </Text>
          
          <Button 
            mode="outlined" 
            icon="download" 
            style={styles.exportButton}
            onPress={() => {/* Handle export */}}
          >
            Export as CSV
          </Button>
          
          <Button 
            mode="outlined" 
            icon="download" 
            style={styles.exportButton}
            onPress={() => {/* Handle export */}}
          >
            Export as JSON
          </Button>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Delete Account</Title>
          <Text style={styles.description}>
            Permanently delete your account and all associated data.
          </Text>
          
          <Button 
            mode="outlined" 
            icon="delete" 
            color={theme.colors.error}
            style={styles.deleteButton}
            onPress={() => {/* Show delete confirmation */}}
          >
            Delete My Account
          </Button>
        </Card.Content>
      </Card>
      
      <Button 
        mode="contained" 
        onPress={handleSaveSettings}
        style={styles.saveButton}
      >
        Save Settings
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  card: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 16,
    color: '#666',
  },
  toggleButton: {
    marginVertical: 4,
  },
  exportButton: {
    marginBottom: 8,
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
  saveButton: {
    marginVertical: 24,
  },
});

export default PrivacySettingsScreen;
