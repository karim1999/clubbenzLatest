import React, { Component } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  FlatList,
  AsyncStorage,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import NavigationComponent from "../components/navigation/navigation";
import { colors } from "../themes";
import { data } from "../resources/constants/ServiceListConstants";
import PartListItem from "../components/parts/PartListItem";
import NavigationService from "../NavigationService";
import * as authAction from "../redux/actions/auth";
import * as partAction from "../redux/actions/parts";
import { getServices } from "../redux/actions/home";
import __ from '../resources/copy';
import SimpleToast from 'react-native-simple-toast';

class PartListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      partList: [
        {
          id: "",
          image: "",
          name: ""
        }
      ]
    };
    this.parts();
  }

  parts() {
    partAction
      .partList()
      .then(res => {
        debugger
        while (this.state.partList.length > 0) {
          this.state.partList.pop();
        }
        for (i = 0; i < res.shops.length; i++) {
          var name = JSON.stringify(res.shops[i].title);
          name = name.replace(/"/g, "");
          var image = JSON.stringify(res.shops[i].image);
          image = image.replace(/"/g, "");
          var id = JSON.stringify(res.shops[i].id);
          id = id.replace(/"/g, "");
          const obj = {
            id: id,
            image: image,
            name: name
          };
          const newArray = this.state.partList.slice();
          newArray.push(obj);
          this.setState({ partList: newArray });
        }
      })
      .catch(err => {
        console.log("error" + JSON.stringify(err));
      });
  }

  onPartClick(itemId) {
    // alert('yes')
    AsyncStorage.setItem("partId", itemId);
    this.props.navigation.navigate("PartsDetailScreen");
  }

  componentDidMount() {
    getServices();
    NetInfo.fetch().then(isConnected => {
			if (!isConnected) {
				SimpleToast.show('Not connected to internet', SimpleToast.BOTTOM)
			}
		})
  }
  render() {
    const data = this.props.services.services;
    return (
      <View style={stylePartListScreen.container}>
        <StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>
        <NavigationComponent
            navigation={this.props.navigation}

            goBack={() => NavigationService.goBack()}
          title={__('All Services' , this.props.language)}
          subTitle={__('Choose your preferred service' , this.props.language)}
        />
        <View style={stylePartListScreen.listWrapper}>
          <FlatList
            data={this.state.partList}
            numColumns={3}
            columnWrapperStyle={{}}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item }) => (
              <PartListItem
                item={item}
                onPress={() => this.onPartClick(item.id)}
                language={this.props.language}
              />
            )}
          />
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
      updateUser: authAction.updateUser,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  null
)(PartListScreen);
const stylePartListScreen = StyleSheet.create({
  container: { flex: 1 },
  listWrapper: {
    flex: 1,
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    flexDirection: "row"
  }
});
