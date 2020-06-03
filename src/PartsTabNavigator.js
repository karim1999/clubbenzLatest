import React from "react";
import { Text, View, Dimensions } from "react-native";
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from "react-navigation";

import { colors, metrics } from "./themes";

const { height, width } = Dimensions.get("window");

import PartsInfoScreen from "./containers/PartsInfoScreen";
import PartsReviewsScreen from "./containers/PartsReviewsScreen";
import PartsOffersScreen from "./containers/PartsOffersScreen";
import { Fonts } from './resources/constants/Fonts';

const TabNavigator = createMaterialTopTabNavigator(
  {
    Info: PartsInfoScreen,
    Reviews: PartsReviewsScreen,
    Offers: PartsOffersScreen
  },
  {
    tabBarPosition: "top",
    animationEnabled: false,
    lazy: false,
    tabBarOptions: {
      activeTintColor: "#0E2D3C",
      inactiveTintColor: colors.blueOpacity40,
      activeBackgroundColor: "red",
      upperCaseLabel: false,
      labelStyle: {
        fontSize: metrics.deviceWidth * 0.035,
        fontFamily: Fonts.CircularBold,
      },
      style: {
        backgroundColor: "white",
        borderTopStartRadius: metrics.radius20,
        borderTopEndRadius: metrics.radius20,
        borderBottomColor: colors.blueOpacity40,
        fontFamily: Fonts.CircularBold,
      },
      indicatorStyle: {
        backgroundColor: "#11455F"
      }
    }
  }
);

export default createAppContainer(TabNavigator);
