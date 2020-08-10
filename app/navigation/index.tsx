import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StatusBar } from 'react-native';
import { enableScreens } from 'react-native-screens';

import SplashScreen from '@screens/SplashScreen';
import Start from '@screens/Start';

import { Movies } from '../providers';

import type { StackCardInterpolationProps } from '@react-navigation/stack';

enableScreens();

const Stack = createStackNavigator();

const forFade = ({ current }: StackCardInterpolationProps) => ({
    cardStyle: {
        opacity: current.progress,
    },
});

const App = () => (
    <>
        <StatusBar barStyle="dark-content" />
        <Movies.Provider>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Splash"
                    screenOptions={{
                        headerShown: false,
                        cardStyleInterpolator: forFade,
                    }}>
                    <Stack.Screen name="Splash" component={SplashScreen} />
                    <Stack.Screen name="Start" component={Start} />
                </Stack.Navigator>
            </NavigationContainer>
        </Movies.Provider>
    </>
);

export default App;
