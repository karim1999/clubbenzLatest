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
	FlatList
} from 'react-native';

import { styles, fonts, colors, metrics } from '../themes';
const { width, height } = Dimensions.get('window');
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import SmoothPicker from 'react-native-smooth-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationComponent from '../components/navigation/navigation';
import CarClass from '../components/carclass/carclass';
import SplitHeading from '../components/common/splitHeading';
import CarOptionListItem from '../components/car/CarOptionListItem';
import {updateUser,getCarsInformation} from './../redux/actions/auth'
import { IMG_PREFIX_URL } from './../config/constant';
import Toast from "react-native-simple-toast";
import { Fonts } from '../resources/constants/Fonts';
import __ from '../resources/copy';

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
			selected1: 0,
			selected2: 0,
			selected3: 0,
			selectedCar: this.props.preferences.models != null ? this.props.preferences.models[0] : {},
			years:this.props.preferences.years,
			fuel_types:this.props.preferences.fuel_types,
			selected_fuel_types_name:'',
			models:this.props.preferences.models,
			selected_models:'',
			selected_fuel_types:"",
			selected_years:'',
			cars_information:[]
		};


		this.verifyNumber = this.verifyNumber.bind(this);
		this.actionNoCode = this.actionNoCode.bind(this);

	}
	verifyNumber() {

		let self = this
		let {years, fuel_types, models, selected1, selected2, selected3} = this.state
		let data= {model_id:this.state.selected_models,fuel_type:this.state.selected_fuel_types,year  :this.state.selected_years}
		getCarsInformation(data).then(res=>{
			console.log(data);
			if (res.cars_information != null) {
			if(res.cars_information.length!=0){
				self.setModalVisible(true);
				self.setState({cars_information:res.cars_information,carModel:this.state.selected_fuel_types_name+' '+this.state.selected_years,carClass:models[selected1].name})
			}
			else{
				setTimeout(() => {
					Toast.show('No Information found for current selection', Toast.LONG, Toast.BOTTOM);
				}, 100)
			}
		}
		}).catch(err=>{
			console.error(err)
		})
	}


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
		this.setState({
			modalVisible: false,
			showOverlay: false,
		});
		this.props.navigation.navigate('CategoriesScreen' , {chassis:car_info.chassis })

	};

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

	   this.setState({models});
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
				self.setState({selected_fuel_types:item.id ,  selected_fuel_types_name:item.name});
			}else{
				BrandItem.selected = false;
			}
			index ++;
			return BrandItem;
			})

		// 	var fuels = [];

		// 	fuels = fuel_types;

		// 	var removedValue = fuels.splice(temp, 1);

		// 	var concatedNewArray = removedValue.concat(fuels)

		// 	console.log(concatedNewArray)

		//  this.setState({fuel_types: concatedNewArray});

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
				self.setState({selected_years:item.name});
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

	render() {
		let self = this
		const { cars_information   } = this.state;
		return (
			<View style={[styles.columnContainer]}>
				<StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>
				<NavigationComponent homeButton={false} navigation={this.props.navigation}
														goBack={() => this.props.navigation.goBack()} title={__("What's your Benz" , this.props.language)} />
				<View style={styles.columnContainer}>
				<TouchableOpacity onPress={() =>this.props.navigation.navigate('CategoriesScreen' , {chassis:this.props.selected_car.car.chassis })}>
						<View style={[styles.tapableButton, CarSelectionStyle.btnStyle1]}>
							<View
								style={{
									flex: 5,
									paddingVertical: height * 0.02,
									paddingHorizontal: width * 0.02,
								}}
							>
								<Text style={{ color: colors.separatorText, paddingLeft: width * 0.03 }}>{this.props.selected_car.year.name ? this.props.selected_car.year.name :''}</Text>
								<Text
									style={{
										color: '#fff',
										// fontWeight: 'bold',
										fontSize: width * 0.06,
										paddingLeft: width * 0.03,
									}}
								>
									{this.props.selected_car.model.name ? this.props.selected_car.model.name :''}
								</Text>
								<View style={{ height: height * 0.05, width: width * 0.3 }}>
									<Image
								    	source={{uri:IMG_PREFIX_URL+this.props.selected_car.model.image}}
										style={{ flex: 1, height: null, width: null, resizeMode: 'contain' }}
									/>
								</View>
							</View>
							<View
								style={{
									flex: 1,
									justifyContent: 'center',
								}}
							>
								<Icon name="ios-arrow-round-forward" size={width * 0.1} color={'#fff'} />
							</View>
						</View>
					</TouchableOpacity>

					{/* <Text
                        style={CarSelectionStyle.title}
                    >
                        –––––   Or choose your Model   –––––
                    </Text> */}
					<SplitHeading
						text={__('Or select your Model' , this.props.language)}
						headingStyle={{ padding: 10, marginTop: 5 }}
						lineColor={{ backgroundColor: colors.blueButton }}
						textColor={{ color: colors.blueButton, fontFamily: Fonts.CircularMedium, }}
					/>

					<View style={CarSelectionStyle.bottomContainer}>
						<ScrollView>
							<View style={[CarSelectionStyle.carType]}>
							<ScrollView horizontal showsHorizontalScrollIndicator={false}>
								<FlatList
									horizontal={true}
									data={this.state.models}
									keyExtractor={(item, index) => item.id}
									renderItem={({ item, index }) => (
										<CarClass item={item}  onPress={(item) => this.onChangeModel(item) }/>
									)}
									ListFooterComponent={this._renderFooter}
								/>
							</ScrollView>
							</View>
							<SplitHeading
								text={__('Engine Type' , this.props.language)}
								headingStyle={{ padding: 10, marginTop: 5 }}
								lineColor={{ backgroundColor: 'rgba(6,0,41, 0.2)' }}
								textColor={{ color: '#8E8E93', fontFamily: Fonts.circular_medium }}
							/>
							<View style={[CarSelectionStyle.carType]}>
							<ScrollView horizontal showsHorizontalScrollIndicator={false}>
								<FlatList
									horizontal={true}
									data={this.state.fuel_types}
									keyExtractor={(item, index) => item.id}
									renderItem={({ item, index }) => (
										<Bubble horizontal selected ={item.selected} item={item} onPress={(item) => this.onChangeCarType(item) }>
											{item.name}
										</Bubble>
									)}
									ListFooterComponent={this._renderFooter}
								/>
							</ScrollView>
							</View>
							<SplitHeading
								text={__('Model Year' , this.props.language)}
								headingStyle={{ padding: 10, marginTop: 5 }}
								lineColor={{ backgroundColor: 'rgba(6,0,41, 0.2)' }}
								textColor={{ color: '#8E8E93', fontFamily: Fonts.circular_medium }}
							/>

							<View style={[CarSelectionStyle.carType, { alignItems: 'flex-start' }]}>

							<ScrollView horizontal showsHorizontalScrollIndicator={false}>
								<FlatList
									horizontal={true}
									data={this.state.years}
									keyExtractor={(item, index) => item.id}
									renderItem={({ item, index }) => (
										<Bubble horizontal selected ={item.selected}  item={item} onPress={(item) => this.onChangeCarYear(item) }>
											{item.name}
										</Bubble>
									)}
									ListFooterComponent={this._renderFooter}
								/>
							</ScrollView>
							</View>

							<TouchableOpacity onPress={this.verifyNumber}>
								<View style={[styles.tapableButtonHollow, CarSelectionStyle.continueBtnStyle]}>
									<Text style={styles.tapButtonStyleTextBlue}>{__('Continue' , this.props.language)}</Text>
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
					<View style={{flex:0.3}}></View>
					<View style={CarSelectionStyle.modelStyle}>
						<View style={CarSelectionStyle.modalInnerView}>
							<View style={styles.center}>
							<CarClass item={this.state.selectedCar} selected={true} selectionResult={true} />
								<SplitHeading
									text={this.state.carModel}
									headingStyle={{ padding: 10, marginTop: 5 }}
									lineColor={{ backgroundColor: colors.blueButton }}
									textColor={{ color: colors.blueButton }}
								/>
							</View>
							<FlatList
								data={cars_information}
								renderItem={this.renderItem}

							/>
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
		selected_car: state.auth.selected_car,
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
	btnStyle1: {
		width: metrics.deviceWidth - 40,
		marginTop: 25,
		height: height * 0.15,
		borderRadius: width * 0.03,
		flexDirection: 'row',
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
		borderColor: colors.black,
		borderWidth: 1,
		borderStyle: 'solid',
		borderTopEndRadius: metrics.radius15,
		borderTopStartRadius: metrics.radius15,
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
		borderTopEndRadius: metrics.radius15,
		borderTopStartRadius: metrics.radius15,
	},
	modelStyle:{
		flex:0.7,
		justifyContent:'flex-end'
	}
});
