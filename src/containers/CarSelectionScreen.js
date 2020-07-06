import React, { PureComponent } from 'react';
import {
	View,
	StyleSheet,
	ScrollView,
	Text,
	TouchableOpacity,
	Dimensions,
	Image,
	ImageBackground,
	StatusBar,
	Modal,
	Alert,
	FlatList,
	PermissionsAndroid,
	Platform,
} from 'react-native';

import { styles, fonts, colors, metrics } from '../themes';
const { width, height } = Dimensions.get('window');
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NavigationService from '../NavigationService';
import NavigationComponent from '../components/navigation/navigation';
import CarClass from '../components/carclass/carclass';
import SplitHeading from '../components/common/splitHeading';
import CarOptionListItem from '../components/car/CarOptionListItem';
import {updateUser,getCarsInformation} from './../redux/actions/auth'
import Toast from "react-native-simple-toast";
import { Fonts } from '../resources/constants/Fonts';
import __ from '../resources/copy';
import SimpleToast from 'react-native-simple-toast';

import Permissions from 'react-native-permissions';

const Bubble = props => {
	const { children, selected, horizontal ,item , onPress} = props;
	return (
		<TouchableOpacity onPress={() => onPress(item)} style={[{alignContent:'center',textAlign: 'center',justifyContent:'center'},item.selected && {  borderRadius: 4,borderBottomWidth: 0.5,borderColor: colors.blueText  }]}>
		<View
			style={[
				{
					alignContent:'center',
					textAlign: 'center',
					justifyContent:'center'
				},
			]}
		>
			<Text style={[CarSelectionStyle.carTypeText, {alignContent:'center',
					textAlign: 'center',
					justifyContent:'center'}, { color: item.selected ? colors.navgationBar : 'rgba(14,45,60, 0.2)' }]}>{children}</Text>
		</View>
		</TouchableOpacity>
	);
};
const navigationOptions = {
	header: null,
};



class CarSelectionScreen extends PureComponent {
	constructor(props){
		super(props)
		this.state = {
			modalVisible: false,
			showOverlay: false,
			carClass: 'A-Class',
			carModel: 'W176 2016',
			selected1: 1,
			selected2: 0,
			selected3: 0,
			selectedCar:this.props.preferences.models[0],
			years:this.props.preferences.years,
			fuel_types:this.props.preferences.fuel_types,
			selected_fuel_types_name:'',
			models:this.props.preferences.models,
			cars_information:[],
			selected_years_id:'',
			selected_year_index: 0,
			cameraPermission: false,
			audioPermission: false,
		};
		this.verifyNumber = this.verifyNumber.bind(this);
		this.actionNoCode = this.actionNoCode.bind(this);
	}

  async scanVinNumber () {

		if (Platform.OS === 'ios') {

				if (this.state.cameraPermission === "denied") {
					this._alertForCameraPermission();
				} else {
					if (this.props.navigation.state.params.MyProfileScreen && this.props.navigation.state.params.MyProfileScreen == true) {
						NavigationService.navigate('ScanVinNumberScreen', {MyProfileScreen: true});
					} else {
						NavigationService.navigate('ScanVinNumberScreen');
					}
				}

		} else {
			const granted = await PermissionsAndroid.requestMultiple(
				[
				PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,

				PermissionsAndroid.PERMISSIONS.CAMERA,

				]
			).then((result) => {
					if ((result['android.permission.CAMERA'] === 'granted') && (result['android.permission.RECORD_AUDIO'] === 'granted')) {
						NavigationService.navigate('ScanVinNumberScreen');
					} else {
						SimpleToast.show('Request not granted!', SimpleToast.SHORT);
					}
			});
		}

	}

