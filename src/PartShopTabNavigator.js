import React from "react";
import { Text, View, Dimensions } from "react-native";
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from "react-navigation";

import { colors, metrics } from "./themes";

const { height, width } = Dimensions.get("window");

import PartShopInfoScreen from "./containers/PartShopInfoScreen";
import PartShopContactScreen from "./containers/PartShopContactScreen";
import PartsReviewsScreen from "./containers/PartsReviewsScreen";
import PartsOffersScreen from "./containers/PartsOffersScreen";
import { Fonts } from "./resources/constants/Fonts";

const TabNavigator = createMaterialTopTabNavigator(
  {
    Info: PartShopInfoScreen,
    Reviews: PartsReviewsScreen,
    Offers: PartsOffersScreen,
    contacts:PartShopContactScreen
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
        backgroundColor: "#11455F"
      }
    }
  }
);

export default createAppContainer(TabNavigator);
