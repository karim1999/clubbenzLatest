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
  Image
} from "react-native";
import NetInfo from "@react-native-community/netinfo";

import NavigationComponent from "../components/navigation/navWIthInput";
import { colors, styles } from "../themes";
import { list } from "../resources/constants/ShopListConstant";
import ListCard from "../components/list/ListCard";
import NavigationService from "../NavigationService";
import FilterModal from "../components/modal/FilterModal";
import * as partShopAction from "./../redux/actions/partsShop";
import PartShopListItem from "../components/partShops/PartShopListItem";
import { Fonts } from '../resources/constants/Fonts';
import __ from '../resources/copy';
import SimpleToast from 'react-native-simple-toast';

import { connect } from 'react-redux';
import Header from "../components/NewHomeScreen/Header";
import Icon from "react-native-vector-icons/FontAwesome";
import SecondHeader from "../components/NewHomeScreen/SecondHeader";

const { height, width } = Dimensions.get("window");
class PartShopScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      partShopList: [],
      totalPartShops:0,
      showSorting: false,
      sortBy: "distance",
      sortType: "ASC",
      showOverlay: false,
      formBy: "distance",
      formType: "ASC"
    };
    this.partShop(0, '', this.state.sortBy, this.state.sortType).then(res => {
      this.setState({
        partShopList: res
      });
    });
  }

  componentDidMount() {
    NetInfo.fetch().then(isConnected => {
			if (!isConnected) {
				SimpleToast.show('Not connected to internet', SimpleToast.BOTTOM)
			}
		})
  }

  partShop(startIndex, searchKeyword, sortBy, sortType) {
    return partShopAction
      .partShopList(startIndex,searchKeyword , this.props.navigation.state.params.position, sortBy, sortType)
      .then(res => {
        debugger
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
            distance:shop.distance ?Math.round(shop.distance * 100) / 100  : 0 ,
            avg_rating: shop.avg_rating ? Math.round(shop.avg_rating , 1):0.0,
          }
        });
        // let data = [...this.state.partShopList, ...shops];
        this.setState({
          // partShopList: searchKeyword ? shops : data,
          totalPartShops: res.total,
          startIndex
        });
        return shops;
      })
      .catch(err => {
        console.log("error" + JSON.stringify(err));
      });
  }

  onLoadMore() {
    this.partShop(this.state.partShopList.length, '', this.state.sortBy, this.state.sortType).then(res => {
      this.setState(prevState => ({partShopList: [...prevState.partShopList, ...res]}));
    });
  }

  onSearch = (text)=>{
    this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    this.partShop(0, text, this.state.sortBy, this.state.sortType).then(res => {
      this.setState({partShopList: res})
    })
  }
  OpenNow = () => {
    this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    this.setState({partShopList:[] ,  totalPartShops:0,}, () =>
        this.partShop(0, '&shop_open=true', this.state.sortBy, this.state.sortType).then(res => {
          this.setState({partShopList: res})
        })
    );
  }

  onPartShopClick(itemId) {
    AsyncStorage.setItem("partShopId", itemId);
    this.props.navigation.navigate("PartShopDetailScreen" , {preferences:this.props.navigation.state.params.preferences, language: this.props.language});
  }

  _renderFooter = () => {
    return (
        this.state.partShopList.length < this.state.totalPartShops ?
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

  onMapPress = ()=>{
    var index = 0;
    const markers = this.state.partShopList.map(shop=>{
      return {
        title: shop.name,
        latitude: shop.location.lat,
        longitude: shop.location.lon,
        id:shop.id,
        ...shop,
        index:index++
      }
    })
    NavigationService.navigate('MapScreen', {markers ,fromScreen:"partShop" , preferences:this.props.navigation.state.params.preferences, position: this.props.navigation.state.params.position})
  }

  sortBy(type){
    this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    this.setState({"sortBy": type}, () =>
        this.partShop(0, '', this.state.sortBy, this.state.sortType).then(res => {
          this.setState({partShopList: res})
        })
    );
  }
  sortType(type){
    this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    this.setState({"sortType": type}, () =>
        this.partShop(0, '', this.state.sortBy, this.state.sortType).then(res => {
          this.setState({partShopList: res})
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
      <View style={stylePartShopScreen.container}>
        <StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>
        <Header
            navigation={this.props.navigation}
            homeButton={false}

            goBack={() => NavigationService.goBack()}
          placeholder='Try a common Name to Access'
          title={__('Part shops' , this.props.language)}
            onSearch={this.onSearch}
          onMapPress={this.onMapPress}
          onSubmitEditing={this.onSearch}
        />
        <SecondHeader showOverlay={this.showOverlay.bind(this)} hideOverlay={this.hideOverlay.bind(this)} openNow={this.OpenNow} sortButton={this.sortButton.bind(this)} />

        {/*<ScrollView>*/}
          <FlatList
            ref={(ref) => { this.flatListRef = ref; }}
            data={this.state.partShopList}
            keyExtractor={(item, index) => item.id}
            onEndReached={() => this.onLoadMore()}
            onEndReachedThreshold={.1}
            renderItem={({ item, index }) => (
              <ListCard
                key={index}
                item={item}
                index={index}
                fromScreen={"partShop"}
                preferences={this.props.navigation.state.params.preferences}
                language={this.props.language}
                onPress={() => this.onPartShopClick(item.id)}
              />
            )}
            ListFooterComponent={this._renderFooter}
          />
        {/*</ScrollView>*/}
        {this.state.showOverlay ? <View onPress={()=> this.setState({showOverlay: false, showSorting: false})} style={stylePartShopScreen.overlayLayer} /> : null}

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

export default connect(mapStateToProps, null)(PartShopScreen)

const stylePartShopScreen = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e1e4e6" },
  secondHeader: {
    height: 80,
    flexDirection: "row",
    backgroundColor: "white",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingBottom: 15,
    top: -5,
    zIndex: -1,
    marginTop: 100
  },
  button: {
//   width: 100,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: width * 0.02,
    marginLeft: width * 0.03,
    marginRight: width * 0.03,
  },
  button2: {
//   width: 100,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: width * 0.02,
    marginLeft: width * 0.03,
    marginRight: width * 0.03,
  },
  sortingText: {
    fontSize: 15,
    color: "black"
  },
  buttonText: {
    color: "#717171",
    fontFamily: Fonts.CircularBold,
    // borderWidth: 1,
    // borderColor: "#717171",
    // borderRadius: width * 0.05,
    alignSelf: "flex-start",
    padding: 7,
    paddingLeft: 10,
    paddingRight: 10
  },
  activeButtonText: {
    backgroundColor: "#e1e4e6"
  },
  sortingButton: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 50,
    paddingRight: 50,
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: "#0b2052",
    color: "white"
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
