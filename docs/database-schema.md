# Neo4j Database Schema Documentation

This document provides detailed information about the Neo4j database schema used in the Wellness app MVP.

## Overview

The Wellness app uses Neo4j, a graph database, to store and relate health data from different domains. The graph structure allows for powerful queries that can reveal relationships between different aspects of health.

## Node Types

### User
Represents a user of the application.

**Properties:**
- `id`: Unique identifier
- `name`: User's name
- `email`: User's email address (unique)
- `password`: Hashed password
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

### MentalHealth (Sahha.ai)
Represents mental health data from Sahha.ai.

**Properties:**
- `id`: Unique identifier
- `date`: Date and time of the record
- `score`: Overall mental health score
- `stress`: Stress level
- `anxiety`: Anxiety level
- `mood`: Mood level
- `created_at`: Timestamp of creation

### Sleep (Asleep.ai)
Represents sleep data from Asleep.ai.

**Properties:**
- `id`: Unique identifier
- `date`: Date and time of the record
- `duration`: Sleep duration in minutes
- `quality`: Sleep quality score
- `deep`: Deep sleep duration in minutes
- `light`: Light sleep duration in minutes
- `rem`: REM sleep duration in minutes
- `awake`: Awake time during sleep in minutes
- `created_at`: Timestamp of creation

### Nutrition (Passio.ai)
Represents nutrition data from Passio.ai.

**Properties:**
- `id`: Unique identifier
- `date`: Date and time of the record
- `totalCalories`: Total calories consumed
- `totalProtein`: Total protein consumed in grams
- `totalCarbs`: Total carbohydrates consumed in grams
- `totalFat`: Total fat consumed in grams
- `created_at`: Timestamp of creation

### Meal
Represents a meal as part of nutrition data.

**Properties:**
- `name`: Meal name (e.g., Breakfast, Lunch)
- `calories`: Calories in the meal
- `protein`: Protein in grams
- `carbs`: Carbohydrates in grams
- `fat`: Fat in grams
- `created_at`: Timestamp of creation

### Fitness (Strava)
Represents fitness activity data from Strava.

**Properties:**
- `id`: Unique identifier
- `date`: Date and time of the record
- `activity_type`: Type of activity (e.g., Run, Ride)
- `duration`: Duration in minutes
- `distance`: Distance in kilometers
- `calories`: Calories burned
- `avg_speed`: Average speed
- `max_speed`: Maximum speed
- `elevation_gain`: Elevation gain in meters
- `created_at`: Timestamp of creation

## Relationships

### HAS_MENTAL_HEALTH
Connects a User to their MentalHealth records.

**Direction:** User → MentalHealth

### HAS_SLEEP
Connects a User to their Sleep records.

**Direction:** User → Sleep

### HAS_NUTRITION
Connects a User to their Nutrition records.

**Direction:** User → Nutrition

### INCLUDES_MEAL
Connects a Nutrition record to its Meal records.

**Direction:** Nutrition → Meal

### HAS_FITNESS
Connects a User to their Fitness records.

**Direction:** User → Fitness

## Database Constraints and Indexes

### Constraints
- `user_id`: Ensures User.id is unique
- `user_email`: Ensures User.email is unique
- `mental_health_id`: Ensures MentalHealth.id is unique
- `sleep_id`: Ensures Sleep.id is unique
- `nutrition_id`: Ensures Nutrition.id is unique
- `fitness_id`: Ensures Fitness.id is unique

### Indexes
- `user_name`: Index on User.name for faster lookups
- `mental_health_date`: Index on MentalHealth.date for faster time-based queries
- `sleep_date`: Index on Sleep.date for faster time-based queries
- `nutrition_date`: Index on Nutrition.date for faster time-based queries
- `fitness_date`: Index on Fitness.date for faster time-based queries

## Example Queries

### Get a user's mental health records for the last week
```cypher
MATCH (u:User {id: 'user123'})-[:HAS_MENTAL_HEALTH]->(m:MentalHealth)
WHERE m.date >= datetime() - duration({days: 7})
RETURN m
ORDER BY m.date DESC
```

### Get a user's sleep quality and mental health score for correlation
```cypher
MATCH (u:User {id: 'user123'})-[:HAS_SLEEP]->(s:Sleep)
MATCH (u)-[:HAS_MENTAL_HEALTH]->(m:MentalHealth)
WHERE date(s.date).year = date(m.date).year 
  AND date(s.date).month = date(m.date).month 
  AND date(s.date).day = date(m.date).day
RETURN s.quality as sleepQuality, m.score as mentalScore
```

### Get a user's nutrition data with meals for a specific day
```cypher
MATCH (u:User {id: 'user123'})-[:HAS_NUTRITION]->(n:Nutrition)
WHERE date(n.date) = date('2025-03-17')
OPTIONAL MATCH (n)-[:INCLUDES_MEAL]->(m:Meal)
RETURN n, collect(m) as meals
```

### Get a user's fitness activities by type
```cypher
MATCH (u:User {id: 'user123'})-[:HAS_FITNESS]->(f:Fitness)
RETURN f.activity_type, count(f) as count, avg(f.duration) as avgDuration
ORDER BY count DESC
```

## Data Flow

1. Data is retrieved from external APIs (Sahha.ai, Asleep.ai, Passio.ai, Strava)
2. Data is transformed into the appropriate format
3. Data is stored in Neo4j using the models defined in `src/models/neo4j.models.js`
4. Relationships are created between nodes
5. Data is queried and analyzed using Cypher queries

## Initialization

The database is initialized with constraints and indexes when the application starts. This is handled by the `initializeDatabase` function in `src/models/neo4j.models.js`.
