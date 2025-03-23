import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Avatar, Switch, List, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { theme } from '../../config/theme';
import { logout } from '../../redux/slices/authSlice';

const ProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [healthSharingEnabled, setHealthSharingEnabled] = useState(true);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text 
            size={80} 
            label={user?.name?.split(' ').map(n => n[0]).join('') || 'U'} 
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Title>{user?.name || 'Demo User'}</Title>
            <Paragraph>{user?.email || 'user@example.com'}</Paragraph>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigation.navigate('EditProfile')}>Edit Profile</Button>
        </Card.Actions>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Connected Services</Title>
          <List.Item
            title="Sahha"
            description="Mental health tracking"
            left={props => <List.Icon {...props} icon="brain" color={theme.colors.primary} />}
            right={props => <List.Icon {...props} icon="check-circle" color={theme.colors.success} />}
            onPress={() => navigation.navigate('ConnectSahha')}
          />
          <Divider />
          <List.Item
            title="Strava"
            description="Fitness activity tracking"
            left={props => <List.Icon {...props} icon="run" color={theme.colors.primary} />}
            right={props => <List.Icon {...props} icon="check-circle" color={theme.colors.success} />}
            onPress={() => navigation.navigate('ConnectStrava')}
          />
          <Divider />
          <List.Item
            title="Asleep"
            description="Sleep analysis"
            left={props => <List.Icon {...props} icon="sleep" color={theme.colors.primary} />}
            right={props => <List.Icon {...props} icon="check-circle" color={theme.colors.success} />}
            onPress={() => navigation.navigate('ConnectAsleep')}
          />
          <Divider />
          <List.Item
            title="Passio"
            description="Nutrition tracking"
            left={props => <List.Icon {...props} icon="food-apple" color={theme.colors.primary} />}
            right={props => <List.Icon {...props} icon="check-circle" color={theme.colors.success} />}
            onPress={() => navigation.navigate('ConnectPassio')}
          />
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Settings</Title>
          <List.Item
            title="Notifications"
            description="Receive reminders and updates"
            right={() => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color={theme.colors.primary}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Dark Mode"
            description="Use dark theme"
            right={() => (
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                color={theme.colors.primary}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Health Data Sharing"
            description="Share data between connected services"
            right={() => (
              <Switch
                value={healthSharingEnabled}
                onValueChange={setHealthSharingEnabled}
                color={theme.colors.primary}
              />
            )}
          />
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Account</Title>
          <List.Item
            title="Change Password"
            left={props => <List.Icon {...props} icon="lock" />}
            onPress={() => navigation.navigate('ChangePassword')}
          />
          <Divider />
          <List.Item
            title="Privacy Policy"
            left={props => <List.Icon {...props} icon="shield-account" />}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          />
          <Divider />
          <List.Item
            title="Terms of Service"
            left={props => <List.Icon {...props} icon="file-document" />}
            onPress={() => navigation.navigate('TermsOfService')}
          />
          <Divider />
          <List.Item
            title="Help & Support"
            left={props => <List.Icon {...props} icon="help-circle" />}
            onPress={() => navigation.navigate('Support')}
          />
          <Divider />
          <List.Item
            title="Logout"
            left={props => <List.Icon {...props} icon="logout" color={theme.colors.error} />}
            onPress={handleLogout}
          />
        </Card.Content>
      </Card>
      
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 0.1.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  profileCard: {
    marginBottom: 16,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 16,
    backgroundColor: theme.colors.primary,
  },
  profileInfo: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  versionText: {
    color: '#666',
  },
});

export default ProfileScreen;
