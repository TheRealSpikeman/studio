export const DEFAULT_APP_FEATURES = { 
  maxChildren: 3, 
  maxQuizzes: 10,
  advancedAnalytics: false,
  customReports: false 
};

export const initialDefaultPlans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 9.99,
    features: ['Feature 1', 'Feature 2']
  },
  {
    id: 'premium', 
    name: 'Premium Plan',
    price: 19.99,
    features: ['All Basic', 'Feature 3', 'Feature 4']
  }
];

export const DEFAULT_PLATFORM_TOOLS = [
  { id: 'tool1', name: 'Reading Tool', description: 'Help with reading' },
  { id: 'tool2', name: 'Math Tool', description: 'Help with math' }
];
