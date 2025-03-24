import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Switch, List, Divider, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { theme } from '../../config/theme';

const NotificationsSettingsScreen = ({ navigation }: any) => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [reminderNotifications, setReminderNotifications] = useState(true);
  const [healthUpdates, setHealthUpdates] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [goalAlerts, setGoalAlerts] = useState(true);
  
  const handleSaveSettings = () => {
    // In a real app, this would save the notification settings to the backend
    // For demo purposes, we'll just navigate back
    navigation.goBack();
  };
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Notification Channels</Title>
          <List.Item
            title="Push Notifications"
            description="Receive notifications on your device"
            right={() => (
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                color={theme.colors.primary}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Email Notifications"
            description="Receive notifications via email"
            right={() => (
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                color={theme.colors.primary}
              />
            )}
          />
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Notification Types</Title>
          <List.Item
            title="Reminders"
            description="Daily reminders for tracking and activities"
            right={() => (
              <Switch
                value={reminderNotifications}
                onValueChange={setReminderNotifications}
                color={theme.colors.primary}
                disabled={!pushNotifications && !emailNotifications}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Health Updates"
            description="Updates about your health metrics"
            right={() => (
              <Switch
                value={healthUpdates}
                onValueChange={setHealthUpdates}
                color={theme.colors.primary}
                disabled={!pushNotifications && !emailNotifications}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Weekly Reports"
            description="Weekly summary of your health data"
            right={() => (
              <Switch
                value={weeklyReports}
                onValueChange={setWeeklyReports}
                color={theme.colors.primary}
                disabled={!pushNotifications && !emailNotifications}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Goal Alerts"
            description="Notifications when you reach your goals"
            right={() => (
              <Switch
                value={goalAlerts}
                onValueChange={setGoalAlerts}
                color={theme.colors.primary}
                disabled={!pushNotifications && !emailNotifications}
              />
            )}
          />
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Quiet Hours</Title>
          <Text style={styles.description}>
            During quiet hours, you will not receive push notifications unless they are critical.
          </Text>
          <List.Item
            title="Start Time"
            description="10:00 PM"
            onPress={() => {/* Open time picker */}}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <Divider />
          <List.Item
            title="End Time"
            description="7:00 AM"
            onPress={() => {/* Open time picker */}}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
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
  saveButton: {
    marginVertical: 24,
  },
});

export default NotificationsSettingsScreen;
