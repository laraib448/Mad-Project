import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Import screens
import { UserProvider } from './src/contexts/UserContext';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import AlertsScreen from './src/screens/AlertsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator Component
function TabNavigator({ route }) {
  // Use route params or default
  const userName = route.params?.userName || 'User';
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Calendar':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Alerts':
              iconName = focused ? 'notifications' : 'notifications-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-circle';
          }
          
          // Return Icon component
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8E44AD',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#8E44AD',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        initialParams={{ userName }}
        options={{
          title: 'Home',
          headerTitle: `Welcome, ${userName}!`,
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarScreen} 
        options={{ title: 'Calendar' }}
      />
      <Tab.Screen 
        name="Alerts" 
        component={AlertsScreen} 
        options={{ title: 'Alerts' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  const [userName, setUserName] = useState('');

  return (
     <UserProvider>
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ 
          headerShown: false,
          cardStyle: { backgroundColor: '#fff' }
        }}
      >
        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} setUserName={setUserName} />}
        </Stack.Screen>
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen 
          name="MainTabs" 
          component={TabNavigator}
          options={({ route }) => ({
            headerShown: false,
            title: 'Birthday Reminder',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </UserProvider>
  );
}