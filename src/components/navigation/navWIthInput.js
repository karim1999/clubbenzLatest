import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Image, StyleSheet, View, Dimensions, TouchableWithoutFeedback, TextInput ,Platform, TouchableOpacity , StatusBar} from 'react-native';
import { colors, fonts, metrics, styles } from '../../themes';
import moduleName from 'react-native-vector-icons/';
import Icon from "react-native-vector-icons/EvilIcons";
import { Fonts } from '../../resources/constants/Fonts';

const { height, width } = Dimensions.get('window');
class NavInput extends PureComponent {
	constructor(props) {
		super(props);
		var temp = '';
		if (this.props.showText)
			temp = this.props.placeholder
			// if (this.props.placeholder === 'Part shops' || this.props.placeholder === 'ServiceShops' || this.props.placeholder === 'Workshops') {
			// 	temp = '';
			// } else
			// 	temp = this.props.placeholder
		this.state={
			// text:this.props.placeholder,
			text: temp,
		}
		this.openLoginScreen = this.openLoginScreen.bind(this);
	}
	openLoginScreen() {}

	clearText = () => {
		if (this.props.placeholder != 'Workshops' && this.props.placeholder != 'Part shops' && this.props.placeholder != 'ServiceShops') {
			if (this.props.notClear == null) {
				this.setState({ text: '' })
			}
		}
	}

	render() {
		return (
				<View style={styles.navigationComponent}>
					<View style={{flex: 1}}>
						{this.props.menuIcon ? (
							<TouchableWithoutFeedback onPress={this.props.onMenuPress}>
								<View style={navigationStyle.leftContainer}>
									<Image
										style={styles.navigationMenuButton}
										source={require('../../resources/icons/ic_menu.png')}
									/>
								</View>
							</TouchableWithoutFeedback>
						) : (
							<TouchableWithoutFeedback onPress={this.props.goBack}>
								<View style={navigationStyle.leftContainer}>
									<Image
										style={{height:32,width:32, alignItems: 'center', justifyContent: 'center'}}
										resizeMode="contain"
										source={require('../../resources/images/ic-back.png')}
									/>
								</View>
							</TouchableWithoutFeedback>
						)}
					</View>
					<View style={{flex: 4}}>
						<View style={[navigationStyle.title]}>
							<View style={navigationStyle.inputWrapper}>
								<TextInput
									textAlignVertical="center"
									style={navigationStyle.textInput}
									placeholder={this.props.placeholder}
									placeholderTextColor={colors.gray70}
									value={this.state.text}
									onChangeText={(text)=>this.setState({text:text})}
									onSubmitEditing={()=> {this.props.onSearch(this.state.text); this.clearText()}}
									// textAlignVertical={true}
								/>

								<TouchableOpacity onPress={()=>{this.props.onSearch(this.state.text); this.clearText()}}>
									<Icon
										name="search"
										size={width * 0.07}
										color='#11455F'
										style={{paddingRight:8, alignContent: 'center', justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}}/>
								</TouchableOpacity>

							</View>
						</View>
					</View>
					<View style={{flex: 1}}>
						{this.props.onMapPress &&
						<TouchableWithoutFeedback onPress={this.props.onMapPress}>
							<View style={navigationStyle.leftContainer}>
								<Image
									style={{height:32,width:32, alignItems: 'center', justifyContent: 'center'}}
									resizeMode="contain"
									source={require('../../resources/icons/ic_mapview.png')}
								/>
							</View>
						</TouchableWithoutFeedback> }
					</View>
					{
						this.props.homeButton != false &&
						<View style={{flex: 1}}>
							<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('HomeScreen')}>
								<View style={navigationStyle.leftContainer}>
									<Image
										style={{height:27,width:27, alignItems: 'center', justifyContent: 'center'}}
										resizeMode="contain"
										source={require('../../resources/images/white-logo.png')}
									/>
								</View>
							</TouchableWithoutFeedback>
						</View>
					}
				</View>
		);
	}
}
export default NavInput;
NavInput.propTypes = {
	title: PropTypes.string,
	subTitle: PropTypes.string,
};

const navigationStyle = StyleSheet.create({
	title: {
		flex: 1,
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "center"
	},
	rightContainer: {
		flex: 1,
		flexWrap: 'wrap',
		marginTop:Platform.OS==="ios"?(height*0.05 + 10):6,
		marginRight: 10,
		alignContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
	},
	leftContainer: {
		flex: 1,
		flexWrap: 'wrap',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop:Platform.OS==="ios"?(height*0.05 + 10):6,
		marginBottom: 10
	},
	textInput: {
		color: colors.blueText,
		fontSize: width * 0.04,
		fontFamily: Fonts.CircularBold,
		flex:1,
		alignItems: 'center',
		alignSelf: 'center',
		// marginTop: 6,
	},
	inputWrapper: {
		backgroundColor: '#fff',
		borderWidth: 1,
		borderRadius: 10,
		alignItems: 'center',
		flex: 1,
		flexDirection:'row',
		marginLeft: height * 0.04,
		marginRight: height * 0.04,
		// padding: 10,
		paddingLeft: 5,
		marginTop: Platform.OS==="ios"?(height*0.05 + 10):6,
		marginBottom: 8,

		// paddingLeft: width * 0.02,
		// marginTop:Platform.OS==="ios"?height*0.05:6,
		// marginBottom: 10,
		// marginRight: 10,
		// marginLeft: 10,
	},
});
