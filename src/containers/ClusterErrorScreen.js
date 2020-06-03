import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableWithoutFeedback,
	StatusBar,
	FlatList,
	Dimensions,
	TouchableOpacity,
	TextInput,
	Image,
	ImageBackground,
	Keyboard
} from 'react-native';
import NavigationComponent from '../components/navigation/navigation';
import { colors, styles, metrics, fonts } from '../themes';
import { list } from '../resources/constants/ShopListConstant';
const { height, width } = Dimensions.get('window');
import * as carAction from "./../redux/actions/car_guide";
import { IMG_PREFIX_URL } from '../config/constant';

import { connect } from "react-redux";
import __ from '../resources/copy';
import { Fonts } from '../resources/constants/Fonts';

class ClusterErrorScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errorList: '',
			text: '',
			serverErrorList: '',
		};
	}
	
	componentDidMount(){
	  this.get_Cluster_error();		
	}
	get_Cluster_error = () =>{
	// carAction.get_Cluster_error({chassis:211})
	carAction.get_Cluster_error({chassis:this.props.navigation.state.params.selected_car.chassis})
		.then(res => {
			if (res.success) {
				//  alert(JSON.stringify(res))
				// debugger
			  this.setState({errorList:res.data, serverErrorList: res.data});
			}
		  })
	}
	

	onSearchPress = () => {
		// alert(JSON.stringify(this.state.errorList));
		var errors = this.state.errorList
		var searchedText = this.state.text.toLowerCase();
		var shortWords = [];
		var matchedText =[];
		// alert(JSON.stringify(errors[0]))
		for (var i=0; i<errors.length; i++) {
			var temp = errors[i].title ? errors[i].title.toLowerCase() : '';
			shortWords.push(temp);
		}
		
		for (var i=0; i<shortWords.length; i++) {
			if (shortWords[i].includes(searchedText)) {
				matchedText.push(errors[i]);
			}
		}
		Keyboard.dismiss()
		this.setState({errorList: matchedText})

	};

	ListEmptyView = () => {
		return (
		  <View style={styles.MainContainer}>
	 
			<Text style={{textAlign: 'center'}}> Sorry, No Data Present</Text>
	 
		  </View>
	 
		);
	  }

	renderItem = ({ item, index }) => {
		return (
			<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('ClusterErrorSolutionsScreen' , 
			{
				errorDetail:item , 
				token:this.props.navigation.state.params.token , 
				title:this.props.navigation.state.params.selected_car_model ? this.props.navigation.state.params.selected_car_model.name + " "+this.props.navigation.state.params.selected_car_year.name:this.props.navigation.state.params.selected_car.model_id.name + " "+this.props.navigation.state.params.selected_car.model_year_end,
				chassis: this.props.navigation.state.params.selected_car.chassis,
				preferences: this.props.navigation.state.params.preferences
			})
			}>

				<View style={styleClusterErrorScreen.listItem}>
					<Text style={styleClusterErrorScreen.listItemText}>
						{item.title}
					</Text>
					<Image source={require('../resources/icons/arrow-big.png')} />
				</View>
			</TouchableWithoutFeedback>
		);
	};

	render() {
		var image = this.props.navigation.state.params.selected_car_model ?this.props.navigation.state.params.selected_car_model.image : this.props.navigation.state.params.selected_car.model_id.image;
		return (
			<View style={{ backgroundColor: 'white', zIndex: 1, flex: 1 }}>
				<View style={{ position: 'absolute', zIndex: 0 }}>
					<View style={{ zIndex: 2 }}>
						<StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>
						<NavigationComponent
							navigation={this.props.navigation}
							title={this.props.navigation.state.params.selected_car_model ? this.props.navigation.state.params.selected_car_model.name + " "+this.props.navigation.state.params.selected_car_year.name:this.props.navigation.state.params.selected_car.model_id.name + " "+this.props.navigation.state.params.selected_car.model_year_end}
							subTitle={__('Cluster error' , this.props.language)}
							goBack={() => this.props.navigation.goBack()}
						/>
					</View>
				</View>
				{/* <View style={{
                    backgroundColor: "red",
                    width: metrics.deviceWidth, height: 208,
                    marginTop: metrics.statusBarHeight + metrics.navBarHeight - 10,
                    zIndex: -1
                }}></View> */}
				<View
					style={{
						zIndex: -1,
						marginTop: height*0.06,
					}}
				>
					<ImageBackground
						style={{
							aspectRatio: 1.7777,
							alignItems: 'center',
							justifyContent: 'center',
						}}
						source={require('../resources/icons/car_area_bg.png')}
					>
						<Image
							style={{ flex: 1,  aspectRatio: 1.5, resizeMode: 'contain' }}
							
							source={{uri:IMG_PREFIX_URL+image}}
						/>
					</ImageBackground>
				</View>
				<View style={{ flex: 1, backgroundColor: 'white' }}>
					<View
						style={{
							flexDirection: 'row',
							paddingHorizontal: metrics.doubleBasePadding,
							height: 66,
							borderBottomWidth: 1,
							borderBottomColor: 'rgba(6,0,41, 0.2)',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<TextInput
							style={{ flex: 1 , color: colors.navgationBar, fontFamily: Fonts.CircularBlack }}
							placeholder={__('Type the error displayed' , this.props.language)}
							placeholderTextColor='rgba(14,45,60, 0.4)'
							onChangeText={(text) => {
									this.setState({ text: text });
									if (text.length == 0) {
										Keyboard.dismiss()
										this.setState({ errorList: this.state.serverErrorList })
									}
								}
							}
							value={this.state.text}
							underlineColorAndroid="transparent"
							onSubmitEditing={this.onSearchPress}
						/>
						<TouchableOpacity onPress={this.onSearchPress}>
							<Image
								style={{ width: 40, height: 40 }}
								source={require('../resources/icons/search.png')}
							/>
						</TouchableOpacity>
					</View>
					<FlatList
						data={this.state.errorList}
						renderItem={this.renderItem}
						keyExtractor={(item, index) => index.toString()}
						ListEmptyComponent={this.ListEmptyView}
					/>
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

export default connect(mapStateToProps, null)(ClusterErrorScreen);

const styleClusterErrorScreen = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white,
		position: 'absolute',
		zIndex: 0,
	},
	listItem: {
		backgroundColor: 'white',
		width: metrics.deviceWidth - 24,
		height: metrics.deviceWidth * 0.18,
		borderRadius: 12,
		// borderWidth: 0.8,
		borderWidth: 1,
		borderColor: '#EFEFF4',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: metrics.smallPadding,
		margin: metrics.baseMargin,
		//elevation: 1 for shadow in android
	},
	listItemText: {
		color: '#1E313E',
		fontSize: 14,
		width: metrics.deviceWidth - 100,
		marginLeft: 10,
		// fontFamily: Fonts.CircularBook,
		fontFamily: Fonts.circular_book
	},
});
