import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { theme } from '../../config/theme';

const HomeScreen = ({ navigation }: any) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const mentalHealth = useSelector((state: RootState) => state.mentalHealth);
  const sleep = useSelector((state: RootState) => state.sleep);
  const nutrition = useSelector((state: RootState) => state.nutrition);
  const fitness = useSelector((state: RootState) => state.fitness);
  
  const isLoading = 
    mentalHealth.loading || 
    sleep.loading || 
    nutrition.loading || 
    fitness.loading;
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.welcomeCard}>
        <Card.Content>
          <Title>Welcome, {user?.name || 'User'}!</Title>
          <Paragraph>Here's your wellness summary for today.</Paragraph>
        </Card.Content>
      </Card>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading your wellness data...</Text>
        </View>
      ) : (
        <>
          <Card style={styles.card}>
            <Card.Content>
              <Title>Mental Health</Title>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreValue}>{mentalHealth.mentalHealthScore || '78'}</Text>
                <Text style={styles.scoreLabel}>/100</Text>
              </View>
              <Paragraph>Your mental health score is good. Continue practicing mindfulness.</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate('MentalHealth')}>View Details</Button>
            </Card.Actions>
          </Card>
          
          <Card style={styles.card}>
            <Card.Content>
              <Title>Sleep</Title>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreValue}>{sleep.sleepScore || '85'}</Text>
                <Text style={styles.scoreLabel}>/100</Text>
              </View>
              <Paragraph>You slept well last night. Keep maintaining a consistent sleep schedule.</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate('Sleep')}>View Details</Button>
            </Card.Actions>
          </Card>
          
          <Card style={styles.card}>
            <Card.Content>
              <Title>Nutrition</Title>
              <View style={styles.nutritionContainer}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{nutrition.dailyCalories || '1800'}</Text>
                  <Text style={styles.nutritionLabel}>calories</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{nutrition.dailyNutrients?.protein || '95'}g</Text>
                  <Text style={styles.nutritionLabel}>protein</Text>
                </View>
              </View>
              <Paragraph>You're on track with your nutrition goals today.</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate('Nutrition')}>View Details</Button>
            </Card.Actions>
          </Card>
          
          <Card style={styles.card}>
            <Card.Content>
              <Title>Fitness</Title>
              <View style={styles.fitnessContainer}>
                <View style={styles.fitnessItem}>
                  <Text style={styles.fitnessValue}>{fitness.dailySteps || '8,742'}</Text>
                  <Text style={styles.fitnessLabel}>steps</Text>
                </View>
                <View style={styles.fitnessItem}>
                  <Text style={styles.fitnessValue}>{fitness.weeklyDistance || '42.5'}</Text>
                  <Text style={styles.fitnessLabel}>km this week</Text>
                </View>
              </View>
              <Paragraph>You're making good progress toward your weekly fitness goals.</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate('Fitness')}>View Details</Button>
            </Card.Actions>
          </Card>
          
          <Card style={styles.card}>
            <Card.Content>
              <Title>Today's Recommendations</Title>
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationTitle}>Take a 10-minute mindfulness break</Text>
                <Text>Based on your stress levels, a short meditation would be beneficial.</Text>
              </View>
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationTitle}>Drink more water</Text>
                <Text>You're slightly below your hydration target for the day.</Text>
              </View>
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationTitle}>Go for an evening walk</Text>
                <Text>You're 1,258 steps away from your daily goal.</Text>
              </View>
            </Card.Content>
          </Card>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  welcomeCard: {
    marginBottom: 16,
    backgroundColor: theme.colors.primary,
  },
  card: {
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 16,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  scoreLabel: {
    fontSize: 18,
    marginLeft: 4,
    color: '#666',
  },
  nutritionContainer: {
    flexDirection: 'row',
    marginVertical: 16,
  },
  nutritionItem: {
    marginRight: 24,
  },
  nutritionValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#666',
  },
  fitnessContainer: {
    flexDirection: 'row',
    marginVertical: 16,
  },
  fitnessItem: {
    marginRight: 24,
  },
  fitnessValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  fitnessLabel: {
    fontSize: 14,
    color: '#666',
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

export default HomeScreen;
