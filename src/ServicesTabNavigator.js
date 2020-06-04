import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import { colors, metrics } from './themes';

const { height, width } = Dimensions.get('window');

import ServicesInfoScreen from './containers/ServicesInfoScreen';
import ServicesContactScreen from "./containers/ServicesContactScreen";
import ServicesReviewScreen from './containers/ServicesReviewScreen';
import ServicesOffersScreen from './containers/ServicesOffersScreen';
import { Fonts } from './resources/constants/Fonts';
import PartShopContactScreen from "./containers/PartShopContactScreen";

const TabNavigator = createMaterialTopTabNavigator(
	{
		Info: ServicesInfoScreen,
		Reviews: ServicesReviewScreen,
		Offers: ServicesOffersScreen,
		contacts:ServicesContactScreen
	},
	{
		tabBarPosition: 'top',
		animationEnabled: false,
		lazy: false,
		tabBarOptions: {
			activeTintColor: '#0E2D3C',
			inactiveTintColor: colors.blueOpacity40,
			activeBackgroundColor: 'red',
			upperCaseLabel: false,
			labelStyle: {
				fontSize: 11,
				fontWeight: "bold",
				fontFamily: Fonts.CircularBold,
				color: "#333"
			},
			style: {
				backgroundColor: 'white',
				borderTopStartRadius: metrics.radius20,
				borderTopEndRadius: metrics.radius20,
				borderBottomColor: colors.blueOpacity40,
				fontFamily: Fonts.CircularBold,
			},
			indicatorStyle: {
				backgroundColor: '#11455F',
			},
		},
	}
);

export default createAppContainer(TabNavigator);
