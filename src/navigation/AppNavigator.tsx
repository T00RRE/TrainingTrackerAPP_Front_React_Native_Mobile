import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import HomeScreen from '../screens/HomeScreen.tsx';
import DetailsScreen from '../screens/DetailsScreen';
import WorkoutSelectionScreen from '../screens/WorkoutSelectionScreen.tsx';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      {/* initialRouteName musi pasować do nazwy w Stack.Screen */}
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Moje Treningi' }} 
        />
        <Stack.Screen 
        name="WorkoutSelection" 
        component={WorkoutSelectionScreen} 
        options={{ headerShown: false }} 
      />
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;