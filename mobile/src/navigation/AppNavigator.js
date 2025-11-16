
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';

const RootStack = createStackNavigator();

export default function AppNavigator() {
	return (
		<RootStack.Navigator screenOptions={{ headerShown: false }}>
			<RootStack.Screen name="Auth" component={AuthNavigator} />
			{/* Add MainNavigator or other navigators here as you build them */}
		</RootStack.Navigator>
	);
}
