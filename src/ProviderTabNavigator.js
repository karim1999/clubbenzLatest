import React from 'react';
import { createAppContainer } from 'react-navigation';
import { colors, metrics } from './themes';

import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import ProviderInfoScreen from "./containers/ProviderInfoScreen";
import ProviderContactScreen from "./containers/ProviderContactScreen";
import ProviderReviewsScreen from "./containers/ProviderReviewsScreen";
import { Fonts } from "./resources/constants/Fonts";
import __ from './resources/copy';


const TabNavigator = createMaterialTopTabNavigator({
    // 'Location': {
    //     screen: props => <ProviderInfoScreen provider={props.screenProps.provider} />,
    // },
    contacts: {
        screen: props => <ProviderContactScreen provider={props.screenProps.provider} />,
        navigationOptions: ({ navigation, navigationOptions }) => ({
            tabBarLabel: __('Contacts', '')
        }),
    },
    Reviews: {
        screen: props => <ProviderReviewsScreen provider={props.screenProps.provider} />,
        navigationOptions: ({ navigation, navigationOptions }) => ({
            tabBarLabel: __('Reviews', '')
        }),
    },
}, {
    tabBarPosition: "top",
    animationEnabled: false,
    lazy: false,
    tabBarOptions: {
        activeTintColor: "#0E2D3C",
        inactiveTintColor: colors.blueOpacity40,
        activeBackgroundColor: "red",
        upperCaseLabel: false,
        labelStyle: {
            fontSize: metrics.deviceWidth * 0.033,
            fontFamily: Fonts.CircularBold
        },
        style: {
            backgroundColor: "white",
            borderTopStartRadius: metrics.radius20,
            borderTopEndRadius: metrics.radius20,
            borderBottomColor: colors.blueOpacity40
        },
        indicatorStyle: {
            backgroundColor: "#11455F",
        }
    }

});

export default createAppContainer(TabNavigator);
