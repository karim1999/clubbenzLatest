import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { colors, metrics } from './themes';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

const { height, width } = Dimensions.get("window");

import WorkshopInfoScreen from "./containers/WorkshopInfoScreen";
import WorkshopContactScreen from "./containers/WorkshopContactScreen";
import WorkshopReviewsScreen from "./containers/WorkshopReviewsScreen";
import WorkshopBooknowScreen from "./containers/WorkshopBooknowScreen";
import WorkshopOffersScreen from "./containers/WorkshopOffersScreen";
import { Fonts } from "./resources/constants/Fonts";
import ServicesContactScreen from "./containers/ServicesContactScreen";
import __ from "./resources/copy";

// import { connect } from 'react-redux';

// import __ from '../src/resources/copy';

// const Info = __('Info' , props.language);



const TabNavigator = createMaterialTopTabNavigator({

    Info : WorkshopInfoScreen,
    reviews: WorkshopReviewsScreen,
    Booking: {
        screen: props => <WorkshopBooknowScreen active={props.screenProps.active} workshop={props.screenProps.details} />,
        navigationOptions: ({ navigation, navigationOptions }) => ({
            tabBarLabel: __('Booking', '')
        }),
    },
    Offers: WorkshopOffersScreen,
    Contacts:WorkshopContactScreen

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
                fontSize: 11,
                fontWeight: "bold",
                fontFamily: Fonts.CircularBold,
                color: "#333"
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
