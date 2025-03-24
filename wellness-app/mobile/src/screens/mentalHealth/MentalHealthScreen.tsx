import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, ProgressBar, Chip, List, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { theme } from '../../config/theme';
import SahhaApiAdapter from '../../services/api/SahhaApiAdapter';

const MentalHealthScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const mentalHealth = useSelector((state: RootState) => state.mentalHealth);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Fetch mental health data when component mounts
    fetchMentalHealthData();
  }, []);
  
  const fetchMentalHealthData = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch data from the Sahha API
      // For demo purposes, we'll simulate a successful API call
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error fetching mental health data:', error);
      setIsLoading(false);
    }
  };
  
  const renderMoodHistory = () => {
    const moodData = mentalHealth.moodHistory || [
      { date: '2025-03-23', mood: 'Happy', score: 85 },
      { date: '2025-03-22', mood: 'Calm', score: 75 },
      { date: '2025-03-21', mood: 'Stressed', score: 45 },
      { date: '2025-03-20', mood: 'Tired', score: 60 },
      { date: '2025-03-19', mood: 'Happy', score: 80 },
    ];
    
    return moodData.map((item, index) => (
      <React.Fragment key={index}>
        <List.Item
          title={item.date}
          description={item.mood}
          right={() => (
            <View style={styles.moodScoreContainer}>
              <Text style={[
                styles.moodScore,
                item.score > 70 ? styles.goodScore : 
                item.score > 50 ? styles.okScore : 
                styles.badScore
              ]}>
                {item.score}
              </Text>
            </View>
          )}
        />
        {index < moodData.length - 1 && <Divider />}
      </React.Fragment>
    ));
  };
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Mental Health Score</Title>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>{mentalHealth.mentalHealthScore || '78'}</Text>
            <Text style={styles.scoreLabel}>/100</Text>
          </View>
          
          <Paragraph style={styles.scoreDescription}>
            Your mental health score is good. You've been managing stress well this week.
          </Paragraph>
          
          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Stress</Text>
              <ProgressBar progress={0.35} color={theme.colors.success} style={styles.progressBar} />
              <Text style={styles.metricValue}>Low</Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Anxiety</Text>
              <ProgressBar progress={0.25} color={theme.colors.success} style={styles.progressBar} />
              <Text style={styles.metricValue}>Low</Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Mood</Text>
              <ProgressBar progress={0.85} color={theme.colors.success} style={styles.progressBar} />
              <Text style={styles.metricValue}>Positive</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Mood Tracking</Title>
          <Paragraph>How are you feeling today?</Paragraph>
          
          <View style={styles.moodChipsContainer}>
            <Chip 
              icon="emoticon-happy-outline" 
              style={styles.moodChip} 
              onPress={() => {/* Log mood */}}
            >
              Happy
            </Chip>
            <Chip 
              icon="emoticon-neutral-outline" 
              style={styles.moodChip} 
              onPress={() => {/* Log mood */}}
            >
              Neutral
            </Chip>
            <Chip 
              icon="emoticon-sad-outline" 
              style={styles.moodChip} 
              onPress={() => {/* Log mood */}}
            >
              Sad
            </Chip>
            <Chip 
              icon="emoticon-angry-outline" 
              style={styles.moodChip} 
              onPress={() => {/* Log mood */}}
            >
              Angry
            </Chip>
            <Chip 
              icon="emoticon-confused-outline" 
              style={styles.moodChip} 
              onPress={() => {/* Log mood */}}
            >
              Anxious
            </Chip>
            <Chip 
              icon="emoticon-cool-outline" 
              style={styles.moodChip} 
              onPress={() => {/* Log mood */}}
            >
              Relaxed
            </Chip>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Mood History</Title>
          <List.Section>
            {renderMoodHistory()}
          </List.Section>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Recommendations</Title>
          
          <List.Item
            title="5-Minute Breathing Exercise"
            description="Reduce stress with deep breathing"
            left={props => <List.Icon {...props} icon="breath" />}
            right={props => <Button mode="text">Start</Button>}
          />
          <Divider />
          
          <List.Item
            title="Guided Meditation"
            description="10-minute mindfulness session"
            left={props => <List.Icon {...props} icon="meditation" />}
            right={props => <Button mode="text">Start</Button>}
          />
          <Divider />
          
          <List.Item
            title="Journal Entry"
            description="Record your thoughts and feelings"
            left={props => <List.Icon {...props} icon="notebook" />}
            right={props => <Button mode="text">Start</Button>}
          />
        </Card.Content>
      </Card>
      
      <Button 
        mode="contained" 
        icon="refresh" 
        onPress={fetchMentalHealthData}
        style={styles.refreshButton}
        loading={isLoading}
        disabled={isLoading}
      >
        Refresh Data
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
    fontSize: 20,
    marginLeft: 4,
    color: '#666',
  },
  scoreDescription: {
    marginBottom: 16,
  },
  metricsContainer: {
    marginTop: 16,
  },
  metricItem: {
    marginBottom: 16,
  },
  metricLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  metricValue: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'right',
  },
  moodChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  moodChip: {
    margin: 4,
  },
  moodScoreContainer: {
    justifyContent: 'center',
  },
  moodScore: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  goodScore: {
    color: theme.colors.success,
  },
  okScore: {
    color: theme.colors.warning,
  },
  badScore: {
    color: theme.colors.error,
  },
  refreshButton: {
    marginVertical: 24,
  },
});

export default MentalHealthScreen;
