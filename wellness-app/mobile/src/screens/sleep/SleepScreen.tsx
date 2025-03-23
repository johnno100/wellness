import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, ProgressBar } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { theme } from '../../config/theme';
import AsleepApiAdapter from '../../services/api/AsleepApiAdapter';
import { fetchSleepDataStart, fetchSleepDataSuccess, fetchSleepDataFailure, startSleepSession, stopSleepSession } from '../../redux/slices/sleepSlice';

const SleepScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { sleepSessions, currentSession, sleepScore, loading, error } = useSelector(
    (state: RootState) => state.sleep
  );
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    // Check if there's an active sleep session
    setIsTracking(!!currentSession && currentSession.status === 'tracking');
  }, [currentSession]);

  const handleRefresh = async () => {
    dispatch(fetchSleepDataStart());
    try {
      // In a real app, this would fetch data from the Asleep API
      // const sessions = await AsleepApiAdapter.getSleepSessions();
      
      // For demo purposes, we'll use mock data
      const mockData = {
        sleepSessions: [
          {
            id: '1',
            date: '2025-03-22',
            startTime: '2025-03-22T22:30:00Z',
            endTime: '2025-03-23T06:00:00Z',
            duration: 7.5, // hours
            deepSleep: 2.1,
            lightSleep: 4.2,
            remSleep: 1.2,
            awake: 0.3,
            sleepScore: 85,
          },
          {
            id: '2',
            date: '2025-03-21',
            startTime: '2025-03-21T23:00:00Z',
            endTime: '2025-03-22T06:30:00Z',
            duration: 7.5, // hours
            deepSleep: 1.8,
            lightSleep: 4.5,
            remSleep: 1.0,
            awake: 0.2,
            sleepScore: 82,
          },
          {
            id: '3',
            date: '2025-03-20',
            startTime: '2025-03-20T22:45:00Z',
            endTime: '2025-03-21T05:45:00Z',
            duration: 7.0, // hours
            deepSleep: 1.9,
            lightSleep: 3.8,
            remSleep: 1.1,
            awake: 0.2,
            sleepScore: 80,
          },
        ],
        sleepScore: 85,
      };
      
      dispatch(fetchSleepDataSuccess(mockData));
    } catch (error) {
      dispatch(fetchSleepDataFailure(error.message));
    }
  };

  const handleStartTracking = async () => {
    try {
      // In a real app, this would start sleep tracking with the Asleep API
      // await AsleepApiAdapter.startSleepTracking();
      
      dispatch(startSleepSession());
      setIsTracking(true);
    } catch (error) {
      console.error('Failed to start sleep tracking:', error);
    }
  };

  const handleStopTracking = async () => {
    try {
      // In a real app, this would stop sleep tracking with the Asleep API
      // await AsleepApiAdapter.stopSleepTracking();
      
      dispatch(stopSleepSession());
      setIsTracking(false);
      
      // In a real app, we would wait for the sleep analysis to complete
      // and then update the sleep sessions
    } catch (error) {
      console.error('Failed to stop sleep tracking:', error);
    }
  };

  const renderSleepSession = (session: any) => {
    return (
      <Card style={styles.sessionCard} key={session.id}>
        <Card.Content>
          <Text style={styles.sessionDate}>{session.date}</Text>
          <View style={styles.sessionHeader}>
            <Text style={styles.sessionDuration}>{session.duration} hours</Text>
            <Text style={styles.sessionScore}>Score: {session.sleepScore}</Text>
          </View>
          
          <View style={styles.sleepStagesContainer}>
            <Text style={styles.sleepStagesTitle}>Sleep Stages</Text>
            
            <View style={styles.sleepStageItem}>
              <Text>Deep Sleep</Text>
              <View style={styles.progressContainer}>
                <ProgressBar progress={session.deepSleep / session.duration} color={theme.colors.primary} style={styles.progressBar} />
                <Text>{session.deepSleep} hrs</Text>
              </View>
            </View>
            
            <View style={styles.sleepStageItem}>
              <Text>Light Sleep</Text>
              <View style={styles.progressContainer}>
                <ProgressBar progress={session.lightSleep / session.duration} color={theme.colors.accent} style={styles.progressBar} />
                <Text>{session.lightSleep} hrs</Text>
              </View>
            </View>
            
            <View style={styles.sleepStageItem}>
              <Text>REM Sleep</Text>
              <View style={styles.progressContainer}>
                <ProgressBar progress={session.remSleep / session.duration} color="#9C27B0" style={styles.progressBar} />
                <Text>{session.remSleep} hrs</Text>
              </View>
            </View>
            
            <View style={styles.sleepStageItem}>
              <Text>Awake</Text>
              <View style={styles.progressContainer}>
                <ProgressBar progress={session.awake / session.duration} color="#FFC107" style={styles.progressBar} />
                <Text>{session.awake} hrs</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.sleepTimeContainer}>
            <Text>Bedtime: {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            <Text>Wake up: {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Sleep Score</Title>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>{sleepScore || '85'}</Text>
            <Text style={styles.scoreLabel}>/100</Text>
          </View>
          <Paragraph>Your sleep score is based on duration, quality, and consistency of your sleep patterns.</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={handleRefresh} loading={loading}>
            Refresh
          </Button>
          <Button onPress={() => navigation.navigate('ConnectAsleep')}>
            Connect Asleep
          </Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Sleep Tracking</Title>
          <Paragraph>
            {isTracking
              ? 'Sleep tracking is currently active. Stop tracking when you wake up.'
              : 'Start tracking your sleep when you go to bed.'}
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          {isTracking ? (
            <Button mode="contained" onPress={handleStopTracking} style={styles.trackingButton}>
              Stop Tracking
            </Button>
          ) : (
            <Button mode="contained" onPress={handleStartTracking} style={styles.trackingButton}>
              Start Tracking
            </Button>
          )}
        </Card.Actions>
      </Card>

      <Title style={styles.sectionTitle}>Sleep History</Title>
      {sleepSessions && sleepSessions.length > 0 ? (
        sleepSessions.map(renderSleepSession)
      ) : (
        <Card style={styles.card}>
          <Card.Content>
            <Paragraph>No sleep sessions recorded yet. Start tracking your sleep tonight!</Paragraph>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Title>Sleep Recommendations</Title>
          <View style={styles.recommendationItem}>
            <Text style={styles.recommendationTitle}>Consistent Schedule</Text>
            <Text>Try to go to bed and wake up at the same time every day, even on weekends.</Text>
          </View>
          <View style={styles.recommendationItem}>
            <Text style={styles.recommendationTitle}>Limit Screen Time</Text>
            <Text>Avoid screens at least 1 hour before bedtime to improve sleep quality.</Text>
          </View>
          <View style={styles.recommendationItem}>
            <Text style={styles.recommendationTitle}>Comfortable Environment</Text>
            <Text>Keep your bedroom cool, dark, and quiet for optimal sleep conditions.</Text>
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
  trackingButton: {
    marginTop: 8,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 16,
  },
  sessionCard: {
    marginBottom: 16,
  },
  sessionDate: {
    fontSize: 14,
    color: '#666',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 16,
  },
  sessionDuration: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sessionScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  sleepStagesContainer: {
    marginBottom: 16,
  },
  sleepStagesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sleepStageItem: {
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    marginRight: 8,
    height: 8,
  },
  sleepTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

export default SleepScreen;
