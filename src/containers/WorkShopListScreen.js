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
import ListCard from "../components/list/ListCard";
import NavigationService from "../NavigationService";
import FilterModal from "../components/modal/FilterModal";
const { height, width } = Dimensions.get("window");
import * as workshopAction from "./../redux/actions/workshops";
import __ from '../resources/copy';
import SimpleToast from 'react-native-simple-toast';

import { connect } from 'react-redux';
import { Fonts } from "../resources/constants/Fonts";
import * as partShopAction from "../redux/actions/partsShop";
import SecondHeader from "../components/NewHomeScreen/SecondHeader";
import Header from "../components/NewHomeScreen/Header";

class WorkShopListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      workshopList: [],
      totalWorkShops:0,
        showOverlay: false,
        showSorting: false,
        formBy: "distance",
        formType: "ASC",
        sortBy: "distance",
        sortType: "ASC"
    };
    // this.workshops(0, '');
      this.workshops(0, '', this.state.sortBy, this.state.sortType).then(res => {
          this.setState({
              workshopList: res
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

    workshops = (startIndex, searchKeyWord, sortBy, sortType) => {
        return workshopAction
            .workshopList(startIndex, searchKeyWord , this.props.navigation.state.params.position, sortBy, sortType)
            .then(res => {
                const shops = res.workshops.map(shop => {
                    return {

                        id: shop.id,
                        logo: shop.workshop_logo,
                        name: shop.name,
                        arabic_name: shop.arabic_name,
                        verified: true,
                        location: {lat:shop.location_lat, lon: shop.location_lon},
                        city:shop.city,
                        country:shop.country,
                        photo_selection_arround_rating:shop.photo_selection_arround_rating,
                        distance:shop.distance ? Math.round(shop.distance * 100) / 100  : 0 ,
                        avg_rating:shop.avg_rating ?Math.round(((shop.avg_rating))*10) / 10 :0,
                        isWorkshop: true
                    }
                });
                // let data = [...this.state.workshopList, ...shops];
                // this.setState({
                //     workshopList: searchKeyWord ? shops : data,
                //     totalWorkShops: res.total,
                //     startIndex
                // })
                // let data = [...this.state.partShopList, ...shops];
                this.setState({
                    totalWorkShops: res.total,
                    startIndex
                });
                return shops;
            })
            .catch(err => {
                console.log("error" + JSON.stringify(err));
            });
    }

    OpenNow = () => {
      this.setState({workshopList:[] ,  totalWorkShops:0 });
      this.workshops(0, '&shop_open=true');
    }
  onLoadMore() {
    // this.workshops(this.state.workshopList.length, '')
      this.workshops(this.state.workshopList.length, '', this.state.sortBy, this.state.sortType).then(res => {
          this.setState(prevState => ({workshopList: [...prevState.workshopList, ...res]}));
      });
  }

  onWorkshopClick(itemId) {
    AsyncStorage.setItem("workshopId", itemId);
    this.props.navigation.navigate("WorkshopDetailScreen" , {preferences:this.props.navigation.state.params.preferences, language: this.props.language} );
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
            <Text style={styles.tapButtonStyleTextBlue}>{__('Load more' , this.props.language)}</Text>
          </View>
        </TouchableOpacity>
      </View> : null
    );
  };

  onSearch = (text)=>{
      if (text) this.workshops(0, text)
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
      NavigationService.navigate('MapScreen', {markers , fromScreen:"workShop", preferences:this.props.navigation.state.params.preferences, position: this.props.navigation.state.params.position})
  }
    sortBy(type){
        this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
        this.setState({"sortBy": type}, () =>
            this.workshops(0, '', this.state.sortBy, this.state.sortType).then(res => {
                this.setState({workshopList: res})
            })
        );
    }
    sortType(type){
        this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
        this.setState({"sortType": type}, () =>
            this.workshops(0, '', this.state.sortBy, this.state.sortType).then(res => {
                this.setState({workshopList: res})
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
      <View style={styleWorkShopListScreen.container}>
        <StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>
          <Header
              navigation={this.props.navigation}
              homeButton={false}

              goBack={() => NavigationService.goBack()}
              title={__('Workshops' , this.props.language)}
              onSearch={this.onSearch}
              onMapPress={this.onMapPress}
              onSubmitEditing={this.onSearch}
          />
          <SecondHeader showOverlay={this.showOverlay.bind(this)} hideOverlay={this.hideOverlay.bind(this)} openNow={this.OpenNow} sortButton={this.sortButton.bind(this)} />
        {/*<ScrollView>*/}
          <FlatList
              ref={(ref) => { this.flatListRef = ref; }}
            data={this.state.workshopList}
            onEndReached={() => this.onLoadMore()}
            onEndReachedThreshold={.1}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item, index }) => (
              <ListCard
                key={index}
                item={item}
                index={index}
                onPress={() => this.onWorkshopClick(item.id)}
                fromScreen={"workShop"}
                preferences={this.props.navigation.state.params.preferences}
                language={this.props.language}
              />
            )}
            ListFooterComponent={this._renderFooter}
          />
          {this.state.showOverlay ? <View onPress={()=> this.setState({showOverlay: false, showSorting: false})} style={styleWorkShopListScreen.overlayLayer} /> : null}
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

mapStateToProps = (state) => {
	return {
		language: state.language,
	}
}

export default connect(mapStateToProps, null)(WorkShopListScreen)

const styleWorkShopListScreen = StyleSheet.create({
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
