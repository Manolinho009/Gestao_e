import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import FloatButton from './components/fab';
import { useState } from 'react';
import EscalaScreen from './screens/create_edit/EscalaScreen';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    
    <NavigationContainer styles={styles.container}>
      <Stack.Navigator>
        <Stack.Screen options={({ navigation, route }) => ( { headerShown: false})} name="Login" component={LoginScreen} />
        <Stack.Screen 
        // options={{ headerShown: false}} 
        options={({ navigation, route }) => (
          {}
          )}
        name="Register" component={RegisterScreen} />
        
        <Stack.Screen 
         options={({ navigation, route }) => ({
          headerTitle: 'Principal',
          headerBackButtonMenuEnabled:false,    
        }
         )}
          name="Home" component={HomeScreen} />
        <Stack.Screen 
         options={({ navigation, route }) => ({
          headerTitle: 'Criar Escala',
          headerBackButtonMenuEnabled:false,    
        }
         )}
          name="CreateEscala" component={EscalaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
