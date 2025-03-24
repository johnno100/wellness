import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card, Title, Paragraph, Button, List, Divider, Chip } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { theme } from '../../config/theme';
import PassioApiAdapter from '../../services/api/PassioApiAdapter';

const NutritionScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const nutrition = useSelector((state: RootState) => state.nutrition);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Fetch nutrition data when component mounts
    fetchNutritionData();
  }, []);
  
  const fetchNutritionData = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch data from the Passio API
      // For demo purposes, we'll simulate a successful API call
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
      setIsLoading(false);
    }
  };
  
  const renderMealHistory = () => {
    const mealData = nutrition.mealHistory || [
      { 
        id: 1, 
        time: 'Breakfast', 
        items: ['Oatmeal with berries', 'Greek yogurt', 'Coffee'],
        calories: 420,
        image: 'https://placeholder.com/wp-content/uploads/2018/10/placeholder.png'
      },
      { 
        id: 2, 
        time: 'Lunch', 
        items: ['Grilled chicken salad', 'Whole grain bread', 'Apple'],
        calories: 580,
        image: 'https://placeholder.com/wp-content/uploads/2018/10/placeholder.png'
      },
      { 
        id: 3, 
        time: 'Snack', 
        items: ['Mixed nuts', 'Banana'],
        calories: 280,
        image: 'https://placeholder.com/wp-content/uploads/2018/10/placeholder.png'
      },
      { 
        id: 4, 
        time: 'Dinner', 
        items: ['Salmon', 'Quinoa', 'Roasted vegetables'],
        calories: 520,
        image: 'https://placeholder.com/wp-content/uploads/2018/10/placeholder.png'
      },
    ];
    
    return mealData.map((meal) => (
      <Card key={meal.id} style={styles.mealCard}>
        <Card.Content>
          <View style={styles.mealHeader}>
            <View>
              <Title>{meal.time}</Title>
              <Paragraph>{meal.calories} calories</Paragraph>
            </View>
            <Image 
              source={{ uri: meal.image }} 
              style={styles.mealImage} 
            />
          </View>
          
          <Divider style={styles.divider} />
          
          <View>
            {meal.items.map((item, index) => (
              <Chip key={index} style={styles.foodChip}>{item}</Chip>
            ))}
          </View>
        </Card.Content>
      </Card>
    ));
  };
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Today's Nutrition</Title>
          
          <View style={styles.calorieContainer}>
            <View style={styles.calorieCircle}>
              <Text style={styles.calorieValue}>{nutrition.dailyCalories || '1800'}</Text>
              <Text style={styles.calorieLabel}>calories</Text>
            </View>
            
            <View style={styles.calorieInfo}>
              <Text style={styles.calorieGoal}>Goal: 2000 calories</Text>
              <Text style={styles.calorieRemaining}>200 calories remaining</Text>
            </View>
          </View>
          
          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{nutrition.dailyNutrients?.protein || '95'}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{nutrition.dailyNutrients?.carbs || '180'}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{nutrition.dailyNutrients?.fat || '60'}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
            
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{nutrition.dailyNutrients?.fiber || '28'}g</Text>
              <Text style={styles.macroLabel}>Fiber</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Water Intake</Title>
          
          <View style={styles.waterContainer}>
            <View style={styles.waterGlasses}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((glass) => (
                <View 
                  key={glass} 
                  style={[
                    styles.waterGlass, 
                    glass <= (nutrition.waterIntake || 5) ? styles.waterGlassFilled : {}
                  ]}
                />
              ))}
            </View>
            
            <Text style={styles.waterText}>
              {nutrition.waterIntake || 5} of 8 glasses
            </Text>
            
            <Button 
              mode="outlined" 
              icon="plus" 
              onPress={() => {/* Add water */}}
              style={styles.waterButton}
            >
              Add Glass
            </Button>
          </View>
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.mealHistoryHeader}>
            <Title>Today's Meals</Title>
            <Button 
              mode="contained" 
              icon="plus" 
              onPress={() => {/* Add meal */}}
              compact
            >
              Add Meal
            </Button>
          </View>
          
          {renderMealHistory()}
        </Card.Content>
      </Card>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Nutrition Insights</Title>
          
          <List.Item
            title="Good protein intake"
            description="You're meeting your daily protein goals"
            left={props => <List.Icon {...props} icon="check-circle" color={theme.colors.success} />}
          />
          <Divider />
          
          <List.Item
            title="Low sugar consumption"
            description="You're keeping added sugars in check"
            left={props => <List.Icon {...props} icon="check-circle" color={theme.colors.success} />}
          />
          <Divider />
          
          <List.Item
            title="Increase fiber intake"
            description="Try adding more vegetables and whole grains"
            left={props => <List.Icon {...props} icon="alert-circle" color={theme.colors.warning} />}
          />
        </Card.Content>
      </Card>
      
      <Button 
        mode="contained" 
        icon="refresh" 
        onPress={fetchNutritionData}
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
  calorieContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  calorieCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  calorieValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  calorieLabel: {
    fontSize: 14,
    color: 'white',
  },
  calorieInfo: {
    flex: 1,
  },
  calorieGoal: {
    fontSize: 16,
    marginBottom: 4,
  },
  calorieRemaining: {
    fontSize: 14,
    color: theme.colors.success,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  macroItem: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  macroLabel: {
    fontSize: 14,
    color: '#666',
  },
  waterContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  waterGlasses: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  waterGlass: {
    width: 20,
    height: 30,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  waterGlassFilled: {
    backgroundColor: theme.colors.primary,
  },
  waterText: {
    fontSize: 16,
    marginBottom: 8,
  },
  waterButton: {
    marginTop: 8,
  },
  mealHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealCard: {
    marginBottom: 12,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  divider: {
    marginVertical: 12,
  },
  foodChip: {
    margin: 4,
  },
  refreshButton: {
    marginVertical: 24,
  },
});

export default NutritionScreen;
