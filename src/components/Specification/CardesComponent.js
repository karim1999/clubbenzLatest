import React, { Component } from 'react';
import { I18nManager, Text, View, Image, Dimensions, ImageBackground, ScrollView, TouchableOpacity, Modal, Linking, ActivityIndicator } from 'react-native';
import Antdesg from 'react-native-vector-icons/AntDesign';
import { colors } from '../../themes';
const right = <Antdesg name="arrowright" size={30} color="#273946" />;
const left = <Antdesg name="arrowleft" size={30} color="#273946" />;
import ImageViewer from 'react-native-image-zoom-viewer';
import { Fonts } from '../../resources/constants/Fonts';
import PDFView from 'react-native-view-pdf';
import {connect} from 'react-redux';

const { width, height } = Dimensions.get('window');
class CardesComponent extends Component {
	state = {
		modalVisible: false,
		isLoading: true
	};
	setModalVisible(visible) {
		this.setState({ modalVisible: visible });
	}
	_onPress = () => {
		if (this.props.imageLink && this.props.imageLink != '') {
			Linking.canOpenURL(this.props.imageLink)
			.then((supported) => {
				if (!supported) {
					console.log("Can't handle url: " + link);
				} else {
					return Linking.openURL(this.props.imageLink);
				}
			})
			.catch((err) => {
				console.log('An error occurred', err)});
		} else {
			if(this.props.imageLink != '' || this.props.imageUrl != '' ){
				if (this.props.modal) this.setModalVisible(!this.state.modalVisible);
			}
		}
	};
	componentDidMount(){
	}

	render() {
		return (
			<View style={{ flex: 1 , paddingBottom:15 }}>
				<Modal
					animationType="fade"
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() => {
						this.setState({ modalVisible: false, isLoading: true });
					}}
				>
					<View
						style={{
							width: width,
							height: height,

							paddingTop: height / 10,
							paddingLeft: width / 9,
							paddingRight: width / 9,
							paddingBottom: height / 11,
						}}
					>

						<View
							style={{
								borderWidth: 2,
								flex: 1,
								borderColor: 'grey',
								backgroundColor: '#FFFFFF',
							}}
						>
							{
								this.state.isLoading && <ActivityIndicator size="large" color="#493184" />
							}

						  {/* <Image
									source={{uri:this.props.imageUrl}}
									style={{ flex: 1, resizeMode: 'contain' }}
							/> */}
							{
								this.props.pdf ?
									<PDFView
										fadeInDuration={250.0}
										style={{ flex: 1 }}
										resource={this.props.imageLink != '' ? this.props.imageLink : this.props.imageUrl}
										resourceType={"url"}
										onLoad={() => this.setState({isLoading: false})}
										onError={() => this.setState({isLoading: false})}
									/>
									:
									<ImageViewer backgroundColor={"white"} imageUrls={[{url: this.props.imageUrl,props: {}}]}/>
							}
							<View
								style={{
									borderWidth: 1,
									borderColor: 'grey',
									position: 'absolute',
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
								<Image style={{width: 33, height: 33}} source={require('../../resources/images/cross_image.png')}/>
								{/* <Text >X</Text> */}
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>

				<TouchableOpacity onPress={this.props.onPress ? this.props.onPress : this._onPress}>
					<View
						style={{
							padding: 6,
							height: height / 12,
							width: width * 0.9,
							backgroundColor: 'white',
							borderWidth: 1,
							borderRadius: width * 0.02,
							borderColor: colors.lightGray,
							marginHorizontal: width * 0.05,
						}}
					>
						<View style={{ flex: 1, borderRadius: 7, flexDirection: 'row' }}>
							<View style={{ padding: 7, alignItems: 'flex-start', justifyContent: 'center' }}>
								<Text style={{ color: '#1E313E', fontSize: 13, fontFamily: Fonts.CircularBook }}>{this.props.content}</Text>
							</View>
							<View style={{ justifyContent: 'center', flex: 1, alignItems: 'flex-end' }}>{I18nManager.isRTL ? left: right}</View>
						</View>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}
mapStateToProps = state => {
	return {
		language: state.language,
	};
};

export default connect(mapStateToProps, null)(CardesComponent);
