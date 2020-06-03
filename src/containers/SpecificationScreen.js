import React, { Component } from 'react';
import {
	Modal,
	Text,
	View,
	Image,
	Dimensions,
	ImageBackground,
	ScrollView,
	FlatList,
	StatusBar,
	Platform,
	TouchableOpacity,
	InteractionManager, TouchableWithoutFeedback
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import ScrollViewComponent from '../components/Specification/ScrollViewComponent';
import CardesComponent from '../components/Specification/CardesComponent';
import { colors } from '../themes';
const { width, height } = Dimensions.get('window');
import * as carAction from "./../redux/actions/car_guide";
import { IMG_PREFIX_URL } from '../config/constant';
import Toast from "react-native-simple-toast";
import { Fonts } from '../resources/constants/Fonts';
import { connect } from "react-redux";
import __ from '../resources/copy';
import SimpleToast from 'react-native-simple-toast';
import { store } from './../redux/create';
import Spinner from 'react-native-loading-spinner-overlay';

class SpecificationScreen extends Component {

	state = {
		car_data: [],
		spinner: false,
	}
	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			// ...long-running synchronous task...
			this.get_Carguide();
		});

		NetInfo.fetch().then(isConnected => {
			if (!isConnected) {
				SimpleToast.show('Not connected to internet', SimpleToast.BOTTOM)
			}
		})
	}

	get_Carguide = () => {
		this.setState({ spinner: true })
		// Toast.show("chassis = " +this.props.navigation.state.params.selected_car.chassis, Toast.LONG, Toast.BOTTOM);

		carAction.get_Carguide({ chassis: this.props.navigation.state.params.selected_car.chassis })
			.then(res => {
				if (res.success) {

					this.setState({ car_data: res.data, spinner: false });

				} else {
					this.setState({ spinner: false })
				}
			}).catch(err => {

				this.setState({ spinner: false })
				console.log("error" + JSON.stringify(err));
			});
	}
	render() {
		return (
			<View style={{ flex: 1, backgroundColor: 'white' }}>
				<Spinner
					visible={this.state.spinner}
				/>
				<StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content' />
				<ImageBackground
					source={{ uri: IMG_PREFIX_URL + this.state.car_data.pic1 }}
					style={{ width: width, height: height / 1.7, backgroundColor: 'black' }}
				>
					<ImageBackground
						style={{ width: width, height: height / 1.7 }}
						source={require('../resources/images/transparent-layer-1.png')}
					>
						<View style={{ flex: 1, justifyContent: 'space-between' }}>

							<View
								style={{
									width: '100%',
									height: height * 0.08,
									flexDirection: 'row',
									paddingTop: Platform.OS === "ios" ? height * 0.05 : 0
								}}
							>
								<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
									<TouchableOpacity onPress={() => this.props.navigation.goBack()}>
										<View style={{ height: height * 0.05, width: width * 0.1 }}>
											<Image
												source={require('../resources/images/ic-back.png')}
												style={{ flex: 1, height: 45, width: 45, resizeMode: 'contain' }}
											/>
										</View>
									</TouchableOpacity>
								</View>
								<View style={{ flex: 4, alignItems: 'center' }}>
									<Text style={{ color: '#FFF', fontFamily: Fonts.CircularBold, fontSize: width * 0.04 }}>
										{this.props.navigation.state.params.selected_car.model}
									</Text>
									<Text style={{ fontSize: width * 0.025, color: '#fff', fontFamily: Fonts.CircularBold }}>	{this.props.navigation.state.params.selected_car.model_text}</Text>
								</View>
								<View style={{ flex: 1 }} >
								{
									this.props.navigation.state.params.homeButton != false &&
										<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('HomeScreen')}>
											<View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
												<Image
													style={{height:27,width:27, alignItems: 'center', justifyContent: 'center'}}
													resizeMode="contain"
													source={require('../resources/images/white-logo.png')}
												/>
											</View>
										</TouchableWithoutFeedback>

								}
								</View>

							</View>
							<View style={{ marginBottom: height * 0.02 }}>
								<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
									<ScrollViewComponent title={__('Displacement', this.props.language)} price={this.props.navigation.state.params.selected_car.displacement} />
									<ScrollViewComponent title={__('Engine Code', this.props.language)} price={this.props.navigation.state.params.selected_car.motor_code} />
									<ScrollViewComponent title={__('Horsepower', this.props.language)} price={this.props.navigation.state.params.selected_car.horse_power} />
									<ScrollViewComponent title={__('Engine Oil Capacity', this.props.language)} price={this.props.navigation.state.params.selected_car.oil_capacity_liter} />
									<ScrollViewComponent title={__('Top Speed', this.props.language)} price={this.props.navigation.state.params.selected_car.top_speed} />
									<ScrollViewComponent title={__('Fuel Consumption', this.props.language)} price={this.props.navigation.state.params.selected_car.fuel_per_hundred_km} />
									<ScrollViewComponent title={__('Acceleration 0-100km/h', this.props.language)} price={this.props.navigation.state.params.selected_car.acceleretion_second} />
									<ScrollViewComponent title={__('Tank Capacity', this.props.language)} price={this.props.navigation.state.params.selected_car.wheels ? this.props.navigation.state.params.selected_car.wheels : ""} />
									{/* <ScrollViewComponent title={__('Tires' , this.props.language)} price={this.props.navigation.state.params.selected_car.tires ? this.props.navigation.state.params.selected_car.tires :"Tires"} /> */}
									{/* <ScrollViewComponent title={__('Text' , this.props.language)} price={this.props.navigation.state.params.selected_car.text1 ? this.props.navigation.state.params.selected_car.text1 :""} /> */}
								</ScrollView>
							</View>

						</View>
					</ImageBackground>
				</ImageBackground>
				<View style={{ flex: 1, marginTop: 9, backgroundColor: '#FFFFFF' }}>
					{/* <ScrollView> */}
					<CardesComponent
						content={__('Cluster errors', this.props.language)}
						onPress={() => this.props.navigation.navigate('ClusterErrorScreen', { selected_car: this.props.navigation.state.params.selected_car, token: this.props.navigation.state.params.user.token, selected_car_model: this.props.navigation.state.params.selected_car_model ? this.props.navigation.state.params.selected_car_model : false, selected_car_year: this.props.navigation.state.params.selected_car_year ? this.props.navigation.state.params.selected_car_year : false, preferences: this.props.navigation.state.params.preferences })}
					/>

					<CardesComponent pdf modal content={__('Chassis Info', this.props.language)} imageLink={this.state.car_data.link2 && this.state.car_data.link2 != '' ? this.state.car_data.link2 : ''} imageUrl={this.state.car_data.pic2 && this.state.car_data.pic2 != '' ? IMG_PREFIX_URL + this.state.car_data.pic2 : ''} />

					{/*<CardesComponent modal content={__('Fues & Relay Location', this.props.language)} imageLink={this.state.car_data.link3 != '' ? this.state.car_data.link3 : ''} imageUrl={IMG_PREFIX_URL + this.state.car_data.pic3} />*/}
					<CardesComponent pdf modal content={__('Fues & Relay Location', this.props.language)} imageLink={this.state.car_data.link3 && this.state.car_data.link3 != '' ? this.state.car_data.link3 : ''} imageUrl={this.state.car_data.pic3 && this.state.car_data.pic3 != '' ? IMG_PREFIX_URL + this.state.car_data.pic3 : ''} />

					<CardesComponent modal content={__('Tire Pressure & Configuration', this.props.language)} imageLink={this.state.car_data.link4 != '' ? this.state.car_data.link4 : ''} imageUrl={IMG_PREFIX_URL + this.state.car_data.pic4} />
					{/* </ScrollView> */}
				</View>
			</View>
		);
	}
}

mapStateToProps = state => {
	return {
		language: state.language,
	};
};

export default connect(mapStateToProps, null)(SpecificationScreen);
