import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
import { colors, metrics } from './themes';

const { height, width } = Dimensions.get("window");

import WorkshopInfoScreen from "./containers/WorkshopInfoScreen";
import WorkshopContactScreen from "./containers/WorkshopContactScreen";
import WorkshopReviewsScreen from "./containers/WorkshopReviewsScreen";
import WorkshopBooknowScreen from "./containers/WorkshopBooknowScreen";
import WorkshopOffersScreen from "./containers/WorkshopOffersScreen";
import { Fonts } from "./resources/constants/Fonts";
import ServicesContactScreen from "./containers/ServicesContactScreen";

// import { connect } from 'react-redux';

// import __ from '../src/resources/copy';

// const Info = __('Info' , props.language);



const ShopTabNavigatorWithoutBooking = createMaterialTopTabNavigator({

    Info : WorkshopInfoScreen,
    reviews: WorkshopReviewsScreen,
    Offers: WorkshopOffersScreen,
    contacts:WorkshopContactScreen

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
            // fontSize: metrics.deviceWidth * 0.035,
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

// mapStateToProps = (state) => {
//     return {
//         language: state.language,
//     }
// }

// class HelperClass extends Component {
//     constructor(props) {

//     }
//     render() {

//     }
// }

// export default connect(mapStateToProps, null)(createAppContainer(TabNavigator));
export default createAppContainer(ShopTabNavigatorWithoutBooking);
