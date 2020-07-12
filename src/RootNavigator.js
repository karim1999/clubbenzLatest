import React, { Component } from "react";
import { View, Dimensions, I18nManager } from "react-native";
import { connect } from "react-redux";
import {
  createAppContainer
} from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import NavigationService from "./NavigationService";
import HowToScreen from "./containers/HowToScreen";
import SplashScreen from "./containers/SplashScreen";
import LanguageScreen from "./containers/LanguageScreen";
import LoginScreen from "./containers/LoginScreen";
import RegisterScreen from "./containers/RegisterScreen";
import ForgotPasswordScreen from "./containers/ForgotPasswordScreen";
import EnableNotificationScreen from "./containers/EnableNotificationScreen";
import CarSelectionScreen from "./containers/CarSelectionScreen";
import HomeScreen from "./containers/NewHomeScreen";
import WorkshopDetailScreen from "./containers/WorkshopDetailScreen";
import ServiceListScreen from "./containers/ServiceListScreen";
import PartListScreen from "./containers/PartsListScreen";
import WorkShopListScreen from "./containers/WorkShopListScreen";

import HomeListScreen from "./containers/HomeListScreen";

import PartsDetailScreen from "./containers/PartsDetailScreen";
import ServicesDetailScreen from "./containers/ServicesDetailScreen";
import CarPartsScreen from "./containers/CarPartsScreen";
import CategoriesScreen from "./containers/CategoriesScreen";
import MapScreen from "./containers/MapScreen";
import MyProfileScreen from "./containers/MyProfileScreen";

import PartShopScreen from "./containers/PartShopScreen";
import PartShopDetailScreen from "./containers/PartShopDetailScreen";
import CategoryListScreen from "./containers/CategoryListScreen";
import DetailScreen from "./containers/DetailScreen";
import SearchScreen from "./containers/SearchScreen";
import SpecificationScreen from "./containers/SpecificationScreen";
import NotificationScreen from "./containers/NotificationScreen";
import BookingScreen from "./containers/BookingScreen";
import ThanksScreen from "./containers/ThanksScreen";


import ItemsScreen from "./containers/ItemsScreen";
import ScanVinNumberScreen from "./containers/ScanVinNumberScreen";
import LocateVinNumberScreen from "./containers/LocateVinNumberScreen";
import ClusterErrorScreen from "./containers/ClusterErrorScreen";

import ClusterErrorSolutionsScreen from "./containers/ClusterErrorSolutionsScreen";
import SlideMenuScreen from "./components/SlideMenu/SlideMenuScreen";
import ClubScreen from "./containers/ClubScreen";
import ServiceShopScreen from "./containers/SerivceShopScreen";
import CarGuideScreen from "./containers/CarGuideScreen";
import LoadingIndicator from "./../src/components/common/loadingIndicator";
import GiveReviewScreen from "./containers/GiveReviewScreen";
import ForgotPassScreen from "./containers/ForgotPassScreen";

import PasswordResetScreen from "./containers/PasswordResetScreen";

import PartSearchListScreen from './containers/PartSearchListScreen';

import ProviderScreen from './containers/ProviderScreen'
import FavoritesScreen from "./containers/FavoritesScreen";
import MembershipsScreen from "./containers/MembershipsScreen";
import SubscribeScreen from "./containers/SubscribeScreen";
import MembershipAddress from './containers/MembershipAddress';
import MembershipsThanksScreen from './containers/MembershipsThanksScreen';
const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Parts: {
      screen: CarPartsScreen
    },
    CarGuide: {
      screen: CarGuideScreen
    },
    ClubScreen: {
      screen: ClubScreen
    },
    NotificationScreen: {
      screen: NotificationScreen
    },
    BookingScreen: {
      screen: BookingScreen
    },
    FavoritesScreen: {
      screen: FavoritesScreen
    },
  },
  {
    contentComponent: SlideMenuScreen,
    drawerPosition: I18nManager.isRTL ?'right':'left',
    drawerWidth: Dimensions.get("window").width,
    navigationOptions: {
      header: null
    }
  }
);

