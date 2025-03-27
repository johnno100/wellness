# Neo4j Data Model

This document details the graph data model used in the Wellness App, illustrating how different health domains are represented and connected within the Neo4j database.

## Overview

The Wellness App leverages Neo4j's graph database capabilities to model the complex relationships between users, their health data across different domains, and social connections. This graph-based approach enables powerful cross-domain analysis and personalized insights that would be challenging to achieve with traditional relational databases.

## Core Entities

![Data Model Diagram](../assets/data-model.png)

### User Node

The central entity in our data model representing application users.

**Properties:**
- `id`: UUID - Primary identifier
- `email`: String - User's email address (unique)
- `password`: String - Hashed password
- `firstName`: String - User's first name
- `lastName`: String - User's last name
- `createdAt`: DateTime - Account creation timestamp
- `updatedAt`: DateTime - Last update timestamp
- `preferences`: JSON - User preferences as a JSON object

**Example Cypher:**
```cypher
CREATE (u:User {
  id: randomUUID(),
  email: "user@example.com",
  password: "hashed_password",
  firstName: "Jane",
  lastName: "Doe",
  createdAt: datetime(),
  updatedAt: datetime(),
  preferences: "{\"theme\":\"dark\",\"notifications\":true}"
})
```

### Mental Health Node

Represents a user's mental health data point, typically synced from Sahha.ai.

**Properties:**
- `id`: UUID - Primary identifier
- `source`: String - Data source (e.g., "sahha")
- `date`: DateTime - When this data was recorded
- `stressLevel`: Integer (0-100) - User's stress level
- `moodScore`: Integer (0-100) - User's mood score
- `anxietyLevel`: Integer (0-100) - User's anxiety level
- `emotionalBalance`: Integer (0-100) - Emotional balance score
- `mentalEnergyLevel`: Integer (0-100) - Mental energy level
- `rawData`: JSON - Complete raw data from source

**Example Cypher:**
```cypher
MATCH (u:User {id: "user-uuid"})
CREATE (m:MentalHealth {
  id: randomUUID(),
  source: "sahha",
  date: datetime(),
  stressLevel: 35,
  moodScore: 75,
  anxietyLevel: 40,
  emotionalBalance: 65,
  mentalEnergyLevel: 70,
  rawData: "{\"full_response\":\"...\",\"source_metrics\":{...}}"
})
CREATE (u)-[:HAS_MENTAL_HEALTH]->(m)
```

### Sleep Node

Represents a user's sleep data point, typically synced from Asleep.ai.

**Properties:**
- `id`: UUID - Primary identifier
- `source`: String - Data source (e.g., "asleep")
- `date`: DateTime - When this data was recorded
- `sleepDuration`: Integer - Total sleep duration in minutes
- `deepSleepDuration`: Integer - Deep sleep duration in minutes
- `remSleepDuration`: Integer - REM sleep duration in minutes
- `lightSleepDuration`: Integer - Light sleep duration in minutes
- `sleepQualityScore`: Integer (0-100) - Overall sleep quality
- `sleepEfficiency`: Integer (0-100) - Sleep efficiency percentage
- `rawData`: JSON - Complete raw data from source

**Example Cypher:**
```cypher
MATCH (u:User {id: "user-uuid"})
CREATE (s:Sleep {
  id: randomUUID(),
  source: "asleep",
  date: datetime(),
  sleepDuration: 480,
  deepSleepDuration: 120,
  remSleepDuration: 90,
  lightSleepDuration: 270,
  sleepQualityScore: 82,
  sleepEfficiency: 87,
  rawData: "{\"full_response\":\"...\",\"sleep_cycles\":[...]}"
})
CREATE (u)-[:HAS_SLEEP]->(s)
```

### Nutrition Node

Represents a user's nutrition data point, typically synced from Passio.ai.

**Properties:**
- `id`: UUID - Primary identifier
- `source`: String - Data source (e.g., "passio")
- `date`: DateTime - When this data was recorded
- `caloriesConsumed`: Integer - Total calories consumed
- `proteinGrams`: Float - Protein consumption in grams
- `carbGrams`: Float - Carbohydrate consumption in grams
- `fatGrams`: Float - Fat consumption in grams
- `fiberGrams`: Float - Fiber consumption in grams
- `waterIntake`: Integer - Water intake in milliliters
- `nutritionQualityScore`: Integer (0-100) - Overall nutrition quality
- `rawData`: JSON - Complete raw data from source

