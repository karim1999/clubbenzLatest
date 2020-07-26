import React, { PureComponent } from 'react';
import { BackHandler, View, StyleSheet, TextInput, Text, TouchableOpacity, Dimensions, Image, ImageBackground,AsyncStorage } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { NavigationActions } from 'react-navigation';
import { styles, fonts, colors, metrics } from '../themes';
const { width, height } = Dimensions.get('window');
import NavigationService from '../NavigationService';
import NavigationComponent from '../components/navigation/navigation';
import * as authAction from './../redux/actions/auth'
import Toast from 'react-native-simple-toast';
import {API_ROOT, VERIFICATION_CODE_WARNING} from '../config/constant';
import { Fonts } from '../resources/constants/Fonts';
import axios from 'axios'
const navigationOptions = {
	header: null,
};

class ForgotPasswordScreen extends PureComponent {
	constructor(props) {
		super(props);
		this.verifyNumber = this.verifyNumber.bind(this);
		this.actionNoCode = this.actionNoCode.bind(this);
		this.state={
			user:props.user,
			code1:'',
			code2:'',
			code3:'',
			code4:'',
			code5:'',
			code6:''
		}
	}
	verifyNumber = () => {
		let self = this
		let {user,code1,code2,code3,code4,code5,code6} = this.state
		if(code1=='' || code2=='' || code3=='' || code4=='' || code5=='' || code6==''){
			setTimeout(() => {
				Toast.show(VERIFICATION_CODE_WARNING,Toast.LONG)
			}, 100)
		}
		else{
			// debugger
			var code = this.state.code1 + this.state.code2 + this.state.code3 + this.state.code4 + this.state.code5 + this.state.code6;
			authAction.userVerification({mobile:user.phone, verification_code:code, token: user.token, email: user.email}).then(res=>{
				if (res.success) {
					user.verification_phone = 1;
					AsyncStorage.setItem('user',JSON.stringify(user))
					self.props.navigation.reset([NavigationActions.navigate({ routeName: 'EnableNotificationScreen' })], 0);
				} else {
					setTimeout(() => {
						Toast.show(res.message,Toast.LONG)
					}, 100)
				}
			}).catch(err=>{
				alert(JSON.stringify(err))
			})
		}
	};
	componentDidMount(): void {
		BackHandler.addEventListener('hardwareBackPress', () => {
			axios.post(API_ROOT + 'user/remove_user', {phone: this.state.user.phone}).then(res => {
				console.log("done")
			}).catch(err => {
				console.log("error")
			});
			this.props.navigation.pop()
			return true
		})
	}

