const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');

// Mock user database for MVP
// In production, this would use the Neo4j database
const users = [];

// User registration
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const userExists = users.find(user => user.email === email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      connections: {
        sahha: false,
        asleep: false,
        passio: false,
        strava: false
      }
    };
    
    users.push(newUser);
    
    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    
    // Return user info and token
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        connections: newUser.connections
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Error registering user' });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
    
    // Return user info and token
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        connections: user.connections
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Error logging in' });
  }
};

// Strava OAuth authorization
exports.stravaAuth = (req, res) => {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const redirectUri = process.env.STRAVA_REDIRECT_URI;
  const scope = 'read,activity:read_all,profile:read_all';
  
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  
  res.redirect(authUrl);
};

// Strava OAuth callback
exports.stravaCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const clientId = process.env.STRAVA_CLIENT_ID;
    const clientSecret = process.env.STRAVA_CLIENT_SECRET;
    
    // Exchange authorization code for tokens
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code'
    });
    
    const { access_token, refresh_token, expires_at, athlete } = response.data;
    
    // In a real app, we would store these tokens in the database
    // For MVP, we'll just return them
    
    return res.status(200).json({
      message: 'Strava connected successfully',
      tokens: {
        access_token,
        refresh_token,
        expires_at
      },
      athlete: {
        id: athlete.id,
        firstname: athlete.firstname,
        lastname: athlete.lastname,
        profile: athlete.profile
      }
    });
  } catch (error) {
    console.error('Strava callback error:', error);
    return res.status(500).json({ message: 'Error connecting to Strava' });
  }
};

// Strava token refresh
exports.stravaRefreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    const clientId = process.env.STRAVA_CLIENT_ID;
    const clientSecret = process.env.STRAVA_CLIENT_SECRET;
    
    // Refresh access token
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token,
      grant_type: 'refresh_token'
    });
    
    const { access_token, expires_at, new_refresh_token } = response.data;
    
    return res.status(200).json({
      message: 'Token refreshed successfully',
      tokens: {
        access_token,
        refresh_token: new_refresh_token || refresh_token,
        expires_at
      }
    });
  } catch (error) {
    console.error('Strava token refresh error:', error);
    return res.status(500).json({ message: 'Error refreshing Strava token' });
  }
};