**Example Cypher:**
```cypher
MATCH (u:User {id: "user-uuid"})
CREATE (n:Nutrition {
  id: randomUUID(),
  source: "passio",
  date: datetime(),
  caloriesConsumed: 2050,
  proteinGrams: 110.5,
  carbGrams: 230.8,
  fatGrams: 65.2,
  fiberGrams: 25.3,
  waterIntake: 2400,
  nutritionQualityScore: 75,
  rawData: "{\"full_response\":\"...\",\"meals\":[...]}"
})
CREATE (u)-[:HAS_NUTRITION]->(n)
```

### Fitness Node

Represents a user's fitness data point, typically synced from Strava.

**Properties:**
- `id`: UUID - Primary identifier
- `source`: String - Data source (e.g., "strava")
- `date`: DateTime - When this data was recorded
- `stepsCount`: Integer - Total steps for the day
- `activeMinutes`: Integer - Minutes of active exercise
- `distanceKm`: Float - Distance covered in kilometers
- `caloriesBurned`: Integer - Calories burned in activity
- `heartRateAvg`: Integer - Average heart rate in BPM
- `heartRateMax`: Integer - Maximum heart rate in BPM
- `fitnessScore`: Integer (0-100) - Overall fitness score
- `rawData`: JSON - Complete raw data from source

**Example Cypher:**
```cypher
MATCH (u:User {id: "user-uuid"})
CREATE (f:Fitness {
  id: randomUUID(),
  source: "strava",
  date: datetime(),
  stepsCount: 12458,
  activeMinutes: 45,
  distanceKm: 8.7,
  caloriesBurned: 420,
  heartRateAvg: 132,
  heartRateMax: 165,
  fitnessScore: 85,
  rawData: "{\"full_response\":\"...\",\"activities\":[...]}"
})
CREATE (u)-[:HAS_FITNESS]->(f)
```

## Relationships

The graph model uses relationships to connect entities in meaningful ways:

| Relationship Type | From | To | Description |
|------------------|------|------|------------|
| `HAS_MENTAL_HEALTH` | User | MentalHealth | Connects a user to their mental health data points |
| `HAS_SLEEP` | User | Sleep | Connects a user to their sleep data points |
| `HAS_NUTRITION` | User | Nutrition | Connects a user to their nutrition data points |
| `HAS_FITNESS` | User | Fitness | Connects a user to their fitness data points |
| `FRIENDS_WITH` | User | User | Bidirectional friendship relationship between users |
| `FOLLOWS` | User | User | Unidirectional following relationship between users |
| `PART_OF` | User | Community | User membership in a community group |
| `COMPLETED` | User | Challenge | User completion of a wellness challenge |
| `TAGGED_IN` | MentalHealth/Sleep/Nutrition/Fitness | Activity | Tags a health record to a specific activity |

## Extended Entities

### Community Node

Represents a community or group within the application.

**Properties:**
- `id`: UUID - Primary identifier
- `name`: String - Community name
- `description`: String - Community description
- `createdAt`: DateTime - Creation timestamp
- `imageUrl`: String - Community profile image URL
- `memberCount`: Integer - Count of members
- `isPrivate`: Boolean - Whether community is private

### Challenge Node

Represents a wellness challenge that users can participate in.

**Properties:**
- `id`: UUID - Primary identifier
- `title`: String - Challenge title
- `description`: String - Challenge description
- `startDate`: DateTime - Challenge start date
- `endDate`: DateTime - Challenge end date
- `domain`: String - Health domain (e.g., "fitness", "nutrition")
- `goal`: JSON - Challenge goal criteria
- `participantCount`: Integer - Number of participants

### Activity Node

Represents a specific user activity or event.

**Properties:**
- `id`: UUID - Primary identifier
- `type`: String - Activity type
- `timestamp`: DateTime - When activity occurred
- `description`: String - Activity description
- `metaData`: JSON - Additional activity data

## Common Queries

### Get User's Latest Health Data

