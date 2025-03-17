# Passio.ai API Integration Research

## Overview
Passio Nutrition-AI SDK is an industry-leading food recognition and nutrition tracking SDK designed to enable app developers to rapidly add AI-powered food logging capabilities and AI-powered nutrition coaching to their mobile applications. The SDK is part of Passio's Nutrition-AI Hub product and relies on a wide range of APIs and functionality.

## Integration Methods
1. **Mobile SDK Integration**:
   - iOS SDK
   - Android SDK
   - React Native SDK
   - Flutter SDK

2. **Direct API Integration**:
   - RESTful API endpoints for food search, image recognition, and speech recognition

## Key Features
- Food recognition and nutrition tracking
- Photo logging analyzed via cloud-side LLMs
- Voice logging for food tracking
- Text search for food items
- Barcode scanning and OCR for nutrition facts recognition

## API Endpoints

### Food Search
- **Mobile SDK**: `searchForFoodSemantic` or `searchForFood`
- **API**: 
  - Semantic search: `https://api.passiolife.com/v2/products/food/search/semantic?term=$query`
  - Advanced search: `https://api.passiolife.com/v2/products/food/search/advanced?term=$query`

### Image Recognition
- **Mobile SDK**: `recognizeImageRemote`
- **API**: `https://api.passiolife.com/v2/products/sdk/tools/vision/extractIngredients`
- The SDK performs several preprocessing steps including barcode scanning and OCR before sending the request
- Images are sent as base64 encoded strings

### Speech Recognition
- **Mobile SDK**: `recognizeSpeechRemote`
- **API**: `https://api.passiolife.com/v2/products/sdk/tools/extractMealLogAction`
- Converts spoken food descriptions to structured data

## Authentication
- API Key required for authentication
- SDK initialization requires API Key

## Data Format
- API responses are in JSON format
- Food data is mapped to objects like:
  - `PassioFoodDataInfo` - For food search results
  - `PassioAdvisorFoodInfo` - For image recognition results
  - `PassioSpeechRecognitionModel` - For speech recognition results

## Localization
- The SDK adds the `Localization-ISO` header to requests if the locale code was set
- Supports multiple languages through the `updateLanguage` function

## Implementation Considerations for Wellness App
- Choose between SDK integration or direct API calls based on requirements
- Consider the shift from real-time on-device food logging to photo/voice logging with cloud processing
- Implement proper error handling for API responses
- Store nutrition data in Neo4j with appropriate relationships to other health data
- Consider privacy implications of sending images and voice data to the cloud

## Resources
- Documentation: https://passio.gitbook.io/nutrition-ai/
- Platform-specific SDK documentation available for iOS, Android, React Native, and Flutter
- Nutrition-AI Hub and Nutrition Advisor API documentation also available
