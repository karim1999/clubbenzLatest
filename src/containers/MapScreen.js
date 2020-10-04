import React, { Component } from 'react';
import { Text, View, StyleSheet , StatusBar , AsyncStorage , Image  , FlatList , Dimensions ,PermissionsAndroid , TouchableOpacity, Platform} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { colors , metrics} from '../themes';
import NavigationComponent from '../components/navigation/mapNavigation';
import MapListCard from "../components/list/MapListCard";
const { width, height  } = Dimensions.get('window');
import Geolocation from 'react-native-geolocation-service';
import __ from '../resources/copy';
import { connect } from 'react-redux';

import { Fonts } from "../resources/constants/Fonts";
import * as partShopAction from "./../redux/actions/partsShop";
import * as workshopAction from "./../redux/actions/workshops";
import * as serviceAction from "./../redux/actions/services";

const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;

// const descelectedMarker = require('../resources/icons/ic_pin.png');
const selectedMarker = require('../resources/icons/ic_pin_selected.png');
const descelectedMarker = require('../resources/icons/ic_pin.png');

var selectedMarkerIndex = -1;

const ITEM_HEIGHT = 80;

class MapScreen extends Component {

	constructor(props) {
		super(props)
		this.mapRef = null;
		const {navigation} = this.props;
		var i = -1 ;
		const data = navigation.getParam('markers', [])
		const position = navigation.getParam('position', 0);
		// alert(JSON.stringify(data[0]))
		const markers_render = data.map(marker => {
		
		const self = this;
			return (
				
				<Marker
					key = {marker.index}
					coordinate={{latitude: parseFloat(marker.latitude), longitude: parseFloat(marker.longitude)}}
					title={this.props.language.isArabic == true ? marker.arabic_name : marker.name}
					description={this.props.language.isArabic == true ? marker.arabic_name : marker.name}
					onCalloutPress={()=>this.scrollToIndex(marker.index)}
					onPress={() => {
						this.scrollToIndex(marker.index)
						}
					}
				>
					<Image style={{ width: 24, height: 31 }} source={descelectedMarker}/>
				</Marker>
			)
		})

		this.state = {
			markers_render,
			lat: 0.0,
			long: 0.0,
			selectedMarkerIndex: -1,
			workshopList: [],
			totalWorkShops: 0,
			serviceShopList: [],
			totalServiceShops: 0,
			partShopList: [],
			totalPartShops: 0,
			data: data,
			position: position,
		}

		let currentLocation;
		if(data[0]){
			currentLocation = {
				latitude: this.props.user.enableLocation == 'true' ? Number(data[0].latitude) : 0,
				longitude: this.props.user.enableLocation == 'true' ? Number(data[0].longitude) : 0,
				latitudeDelta: 0.003,
				longitudeDelta: 0.003 * ASPECT_RATIO
			  }
		}

			//this._map.animateToCoordinate(tempCoords, 1);
			if (this.props.user.enableLocation == 'true') {
				this.mapView && this.mapView.animateToRegion(currentLocation, 1300); 
			}
			this.onPressCurrentLocation();
	}

	onPressMarker = (index) => {
		// alert(index)
		selectedMarkerIndex = index
		this.setState({markers_render: [], selectedMarkerIndex: index})
		this.renderMarkersOnMap(this.state.data)
	}

	onPressCurrentLocation = async () => {

		if (this.props.user.enableLocation == 'true') {

			if (Platform.OS == 'android') {

		const granted = await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
			{
			  title: "Clubenz Location Permission",
			  message:
				"Clubenz needs access to your Location " +
				"to locate the nearest shops."
			}
		  );
		  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			Geolocation.getCurrentPosition(
				(position) => {
					let currentLocation = {
						latitude: Number(position.coords.latitude),
						longitude: Number(position.coords.longitude),
						latitudeDelta: 0.003,
						longitudeDelta: 0.003 * ASPECT_RATIO
						}
						// displaying marker on current location
						if (this.props.user.enableLocation == 'true') {
							this.setState({
								lat: currentLocation.latitude, 
								long: currentLocation.longitude
							})
						} else {
							this.setState({
								lat: 0, 
								long: 0
							})
						}

						//this._map.animateToCoordinate(tempCoords, 1);
						
						// temporarily commenting
						if (this.props.user.enableLocation == 'true') {
							this.mapView && this.mapView.animateToRegion(currentLocation, 1300);
						}
			},
				(error) => {
				
				},
				{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
			);


			
		  } else {
			    //  alert(granted);
			}
		} else {
			// sample testing
			// let currentLocation = {
			// 	latitude: 31.450775499999995,
			// 	longitude: 74.251383,
			// 	latitudeDelta: 0.003,
			// 	longitudeDelta: 0.003 * ASPECT_RATIO
			// 	}
			// 	debugger
			// 	this.mapView && this.mapView.animateToRegion(currentLocation, 1300);

				Geolocation.getCurrentPosition(
					(position) => {
						let currentLocation = {
							latitude: Number(position.coords.latitude),
							longitude: Number(position.coords.longitude),
							latitudeDelta: 0.003,
							longitudeDelta: 0.003 * ASPECT_RATIO
							}
							// displaying marker on current location
							if (this.props.user.enableLocation == 'true') {
								this.setState({
									lat: currentLocation.latitude, 
									long: currentLocation.longitude
								})
							} else {
								this.setState({
									lat: 0, 
									long: 0
								})
							}
	
							//this._map.animateToCoordinate(tempCoords, 1);
							
							// temporarily commenting
							if (this.props.user.enableLocation == 'true') {
								this.mapView && this.mapView.animateToRegion(currentLocation, 1300);
							}
				},
					(error) => {
					
					},
					{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
				);

		}
	}
	}
	onWorkshopClick(itemId) {
		if(this.props.navigation.state.params.fromScreen == "partShop"){
			AsyncStorage.setItem("partShopId", itemId);
			this.props.navigation.navigate("PartShopDetailScreen", {preferences:[]});
		}else if(this.props.navigation.state.params.fromScreen == "serviceShop"){
			AsyncStorage.setItem("serviceShopId", itemId);
			this.props.navigation.navigate("ServicesDetailScreen" ,{preferences:[]});
		}
		else{
			AsyncStorage.setItem("workshopId", itemId);
			this.props.navigation.navigate("WorkshopDetailScreen" , {preferences:[]});
		}
		
	  }
	
