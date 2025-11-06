// Mock reanimated to avoid native dependency
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Mock RNGH minimal stubs
jest.mock('react-native-gesture-handler', () => ({
	GestureHandlerRootView: ({ children }) => children,
}));

// Mock React Navigation containers and navigators
jest.mock('@react-navigation/native', () => {
	const React = require('react');
	return {
		...jest.requireActual('@react-navigation/native'),
		NavigationContainer: ({ children }) => React.createElement(React.Fragment, null, children),
	};
});

jest.mock('@react-navigation/native-stack', () => {
	const React = require('react');
	return {
		createNativeStackNavigator: () => ({
			Navigator: ({ children }) => React.createElement(React.Fragment, null, children),
			Screen: () => null,
		}),
	};
});

jest.mock('@react-navigation/bottom-tabs', () => {
	const React = require('react');
	return {
		createBottomTabNavigator: () => ({
			Navigator: ({ children }) => React.createElement(React.Fragment, null, children),
			Screen: () => null,
		}),
	};
});

// Mock vector icons to simple components
jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');
