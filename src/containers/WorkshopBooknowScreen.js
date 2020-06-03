import React, { PureComponent } from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity, Text, TextInput, Image} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Toast from "react-native-simple-toast";
import { connect } from 'react-redux';
import { styles, fonts, colors, metrics } from '../themes';
const { width, height } = Dimensions.get('window');
import NavigationService from '../NavigationService';
import * as workshopAction from "../redux/actions/workshops";
import { ScrollView } from 'react-native-gesture-handler';
import { Fonts } from '../resources/constants/Fonts';
import __ from '../resources/copy';

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

class WorkshopBooknowsScreen extends PureComponent {

	static navigationOptions = ({ navigation }) => ({
		title: __('Booking', '')
	});

	constructor(props) {
		super(props);
	}
	state = {
		date: new Date(),
		isValid: true,
		comments: '',
		weekDays: {
			Sunday: 0,
			Monday: 1,
			Tuesday: 2,
			Wednesday: 3,
			Thursday: 4,
			Friday: 5,
			Saturday: 6,
		}
	};
	componentDidMount(){
		this.setDate(this.state.date)
		// alert(JSON.stringify(this.props.workshop))
	}

	createBooking(data) {
		if(this.state.isValid){
			workshopAction
				.workshopBooking(data)
				.then(res => {
					// alert(JSON.stringify(res));
					if (res ) {
						// Alert.alert('Booking Info', res.message);
						if (res.success)
							NavigationService.navigate('ThanksScreen' , {user:this.props.user, isBooking: true, });
						// debugger;

					} else {
						setTimeout(() => {
							Toast.show('Something gone wrong, Try again.', Toast.LONG, Toast.BOTTOM);
						}, 100)
					}
				})
				.catch(err => {
					console.log("error" + JSON.stringify(err));
				});
		}
	}

	submit = () => {
		const date = this.state.date
		const data = {
			date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
			time: date.getHours() + ':' + date.getMinutes(),
			comments:this.state.comments
		}
		if (data.comments !== '') {
			this.createBooking(data)
		} else {
			setTimeout(() => {
				Toast.show('Please enter your comment or request!')
            }, 100)
		}
	};
	setDate(date){
		// alert(date)
		this.setState({ date, isValid: true }, ()=> {
			let dateObject= new Date(date)
			let invalidDay= this.state.weekDays[this.props.workshop.day_off]
			let invalidFrom= parseInt(this.props.workshop.closing_hour.split(":")[0])
			let invalidTo= parseInt(this.props.workshop.opening_hour.split(":")[0])
			if(invalidDay == dateObject.getUTCDay() || dateObject.getHours() >= invalidFrom || dateObject.getHours() < invalidTo){
				this.setState({ isValid: false })
				return
			}
		})
	}

	render = ()=> {

		var minDate = new Date();
		minDate.setDate(minDate.getDate() + 2);
		minDate.setHours(0,0,0,0);
		var maxDate = new Date();
		maxDate.setDate(minDate.getDate() + 30);
		if(!this.props.active)
			return (
				<View style={[styleWorkshopBooknowsScreen.container, {
					alignItems: "center",
					paddingTop: 8
				}]}>
				<View style={styles.center}>
					<View style={{flex: 0.2}}></View>
					<View style={[styles.center, {flex: 0.6}]}>
						<Image source={require('../resources/images/discount.png')} style={{height: 60, width: 55, justifyContent: 'center'}}/>
						<Text style={{fontSize: 25, fontFamily: Fonts.CircularBook, color: colors.blueButton}}>{__('Booking is not available', this.props.language)}</Text>
						<Text style={{fontSize: 14, fontFamily: Fonts.CircularBook, color: colors.grey93}}>{__('Looks like this provider does not support booking now', this.props.language)}</Text>
					</View>
					<View style={{flex: 0.2}}></View>
				</View>
				</View>
			)
		else
		return (
			<KeyboardAwareScrollView>
			<View
				style={[
					styleWorkshopBooknowsScreen.container,
					{
						alignItems: 'center',
					},
				]}
			>
				<View style={{ marginTop: width * 0.04 }}>
					<Text
						style={{
							textAlign: 'center',
							color: '#11435E',
							fontSize: fonts.size.medium,
							fontFamily: Fonts.CircularMedium,
							// fontWeight: fonts.fontWeight.bold,
						}}
					>
						{__('Book your maintainience in advance choose date and time and any comments or requests.' , this.props.language)}
					</Text>
				</View>
				<View style={{ marginVertical: width * 0.04 }}>
					<Text
						style={{
							textAlign: 'center',
							color: colors.grey93,
							fontSize: fonts.size.medium,
							fontFamily: Fonts.circular_medium,
						}}
					>
						{__('Select date and time' , this.props.language)}
					</Text>
				</View>
				<View>
					{
						!this.state.isValid ?
							<Text style={{color: "red"}}>{__('The provider is not available during that time')}</Text>:null
					}
					<DatePicker
						mode={"datetime"}
						minimumDate={minDate}
						maximumDate={maxDate}
						minuteInterval={30}
						date={this.state.date}
						onDateChange={date => this.setDate(date)}
						minDate={minDate}
					/>
				</View>

				<View style={[styles.commentInputField, {paddingLeft: 5}]}>
					<TextInput
						// style={[styles.commentInputField]}
						style={{fontFamily: Fonts.CircularMedium, fontFamily: Fonts.CircularMedium}}
						placeholder={__('comments or requests' , this.props.language)}
						placeholderTextColor='rgba(0,0,0, 0.4)'
						onChangeText={comments => this.setState({ comments: comments })}
						value={this.state.comments}
					/>
				</View>
				<View>
					<TouchableOpacity onPress={this.submit}>
						<View style={styleWorkshopBooknowsScreen.contactBtnStyle}>
							<Text style={[styleWorkshopBooknowsScreen.cancelBtnText, {color: '#11455F'}]}>{__('Send Request' , this.props.language)}</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
			</KeyboardAwareScrollView>
		);
	}
}

mapStateToProps = (state) => {
	return {
		user: state.auth.user,
		language: state.language,
	}
  }
export default connect(mapStateToProps, null)(WorkshopBooknowsScreen)

const styleWorkshopBooknowsScreen = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white,
	},
	btnStyle: {
		width: metrics.deviceWidth - 40,
		marginBottom: 5,
	},
	contactBtnStyle: {
		width: metrics.deviceWidth - 40,
		height: 60,
		fontFamily: Fonts.CircularMedium,
			justifyContent: 'center',
			alignItems: 'center',
			borderColor: '#11455F',
			borderWidth: 1,
			borderStyle: 'solid',
			borderRadius: metrics.radius40,
			marginBottom: 10,
			marginTop: 10,
	  },
	  cancelBtnText: {
		color: '#0E2D3C',
		fontSize: 18,
		fontFamily: Fonts.CircularMedium,
		textAlign: 'center',
	  },
});