	_alertForCameraPermission = () => {
    Alert.alert(
			'Clubbenz needs to access your camera',
			'Clubbenz Camera Permission',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Permission denied'),
          style: 'cancel',
        },
        this.state.cameraPermission == 'undetermined'
          ? {text: 'OK', onPress: this._requestPermission}
          : {text: 'Open Settings', onPress: Permissions.openSettings},
      ],
		);

	}

	_requestPermission = () => {
		Permissions.check('camera').then(response => {
			this.setState({cameraPermission: response});
		})
	}

	componentDidMount() {
		this._requestPermission();
	}

	verifyNumber() {

		let self = this
		let {years, fuel_types, models, selected1, selected2, selected3} = this.state
		let data= {model_id:this.state.selected_models,fuel_type:this.state.selected_fuel_types,year  :this.state.selected_years}
		getCarsInformation(data).then(res=>{
			if(res.cars_information.length!=0){
				self.setModalVisible(true);
				self.setState({cars_information:res.cars_information,carModel:this.state.selected_fuel_types_name+' '+this.state.selected_years,carClass:models[selected1].name})
			}
			else{
				setTimeout(() => {
					Toast.show('No Information found for current selection', Toast.LONG);
				}, 100)
			}
		}).catch(err=>{
			console.error(err)
		})
	}

	actionNoCode() {
		alert('Vin Code');
	}

	setModalVisible(visible) {
		this.setState({
			modalVisible: visible,
			showOverlay: visible,
		});
	}

	onCarOptionPress = (car_info) => {
		let {years,selected3} = this.state
		this.setState({
			modalVisible: false,
			showOverlay: false,
		});
		if(this.props.navigation.state.params.MyProfileScreen){

		 //MyProfileScreen
		 this.props.navigation.state.params.updateSelectedCar( car_info , this.state.selected_years_id );
		 NavigationService.goBack();

		}else{


			//  debugger
				 this.props.updateUser({car_vin_prefix:car_info.vin_prefix,car_type_id:car_info.fuel_type,model_id:car_info.model_id,year_id:/*years[selected3].id*/years[this.state.selected_year_index].id})
				 console.log(years[selected3])
				// debugger
		     NavigationService.navigate('RegisterScreen');
		}


	};

	renderItem = ({item}) => {
		const self = this;
		return (
			<CarOptionListItem
			key={item}
			carOptionHeading={item.model}
			carOptionDetail={item.model_text}
			onPress={()=>self.onCarOptionPress(item)}
		/>
		)
	  }
	  onChangeModel = (item) => {
		const self = this;
		var index = 0;
		var temp = -1;
		var models = this.state.models.map(function(el) {
			var BrandItem = Object.assign({}, el);
			if(BrandItem.id == item.id ){
				BrandItem.selected = true;
				temp = index;
				self.setState({selected_models:item.id  , selectedCar:item});
			}else{
				BrandItem.selected = false;
			}
			index ++;
			return BrandItem;
		  })

		// 	var modelArr = [];

		// 	modelArr = models;

		// 	var removedValue = modelArr.splice(temp, 1);

		// 	var concatedNewArray = removedValue.concat(modelArr)

		// 	console.log(concatedNewArray)

		//  this.setState({models: concatedNewArray});

		this.setState({models: models})

		}

	  onChangeCarType = (item) => {
		const self = this;
		var index = 0;
		var temp = -1;
			var fuel_types = this.state.fuel_types.map(function(el) {
			var BrandItem = Object.assign({}, el);
			if(BrandItem.id == item.id ){
				BrandItem.selected = true;
				temp = index;
				self.setState({selected_fuel_types:item.id , selected_fuel_types_name:item.name});
			}else{
				BrandItem.selected = false;
			}
			index ++;
			return BrandItem;
			})

			// var fuels = [];

			// fuels = fuel_types;

			// console.log(fuels);

			// var removedValue = fuels.splice(temp, 1);

			// var concatedNewArray = removedValue.concat(fuels)

			// console.log(concatedNewArray)

		//  this.setState({fuel_types: concatedNewArray});
		//  this.fuelScrollToIndex(0)

		this.setState({fuel_types});

	  }

	  onChangeCarYear = (item) => {
		const self = this;
		var index = 0;
		var temp = -1;
		var years = this.state.years.map(function(el) {
			var BrandItem = Object.assign({}, el);
			if(BrandItem.id == item.id ){
				BrandItem.selected = true;
				temp = index;
				// debugger
				self.setState({selected_years:item.name , selected_years_id:item.id, selected_year_index: index});
			}else{
				BrandItem.selected = false;
			}
			index ++;
			return BrandItem;
			})

		// 	var yearsArr = [];
		// 	yearsArr = years;

		// 	var removedValue = yearsArr.splice(temp, 1);

		// 	var concatedNewArray = removedValue.concat(yearsArr)

		// 	console.log(concatedNewArray)

		//  this.setState({years: concatedNewArray});

	   this.setState({years});
		}

		fuelScrollToIndex = (index) => {
			let randomIndex = index;
			this.fuelListRef.scrollToIndex({animated: true, index: randomIndex});
		}

	scrollToCar = (index) => {
		this.carListRef.scrollToIndex({animated: true, index: index});
	}
	scrollToFuel = (index) => {
		this.fuelListRef.scrollToIndex({animated: true, index: index});
	}
	scrollToYear = (index) => {
		this.yearListRef.scrollToIndex({animated: true, index: index});
	}

	render() {
		let self = this
		const { cars_information   } = this.state;
		return (
			<View style={[styles.columnContainer]}>
				<StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>
				<NavigationComponent
					homeButton={false}
					navigation={this.props.navigation}
					goBack={() => this.props.navigation.pop()} title={__("What's your Benz" , this.props.language)} subTitle={__("It’s super quick" , this.props.language)}/>

				<View style={styles.columnContainer}>
					<TouchableOpacity onPress={() => this.scanVinNumber()}>
						<View style={[styles.tapableButton, CarSelectionStyle.btnStyle]}>
							<Text style={styles.tapButtonStyleTextWhite}>{__("Scan your Vin Number" , this.props.language)}</Text>
						</View>
					</TouchableOpacity>

					{/* <Text
                        style={CarSelectionStyle.title}
                    >
                        –––––   Or choose your Model   –––––
                    </Text> */}
					<SplitHeading
						text={__("Or select your Model" , this.props.language)}
						headingStyle={{ padding: 10, marginTop: 5 }}
						lineColor={{ backgroundColor: colors.splitHeading, opacity: 0.2 }}
						textColor={{ color: colors.blueButton }}
						textSize={{fontSize: fonts.size.h13, fontFamily: Fonts.CircularMedium}}
					/>

					<View style={CarSelectionStyle.bottomContainer}>
						<ScrollView>
							<View style={[CarSelectionStyle.carType]}>
							{/*<ScrollView horizontal showsHorizontalScrollIndicator={false}>*/}
								<FlatList
									ref={(ref) => { this.carListRef = ref; }}
									horizontal={true}
									data={this.state.models}
									keyExtractor={(item, index) => item.id}
									renderItem={({ item, index }) => (
										<CarClass item={item}  onPress={(item) => {
											this.scrollToCar(index)
											this.onChangeModel(item)
										} }/>
									)}
									ListFooterComponent={this._renderFooter}
								/>
							{/*</ScrollView>*/}
							</View>
							<SplitHeading
								text={__("Car Engine" , this.props.language)}
								headingStyle={{ padding: 10, marginTop: 5 }}
								lineColor={{ backgroundColor: colors.splitHeading, fontFamily: Fonts.CircularMedium, opacity: 0.2 }}
								textColor={{ color: colors.grey93 }}
								textSize={{ fontSize: fonts.size.h13, fontFamily: Fonts.CircularMedium }}
							/>
							<View style={[CarSelectionStyle.carType]}>
							{/*<ScrollView horizontal showsHorizontalScrollIndicator={false}>*/}
								<FlatList
									horizontal={true}
									ref={(ref) => { this.fuelListRef = ref; }}
									data={this.state.fuel_types}
									keyExtractor={(item, index) => item.id}
									renderItem={({ item, index }) => (
										<Bubble horizontal selected ={item.selected} item={item} onPress={(item) => {
											this.scrollToFuel(index)
											this.onChangeCarType(item)
										} }>
											{this.props.language.isArabic ? item.arabic_name : item.name}
										</Bubble>
									)}
									ListFooterComponent={this._renderFooter}
								/>
							{/*</ScrollView>*/}
							</View>
							<SplitHeading
								text={__("Model Year" , this.props.language)}
								headingStyle={{ padding: 10, marginTop: 5 }}
								lineColor={{ backgroundColor: colors.splitHeading, fontFamily: Fonts.CircularMedium, opacity: 0.2  }}
								textColor={{ color: colors.grey93 }}
								textSize={{ fontSize: fonts.size.h13, fontFamily: Fonts.CircularMedium }}
							/>

							<View style={[CarSelectionStyle.carType, { alignItems: 'flex-start' }]}>
							{/*<ScrollView horizontal showsHorizontalScrollIndicator={false}>*/}
								<FlatList
									ref={(ref) => { this.yearListRef = ref; }}
									horizontal={true}
									data={this.state.years}
									keyExtractor={(item, index) => item.id}
									renderItem={({ item, index }) => (
										<Bubble horizontal selected ={item.selected}  item={item} onPress={(item) => {
											this.scrollToYear(index)
											this.onChangeCarYear(item)
										} }>
											{item.name}
										</Bubble>
									)}
									ListFooterComponent={this._renderFooter}
								/>
							{/*</ScrollView>*/}
							</View>

							<TouchableOpacity onPress={this.verifyNumber}>
								<View style={[styles.tapableButtonHollow, CarSelectionStyle.continueBtnStyle]}>
									<Text style={styles.tapButtonStyleTextBlue}>{__("Continue" , this.props.language)}</Text>
								</View>
							</TouchableOpacity>
						</ScrollView>
					</View>
				</View>

				{this.state.showOverlay ? <View style={CarSelectionStyle.overlayLayer} /> : null}

				<Modal
					transparent={true}
					visible={this.state.modalVisible}
					animationType="slide"
					onRequestClose={() => {
						this.setModalVisible(!this.state.modalVisible);
					}}
					style={{alignItems:'flex-end'}}
				>
					<View style={{flex:0.5}}>
						<TouchableOpacity style={{flex: 1}} onPress={() => {this.setState({ modalVisible: false, showOverlay: false })}} />
					</View>
					<View style={CarSelectionStyle.modelStyle}>
						<View style={CarSelectionStyle.modalInnerView}>
							<View style={styles.center}>
							<CarClass item={this.state.selectedCar} selected={true} selectionResult={true} />
								<SplitHeading
									text={this.state.carModel}
									headingStyle={{ padding: 10 }}
									lineColor={{ backgroundColor: colors.splitHeading, opacity: 0.2 }}
									textColor={{ color: colors.black, fontFamily: Fonts.CircularBold, opacity: 0.5 }}
								/>
							</View>

							<FlatList
								data={cars_information}
								renderItem={this.renderItem}

							/>
							{/* {cars_information.map((cars_info,index)=>{
								return <CarOptionListItem
													key={index}
													carOptionHeading={cars_info.text1}
													carOptionDetail={cars_info.text2}
													onPress={()=>self.onCarOptionPress(cars_info)}
												/>
							})} */}
						</View>
					</View>
				</Modal>
			</View>
		);
	}
}
mapStateToProps = (state) => {
	return {
		services: state.init.services,
		preferences: state.init.preferences,
		user: state.auth.user,
		isIndicator : state.init.is_loading_indicator,
		language: state.language,
	}
  }
  mapDispatchToProps = (dispatch) => bindActionCreators(
    {
		updateUser:updateUser
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CarSelectionScreen)

const CarSelectionStyle = StyleSheet.create({
	btnStyle: {
		width: metrics.deviceWidth - 40,
		marginTop: 25,
	},
	carType: {
		width: metrics.deviceWidth - 13,
		marginTop: 1,
		marginLeft: 10,
	},
	carTypeText: {
		marginHorizontal: width*0.03,
		fontFamily: fonts.type.bold,
		fontSize: width * 0.15,
		color: colors.overlayLayer,
		textAlign: 'center',
		fontFamily: Fonts.CircularBold,
	},
	title: {
		fontFamily: fonts.type.base,
		fontSize: fonts.size.h14,
		color: colors.blueButton,
		textAlign: 'center',
		marginTop: 15,
	},
	subTitle: {
		fontFamily: fonts.type.base,
		fontSize: fonts.size.h14,
		color: colors.darkGray,
		textAlign: 'center',
		marginTop: 15,
	},
	continueBtnStyle: {
		width: metrics.deviceWidth - 40,
		marginTop: 25,
		marginBottom: 30,
	},
	bottomContainer: {
		flex: 1,
		flexDirection: 'column',
		marginTop: 15,
		height: metrics.deviceHeight - metrics.deviceHeight / 4,
		width: metrics.deviceWidth,
		borderColor: '#707070',
		borderWidth: 1,
		borderStyle: 'solid',
		borderTopEndRadius: metrics.radius20,
		borderTopStartRadius: metrics.radius20,
	},
	overlayLayer: {
		flex: 1,
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		backgroundColor: 'rgba(14, 45, 59, 0.8)',
	},
	modalInnerView:{
		backgroundColor:'#FFF',
		borderTopEndRadius: metrics.radius20,
		borderTopStartRadius: metrics.radius20,
	},
	modelStyle:{
		flex:0.5,
		justifyContent:'flex-end'
	}
});