const TopLevelNavigator = createStackNavigator({
  Splash: {
    screen: SplashScreen,
    navigationOptions: {
      header: null
    }
  },
  LanguageScreen: {
    screen: LanguageScreen,
    navigationOptions: {
      header: null
    }
  },
  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: {
      header: null
    }
  },
  RegisterScreen: {
    screen: RegisterScreen,
    navigationOptions: {
      header: null
    }
  },
  HowToScreen: {
    screen: HowToScreen,
    navigationOptions: {
      header: null
    }
  },
  ForgotPasswordScreen: {
    screen: ForgotPasswordScreen,
    navigationOptions: {
      header: null
    }
  },
  ForgotPassScreen: {
    screen: ForgotPassScreen,
    navigationOptions: {
      header: null
    }
  },
  PasswordResetScreen: {
    screen: PasswordResetScreen,
    navigationOptions: {
      header: null
    }
  },
  PartSearchListScreen: {
    screen: PartSearchListScreen,
    navigationOptions: {
      header: null
    }
  },
  EnableNotificationScreen: {
    screen: EnableNotificationScreen,
    navigationOptions: {
      header: null
    }
  },
  HomeScreen: DrawerNavigator,
  WorkshopDetailScreen: {
    // done
    screen: WorkshopDetailScreen,
    navigationOptions: {
      header: null
    }
  },
  PartsDetailScreen: {
    // done
    screen: PartsDetailScreen,
    navigationOptions: {
      header: null
    }
  },
  ServicesDetailScreen: {
    // done
    screen: ServicesDetailScreen,
    navigationOptions: {
      header: null
    }
  },
  ServiceListScreen: {
    // done
    screen: ServiceListScreen,
    navigationOptions: {
      header: null
    }
  },
  PartListScreen: {
    // done
    screen: PartListScreen,
    navigationOptions: {
      header: null
    }
  },
  WorkShopListScreen: {
    // done
    screen: WorkShopListScreen,
    navigationOptions: {
      header: null
    }
  },
  HomeListScreen: {
    // done
    screen: HomeListScreen,
    navigationOptions: {
      header: null
    }
  },
  PartShopScreen: {
    // done
    screen: PartShopScreen,
    navigationOptions: {
      header: null
    }
  },
  PartShopDetailScreen: {
    // done
    screen: PartShopDetailScreen,
    navigationOptions: {
      header: null
    }
  },
  MyProfileScreen: {
    // done
    screen: MyProfileScreen,
    navigationOptions: {
      header: null
    }
  },
  MapScreen: {
    screen: MapScreen,
    navigationOptions: {
      header: null
    }
  },
  CategoryListScreen: {
    screen: CategoryListScreen,
    navigationOptions: {
      header: null
    }
  },
  ProviderScreen: {
    screen: ProviderScreen,
    navigationOptions: {
      header: null
    }
  },
  SearchScreen: {
    screen: SearchScreen,
    navigationOptions: {
      header: null
    }
  },
  DetailScreen: {
    screen: DetailScreen,
    navigationOptions: {
      header: null
    }
  },
  ScanVinNumberScreen: {
    screen: ScanVinNumberScreen,
    navigationOptions: {
      header: null
    }
  },
  LocateVinNumberScreen: {
    screen: LocateVinNumberScreen,
    navigationOptions: {
      header: null
    }
  },
  CarSelectionScreen: {
    screen: CarSelectionScreen,
    navigationOptions: {
      header: null
    }
  },
  ItemsScreen: {
    screen: ItemsScreen,
    navigationOptions: {
      header: null
    }
  },
  SpecificationScreen: {
    screen: SpecificationScreen,
    navigationOptions: {
      header: null
    }
  },
  NotificationScreen: {
    screen: NotificationScreen,
    navigationOptions: {
      header: null
    }
  },

  BookingScreen: {
    screen: BookingScreen,
    navigationOptions: {
      header: null
    }
  },

  ThanksScreen: {
    screen: ThanksScreen,
    navigationOptions: {
      header: null
    }
  },
  MembershipsThanksScreen: {
    screen: MembershipsThanksScreen,
    navigationOptions: {
      header: null
    }
  },
    CategoriesScreen: {
      screen: CategoriesScreen,
      navigationOptions: {
      header: null
    }
    },
  ClusterErrorScreen: {
    screen: ClusterErrorScreen,
    navigationOptions: {
      header: null
    }
  },
  ServiceShopScreen: {
    // done
    screen: ServiceShopScreen,
    navigationOptions: {
      header: null
    }
  },
  ClusterErrorSolutionsScreen: {
    screen: ClusterErrorSolutionsScreen,
    navigationOptions: {
      header: null
    }
  },
  SideMenu: {
    screen: SlideMenuScreen,
    navigationOptions: {
      header: null
    }
  },
  GiveReviewScreen:{
    screen: GiveReviewScreen,
    navigationOptions:{
      header:null
    }
  },
  MembershipsScreen: {
    screen: MembershipsScreen,
    navigationOptions:{
      header:null
    }
  },
  MembershipAddress: {
    screen: MembershipAddress,
    navigationOptions:{
      header:null
    }
  },
  SubscribeScreen: {
    screen: SubscribeScreen,
    navigationOptions:{
      header:null
    }
  },

});

const AppContainer = createAppContainer(TopLevelNavigator);

const RootNavigator = props => {
  return (
    <View style={{ flex: 1 }}>
      <LoadingIndicator />
      <AppContainer
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    </View>
  );
};

mapStateToProps = state => {
  return {
    is_loading_indicator: state.init.is_loading_indicator
  };
};

export default connect(
  mapStateToProps,
  null
)(RootNavigator);
