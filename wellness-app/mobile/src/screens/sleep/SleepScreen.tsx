import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, ProgressBar, List, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { theme } from '../../config/theme';
import AsleepApiAdapter from '../../services/api/AsleepApiAdapter';

const SleepScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const sleep = useSelector((state: RootState) => state.sleep);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Fetch sleep data when component mounts
    fetchSleepData();
  }, []);
  
  const fetchSleepData = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch data from the Asleep API
      // For demo purposes, we'll simulate a successful API call
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error fetching sleep data:', error);
      setIsLoading(false);
    }
  };
  
  const renderSleepHistory = () => {
    const sleepData = sleep.sleepHistory || [
      { date: '2025-03-23', duration: 7.5, quality: 85, deepSleep: 2.1 },
      { date: '2025-03-22', duration: 8.2, quality: 90, deepSleep: 2.4 },
      { date: '2025-03-21', duration: 6.8, quality: 70, deepSleep: 1.8 },
      { date: '2025-03-20', duration: 7.0, quality: 75, deepSleep: 2.0 },
      { date: '2025-03-19', duration: 7.8, quality: 85, deepSleep: 2.3 },
    ];
    
    return sleepData.map((item, index) => (
      <React.Fragment key={index}>
        <List.Item
          title={item.date}
          description={`${item.duration} hours (${item.deepSleep} hrs deep sleep)`}
          right={() => (
            <View style={styles.sleepQualityContainer}>
              <Text style={[
                styles.sleepQuality,
                item.quality > 80 ? styles.goodQuality : 
                item.quality > 60 ? styles.okQuality : 
                styles.badQuality
              ]}>
                {item.quality}%
              </Text>
            </View>
          )}
        />
        {index < sleepData.length - 1 && <Divider />}
      </React.Fragment>
    ));
  };
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Sleep Score</Title>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>{sleep.sleepScore || '85'}</Text>
            <Text style={styles.scoreLabel}>/100</Text>
          </View>
          
          <Paragraph style={styles.scoreDescription}>
            Your sleep quality is excellent. You've been maintaining a consistent sleep schedule.
          </Paragraph>
          
          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Duration</Text>
              <ProgressBar progress={0.85} color={theme.colors.success} style={styles.progressBar} />
              <Text style={styles.metricValue}>7.5 hours</Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Deep Sleep</Text>
              <ProgressBar progress={0.70} color={theme.colors.success} style={styles.progressBar} />
              <Text style={styles.metricValue}>2.1 hours</Text>
            </View>
            
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Consistency</Text>
              <ProgressBar progress={0.90} color={theme.colors.success} style={styles.progressBar} />
              <Text style={styles.metricValue}>Excellent</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Last Night's Sleep</Title>
          
          <View style={styles.lastNightContainer}>
            <View style={styles.lastNightItem}>
              <Text style={styles.lastNightLabel}>Bedtime</Text>
              <Text style={styles.lastNightValue}>10:45 PM</Text>
            </View>
            
            <View style={styles.lastNightItem}>
              <Text style={styles.lastNightLabel}>Wake Time</Text>
              <Text style={styles.lastNightValue}>6:15 AM</Text>
            </View>
            
            <View style={styles.lastNightItem}>
              <Text style={styles.lastNightLabel}>Total Sleep</Text>
              <Text style={styles.lastNightValue}>7h 30m</Text>
            </View>
          </View>
          
          <View style={styles.sleepStagesContainer}>
            <Title style={styles.sleepStagesTitle}>Sleep Stages</Title>
            
            <View style={styles.sleepStageItem}>
              <Text style={styles.sleepStageLabel}>Deep Sleep</Text>
              <View style={styles.sleepStageBarContainer}>
                <View style={[styles.sleepStageBar, { width: '28%', backgroundColor: theme.colors.primary }]} />
              </View>
              <Text style={styles.sleepStageValue}>2h 6m (28%)</Text>
            </View>
            
            <View style={styles.sleepStageItem}>
              <Text style={styles.sleepStageLabel}>Light Sleep</Text>
              <View style={styles.sleepStageBarContainer}>
                <View style={[styles.sleepStageBar, { width: '45%', backgroundColor: theme.colors.accent }]} />
              </View>
              <Text style={styles.sleepStageValue}>3h 23m (45%)</Text>
            </View>
            
            <View style={styles.sleepStageItem}>
              <Text style={styles.sleepStageLabel}>REM</Text>
              <View style={styles.sleepStageBarContainer}>
                <View style={[styles.sleepStageBar, { width: '20%', backgroundColor: '#9C27B0' }]} />
              </View>
              <Text style={styles.sleepStageValue}>1h 30m (20%)</Text>
            </View>
            
            <View style={styles.sleepStageItem}>
              <Text style={styles.sleepStageLabel}>Awake</Text>
              <View style={styles.sleepStageBarContainer}>
                <View style={[styles.sleepStageBar, { width: '7%', backgroundColor: '#FFC107' }]} />
              </View>
              <Text style={styles.sleepStageValue}>31m (7%)</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Sleep History</Title>
          <List.Section>
            {renderSleepHistory()}
          </List.Section>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Recommendations</Title>
          
          <List.Item
            title="Maintain Consistent Schedule"
            description="Go to bed and wake up at the same time"
            left={props => <List.Icon {...props} icon="clock-time-eight-outline" />}
          />
          <Divider />
          
          <List.Item
            title="Limit Screen Time"
            description="Avoid screens 1 hour before bedtime"
            left={props => <List.Icon {...props} icon="cellphone-off" />}
          />
          <Divider />
          
          <List.Item
            title="Bedtime Routine"
            description="Try a relaxing activity before sleep"
            left={props => <List.Icon {...props} icon="book-open-variant" />}
          />
        </Card.Content>
      </Card>
      
      <Button 
        mode="contained" 
        icon="refresh" 
        onPress={fetchSleepData}
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
  lastNightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  lastNightItem: {
    alignItems: 'center',
  },
  lastNightLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  lastNightValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sleepStagesContainer: {
    marginTop: 16,
  },
  sleepStagesTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  sleepStageItem: {
    marginBottom: 12,
  },
  sleepStageLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  sleepStageBarContainer: {
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  sleepStageBar: {
    height: '100%',
  },
  sleepStageValue: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  sleepQualityContainer: {
    justifyContent: 'center',
  },
  sleepQuality: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  goodQuality: {
    color: theme.colors.success,
  },
  okQuality: {
    color: theme.colors.warning,
  },
  badQuality: {
    color: theme.colors.error,
  },
  refreshButton: {
    marginVertical: 24,
  },
});

export default SleepScreen;
