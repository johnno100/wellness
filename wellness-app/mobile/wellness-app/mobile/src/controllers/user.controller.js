// User controller for handling user-related operations
const users = []; // Mock user database for MVP

// Get user profile
exports.getProfile = (req, res) => {
  try {
    const userId = req.userId;
    const user = users.find(user => user.id === userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      connections: user.connections
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Error retrieving user profile' });
  }
};

// Update user profile
exports.updateProfile = (req, res) => {
  try {
    const userId = req.userId;
    const { name, email } = req.body;
    
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user information
    users[userIndex] = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      email: email || users[userIndex].email
    };
    
    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: users[userIndex].id,
        name: users[userIndex].name,
        email: users[userIndex].email,
        connections: users[userIndex].connections
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Error updating user profile' });
  }
};

// Get user settings
exports.getSettings = (req, res) => {
  try {
    const userId = req.userId;
    // In a real app, we would retrieve user settings from the database
    // For MVP, we'll return mock settings
    
    return res.status(200).json({
      notifications: {
        email: true,
        push: true
      },
      privacy: {
        shareData: false
      },
      units: {
        distance: 'km',
        weight: 'kg'
      }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    return res.status(500).json({ message: 'Error retrieving user settings' });
  }
};

// Update user settings
exports.updateSettings = (req, res) => {
  try {
    const userId = req.userId;
    const { notifications, privacy, units } = req.body;
    
    // In a real app, we would update user settings in the database
    // For MVP, we'll just return the updated settings
    
    return res.status(200).json({
      message: 'Settings updated successfully',
      settings: {
        notifications,
        privacy,
        units
      }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return res.status(500).json({ message: 'Error updating user settings' });
  }
};

// Connect Sahha.ai
exports.connectSahha = (req, res) => {
  try {
    const userId = req.userId;
    const { apiKey } = req.body;
    
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user connections
    users[userIndex].connections.sahha = true;
    
    return res.status(200).json({
      message: 'Sahha.ai connected successfully',
      connections: users[userIndex].connections
    });
  } catch (error) {
    console.error('Connect Sahha error:', error);
    return res.status(500).json({ message: 'Error connecting to Sahha.ai' });
  }
};

// Connect Asleep.ai
exports.connectAsleep = (req, res) => {
  try {
    const userId = req.userId;
    const { apiKey } = req.body;
    
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user connections
    users[userIndex].connections.asleep = true;
    
    return res.status(200).json({
      message: 'Asleep.ai connected successfully',
      connections: users[userIndex].connections
    });
  } catch (error) {
    console.error('Connect Asleep error:', error);
    return res.status(500).json({ message: 'Error connecting to Asleep.ai' });
  }
};

// Connect Passio.ai
exports.connectPassio = (req, res) => {
  try {
    const userId = req.userId;
    const { apiKey } = req.body;
    
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user connections
    users[userIndex].connections.passio = true;
    
    return res.status(200).json({
      message: 'Passio.ai connected successfully',
      connections: users[userIndex].connections
    });
  } catch (error) {
    console.error('Connect Passio error:', error);
    return res.status(500).json({ message: 'Error connecting to Passio.ai' });
  }
};

// Get user connections
exports.getConnections = (req, res) => {
  try {
    const userId = req.userId;
    const user = users.find(user => user.id === userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({
      connections: user.connections
    });
  } catch (error) {
    console.error('Get connections error:', error);
    return res.status(500).json({ message: 'Error retrieving user connections' });
  }
};
