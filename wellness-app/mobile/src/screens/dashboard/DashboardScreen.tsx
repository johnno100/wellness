import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { theme } from '../../config/theme';

const DashboardScreen = ({ navigation }: any) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const mentalHealth = useSelector((state: RootState) => state.mentalHealth);
  const sleep = useSelector((state: RootState) => state.sleep);
  const nutrition = useSelector((state: RootState) => state.nutrition);
  const fitness = useSelector((state: RootState) => state.fitness);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
      <Text style={styles.date}>{new Date().toDateString()}</Text>

      <Card style={styles.summaryCard}>
        <Card.Content>
          <Title>Your Wellness Summary</Title>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>78</Text>
              <Text style={styles.scoreLabel}>Mental</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>85</Text>
              <Text style={styles.scoreLabel}>Sleep</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>62</Text>
              <Text style={styles.scoreLabel}>Nutrition</Text>
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreValue}>70</Text>
              <Text style={styles.scoreLabel}>Fitness</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Title style={styles.sectionTitle}>Mental Health</Title>
      <Card style={styles.card} onPress={() => navigation.navigate('MentalHealthTab')}>
        <Card.Content>
          <Title>Mental Health Score</Title>
          <Paragraph>Your mental health score is 78/100</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button>View Details</Button>
        </Card.Actions>
      </Card>

      <Title style={styles.sectionTitle}>Sleep</Title>
      <Card style={styles.card} onPress={() => navigation.navigate('SleepTab')}>
        <Card.Content>
          <Title>Sleep Quality</Title>
          <Paragraph>You slept for 7h 30m last night</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button>View Details</Button>
        </Card.Actions>
      </Card>

      <Title style={styles.sectionTitle}>Nutrition</Title>
      <Card style={styles.card} onPress={() => navigation.navigate('NutritionTab')}>
        <Card.Content>
          <Title>Nutrition Intake</Title>
          <Paragraph>1,800 calories consumed today</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button>View Details</Button>
        </Card.Actions>
      </Card>

      <Title style={styles.sectionTitle}>Fitness</Title>
      <Card style={styles.card} onPress={() => navigation.navigate('FitnessTab')}>
        <Card.Content>
          <Title>Activity Summary</Title>
          <Paragraph>5,000 steps today</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button>View Details</Button>
        </Card.Actions>
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  summaryCard: {
    marginBottom: 24,
    elevation: 4,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    marginBottom: 16,
  },
});

export default DashboardScreen;
