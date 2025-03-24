import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card, Title, Paragraph, Button, List, Divider, DataTable } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { theme } from '../../config/theme';
import StravaApiAdapter from '../../services/api/StravaApiAdapter';

const FitnessScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const fitness = useSelector((state: RootState) => state.fitness);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Fetch fitness data when component mounts
    fetchFitnessData();
  }, []);
  
  const fetchFitnessData = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch data from the Strava API
      // For demo purposes, we'll simulate a successful API call
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error fetching fitness data:', error);
      setIsLoading(false);
    }
  };
  
  const renderActivityHistory = () => {
    const activityData = fitness.activityHistory || [
      { 
        id: 1, 
        date: '2025-03-23', 
        type: 'Running', 
        distance: 5.2,
        duration: '28:45',
        calories: 420,
      },
      { 
        id: 2, 
        date: '2025-03-22', 
        type: 'Cycling', 
        distance: 15.8,
        duration: '45:20',
        calories: 580,
      },
      { 
        id: 3, 
        date: '2025-03-21', 
        type: 'Walking', 
        distance: 3.5,
        duration: '42:10',
        calories: 280,
      },
      { 
        id: 4, 
        date: '2025-03-19', 
        type: 'Running', 
        distance: 4.8,
        duration: '26:30',
        calories: 390,
      },
    ];
    
    return (
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Date</DataTable.Title>
          <DataTable.Title>Activity</DataTable.Title>
          <DataTable.Title numeric>Distance</DataTable.Title>
          <DataTable.Title numeric>Duration</DataTable.Title>
        </DataTable.Header>
        
        {activityData.map((activity) => (
          <DataTable.Row key={activity.id} onPress={() => {/* View activity details */}}>
            <DataTable.Cell>{activity.date}</DataTable.Cell>
            <DataTable.Cell>{activity.type}</DataTable.Cell>
            <DataTable.Cell numeric>{activity.distance} km</DataTable.Cell>
            <DataTable.Cell numeric>{activity.duration}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Today's Activity</Title>
          
          <View style={styles.todayContainer}>
            <View style={styles.metricCircle}>
              <Text style={styles.metricValue}>{fitness.dailySteps || '8,742'}</Text>
              <Text style={styles.metricLabel}>steps</Text>
            </View>
            
            <View style={styles.metricDetails}>
              <View style={styles.metricItem}>
                <Text style={styles.metricItemLabel}>Distance</Text>
                <Text style={styles.metricItemValue}>{fitness.dailyDistance || '6.2'} km</Text>
              </View>
              
              <View style={styles.metricItem}>
                <Text style={styles.metricItemLabel}>Calories</Text>
                <Text style={styles.metricItemValue}>{fitness.dailyCalories || '320'}</Text>
              </View>
              
              <View style={styles.metricItem}>
                <Text style={styles.metricItemLabel}>Active Time</Text>
                <Text style={styles.metricItemValue}>{fitness.dailyActiveMinutes || '48'} min</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.goalContainer}>
            <Text style={styles.goalText}>
              {fitness.dailySteps && parseInt(fitness.dailySteps.replace(',', '')) >= 10000 
                ? 'Daily step goal achieved! 🎉' 
                : `${10000 - parseInt((fitness.dailySteps || '8742').replace(',', ''))} steps to go`
              }
            </Text>
            <View style={styles.goalBar}>
              <View 
                style={[
                  styles.goalProgress, 
                  { width: `${Math.min(parseInt((fitness.dailySteps || '8742').replace(',', '')) / 100, 100)}%` }
                ]} 
              />
            </View>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Weekly Summary</Title>
          
          <View style={styles.weeklyContainer}>
            <View style={styles.weeklyItem}>
              <Text style={styles.weeklyValue}>{fitness.weeklyDistance || '42.5'}</Text>
              <Text style={styles.weeklyLabel}>km</Text>
            </View>
            
            <View style={styles.weeklyItem}>
              <Text style={styles.weeklyValue}>{fitness.weeklyActiveDays || '5'}/7</Text>
              <Text style={styles.weeklyLabel}>active days</Text>
            </View>
            
            <View style={styles.weeklyItem}>
              <Text style={styles.weeklyValue}>{fitness.weeklyCalories || '2,450'}</Text>
              <Text style={styles.weeklyLabel}>calories</Text>
            </View>
          </View>
          
          <Paragraph style={styles.weeklyDescription}>
            You're on track to meet your weekly goal of 50km. Keep it up!
          </Paragraph>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.activityHeader}>
            <Title>Recent Activities</Title>
            <Button 
              mode="contained" 
              icon="plus" 
              onPress={() => {/* Add activity */}}
              compact
            >
              Add Activity
            </Button>
          </View>
          
          {renderActivityHistory()}
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Fitness Insights</Title>
          
          <List.Item
            title="Consistent Activity"
            description="You've been active 5 out of the last 7 days"
            left={props => <List.Icon {...props} icon="check-circle" color={theme.colors.success} />}
          />
          <Divider />
          
          <List.Item
            title="Improved Pace"
            description="Your running pace has improved by 5% this week"
            left={props => <List.Icon {...props} icon="trending-up" color={theme.colors.success} />}
          />
          <Divider />
          
          <List.Item
            title="Try Interval Training"
            description="Add high-intensity intervals to boost your fitness"
            left={props => <List.Icon {...props} icon="lightbulb-outline" color={theme.colors.primary} />}
          />
        </Card.Content>
      </Card>
      
      <Button 
        mode="contained" 
        icon="refresh" 
        onPress={fetchFitnessData}
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
  todayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  metricCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  metricLabel: {
    fontSize: 14,
    color: 'white',
  },
  metricDetails: {
    flex: 1,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricItemLabel: {
    fontSize: 14,
    color: '#666',
  },
  metricItemValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  goalContainer: {
    marginTop: 8,
  },
  goalText: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  goalBar: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  goalProgress: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  weeklyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  weeklyItem: {
    alignItems: 'center',
  },
  weeklyValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  weeklyLabel: {
    fontSize: 14,
    color: '#666',
  },
  weeklyDescription: {
    textAlign: 'center',
    marginTop: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  refreshButton: {
    marginVertical: 24,
  },
});

export default FitnessScreen;
