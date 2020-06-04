import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import { colors, metrics } from './themes';
import AllItemScreen from './containers/AllItemScreen';
import NewItemScreen from './containers/NewItemScreen';
import UsedItemScreen from './containers/UsedItemScreen';

const { height, width } = Dimensions.get('window');

import __ from '../src/resources/copy';

const ItemTabNavigator = createMaterialTopTabNavigator(
	{
		'Test': {
			screen: AllItemScreen,
			navigationOptions: {
				tabBarLabel: ({ focused, tintColor }) => (
					<View
						style={{
							backgroundColor: focused ? colors.blueText : '#fff',
							alignSelf: 'stretch',
							alignItems: 'center',
							paddingVertical: 5,
							borderRadius: width * 0.05,
						}}
					>
						<Text style={{ color: tintColor, fontSize: width * 0.025, }}>Testing</Text>
					</View>
				),
			},
		},
		New: {
			screen: NewItemScreen,
			navigationOptions: {
				tabBarLabel: ({ focused, tintColor }) => (
					<View
						style={{
							backgroundColor: focused ? colors.blueText : '#fff',
							alignSelf: 'stretch',
							alignItems: 'center',
							paddingVertical: 5,
							borderRadius: width * 0.05,
						}}
					>
						<Text style={{ color: tintColor, fontSize: width * 0.025, }}>{__('NEW' , '')}</Text>
					</View>
				),
			},
		},
		Used: {
			screen: UsedItemScreen,
			navigationOptions: {
				tabBarLabel: ({ focused, tintColor }) => (
					<View
						style={{
							backgroundColor: focused ? colors.blueText : '#fff',
							alignSelf: 'stretch',
							alignItems: 'center',
							paddingVertical: 5,
							borderRadius: width * 0.05,
						}}
					>
						<Text style={{ color: tintColor, fontSize: width * 0.025, }}>{__('USED' , '')}</Text>
					</View>
				),
			},
		},
	},
	{
		initialRouteName: 'All',
		swipeEnabled: false,
		tabBarOptions: {
			tabStyle: {
				backgroundColor: 'white',
				paddingVertical: 3,
				paddingHorizontal: 3,
			},
			style: {
				backgroundColor: 'white',
				marginHorizontal: width * 0.1,
				borderRadius: width * 0.1,
				overflow: 'hidden',
				elevation: 0,
				marginVertical: height * 0.02,
			},
			showIcon: false,
			pressColor: '#FFF',
			indicatorStyle: { backgroundColor: 'white' },
			activeTintColor: '#fff',
			inactiveTintColor: colors.blueText,
		},
	}
);

export default createAppContainer(ItemTabNavigator);