```cypher
MATCH (u:User {id: $userId})
OPTIONAL MATCH (u)-[:HAS_MENTAL_HEALTH]->(m:MentalHealth)
WITH u, m ORDER BY m.date DESC LIMIT 1

OPTIONAL MATCH (u)-[:HAS_SLEEP]->(s:Sleep)
WITH u, m, s ORDER BY s.date DESC LIMIT 1

OPTIONAL MATCH (u)-[:HAS_NUTRITION]->(n:Nutrition)
WITH u, m, s, n ORDER BY n.date DESC LIMIT 1

OPTIONAL MATCH (u)-[:HAS_FITNESS]->(f:Fitness)
WITH u, m, s, n, f ORDER BY f.date DESC LIMIT 1

RETURN m, s, n, f
```

### Get User's Health Trends Over Time

```cypher
MATCH (u:User {id: $userId})
MATCH (u)-[:HAS_MENTAL_HEALTH]->(m:MentalHealth)
WHERE m.date >= datetime($startDate) AND m.date <= datetime($endDate)
RETURN m.date as date, m.stressLevel as stressLevel, m.moodScore as moodScore
ORDER BY m.date
```

### Find Connections Between Sleep and Fitness

```cypher
MATCH (u:User {id: $userId})
MATCH (u)-[:HAS_SLEEP]->(s:Sleep)
MATCH (u)-[:HAS_FITNESS]->(f:Fitness)
WHERE date(s.date) = date(f.date)
RETURN 
  date(s.date) as date, 
  s.sleepQualityScore as sleepQuality, 
  f.activeMinutes as activeMinutes
ORDER BY date
```

### Get Friends' Recent Activities

```cypher
MATCH (u:User {id: $userId})-[:FRIENDS_WITH]->(friend:User)
MATCH (friend)-[:HAS_FITNESS]->(f:Fitness)
WHERE f.date >= datetime() - duration({days: 7})
RETURN friend.firstName, friend.lastName, f
ORDER BY f.date DESC
LIMIT 20
```

## Indexing Strategy

To optimize query performance, the following indexes are created:

```cypher
// User indexes
CREATE INDEX user_id FOR (u:User) ON (u.id);
CREATE INDEX user_email FOR (u:User) ON (u.email);

// Health data indexes
CREATE INDEX mental_health_date FOR (m:MentalHealth) ON (m.date);
CREATE INDEX sleep_date FOR (s:Sleep) ON (s.date);
CREATE INDEX nutrition_date FOR (n:Nutrition) ON (n.date);
CREATE INDEX fitness_date FOR (f:Fitness) ON (f.date);

// Combined indexes for time-based filtering
CREATE INDEX mental_health_user_date FOR (m:MentalHealth) ON (m.source, m.date);
CREATE INDEX sleep_user_date FOR (s:Sleep) ON (s.source, s.date);
CREATE INDEX nutrition_user_date FOR (n:Nutrition) ON (n.source, n.date);
CREATE INDEX fitness_user_date FOR (f:Fitness) ON (f.source, f.date);
```

## Data Validation and Constraints

```cypher
// Ensure user email uniqueness
CREATE CONSTRAINT user_email_unique FOR (u:User) REQUIRE u.email IS UNIQUE;

// Ensure entity IDs are unique
CREATE CONSTRAINT user_id_unique FOR (u:User) REQUIRE u.id IS UNIQUE;
CREATE CONSTRAINT mental_health_id_unique FOR (m:MentalHealth) REQUIRE m.id IS UNIQUE;
CREATE CONSTRAINT sleep_id_unique FOR (s:Sleep) REQUIRE s.id IS UNIQUE;
CREATE CONSTRAINT nutrition_id_unique FOR (n:Nutrition) REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT fitness_id_unique FOR (f:Fitness) REQUIRE f.id IS UNIQUE;
```

## Data Migration Strategy

1. **Versioned Migrations**: Database migrations are versioned and applied sequentially
2. **Backward Compatibility**: New schema changes maintain compatibility with existing data
3. **Data Transformation**: Legacy data is transformed to match new schema requirements
4. **Validation**: Pre and post-migration data validation ensures data integrity
5. **Rollback Plans**: Each migration includes a rollback procedure in case of issues

## Performance Considerations

1. **Property Types**: Using appropriate data types for properties (e.g., Integer vs Float)
2. **Selective Indexing**: Creating indexes only for frequently queried properties
3. **Query Optimization**: Writing efficient Cypher queries that leverage indexes
4. **Pagination**: Implementing pagination for large result sets using SKIP/LIMIT
5. **Batching**: Processing large data operations in batches to avoid memory issues
