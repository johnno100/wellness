import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Title, List, Divider, Button, RadioButton } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { theme } from '../../config/theme';

// Component for color selection circles
const TouchableColorCircle = ({ color, isSelected, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.colorCircleContainer, isSelected && styles.selectedColorContainer]}
      onPress={onPress}
    >
      <View style={[styles.colorCircle, { backgroundColor: color }]} />
    </TouchableOpacity>
  );
};

const AppearanceSettingsScreen = ({ navigation }: any) => {
  const [themeMode, setThemeMode] = useState('light');
  const [accentColor, setAccentColor] = useState('blue');
  const [fontSize, setFontSize] = useState('medium');
  
  const handleSaveSettings = () => {
    // In a real app, this would save the appearance settings to the app state
    // For demo purposes, we'll just navigate back
    navigation.goBack();
  };
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Theme</Title>
          <RadioButton.Group onValueChange={value => setThemeMode(value)} value={themeMode}>
            <RadioButton.Item label="Light" value="light" />
            <RadioButton.Item label="Dark" value="dark" />
            <RadioButton.Item label="System Default" value="system" />
          </RadioButton.Group>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Accent Color</Title>
          <View style={styles.colorContainer}>
            <TouchableColorCircle 
              color="#2196F3" 
              isSelected={accentColor === 'blue'} 
              onPress={() => setAccentColor('blue')} 
            />
            <TouchableColorCircle 
              color="#4CAF50" 
              isSelected={accentColor === 'green'} 
              onPress={() => setAccentColor('green')} 
            />
            <TouchableColorCircle 
              color="#F44336" 
              isSelected={accentColor === 'red'} 
              onPress={() => setAccentColor('red')} 
            />
            <TouchableColorCircle 
              color="#9C27B0" 
              isSelected={accentColor === 'purple'} 
              onPress={() => setAccentColor('purple')} 
            />
            <TouchableColorCircle 
              color="#FF9800" 
              isSelected={accentColor === 'orange'} 
              onPress={() => setAccentColor('orange')} 
            />
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Font Size</Title>
          <RadioButton.Group onValueChange={value => setFontSize(value)} value={fontSize}>
            <RadioButton.Item label="Small" value="small" />
            <RadioButton.Item label="Medium" value="medium" />
            <RadioButton.Item label="Large" value="large" />
          </RadioButton.Group>
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
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  colorCircleContainer: {
    padding: 4,
    borderRadius: 20,
  },
  selectedColorContainer: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  saveButton: {
    marginVertical: 24,
  },
});

export default AppearanceSettingsScreen;
