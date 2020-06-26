import React, { Component } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  FlatList,
  AsyncStorage,
  InteractionManager,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import NavigationComponent from "../components/navigation/navigation";
import { colors } from "../themes";
import { data } from "../resources/constants/ServiceListConstants";
import ServiceListItem from "../components/services/ServiceListItem";
import NavigationService from "../NavigationService";
import * as authAction from "./../redux/actions/auth";
import * as serviceAction from "./../redux/actions/services";
import { getServices } from "./../redux/actions/home";
import __ from '../resources/copy';
import SimpleToast from 'react-native-simple-toast';
import Service from '../components/NewHomeScreen/Service';
import {IMG_PREFIX_URL} from '../config/constant';
import Service2 from '../components/NewHomeScreen/Service2';

class ServiceListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      serviceList: [
        {
          id: "",
          sorting: "",
          image: "",
          name: "",
          arabic_name: "",
          show_on_home: ""
        }
      ]
    };
    // this.services();
  }

  services() {
    serviceAction
      .serviceList()
      .then(res => {
        this.setState({ serviceList: res.services });
      })
      .catch(err => {
        console.log("error" + JSON.stringify(err));
      });
  }

  onServiceClick(itemId) {
    AsyncStorage.setItem("serviceId", itemId);
    // // debugger
    this.props.navigation.navigate("ServiceShopScreen" , {position:this.props.navigation.state.params.position, preferences: this.props.navigation.state.params.preferences});
  }

  componentDidMount() {
    // getServices();
    InteractionManager.runAfterInteractions(() => {
      getServices();
      this.services();
    });
    NetInfo.fetch().then(isConnected => {
			if (!isConnected) {
				SimpleToast.show('Not connected to internet', SimpleToast.BOTTOM)
			}
		})
  }
  render() {
    const data = this.props.services.services;
    return (
      <View style={styleServiceListScreen.container}>
        <StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>
        <NavigationComponent
            homeButton={false}
            navigation={this.props.navigation}
            goBack={() => NavigationService.goBack()}
          title={__('All Services' , this.props.language)}
          subTitle={__('Choose your preferred service' , this.props.language)}
        />
        <View style={styleServiceListScreen.listWrapper}>
          <FlatList
            data={this.state.serviceList}
            numColumns={2}
            columnWrapperStyle={{}}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item }) => (
                <Service2 onPress={() =>item.service_shop > 0 ? this.onServiceClick(item.id):null}
                          disable={item.service_shop <= 0}
                         language={this.props.language}
                         title={this.props.language.isArabic == true ? item.arabic_name : item.name } image={IMG_PREFIX_URL + item.image} />
            )}
          />
          <View></View>
        </View>
      </View>
    );
  }
}
mapStateToProps = state => {
  return {
    services: state.home.services,
    language: state.language,
  };
};
mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateUser: authAction.updateUser
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  null
)(ServiceListScreen);
const styleServiceListScreen = StyleSheet.create({
  container: { flex: 1 },
  listWrapper: {
    flex: 1
  }
});
