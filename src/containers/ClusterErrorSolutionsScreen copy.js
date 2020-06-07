import React, { Component } from 'react';
import {
	View,
	ScrollView,
	Text,
	StyleSheet,
	StatusBar,
	FlatList,
	TouchableOpacity,
	ImageBackground,
	Dimensions,
	Modal,
	AsyncStorage,
	TextInput,
	Image,
} from 'react-native';
import NavigationComponent from '../components/navigation/navigation';
import { colors, styles, metrics, fonts } from '../themes';
import SplitHeading from '../components/common/splitHeading';
import ClusterErrorSolutionItem from '../components/error/clusterErrorSolutionItem';
import * as carAction from "../redux/actions/car_guide";
const {width,height} = Dimensions.get('window');
import ImageViewer from 'react-native-image-zoom-viewer';
import { IMG_PREFIX_URL } from '../config/constant';
import { Fonts } from '../resources/constants/Fonts';
import __ from '../resources/copy';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import * as authAction from './../redux/actions/auth'

class ClusterErrorSolutionsScreen extends Component {
	constructor(props) {
		super(props);
	}
	state = {
		count: 0,
		isLiked: false,
		errorSolutionList:[],
		modalVisible:false,
		error_details:[],
		solution: '',
		profile_picture: '',
    photo:{}
	};

	showImagePicker = () => {
		const options = {
				title: 'Select Avatar',
				maxWidth: 300,
				maxHeight: 300,
				storageOptions: {
						skipBackup: true,
						path: 'images',
				},
		};

		ImagePicker.showImagePicker(options, (response) => {
				console.log('Response = ', response);

				if (response.didCancel) {
						console.log('User cancelled image picker');
				} else if (response.error) {
						console.log('ImagePicker Error: ', response.error);
				} else if (response.customButton) {
						console.log('User tapped custom button: ', response.customButton);
				} else {
						const profile_picture = response.uri;
						const photo = response;
						this.setState({profile_picture , photo})
						// debugger
				}
		});
}

	componentDidMount(){
		this.get_Cluster_error_solution();
	  }
	  get_Cluster_error_solution = () =>{
		// alert('id' + this.props.navigation.state.params.errorDetail.id);
		// alert('token' + this.props.navigation.state.params.token);

	  carAction.get_Cluster_error_solution({cluster_error_id:this.props.navigation.state.params.errorDetail.id , token:this.props.navigation.state.params.token})
		  .then(res => {
			  if (res.success) {
		      this.setState({errorSolutionList:[]});
				  this.setState({errorSolutionList:res.data , error_details:res.error_details});
			  }
			})
	  }

	like = (solution_id , type) => {
		carAction.error_solution_like({token:this.props.navigation.state.params.token , type:type ,solution_id:solution_id})
		.then(res => {
			if (res.success) {
			//	alert("Feedback Submitted Successfully")
			this.get_Cluster_error_solution();
			}else{
			//	alert("You aleady submitted your Feedback")
			}
		  })

		// const self = this;
		// if (this.state.isLiked) {
		// 	self.setState({
		// 		count: self.state.count - 1,
		// 		isLiked: false,
		// 	});
		// } else {
		// 	self.setState({
		// 		count: self.state.count + 1,
		// 		isLiked: true,
		// 	});
		// }
	};

	zoomImage = (image) =>{
		// alert(image);
		this.setState({modalVisible:true , zoomImage:image});

	}


	renderItem = ({ item, index }) => {
		return (
			<ClusterErrorSolutionItem
			    errorSolution={item}
				key={item.id}
				data={item}
				rowIndex={index}
				refresh={this.get_Cluster_error_solution}
				like={this.like}
				zoomImage={this.zoomImage}
			/>
		);
	};

	findProvider = () => {

		// this.props.navigation.navigate('WorkShopListScreen' , {});
		// alert(JSON.stringify(this.state.error_details));
		// debugger

		if(this.state.error_details.shop_type == "partShop"){
			AsyncStorage.setItem("partShopId", this.state.error_details.shop_id);
			this.props.navigation.navigate("PartShopDetailScreen",{preferences:[]});
		}else if(this.state.error_details.shop_type == "serviceShop"){
			AsyncStorage.setItem("serviceShopId", this.state.error_details.shop_id);
			this.props.navigation.navigate("ServicesDetailScreen",{preferences:[]});
		}
		else{
			// alert(this.state.error_details.shop_id);
			AsyncStorage.setItem("workshopId", this.state.error_details.shop_id);
			this.props.navigation.navigate("WorkshopDetailScreen" ,{preferences:[]});
		}

	};