	handleKeyPress=(nativeEvent,ref) =>{
        if (nativeEvent.nativeEvent.key === 'Backspace') {
            this.refs[ref].focus();
        }
	}
	onChangeCode=(value,name,ref)=>{
		if(value.length==1){
			this.refs[ref].focus();
		}
		this.setState(prevState=>{
			const prev = { ...prevState };
            prev[name] = value;
            return prev;
		})
	}
	actionNoCode() {}
	goBack(){
		axios.post(API_ROOT + 'user/remove_user', {phone: this.state.user.phone}).then(res => {
			console.log("done")
		}).catch(err => {
			console.log("error")
		});
		this.props.navigation.pop()
	}
	// debugger;
	render() {
		const {code1,code2,code3,code4,code5,code6} = this.state
		return (
			<View style={[styles.columnContainer]}>
				<NavigationComponent
					homeButton={false}
					navigation={this.props.navigation}
					goBack={() => this.goBack()} title="Verify your account" />
				<View style={styles.columnContainer}>
					<Text style={FPStyle.title}>Enter the code that we sent to</Text>
					<Text style={FPStyle.code}>{this.props.navigation.state.params.mobile ? this.props.navigation.state.params.mobile :''}</Text>
					<View style={FPStyle.inputContainer}>
						<TextInput returnKeyType='done' maxLength={1} value={code1} ref="code1" onChangeText={(text)=>{this.onChangeCode(text,'code1','code2'); this.setState({code1: text})}} onKeyPress={ (nativeEvent) => this.handleKeyPress(nativeEvent,'code1') } style={FPStyle.numberInput} placeholder={'-'} keyboardType="number-pad" />
						<TextInput returnKeyType='done' maxLength={1} value={code2} ref="code2" onChangeText={(text)=>{this.onChangeCode(text,'code2','code3'); this.setState({code2: text})}} onKeyPress={ (nativeEvent) => this.handleKeyPress(nativeEvent,'code1') } style={FPStyle.numberInput} placeholder={'-'} keyboardType="number-pad" />
						<TextInput returnKeyType='done' maxLength={1} value={code3} ref="code3" onChangeText={(text)=>{this.onChangeCode(text,'code3','code4'); this.setState({code3: text})}} onKeyPress={ (nativeEvent) => this.handleKeyPress(nativeEvent,'code2') } style={FPStyle.numberInput} placeholder={'-'} keyboardType="number-pad" />
						<TextInput returnKeyType='done' maxLength={1} value={code4} ref="code4" onChangeText={(text)=>{this.onChangeCode(text,'code4','code5'); this.setState({code4: text})}} onKeyPress={ (nativeEvent) => this.handleKeyPress(nativeEvent,'code3') } style={FPStyle.numberInput} placeholder={'-'} keyboardType="number-pad" />
						<TextInput returnKeyType='done' maxLength={1} value={code5} ref="code5" onChangeText={(text)=>{this.onChangeCode(text,'code5','code6'); this.setState({code5: text})}} onKeyPress={ (nativeEvent) => this.handleKeyPress(nativeEvent,'code4') } style={FPStyle.numberInput} placeholder={'-'} keyboardType="number-pad" />
						<TextInput returnKeyType='done' maxLength={1} value={code6} ref="code6" onChangeText={(text)=>{this.onChangeCode(text,'code6','code6'); this.setState({code6: text})}} onKeyPress={ (nativeEvent) => this.handleKeyPress(nativeEvent,'code5') } style={FPStyle.numberInput} placeholder={'-'} keyboardType="number-pad" />
					</View>

					<TouchableOpacity onPress={this.verifyNumber}>
						<View style={[styles.tapableButton, FPStyle.btnStyle]}>
							<Text style={styles.tapButtonStyleTextWhite}>Continue</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity onPress={this.actionNoCode}>
						<Text style={[styles.tapButtonStyleTextUnderLine, FPStyle.noCodeText]}>
							Didn't recieve the code
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}
}
mapStateToProps = (state) => {
	return {
		user: state.auth.user
	}
  }
  mapDispatchToProps = (dispatch) => bindActionCreators(
    {
		updateUser:authAction.updateUser
    },
    dispatch
  );

export default connect(mapStateToProps, null)(ForgotPasswordScreen)

const FPStyle = StyleSheet.create({
	title: {
		fontFamily: Fonts.CircularBook,
		fontSize: fonts.size.h14,
		color: colors.black,
		textAlign: 'center',
		marginTop: 30,
	},
	noCodeText: {
		marginTop: 20,
		textDecorationLine: 'underline',
	},
	btnStyle: {
		width: metrics.deviceWidth - 40,
		marginTop: 30,
	},
	code: {
		fontFamily: Fonts.CircularBook,
		fontSize: fonts.size.h3,
		color: colors.blueText,
		textAlign: 'center',
		marginTop: 20,
	},
	inputContainer: {
		marginTop: 20,
		marginHorizontal: 20,
		flexDirection: 'row',
		justifyContent: 'center',
	},
	numberInput: {
		height: 60,
		width: 55,
		marginHorizontal: 2,
		textAlign: 'center',
		color: colors.blueText,
		fontFamily: fonts.type.base,
		fontSize: fonts.size.h4,
		backgroundColor: colors.grayLight,
		borderRadius: metrics.radius7,
	},
});
