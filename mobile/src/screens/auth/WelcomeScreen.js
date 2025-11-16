
import React from 'react';
import { View, Text, Button } from 'react-native';

export default function WelcomeScreen({ navigation }) {
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text>Welcome to Kitchen19!</Text>
			<Button title="Login" onPress={() => navigation.navigate('Login')} />
		</View>
	);
}