	addSolution = () => {
		this.setState({ modalVisible: true })
	}

	sendSolution = () => {
		AsyncStorage.getItem("user").then(value => {
			if (value != null) {

				var description = this.state.solution;
				var token = JSON.parse(value).token;
				var language = this.props.language.isArabic == true ? 'arabic' : 'english'

				const data = {
					language: language,
					description: description,
					picture :{
						name: this.state.photo.fileName,
						type: this.state.photo.type,
						uri: this.state.photo.uri,
					},
					token: token,
					cluster_error_id: this.props.navigation.state.params.errorDetail.id,
				}

				authAction.sendSolution(data).then(res=>{
					if (res.success) {
						alert('Solution Submitted Successfully')
						this.setState({ modalVisible: false })
					} else {
						setTimeout(() => {
              Toast.show(res.message,Toast.LONG)
            }, 100)
					}
				}).catch(err=>{
					alert(JSON.stringify(err))
				})

			}
		});
}

	render() {

		return (
			<View style={styleClusterErrorScreen.container}>
				<View style={{ position: 'absolute', zIndex: 0 }}>
					<View style={{ zIndex: 2 }}>
						<StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>
						<NavigationComponent
							navigation={this.props.navigation}
							title={this.props.navigation.state.params.title}
							subTitle={__('How can we help' , this.props.language)}
							goBack={() => this.props.navigation.goBack()}
						/>
					</View>
				</View>
				<View
					style={{
						zIndex: -1,
						marginTop: height*0.1,
					}}
				>
					<ImageBackground
						style={{
							aspectRatio: 1.7777,
						}}
						// source={require('../resources/images/car_error_sample-2.png')}
						source={{uri:IMG_PREFIX_URL+this.props.navigation.state.params.errorDetail.pic1}}

					/>
				</View>
				<View style={styleClusterErrorScreen.solutionsContainer}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<Text style={styleClusterErrorScreen.problemHeading}>
						{this.props.navigation.state.params.errorDetail ? this.props.navigation.state.params.errorDetail.title:"Dummy Tittle Stop vechile Shifts to p Leave "  }
						</Text>

						<Text numberOfLines={3} style={styleClusterErrorScreen.problemStatement}>
						{this.props.navigation.state.params.errorDetail ? (this.props.language.isArabic == true ? this.props.navigation.state.params.errorDetail.description_arabic : this.props.navigation.state.params.errorDetail.description):"Dummy Description Stop vechile Shifts to p Leave "  }
						</Text>

						<SplitHeading
							text={__('What might cause such error' , this.props.language)}
							headingStyle={{ padding: 5, marginVertical: 12, }}
							lineColor={{ backgroundColor: colors.grey93 }}
							textColor={{ color: colors.grey93, fontFamily: Fonts.CircularMedium, }}
						/>

						<FlatList
							data={this.state.errorSolutionList}
							renderItem={this.renderItem}
							keyExtractor={(item, index) => index.toString()}
							showsVerticalScrollIndicator={false}
							extraData={this.state}
						/>

              <TouchableOpacity onPress={() => this.addSolution()}>
							<View style={styleClusterErrorScreen.submitSolution}>
								<Text style={styleClusterErrorScreen.submitSolutionText}>{__('Add your solution to help others' , this.props.language)}</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={this.findProvider}>
							<View style={styleClusterErrorScreen.btnStyle}>
								<Text style={styles.tapButtonStyleTextBlue}>{__('Find a service provider' , this.props.language)}</Text>
							</View>
						</TouchableOpacity>
					</ScrollView>
				</View>

				<Modal
					animationType="fade"
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() => {
						this.setState({ modalVisible: false });
					}}
				>
				<ScrollView>
					<View
						style={{
							width: width,
							height: height / 2,

							paddingTop: height / 10,
							paddingLeft: width / 9,
							paddingRight: width / 9,
							paddingBottom: height / 11,

							// backgroundColor: 'black',
							flexDirection: 'row',
							justifyContent: 'flex-end',
							alignItems: 'flex-end',
							// opacity: 0.1,
						}}
					>
					</View>

					<View
						style={{
							width: width,
							height: height / 2,
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>

						<View style={{
							width: width / 1.1,
							// padding: 20,
							height: 100,
							backgroundColor: '#EFEFF4',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							borderWidth: 0.5,
							borderColor: 'grey',
							borderBottomWidth: 0,
						}}>

						<View
								style={{
									borderWidth: 1,
									borderColor: 'grey',
									position: 'absolute',
									backgroundColor: 'white',
									top: -15,
									right: -8,
									// backgroundColor: 'white',
									width: 33,
									height: 33,
									borderRadius: 16,
								}}
							>
								<TouchableOpacity
									style={{
										flex: 1,
										justifyContent:'center',
										alignItems:'center'
									}}
									onPress={() => this.setState({ modalVisible: false })}
								>
								<Image style={{width: 33, height: 33}} source={require('../resources/images/cross_image.png')}/>
								{/* <Text >X</Text> */}
								</TouchableOpacity>
						</View>


					<TextInput style={{
						flex: 0.7,
						height: 50,
						borderWidth: 1.5,
						borderColor: 'black',
						marginLeft: 10,
					}}
						placeholder='Enter Solution ...'
						placeholderTextColor='black'
						value={this.state.solution}
						textInputStyle={{ textAlign: "center", fontFamily: Fonts.CircularMedium, color: '#000000'}}
						onChangeText={solution => this.setState({ solution: solution })}
					/>

					<View style={{justifyContent: 'center', alignItems: 'center', flex: 0.3, height: 70}}>

					<TouchableOpacity onPress={() => this.showImagePicker()}>

					<Image source={this.state.profile_picture == '' ? require("../resources/icons/add-image.png") : {uri: this.state.profile_picture}} height={40} width={50} />

					</TouchableOpacity>

					</View>

					</View>

					<View style={{height: 50, width: width / 1.1, backgroundColor: '#EFEFF4', borderWidth: 0.5,
							borderColor: 'grey', borderTopWidth: 0, flexDirection: 'row',justifyContent: 'flex-end'}}>
						<TouchableOpacity onPress={() => this.sendSolution()}>
							<Image source={require('../resources/images/plus.png')} width={50} height={50} style={{width: 50, height: 50, marginRight: 20, marginBottom: 20}} />
						</TouchableOpacity>
					</View>



					</View>
					</ScrollView>

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

export default connect(mapStateToProps, null)(ClusterErrorSolutionsScreen);

const styleClusterErrorScreen = StyleSheet.create({
	container: {
		backgroundColor: 'black',
		zIndex: 1,
		flex: 1,
	},
	submitSolutionText:{
	color:	colors.grey93,
    textAlign: 'center',
    fontFamily: Fonts.CircularMedium,
		fontSize: fonts.size.h11,
	},
	listItemText: {
		color: '#344651',
		fontSize: 14,
	},
	btnStyle: {
		width: metrics.deviceWidth - 40,
		height: 60,
		justifyContent: 'center',
		alignSelf: 'center',
		backgroundColor: 'transparent',
		borderColor: colors.blueText,
		borderWidth: 1,
		borderStyle: 'solid',
		borderRadius: metrics.radius40,
		marginVertical: 4,
	},
	submitSolution:{
	  paddingVertical: 20,
	  borderColor: colors.grey93,
	  borderWidth: 1,
    borderStyle: 'dashed',
	  borderRadius: 8,
	  marginVertical: 12,

	},
	problemHeading: {
		marginTop: 12,
		color: colors.blueText,
		fontSize: 25,
		textAlign: 'center',
		fontFamily: Fonts.CircularBook,
	},
	problemStatement: {
		marginTop: 12,
		paddingHorizontal: metrics.doubleBaseMargin,
		color: '#060029',
		fontSize: 14,
		textAlign: 'center',
		fontFamily: Fonts.CircularBook,
	},
	solutionsContainer: {
		flex: 1,
		backgroundColor: 'white',
		zIndex: -1,
		marginTop: 0,
		borderTopStartRadius: metrics.radius20,
		borderTopEndRadius: metrics.radius20,
		padding: metrics.smallPadding,
		alignItems: 'center',
	},
});