		scrollToIndex = (index) => {
			let randomIndex = index;
			// alert(index)
			this.flatListRef.scrollToIndex({animated: true, index: randomIndex});
			this.onPressMarker(randomIndex)
		}

		// for workshops

		workshops = (startIndex, searchKeyWord) => {
			workshopAction
					.workshopList(startIndex, searchKeyWord , this.state.position)
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
									}
							});
							let data = [...this.state.workshopList, ...shops];
							this.setState({
									workshopList: shops,
									totalWorkShops: res.total,
							})
							const markers = this.workShopMarkers();
							this.renderMarkersOnMap(markers)
					})
					.catch(err => {
							console.log("error" + JSON.stringify(err));
					});

	}

	// for partshops

	partShop(startIndex, searchKeyword) {
    partShopAction
      .partShopList(startIndex,searchKeyword , this.state.position)
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
            distance:shop.distance ?Math.round(shop.distance * 100) / 100  : 0 ,
            avg_rating: shop.avg_rating ? Math.round(shop.avg_rating , 1):0.0,
          }
        });
        let data = [...this.state.partShopList, ...shops];
        this.setState({
          partShopList: shops,
          totalPartShops: res.total,
				});
				const markers = this.partShopMarkers();
				this.renderMarkersOnMap(markers)
      })
      .catch(err => {
        console.log("error" + JSON.stringify(err));
      });
  }


	// for service shops

	serviceShop(startIndex, searchKeyword) {
    serviceAction
      .serviceShop(startIndex, searchKeyword ,this.state.position)
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
				
        let data = [...this.state.serviceShopList, ...shops];
        this.setState({
          serviceShopList: shops,
          totalServiceShops: res.total,
				});
				const markers = this.serviceShopMarkers();
				console.log(markers.length)
				this.renderMarkersOnMap(markers)
      })
      .catch(err => {
        console.log("error" + JSON.stringify(err));
      });
	}
	
	OpenNow = () => {
		

		this.clearMap();

	}

	clearMap = () => {
		selectedMarkerIndex = -1;
		this.setState({ 
				markers_render: [], data: [],
				partShopList: [], totalPartShops: 0,
				serviceShopList: [], totalServiceShops: 0, 
				workshopList: [], totalWorkShops: 0,
				selectedMarkerIndex: -1,
			})

		this.applyOpenNowFilter();

	}

	applyOpenNowFilter = () => {

		if (this.props.navigation.state.params.fromScreen == "partShop"){
    	this.partShop(0, '&shop_open=true');
		} else if(this.props.navigation.state.params.fromScreen == "serviceShop"){
    	this.serviceShop(0, '&shop_open=true');
		} else if (this.props.navigation.state.params.fromScreen == "workShop"){
      this.workshops(0, '&shop_open=true');
		}

	}

	renderMarkersOnMap = (markers) => {
		console.log("Markers are now ");
		console.log(markers)
		
		const markers_render = markers.map(marker => {
			
			return (
				
				<Marker
					coordinate={{latitude: parseFloat(marker.latitude), longitude: parseFloat(marker.longitude)}}
					title={this.props.language.isArabic == true ? marker.arabic_name : marker.name}
					description={this.props.language.isArabic == true ? marker.arabic_name : marker.name}
					onCalloutPress={()=>this.scrollToIndex(marker.index)}
					onPress={() => {
						// alert(marker.index)
						this.scrollToIndex(marker.index)
						}
					}
					// zIndex={selectedMarkerIndex == marker.index ? 1 : 0}
				>
					<Image style={{ width: 24, height: 31 }} /*width={selectedMarkerIndex == marker.index ? 42 : 24} height={selectedMarkerIndex == marker.index ? 54 : 31} style={selectedMarkerIndex == marker.index ? {width: 42, height: 54} : {	width: 24, height: 31} }*/ source={selectedMarkerIndex == marker.index ? selectedMarker : descelectedMarker} />
			
				</Marker>
			)
		})

		this.setState({markers_render: markers_render, data: markers});

	}
	
	serviceShopMarkers = () => {
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
		return markers;
	}

	partShopMarkers = () => {
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
		return markers;
	}

	workShopMarkers = () => {
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
			return markers;
	}

	render() {
		// const {navigation} = this.props
		// const data = navigation.getParam('markers', [])
		const data = this.state.data;
		var marginTop= 0;
		if (data.length != 0) {
            if(data[0].detail){
                marginTop = 16;
            }
	    }
		return (
			<View style={styles.container}>
			<StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>

			<View style={{ marginTop:marginTop , backgroundColor: "transparent",}}>
                <NavigationComponent
                    navigation={this.props.navigation}
                    goBack={() => this.props.navigation.goBack()}
                        title={__('Map' , this.props.language)}
                        rightIcon={true}
                    />
                <View style={styles.secondHeader}>
                    <TouchableOpacity style={styles.button} onPress={()=> this.OpenNow() }>
                        <Text style={styles.buttonText}>{__('Open Now' , this.props.language)}</Text>
                        <Image style={{width: 25, height: 25}} source={require('../resources/icons/Filter.png')} />
                    </TouchableOpacity>
                </View>
			</View>
				
				<View style={styles.container}>
				<MapView
				  ref={ref => { this.mapView = ref; }}
					style={styles.map}
				>

					{this.state.markers_render.length > 0 ? this.state.markers_render : null}

					<Marker
							coordinate={{
								latitude: parseFloat(this.state.lat), 
								longitude: parseFloat(this.state.long)}

							}
							zIndex={2}
							title=''>
							<Image style={{width: 25, height: 25}} source={require('../resources/icons/circle.png')} />
					</Marker>

				</MapView>
				<View style={{position:'absolute' ,bottom:8}}>
				<TouchableOpacity style={{height:52,width:52, alignSelf:'flex-end' }} onPress={this.onPressCurrentLocation}>
				<View style={{backgroundColor:"white" , height:52,width:52, alignSelf:'flex-end' ,alignItems:'center',justifyContent:'center', marginRight:width * 0.03,borderRadius:10}}>
                 <Image source={require('../resources/icons/current_location.png')} />
				</View>
				</TouchableOpacity>
					<FlatList
						horizontal={true}
						ref={(ref) => { this.flatListRef = ref; }}
						showsHorizontalScrollIndicator={false}
						data={data}
						keyExtractor={(item, index) => item.id}
						renderItem={({ item, index }) => (
						<MapListCard
							key={index}
							item={item}
							index={index}
							onPress={() => this.onWorkshopClick(item.id)}
							language={this.props.language}
						/>
						)}
						ListFooterComponent={this._renderFooter}
						getItemLayout={(data, index) => (
								// {length: width, offset: (width - 30) * index, index
								{length: width - 30, offset: (width - 30) * (index), index}
						)}
						onScrollToIndexFailed={(info) => {console.log(info)}}
					/>
				
				</View>
				</View>
				
			</View>
		);
	}
}

mapStateToProps = (state) => {
	return {
    preferences: state.init.preferences,
		language: state.language,
		user: state.auth.user,
	}
  }

export default connect(mapStateToProps, null)(MapScreen)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		backgroundColor: "black",
		zIndex: -2,
		marginTop: 0,
	},
	map: {
		...StyleSheet.absoluteFillObject,
		marginTop:metrics.statusBarHeight,
		marginTop: -25,
	},
	secondHeader: {
    height: (height * 0.07) + 7,
    flexDirection: "row",
    backgroundColor: "#cad0d4",
    borderBottomEndRadius: width * 0.04,
    borderBottomStartRadius: width * 0.04,
    alignItems: "center",
    top: -12,
    zIndex: -1
  },
  button232: {
    borderWidth: 1,
    borderColor: "#717171",
    height: height * 0.04,
    justifyContent: "center",
    paddingHorizontal: width * 0.02,
    borderRadius: width * 0.05,
	marginLeft: width * 0.03,
	marginTop: 7
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: width * 0.02,
    marginLeft: width * 0.03,
    marginRight: width * 0.03,
  },
  buttonText: {
    color: "#717171",
    fontFamily: Fonts.CircularBold,
  }
});
