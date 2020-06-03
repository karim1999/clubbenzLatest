import React from 'react';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
import { colors, metrics } from './themes';


import ProviderInfoScreen from "./containers/ProviderInfoScreen";
import ProviderContactScreen from "./containers/ProviderContactScreen";
import ProviderReviewsScreen from "./containers/ProviderReviewsScreen";
import { Fonts } from "./resources/constants/Fonts";


const TabNavigator = createMaterialTopTabNavigator({
    // 'Location': {
    //     screen: props => <ProviderInfoScreen provider={props.screenProps.provider} />,
    // },
    'contacts': {
        screen: props => <ProviderContactScreen provider={props.screenProps.provider} />,
    },
    'reviews': {
        screen: props => <ProviderReviewsScreen provider={props.screenProps.provider} />,
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
