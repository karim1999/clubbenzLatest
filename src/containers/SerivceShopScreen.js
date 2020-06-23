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
  AsyncStorage,
  InteractionManager, Image,
} from "react-native";
import NavigationComponent from "../components/navigation/navWIthInput";
import { colors, styles } from "../themes";
import ServiceListCard from "../components/list/ServiceListCard";
import NavigationService from "../NavigationService";
import FilterModal from "../components/modal/FilterModal";

import * as serviceAction from "./../redux/actions/services";
import { Fonts } from '../resources/constants/Fonts';

import { connect } from "react-redux";
import __ from '../resources/copy';
import {Marker} from "react-native-maps";
import * as partShopAction from "../redux/actions/partsShop";
import SecondHeader from "../components/NewHomeScreen/SecondHeader";
import Header from "../components/NewHomeScreen/Header";

const { height, width } = Dimensions.get("window");
class ServiceShopScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      serviceShopList: [],
      totalServiceShops:0,
      showSorting: false,
      sortBy: "distance",
      sortType: "ASC",
      showOverlay: false,
      formBy: "distance",
      formType: "ASC",
      search: "",
      isSearching: false

    };
    // this.serviceShop(0, '');
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      // this.serviceShop(0, '');
      this.serviceShop(0, '', this.state.sortBy, this.state.sortType).then(res => {
        this.setState({
          serviceShopList: res
        });
      });
    });
  }

  serviceShop(startIndex, searchKeyword, sortBy, sortType) {
    return serviceAction
      .serviceShop(startIndex, searchKeyword ,this.props.navigation.state.params.position, sortBy, sortType)
      .then(res => {
        const shops = res.shops.map(shop => {
          return {
            id: shop.id,
            logo: shop.service_logo_image,
            name: shop.name,
            arabic_name: shop.arabic_name,
            verified: true,
            location: {lat:shop.location_latitude, lon: shop.location_longitude},
            created_date:shop.created_date = "0000-00-00" ? "2019-01-01" :shop.created_date,
            photo_selection_arround_rating:shop.rating_image,
            city:shop.city,
            country:shop.country,
            distance:shop.distance ? Math.round(shop.distance * 100) / 100  : 0 ,
            avg_rating:shop.avg_rating ? Math.round(shop.avg_rating * 10) / 10  : 0 ,

          }
        });
        // let data = [...this.state.serviceShopList, ...shops];
        // this.setState({
        //   serviceShopList: searchKeyword ? shops : data,
        //   totalServiceShops: res.total,
        //   startIndex
        // });
        this.setState({
          totalServiceShops: res.total,
          startIndex
        });
        return shops;
      })
      .catch(err => {
        console.log("error" + JSON.stringify(err));
      });
  }

  onServiceShopClick(itemId) {
    // alert(itemId)
    AsyncStorage.setItem("serviceShopId", itemId);
    this.props.navigation.navigate("ServicesDetailScreen" , {preferences:this.props.navigation.state.params.preferences, language: this.props.language});
  }

  onLoadMore() {
    // this.serviceShop(this.state.serviceShopList.length, '')
    this.serviceShop(this.state.serviceShopList.length, this.state.isSearching != "" ? this.state.search : '', this.state.sortBy, this.state.sortType).then(res => {
      this.setState(prevState => ({serviceShopList: [...prevState.serviceShopList, ...res]}));
    });
  }

  _renderFooter = () => {
    return (
        this.state.serviceShopList.length < this.state.totalServiceShops ?
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
            <Text style={styles.tapButtonStyleTextBlue}>{__('Load more' , this.props.language)}</Text>
          </View>
        </TouchableOpacity>
      </View> : null
    );
  };

  onSearch = (text)=>{
    this.setState({search: text, isSearching: true})
    if(this.flatListRef)
      this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    this.serviceShop(0,text, this.state.sortBy, this.state.sortType).then(res => {
      this.setState({serviceShopList: res})
    })
  }
  OpenNow = () => {
    if(this.flatListRef)
      this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    this.serviceShop(0,'&shop_open=true', this.state.sortBy, this.state.sortType).then(res => {
      this.setState({serviceShopList: res})
    })
  }
  onMapPress = ()=>{
    var index = 0;
    const markers = this.state.serviceShopList.map(shop=>{
      return {
        title: shop.name,
        latitude: shop.location.lat,
        longitude: shop.location.lon,
        id:shop.id,
        ...shop,
        index:index++
      }
    })
    NavigationService.navigate('MapScreen', {markers , fromScreen:'serviceShop', position: this.props.navigation.state.params.position})
  }
  sortBy(type){
    if(this.flatListRef)
      this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    this.setState({"sortBy": type}, () =>
        this.serviceShop(0, '', this.state.sortBy, this.state.sortType).then(res => {
          this.setState({serviceShopList: res})
        })
    );
  }
  sortType(type){
    if(this.flatListRef)
      this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    this.setState({"sortType": type}, () =>
        this.serviceShop(0, '', this.state.sortBy, this.state.sortType).then(res => {
          this.setState({serviceShopList: res})
        })
    );
  }
  sortButton(formBy, formType){
    // alert(formBy, formType)
    this.setState({showOverlay: false, showSorting: false, sortBy: formBy, sortType: formType}, () => {
      this.sortBy(this.state.sortBy)
    })
  }
  showOverlay(){
    this.setState({showOverlay: true})
  }
  hideOverlay(){
    this.setState({showOverlay: false})
  }

  render() {
    return (
      <View style={styleServiceShopScreen.container}>
        <StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>
        <Header
            navigation={this.props.navigation}
            homeButton={true}
            goBack={() => NavigationService.goBack()}
            title="Services Shop"
            onSearch={this.onSearch}
            onMapPress={this.onMapPress}
            onSubmitEditing={this.onSearch}
        />

        <SecondHeader showOverlay={this.showOverlay.bind(this)} hideOverlay={this.hideOverlay.bind(this)} openNow={this.OpenNow} sortButton={this.sortButton.bind(this)} />

        {/*<ScrollView>*/}
          {this.state.serviceShopList &&  this.state.serviceShopList.length> 0 ?
            <FlatList
                ref={(ref) => { this.flatListRef = ref; }}
              data={this.state.serviceShopList}
              onEndReached={() => this.onLoadMore()}
              onEndReachedThreshold={.1}
              keyExtractor={(item, index) => item.id}
              renderItem={({ item, index }) => (
                  <ServiceListCard
                      item={item}
                      index={index}
                      onPress={() => this.onServiceShopClick(item.id)}
                      language={this.props.language}
                      preferences={this.props.navigation.state.params.preferences}
                      // onPress={() =>
                      //   this.props.navigation.navigate("ServicesDetailScreen")
                      // }
                  />
              )}
              ListFooterComponent={this._renderFooter}
            /> : <Text style={styleServiceShopScreen.placeholder}>No Service Shops found</Text>
          }
        {this.state.showOverlay ? <View onPress={()=> this.setState({showOverlay: false, showSorting: false})} style={styleServiceShopScreen.overlayLayer} /> : null}

        {/*</ScrollView>*/}
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

mapStateToProps = state => {
  return {
    language: state.language,
  };
};

export default connect(mapStateToProps, null)(ServiceShopScreen);

const styleServiceShopScreen = StyleSheet.create({
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
//   width: 100,
    justifyContent: "center",
    paddingHorizontal: width * 0.02,
    marginLeft: width * 0.03,
  },
  buttonText: {
    color: "#717171",
    fontFamily: Fonts.CircularBold,
    borderWidth: 1,
    borderColor: "#717171",
    borderRadius: width * 0.05,
    alignSelf: "flex-start",
    padding: 7,
    paddingLeft: 10,
    paddingRight: 10
  },
  placeholder:{
    alignSelf : "center",
    marginTop: 30,
    width: 200,
    fontSize:17,
    fontFamily: Fonts.CircularBold,
  },
  activeButtonText: {
    backgroundColor: "#e1e4e6"
  },
  overlayLayer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(47,51,54,0.22)',
  },

});
