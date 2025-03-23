import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, DataTable, Chip } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { theme } from '../../config/theme';
import StravaApiAdapter from '../../services/api/StravaApiAdapter';
import { fetchFitnessDataStart, fetchFitnessDataSuccess, fetchFitnessDataFailure } from '../../redux/slices/fitnessSlice';

const FitnessScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { activities, dailySteps, weeklyDistance, loading, error } = useSelector(
    (state: RootState) => state.fitness
  );

  const handleRefresh = async () => {
    dispatch(fetchFitnessDataStart());
    try {
      // In a real app, this would fetch data from the Strava API
      // const activities = await StravaApiAdapter.getAthleteActivities();
      
      // For demo purposes, we'll use mock data
      const mockData = {
        activities: [
          {
            id: '1',
            type: 'Run',
            name: 'Morning Run',
            date: '2025-03-23',
            distance: 5.2, // km
            duration: 28, // minutes
            calories: 420,
            pace: '5:23', // min/km
            elevationGain: 45, // meters
          },
          {
            id: '2',
            type: 'Ride',
            name: 'Evening Bike Ride',
            date: '2025-03-22',
            distance: 15.7, // km
            duration: 45, // minutes
            calories: 380,
            pace: null,
            elevationGain: 120, // meters
          },
          {
            id: '3',
            type: 'Swim',
            name: 'Pool Swim',
            date: '2025-03-21',
            distance: 1.5, // km
            duration: 35, // minutes
            calories: 310,
            pace: null,
            elevationGain: 0, // meters
          },
        ],
        dailySteps: 8742,
        weeklyDistance: 42.5, // km
      };
      
      dispatch(fetchFitnessDataSuccess(mockData));
    } catch (error) {
      dispatch(fetchFitnessDataFailure(error.message));
    }
  };

  const renderActivityItem = (activity) => {
    return (
      <Card style={styles.activityCard} key={activity.id}>
        <Card.Content>
          <View style={styles.activityHeader}>
            <View>
              <Text style={styles.activityName}>{activity.name}</Text>
              <Text style={styles.activityDate}>{activity.date}</Text>
            </View>
            <Chip mode="outlined" style={styles.activityTypeChip}>{activity.type}</Chip>
          </View>
          
          <View style={styles.activityStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{activity.distance.toFixed(1)}</Text>
              <Text style={styles.statLabel}>km</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{activity.duration}</Text>
              <Text style={styles.statLabel}>min</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{activity.calories}</Text>
              <Text style={styles.statLabel}>cal</Text>
            </View>
            {activity.pace && (
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{activity.pace}</Text>
                <Text style={styles.statLabel}>pace</Text>
              </View>
            )}
          </View>
          
          {activity.elevationGain > 0 && (
            <Text style={styles.elevationText}>Elevation Gain: {activity.elevationGain}m</Text>
          )}
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Activity Summary</Title>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{dailySteps || '8,742'}</Text>
              <Text style={styles.summaryLabel}>Daily Steps</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{weeklyDistance || '42.5'}</Text>
              <Text style={styles.summaryLabel}>Weekly km</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>3</Text>
              <Text style={styles.summaryLabel}>Activities</Text>
            </View>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button onPress={handleRefresh} loading={loading}>
            Refresh
          </Button>
          <Button onPress={() => navigation.navigate('ConnectStrava')}>
            Connect Strava
          </Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Weekly Goals</Title>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Goal</DataTable.Title>
              <DataTable.Title numeric>Target</DataTable.Title>
              <DataTable.Title numeric>Current</DataTable.Title>
              <DataTable.Title numeric>Progress</DataTable.Title>
            </DataTable.Header>
            
            <DataTable.Row>
              <DataTable.Cell>Steps</DataTable.Cell>
              <DataTable.Cell numeric>70,000</DataTable.Cell>
              <DataTable.Cell numeric>61,194</DataTable.Cell>
              <DataTable.Cell numeric>87%</DataTable.Cell>
            </DataTable.Row>
            
            <DataTable.Row>
              <DataTable.Cell>Distance</DataTable.Cell>
              <DataTable.Cell numeric>50 km</DataTable.Cell>
              <DataTable.Cell numeric>42.5 km</DataTable.Cell>
              <DataTable.Cell numeric>85%</DataTable.Cell>
            </DataTable.Row>
            
            <DataTable.Row>
              <DataTable.Cell>Activities</DataTable.Cell>
              <DataTable.Cell numeric>5</DataTable.Cell>
              <DataTable.Cell numeric>3</DataTable.Cell>
              <DataTable.Cell numeric>60%</DataTable.Cell>
            </DataTable.Row>
            
            <DataTable.Row>
              <DataTable.Cell>Active Minutes</DataTable.Cell>
              <DataTable.Cell numeric>150 min</DataTable.Cell>
              <DataTable.Cell numeric>108 min</DataTable.Cell>
              <DataTable.Cell numeric>72%</DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </Card.Content>
      </Card>

      <Title style={styles.sectionTitle}>Recent Activities</Title>
      {activities && activities.length > 0 ? (
        activities.map(renderActivityItem)
      ) : (
        <Card style={styles.card}>
          <Card.Content>
            <Paragraph>No activities recorded yet. Connect your Strava account to sync your activities.</Paragraph>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Title>Fitness Recommendations</Title>
          <View style={styles.recommendationItem}>
            <Text style={styles.recommendationTitle}>Mix Up Your Workouts</Text>
            <Text>Incorporate a variety of activities to work different muscle groups and prevent boredom.</Text>
          </View>
          <View style={styles.recommendationItem}>
            <Text style={styles.recommendationTitle}>Rest Days Are Important</Text>
            <Text>Allow your body time to recover between intense workouts to prevent injury and improve performance.</Text>
          </View>
          <View style={styles.recommendationItem}>
            <Text style={styles.recommendationTitle}>Stay Consistent</Text>
            <Text>Regular, moderate exercise is more beneficial than occasional intense workouts.</Text>
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
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 16,
  },
  activityCard: {
    marginBottom: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  activityName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activityDate: {
    fontSize: 14,
    color: '#666',
  },
  activityTypeChip: {
    backgroundColor: theme.colors.background,
  },
  activityStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  elevationText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  recommendationItem: {
    marginBottom: 12,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});

export default FitnessScreen;
