import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, TextInput } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { theme } from '../../config/theme';
import SahhaApiAdapter from '../../services/api/SahhaApiAdapter';
import { fetchMentalHealthDataStart, fetchMentalHealthDataSuccess, fetchMentalHealthDataFailure } from '../../redux/slices/mentalHealthSlice';

const MentalHealthScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { mentalHealthScore, stressLevel, anxietyLevel, moodHistory, loading, error } = useSelector(
    (state: RootState) => state.mentalHealth
  );
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');

  const handleRefresh = async () => {
    dispatch(fetchMentalHealthDataStart());
    try {
      // In a real app, this would fetch data from the Sahha API
      const scores = await SahhaApiAdapter.getHealthScores();
      
      // For demo purposes, we'll use mock data
      const mockData = {
        mentalHealthScore: 78,
        stressLevel: 42,
        anxietyLevel: 35,
        moodHistory: [
          { date: '2025-03-22', mood: 'Happy', notes: 'Had a great day!' },
          { date: '2025-03-21', mood: 'Tired', notes: 'Worked late' },
          { date: '2025-03-20', mood: 'Stressed', notes: 'Deadline approaching' },
        ],
      };
      
      dispatch(fetchMentalHealthDataSuccess(mockData));
    } catch (error) {
      dispatch(fetchMentalHealthDataFailure(error.message));
    }
  };

  const handleAddMood = () => {
    if (!mood) return;
    
    // In a real app, this would send data to the Sahha API
    // For demo purposes, we'll just update the local state
    const newMoodEntry = {
      date: new Date().toISOString().split('T')[0],
      mood,
      notes,
    };
    
    // Update the mood history in the Redux store
    const updatedMoodHistory = [newMoodEntry, ...(moodHistory || [])];
    dispatch(fetchMentalHealthDataSuccess({
      mentalHealthScore: mentalHealthScore || 78,
      stressLevel: stressLevel || 42,
      anxietyLevel: anxietyLevel || 35,
      moodHistory: updatedMoodHistory,
    }));
    
    // Clear the input fields
    setMood('');
    setNotes('');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Mental Health Score</Title>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>{mentalHealthScore || '78'}</Text>
            <Text style={styles.scoreLabel}>/100</Text>
          </View>
          <Paragraph>Your mental health score is based on various factors including sleep patterns, activity levels, and self-reported mood.</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={handleRefresh} loading={loading}>
            Refresh
          </Button>
          <Button onPress={() => navigation.navigate('ConnectSahha')}>
            Connect Sahha
          </Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Stress & Anxiety</Title>
          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{stressLevel || '42'}</Text>
              <Text style={styles.metricLabel}>Stress</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{anxietyLevel || '35'}</Text>
              <Text style={styles.metricLabel}>Anxiety</Text>
            </View>
          </View>
          <Paragraph>Lower scores indicate better mental well-being.</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Mood Tracker</Title>
          <TextInput
            label="How are you feeling today?"
            value={mood}
            onChangeText={setMood}
            style={styles.input}
          />
          <TextInput
            label="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            style={styles.input}
          />
          <Button mode="contained" onPress={handleAddMood} style={styles.addButton}>
            Add Mood
          </Button>

          <Title style={styles.historyTitle}>Mood History</Title>
          {moodHistory && moodHistory.length > 0 ? (
            moodHistory.map((entry, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyDate}>{entry.date}</Text>
                <Text style={styles.historyMood}>{entry.mood}</Text>
                {entry.notes && <Text style={styles.historyNotes}>{entry.notes}</Text>}
              </View>
            ))
          ) : (
            <Text>No mood entries yet. Start tracking your mood today!</Text>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Recommendations</Title>
          <View style={styles.recommendationItem}>
            <Text style={styles.recommendationTitle}>Practice Mindfulness</Text>
            <Text>Taking a few minutes each day to practice mindfulness can help reduce stress and improve mental clarity.</Text>
          </View>
          <View style={styles.recommendationItem}>
            <Text style={styles.recommendationTitle}>Regular Exercise</Text>
            <Text>Even light physical activity can boost your mood and reduce anxiety.</Text>
          </View>
          <View style={styles.recommendationItem}>
            <Text style={styles.recommendationTitle}>Quality Sleep</Text>
            <Text>Aim for 7-9 hours of quality sleep each night to support mental health.</Text>
          </View>
        </Card.Content>
      </Card>
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
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 16,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  scoreLabel: {
    fontSize: 24,
    marginLeft: 4,
    color: '#666',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.accent,
  },
  metricLabel: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  addButton: {
    marginBottom: 24,
  },
  historyTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 18,
  },
  historyItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
  },
  historyMood: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  historyNotes: {
    fontSize: 14,
  },
  recommendationItem: {
    marginBottom: 16,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});

export default MentalHealthScreen;
