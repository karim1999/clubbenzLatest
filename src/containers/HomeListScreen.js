import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
  AsyncStorage
} from "react-native";
import NavigationComponent from "../components/navigation/navWIthInput";
import { colors, styles } from "../themes";
import ListCard from "../components/list/ListCard";
import NavigationService from "../NavigationService";
import FilterModal from "../components/modal/FilterModal";
const { height, width } = Dimensions.get("window");
//need to comment
import * as workshopAction from "../redux/actions/workshops";
import { Fonts } from '../resources/constants/Fonts';

import * as homeAction from "../redux/actions/home";

import { connect } from 'react-redux';

class HomeListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      workshopList: [],
      totalWorkShops:0,
    };
    this.HomeSearchList(0, this.props.navigation.state.params.searchText);
  }

  componentWillUnmount() {
    // alert('unmounted')
  }

  HomeSearchList = (startIndex, searchKeyWord) => {
    homeAction
            .HomeSearchList(startIndex, searchKeyWord , this.props.navigation.state.params.position)
            .then(res => {

                const shops = res.map(shop => {

                  var img = '';

                  if (shop.workshop_logo) {
                    img = shop.workshop_logo;
                  }
                  else if (shop.service_logo_image) {
                    img = shop.service_logo_image;
                  }

                  return { 
                        id: shop.id,
                        logo: img,
                        name: shop.name,
                        arabic_name: shop.arabic_name,
                        verified: true,
                        location: {lat:shop.location_lat, lon: shop.location_lon},
                        city:shop.city,
                        country:shop.country,
                        photo_selection_arround_rating:shop.photo_selection_arround_rating,
                        distance:shop.distance ? Math.round(shop.distance * 100) / 100  : 0 ,
                        avg_rating:shop.avg_rating ?Math.round(((shop.avg_rating))*10) / 10 :0,
                        shop_type:shop.shop_type
                    }
                });
                let data = [...this.state.workshopList, ...shops];
                this.setState({
                    workshopList: searchKeyWord ? shops : data,
                    totalWorkShops: res.total,
                    startIndex
                })
            })
            .catch(err => {
                console.log("error" + JSON.stringify(err));
            });
    }
OpenNow = () => {
  this.setState({workshopList:[]});
  this.workshops(0, '&Shop_open=true');
}
  onLoadMore() {
    this.workshops(this.state.workshopList.length, '')
  }

  onWorkshopClick(itemId , shop_type) {

    // alert(itemId + shop_type);
    if(shop_type === "workshop"){

      AsyncStorage.setItem("workshopId", itemId);
      this.props.navigation.navigate("WorkshopDetailScreen" , {preferences:this.props.navigation.state.params.preferences, language: this.props.language} );

    }else if (shop_type === "service_shop"){
      // debugger
      AsyncStorage.setItem("serviceShopId", itemId);
      this.props.navigation.navigate("ServicesDetailScreen" , {preferences:this.props.navigation.state.params.preferences, language: this.props.language} );

    }else{

      AsyncStorage.setItem("partShopId", itemId);
      this.props.navigation.navigate("PartShopDetailScreen" , {preferences:this.props.navigation.state.params.preferences, language: this.props.language});

    }
   

  }

  _renderFooter = () => {
    return (
        this.state.workshopList.length < this.state.totalWorkShops ?
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginVertical: height * 0.02
        }}
      >
        <TouchableOpacity onPress={() => this.onLoadMore()}>
          <View
            style={[
              styles.tapableButton,
              {
                paddingHorizontal: width * 0.3,
                backgroundColor: "transparent",
                borderColor: colors.blueText,
                borderWidth: 1
              }
            ]}
          >
            <Text style={styles.tapButtonStyleTextBlue}>Load more</Text>
          </View>
        </TouchableOpacity>
      </View> : null
    );
  };

  onSearch = (text)=>{
      this.setState({workshopList:[]});
      if (text)  this.HomeSearchList(0, text);
  }

  onMapPress = ()=>{
    var index = 0;
      const markers = this.state.workshopList.map(shop=>{
          return {
              title: shop.name,
              latitude: shop.location.lat,
              longitude: shop.location.lon,
              id:shop.id,
              ...shop,
              index:index++
          }
      })
      NavigationService.navigate('MapScreen', {markers , preferences:this.props.navigation.state.params.preferences})
  }


  render() {
    return (
      <View style={styleHomeListScreen.container}>
        <StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>
        <NavigationComponent
            navigation={this.props.navigation}

            goBack={() => NavigationService.goBack()}
          placeholder={this.props.navigation.state.params.searchText}
          onSearch={this.onSearch}
          onSubmitEditing={this.onSearch}
          showText={true}
          // onMapPress={this.onMapPress}
        />
        <ScrollView>
          {
            this.state.workshopList.length > 0 ?
          <FlatList
            data={this.state.workshopList}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item, index }) => (
              <ListCard
                key={index}
                item={item}
                index={index}
                onPress={() => this.onWorkshopClick(item.id , item.shop_type)}
                fromScreen={"workShop"}
                preferences={this.props.navigation.state.params.preferences}
                language={this.props.language}
              />
            )}
            ListFooterComponent={this._renderFooter}
          /> : <Text style={styleHomeListScreen.placeholder}>No Shops found</Text>
            }
        </ScrollView>
        <Modal
          visible={this.state.modalVisible}
          animationType="fade"
          onRequestClose={() => this.setState({ modalVisible: false })}
          transparent
        >
          <FilterModal
            onCancel={() => this.setState({ modalVisible: false })}
          />
        </Modal>
      </View>
    );
  }
}

mapStateToProps = (state) => {
	return {
		language: state.language,
	}
}
export default connect(mapStateToProps, null)(HomeListScreen)

const styleHomeListScreen = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e1e4e6" },
  secondHeader: {
    height: height * 0.07,
    flexDirection: "row",
    backgroundColor: "#cad0d4",
    borderBottomEndRadius: width * 0.04,
    borderBottomStartRadius: width * 0.04,
    alignItems: "center",
    top: -5,
    zIndex: -1
  },
  button: {
    borderWidth: 1,
    borderColor: "#717171",
    height: height * 0.04,
    justifyContent: "center",
    paddingHorizontal: width * 0.02,
    borderRadius: width * 0.05,
    marginLeft: width * 0.03
  },
  buttonText: {
    color: "#717171",
    // fontWeight: "bold"
  },
  placeholder:{
    alignSelf : "center",
    marginTop: 30,
    width: 200,
    fontSize:17,
    fontFamily: Fonts.CircularBold,
    textAlign: 'center'
  }
});
