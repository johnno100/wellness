import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card, Title, Paragraph, Button, TextInput, Chip, FAB } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { theme } from '../../config/theme';
import PassioApiAdapter from '../../services/api/PassioApiAdapter';
import { fetchNutritionDataStart, fetchNutritionDataSuccess, fetchNutritionDataFailure, addFoodEntry } from '../../redux/slices/nutritionSlice';

const NutritionScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { foodEntries, dailyCalories, dailyNutrients, loading, error } = useSelector(
    (state: RootState) => state.nutrition
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleRefresh = async () => {
    dispatch(fetchNutritionDataStart());
    try {
      // In a real app, this would fetch data from the Passio API
      // const nutritionData = await PassioApiAdapter.getNutritionData();
      
      // For demo purposes, we'll use mock data
      const mockData = {
        foodEntries: [
          {
            id: '1',
            name: 'Grilled Chicken Salad',
            timestamp: '2025-03-23T12:30:00Z',
            calories: 350,
            nutrients: {
              protein: 30,
              carbs: 15,
              fat: 18,
              fiber: 5,
              sugar: 3,
            },
            mealType: 'lunch',
            image: 'https://example.com/chicken-salad.jpg',
          },
          {
            id: '2',
            name: 'Oatmeal with Berries',
            timestamp: '2025-03-23T08:00:00Z',
            calories: 280,
            nutrients: {
              protein: 8,
              carbs: 45,
              fat: 6,
              fiber: 7,
              sugar: 12,
            },
            mealType: 'breakfast',
            image: 'https://example.com/oatmeal.jpg',
          },
          {
            id: '3',
            name: 'Protein Smoothie',
            timestamp: '2025-03-22T16:00:00Z',
            calories: 220,
            nutrients: {
              protein: 20,
              carbs: 25,
              fat: 5,
              fiber: 3,
              sugar: 15,
            },
            mealType: 'snack',
            image: 'https://example.com/smoothie.jpg',
          },
        ],
        dailyCalories: 1800,
        dailyNutrients: {
          protein: 95,
          carbs: 200,
          fat: 60,
          fiber: 25,
          sugar: 45,
        },
      };
      
      dispatch(fetchNutritionDataSuccess(mockData));
    } catch (error) {
      dispatch(fetchNutritionDataFailure(error.message));
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // In a real app, this would search for food using the Passio API
      // const results = await PassioApiAdapter.searchForFood(searchQuery);
      
      // For demo purposes, we'll use mock data
      const mockResults = [
        {
          id: 'f1',
          name: 'Apple',
          calories: 95,
          nutrients: {
            protein: 0.5,
            carbs: 25,
            fat: 0.3,
            fiber: 4.4,
            sugar: 19,
          },
          serving: '1 medium (182g)',
          image: 'https://example.com/apple.jpg',
        },
        {
          id: 'f2',
          name: 'Banana',
          calories: 105,
          nutrients: {
            protein: 1.3,
            carbs: 27,
            fat: 0.4,
            fiber: 3.1,
            sugar: 14,
          },
          serving: '1 medium (118g)',
          image: 'https://example.com/banana.jpg',
        },
        {
          id: 'f3',
          name: 'Orange',
          calories: 62,
          nutrients: {
            protein: 1.2,
            carbs: 15.4,
            fat: 0.2,
            fiber: 3.1,
            sugar: 12.2,
          },
          serving: '1 medium (131g)',
          image: 'https://example.com/orange.jpg',
        },
      ];
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Failed to search for food:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFood = (food) => {
    const newFoodEntry = {
      id: Date.now().toString(),
      name: food.name,
      timestamp: new Date().toISOString(),
      calories: food.calories,
      nutrients: food.nutrients,
      mealType: 'snack', // Default meal type
      image: food.image,
    };
    
    dispatch(addFoodEntry(newFoodEntry));
    setSearchQuery('');
    setSearchResults([]);
  };

  const renderFoodEntry = (entry) => {
    return (
      <Card style={styles.foodEntryCard} key={entry.id}>
        <Card.Content>
          <View style={styles.foodEntryHeader}>
            <View>
              <Text style={styles.foodEntryName}>{entry.name}</Text>
              <Text style={styles.foodEntryTime}>
                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            <Chip mode="outlined">{entry.mealType}</Chip>
          </View>
          
          <View style={styles.nutrientsContainer}>
            <View style={styles.nutrientItem}>
              <Text style={styles.nutrientValue}>{entry.calories}</Text>
              <Text style={styles.nutrientLabel}>Calories</Text>
            </View>
            <View style={styles.nutrientItem}>
              <Text style={styles.nutrientValue}>{entry.nutrients.protein}g</Text>
              <Text style={styles.nutrientLabel}>Protein</Text>
            </View>
            <View style={styles.nutrientItem}>
              <Text style={styles.nutrientValue}>{entry.nutrients.carbs}g</Text>
              <Text style={styles.nutrientLabel}>Carbs</Text>
            </View>
            <View style={styles.nutrientItem}>
              <Text style={styles.nutrientValue}>{entry.nutrients.fat}g</Text>
              <Text style={styles.nutrientLabel}>Fat</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderSearchResult = (food) => {
    return (
      <Card style={styles.searchResultCard} key={food.id}>
        <Card.Content>
          <View style={styles.searchResultHeader}>
            <View>
              <Text style={styles.searchResultName}>{food.name}</Text>
              <Text style={styles.searchResultServing}>{food.serving}</Text>
            </View>
            <Text style={styles.searchResultCalories}>{food.calories} cal</Text>
          </View>
          
          <View style={styles.searchResultNutrients}>
            <Text>Protein: {food.nutrients.protein}g</Text>
            <Text>Carbs: {food.nutrients.carbs}g</Text>
            <Text>Fat: {food.nutrients.fat}g</Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => handleAddFood(food)}>Add</Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Daily Nutrition</Title>
            <View style={styles.caloriesContainer}>
              <Text style={styles.caloriesValue}>{dailyCalories || '1800'}</Text>
              <Text style={styles.caloriesLabel}>calories</Text>
            </View>
            
            <Title style={styles.macrosTitle}>Macronutrients</Title>
            <View style={styles.macrosContainer}>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>{dailyNutrients?.protein || '95'}g</Text>
                <Text style={styles.macroLabel}>Protein</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>{dailyNutrients?.carbs || '200'}g</Text>
                <Text style={styles.macroLabel}>Carbs</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>{dailyNutrients?.fat || '60'}g</Text>
                <Text style={styles.macroLabel}>Fat</Text>
              </View>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button onPress={handleRefresh} loading={loading}>
              Refresh
            </Button>
            <Button onPress={() => navigation.navigate('ConnectPassio')}>
              Connect Passio
            </Button>
          </Card.Actions>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Food Search</Title>
            <TextInput
              label="Search for food"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              right={<TextInput.Icon name="magnify" onPress={handleSearch} />}
              style={styles.searchInput}
            />
          </Card.Content>
        </Card>

        {isSearching ? (
          <Card style={styles.card}>
            <Card.Content style={styles.loadingContainer}>
              <Text>Searching...</Text>
            </Card.Content>
          </Card>
        ) : searchResults.length > 0 ? (
          <>
            <Title style={styles.sectionTitle}>Search Results</Title>
            {searchResults.map(renderSearchResult)}
          </>
        ) : null}

        <Title style={styles.sectionTitle}>Today's Food Log</Title>
        {foodEntries && foodEntries.length > 0 ? (
          foodEntries.map(renderFoodEntry)
        ) : (
          <Card style={styles.card}>
            <Card.Content>
              <Paragraph>No food entries recorded today. Start logging your meals!</Paragraph>
            </Card.Content>
          </Card>
        )}

        <Card style={styles.card}>
          <Card.Content>
            <Title>Nutrition Tips</Title>
            <View style={styles.tipItem}>
              <Text style={styles.tipTitle}>Stay Hydrated</Text>
              <Text>Aim to drink at least 8 glasses of water daily.</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipTitle}>Eat Colorful Foods</Text>
              <Text>Include a variety of colorful fruits and vegetables in your diet for essential nutrients.</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipTitle}>Portion Control</Text>
              <Text>Be mindful of portion sizes to maintain a balanced calorie intake.</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
      
      <FAB
        style={styles.fab}
        icon="camera"
        onPress={() => navigation.navigate('FoodRecognition')}
        label="Scan Food"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 16,
  },
  caloriesValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  caloriesLabel: {
    fontSize: 24,
    marginLeft: 8,
    color: '#666',
  },
  macrosTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.accent,
  },
  macroLabel: {
    fontSize: 14,
    color: '#666',
  },
  searchInput: {
    marginBottom: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 16,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 16,
  },
  foodEntryCard: {
    marginBottom: 12,
  },
  foodEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  foodEntryName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  foodEntryTime: {
    fontSize: 14,
    color: '#666',
  },
  nutrientsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutrientItem: {
    alignItems: 'center',
  },
  nutrientValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  nutrientLabel: {
    fontSize: 12,
    color: '#666',
  },
  searchResultCard: {
    marginBottom: 12,
  },
  searchResultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchResultServing: {
    fontSize: 14,
    color: '#666',
  },
  searchResultCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  searchResultNutrients: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tipItem: {
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default NutritionScreen;
