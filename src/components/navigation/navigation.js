import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Text, Image, StyleSheet, View, Dimensions, Platform, TouchableWithoutFeedback, I18nManager } from 'react-native';
import { colors, fonts, metrics, styles } from '../../themes';
import { Fonts } from '../../resources/constants/Fonts';
const { width, height } = Dimensions.get('window');
import Icon from "react-native-vector-icons/AntDesign"
import Icon2 from "react-native-vector-icons/FontAwesome"
class Navigation extends PureComponent {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View>
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
								<View style={[navigationStyle.leftContainer, {transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}]}>
									<Image
										resizeMode="contain"
										style={{height:32,width:32, marginLeft: 15,}}
										source={require('../../resources/images/ic-back.png')}
									/>

								</View>
							</TouchableWithoutFeedback>
						)}
					</View>
					{this.props.headerimageIcone ?
						<View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
							<Image
								style={{ width: 32, height: 32, marginTop:  (Platform.OS === 'ios') ? height*0.03 : 0}}
								source={require('../../resources/images/white-logo.png')}
							/>
						</View> :
						<View style={{flex: 4}}>
							<View style={[navigationStyle.title, {marginLeft: 10,}]}>
								<Text
									style={[
										fonts.style.titleTextBoldWhite,
										{ color: colors.white, fontSize: width * 0.05, fontFamily: Fonts.CircularBold, },
									]}
								>
									{this.props.title}
								</Text>
								{this.props.subTitle ? (
									<Text style={navigationStyle.subTitle}>{this.props.subTitle}</Text>
								) : null}
							</View>
						</View>
					}

					{this.props.rightIcon &&
					<View style={{flex: 1}}>
							{this.props.share ? (<TouchableWithoutFeedback onPress={this.props.onSharePress}>
								<View style={[navigationStyle.leftContainer, {alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}]}>
									<Image
										style={[styles.navigationMenuButton, {marginBottom: 5}]}
										source={require('../../resources/icons/ic-share.png')}
									/>
								</View>
							</TouchableWithoutFeedback>) : (
								<TouchableWithoutFeedback onPress={this.props.onMenuPress}>
									<View>
										<Image
											style={styles.navigationMenuButton}
											source={require('../../resources/icons/search.png')}
										/>
									</View>
								</TouchableWithoutFeedback>
							)}
					</View>
					}
					{
						this.props.favorite ?
							<View style={{flex: 1, alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>
								<TouchableWithoutFeedback onPress={this.props.onPressFavorite}>
									<View style={[navigationStyle.leftContainer, {alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}]}>
										<Icon
											style={[styles.navigationMenuButton, {marginBottom: 5}]}
											name={this.props.isFavorite ? "star" : "staro"} size={27} color={this.props.isFavorite ? "#F24601": "white"}/>
									</View>
								</TouchableWithoutFeedback>
							</View> :
							!this.props.headerimageIcone && this.props.homeButton != false?
								<View style={{flex: 1}}>
									<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('Home')}>
										<View style={navigationStyle.leftContainer}>
											<Icon2 name={"home"} style={[styles.navigationMenuButton, {marginBottom: 5}]} size={27} color={"white"}/>
										</View>
									</TouchableWithoutFeedback>
								</View> : <View style={{flex: 1}}></View>
					}

				</View>
			</View>
		);
	}
}
export default Navigation;
Navigation.propTypes = {
	title: PropTypes.string,
	subTitle: PropTypes.string,
};

const navigationStyle = StyleSheet.create({
	title: {
		flex: 3,
		marginTop:Platform.OS==="ios"?height*0.04:0,
		alignItems: 'center',
		justifyContent: 'center',
		fontFamily: Fonts.CircularBold,
	},
	rightContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingRight: 15,
		marginTop:Platform.OS==="ios"?height*0.04:6,
		alignSelf: "center",
	},
	leftContainer: {
		flex: 1,
		flexWrap: 'wrap',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginTop:  (Platform.OS === 'ios') ? 20 : 6,
	},
	subTitle: {
		textAlign: 'center',
		color: colors.white,
		fontSize: fonts.size.tiny,
		fontFamily: Fonts.CircularBook,
	},
});
