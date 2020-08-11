import React, { Component } from 'react';
import { Text, View, ImageBackground, Dimensions, Image, Animated, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { fonts, styles, colors, metrics } from '../themes';
const { width, height } = Dimensions.get('window');
import {Height,Width} from '../config/dimensions'
import { Fonts } from '../resources/constants/Fonts';
import { connect } from 'react-redux';
import __ from '../resources/copy';

const howto_full_service = require('../resources/images/howto_full_service.png')
const howto_shops = require('../resources/images/howto_shops.png')
const howto_ratings = require('../resources/images/howto_ratings.png')
const howto_cluster_error = require('../resources/images/howto_cluster_error.png')
const howto_car_parts = require('../resources/images/how_to_carparts.png')

class HowToScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			animation: new Animated.Value(0),
			active_index:1
		};
	}
	scrollToEnd = () => this.carousel.scrollToEnd({ animated: false });
	scrollToEnd2 = () => this.carousel2.scrollToEnd({ animated: false });

	__changeView=(event: Object)=>{
		  if (event.nativeEvent.contentOffset.x == 0) {
			 this.setState({ active_index: 1 })
		  }
		  else if(event.nativeEvent.contentOffset.x.toFixed(0) == width.toFixed(0)){
			 this.setState({ active_index: 2 })
		  }
		  else if(event.nativeEvent.contentOffset.x.toFixed(0) == (width*2).toFixed(0))
		  {
		     this.setState({ active_index: 3})
		  }
		  else if(event.nativeEvent.contentOffset.x.toFixed(0) == (width*3).toFixed(0))
		  {
		     this.setState({ active_index: 4})
		  }
		  else if(event.nativeEvent.contentOffset.x.toFixed(0) == (width*4).toFixed(0))
		  {
		     this.setState({ active_index: 5})
		  }
	}
	render() {
		const image1Opacity = this.state.animation.interpolate({
			inputRange: [0, width],
			outputRange: [1, 0],
			extrapolate: 'clamp',
		});
		const image2Opacity = this.state.animation.interpolate({
			inputRange: [0, width, width * 2],
			outputRange: [0, 1, 0],
			extrapolate: 'clamp',
		});
		const image3Opacity = this.state.animation.interpolate({
			inputRange: [width, width * 2, width * 3],
			outputRange: [0, 1, 0],
			extrapolate: 'clamp',
		});
		const image4Opacity = this.state.animation.interpolate({
			inputRange: [width * 2, width * 3, width * 4],
			outputRange: [0, 1, 0],
			extrapolate: 'clamp',
		});
		const textPosition = this.state.animation.interpolate({
			inputRange: [width * 2, width * 2.1, width * 3, width * 4],
			outputRange: [0, height * 0.05, height * 0.05, 0],
			extrapolate: 'clamp',
		});
		return (
			<View style={{ flex: 1 }}>
				<ImageBackground
					style={{ flex: 1 }}
					imageStyle={{
						resizeMode: 'cover',
						width: width * 1.9,
						height: height * 1.1,
						left: -width * 0.62,
					}}
					source={require('../resources/images/bg_top.png')}
				>
					<View
						style={{
							// width: Width(13.15),
							// height: Height(8),
							width: width * 0.13,
							height: width * 0.13,
							alignSelf: 'center',
							// marginTop: height * 0.07,
							marginTop: height * 0.055,
						}}
					>
						<Image
							style={{ flex: 1, height: null, width: null,}}
							source={require('../resources/images/white-logo.png')}
						/>
					</View>
				</ImageBackground>
				<View
					style={{
						width: width,
						height: Height(85),
						top: Height(20),
					}}
				>

					{
						this.props.language.isArabic ?
							<View
								style={[
									{
										position: 'absolute',
										top: Height(-15),
									}
								]}
							>

								{this.state.active_index==5?<Image
									source={howto_full_service}
									style={{ height: Height(48.5), width: Width(77.6), marginHorizontal:Width(11.2) }}
									resizeMode="cover"
								/>:null}
								{this.state.active_index==4?<Image
									source={howto_shops}
									style={{ height: Height(48.5), width: Width(77.6), marginHorizontal:Width(11.2) }}
									resizeMode="cover"
								/>:null}
								{this.state.active_index==3?<Image
									source={howto_ratings}
									style={{ height: Height(48.5), width: Width(77.6), marginHorizontal:Width(11.2) }}
									resizeMode="cover"
								/>:null}
								{this.state.active_index==2?<Image
									source={howto_cluster_error}
									style={{ height: Height(48.5), width: Width(77.6), marginHorizontal:Width(11.2) }}
									resizeMode="cover"
								/>:null}
								{this.state.active_index==1?<Image
									source={howto_car_parts}
									style={{ height: Height(48.5), width: Width(77.6), marginHorizontal:Width(11.2) }}
									resizeMode="cover"
								/>:null}
							</View>
							:
							<View
								style={[
									{
										position: 'absolute',
										top: Height(-15),
									}
								]}
							>

								{this.state.active_index==1?<Image
									source={howto_full_service}
									style={{ height: Height(48.5), width: Width(77.6), marginHorizontal:Width(11.2) }}
									resizeMode="cover"
								/>:null}
								{this.state.active_index==2?<Image
									source={howto_shops}
									style={{ height: Height(48.5), width: Width(77.6), marginHorizontal:Width(11.2) }}
									resizeMode="cover"
								/>:null}
								{this.state.active_index==3?<Image
									source={howto_ratings}
									style={{ height: Height(48.5), width: Width(77.6), marginHorizontal:Width(11.2) }}
									resizeMode="cover"
								/>:null}
								{this.state.active_index==4?<Image
									source={howto_cluster_error}
									style={{ height: Height(48.5), width: Width(77.6), marginHorizontal:Width(11.2) }}
									resizeMode="cover"
								/>:null}
								{this.state.active_index==5?<Image
									source={howto_car_parts}
									style={{ height: Height(48.5), width: Width(77.6), marginHorizontal:Width(11.2) }}
									resizeMode="cover"
								/>:null}
							</View>
					}


					<View style={{ position: 'absolute', justifyContent: 'flex-end', height: '100%' }}>
						<View
							style={{
								backgroundColor: '#fff',
								width: width,
								height:Height(52) ,
								borderTopLeftRadius: width * 0.05,
								borderTopRightRadius: width * 0.05,
								borderTopColor: '#000000',
								borderWidth: 0.5,
							}}
						/>
					</View>
					<View
						style={{
							position: 'absolute',
							bottom: height * 0.22,
							width: width,
							height: Platform.OS === 'ios' ? 70 : 60,
							// height: 60,

							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							zIndex:999,
						}}
					>
						{
							this.props.language.isArabic ?
								<ScrollView
									ref={it => {
										this.carousel2 = it;
									}}
									onContentSizeChange={this.scrollToEnd2}
									overScrollMode="never"
									style={{ flex: 1 }}
									pagingEnabled
									horizontal
									scrollEventThrottle={16}
									onScroll={Animated.event([
										{
											nativeEvent: {
												contentOffset: {
													x: this.state.animation,
												},
											},
										},
									])}
								>
									<View style={{ width: width, height: '100%', justifyContent: 'center',flexDirection:'row' }}>
										{this.state.active_index!=1?<View
											style={{
												height: width * 0.01,
												borderRadius: width * 0.01,
												width: width * 0.05,
												backgroundColor: this.state.active_index==1?'#11455F':'#e6eff9',
											}}
										/>:null}
										{this.state.active_index!=1?<View
											style={{
												height: width * 0.01,
												borderRadius: width * 0.01,
												width: width * 0.05,
												marginLeft: width * 0.02,
												backgroundColor: this.state.active_index==2?'#11455F':'#e6eff9',
											}}
										/>:null}
										{this.state.active_index!=1?<View
											style={{
												height: width * 0.01,
												borderRadius: width * 0.01,
												width: width * 0.05,
												marginLeft: width * 0.02,
												backgroundColor: this.state.active_index==3?'#11455F':'#e6eff9',
											}}
										/>:null}
										{this.state.active_index!=1?<View
											style={{
												height: width * 0.01,
												borderRadius: width * 0.01,
												width: width * 0.05,
												marginLeft: width * 0.02,
												backgroundColor: this.state.active_index==4?'#11455F':'#e6eff9',
											}}
										/>:null}
										{this.state.active_index!=1?<View
											style={{
												height: width * 0.01,
												borderRadius: width * 0.01,
												width: width * 0.05,
												marginLeft: width * 0.02,
												backgroundColor: this.state.active_index==5?'#11455F':'#e6eff9',
											}}
										/>:null}
										{this.state.active_index==1?
											<TouchableOpacity style={styles.center} activeOpacity={0.8} onPress={() => this.props.navigation.navigate('LoginScreen')}>
												<View
													style={[
														styles.center,
														{
															justifyContent: 'center',
															alignItems: 'center',
															backgroundColor: '#11455f',
															zIndex: 1,
															// alignSelf: 'center',
															// borderRadius: width * 0.15,
															borderRadius: 50,
															borderWidth: 1,
															borderColor: '#11455f',
															height: 60,
															width: metrics.deviceWidth - 40,
															fontFamily: Fonts.CircularMedium,
														}

													]}>
													<Text
														style={{ color: '#FFFFFF',
															// height: 60,
															// paddingVertical: height * 0.01,
															// paddingHorizontal: width * 0.32,
															fontSize: fonts.size.h11,
															fontFamily: Fonts.circular_medium,
															textAlignVertical: 'center'}}>
														{__('Get Started' , this.props.language)}
													</Text>
												</View>
											</TouchableOpacity>:<View
												style={{
													height: width * 0.01,
													borderRadius: width * 0.01,
												}}
											/>}
									</View>
								</ScrollView>
								:
								<ScrollView
									overScrollMode="never"
									style={{ flex: 1 }}
									pagingEnabled
									horizontal
									scrollEventThrottle={16}
									onScroll={Animated.event([
										{
											nativeEvent: {
												contentOffset: {
													x: this.state.animation,
												},
											},
										},
									])}
								>
									<View style={{ width: width, height: '100%', justifyContent: 'center',flexDirection:'row' }}>
										{this.state.active_index!=5?<View
											style={{
												height: width * 0.01,
												borderRadius: width * 0.01,
												width: width * 0.05,
												backgroundColor: this.state.active_index==1?'#11455F':'#e6eff9',
											}}
										/>:null}
										{this.state.active_index!=5?<View
											style={{
												height: width * 0.01,
												borderRadius: width * 0.01,
												width: width * 0.05,
												marginLeft: width * 0.02,
												backgroundColor: this.state.active_index==2?'#11455F':'#e6eff9',
											}}
										/>:null}
										{this.state.active_index!=5?<View
											style={{
												height: width * 0.01,
												borderRadius: width * 0.01,
												width: width * 0.05,
												marginLeft: width * 0.02,
												backgroundColor: this.state.active_index==3?'#11455F':'#e6eff9',
											}}
										/>:null}
										{this.state.active_index!=5?<View
											style={{
												height: width * 0.01,
												borderRadius: width * 0.01,
												width: width * 0.05,
												marginLeft: width * 0.02,
												backgroundColor: this.state.active_index==4?'#11455F':'#e6eff9',
											}}
										/>:null}
										{this.state.active_index==5?
											<TouchableOpacity style={styles.center} activeOpacity={0.8} onPress={() => this.props.navigation.navigate('LoginScreen')}>
												<View
													style={[
														styles.center,
														{
															justifyContent: 'center',
															alignItems: 'center',
															backgroundColor: '#11455f',
															zIndex: 1,
															// alignSelf: 'center',
															// borderRadius: width * 0.15,
															borderRadius: 50,
															borderWidth: 1,
															borderColor: '#11455f',
															height: 60,
															width: metrics.deviceWidth - 40,
															fontFamily: Fonts.CircularMedium,
														}

													]}>
													<Text
														style={{ color: '#FFFFFF',
															// height: 60,
															// paddingVertical: height * 0.01,
															// paddingHorizontal: width * 0.32,
															fontSize: fonts.size.h11,
															fontFamily: Fonts.circular_medium,
															textAlignVertical: 'center'}}>
														{__('Get Started' , this.props.language)}
													</Text>
												</View>
											</TouchableOpacity>:<View
												style={{
													height: width * 0.01,
													borderRadius: width * 0.01,
													width: width * 0.05,
													marginLeft: width * 0.02,
													backgroundColor: '#e6eff9',
												}}
											/>}
									</View>
								</ScrollView>
						}
					</View>
					{
						this.props.language.isArabic ?
							<ScrollView
								ref={it => {
									this.carousel = it;
								}}
								onContentSizeChange={this.scrollToEnd}
								overScrollMode="never"
								style={{ flex: 1 }}
								pagingEnabled
								horizontal
								scrollEventThrottle={16}
								onScroll={this.__changeView}
							>
								<View style={{ width: width, justifyContent: 'center'  }}>
									<Text
										style={[
											{
												fontSize: width * 0.055,
												color: colors.blueText,
												textAlign: 'center',
												paddingHorizontal: width * 0.2,
												// marginTop: width * 0.05,
												marginTop: width * 0.01,
												fontFamily: Fonts.circular_black,
											},
										]}
									>
										{__('Parts hub' , this.props.language)}
									</Text>
									<Text
										style={{
											textAlign: 'center',
											// paddingHorizontal: width * 0.05,
											paddingHorizontal: Width(2.9),
											marginTop: width * 0.04,
											fontSize: width * 0.038,
											color: '#000000',
											fontFamily: Fonts.circular_book,
										}}
									>
										{__('Get access to the largest spare parts store through simple clicks with verified reviews and feedback from other members.' , this.props.language)}
									</Text>
								</View>
								<View style={{ width: width, height: '95%', justifyContent: 'center' }}>
									<Text
										style={[
											{
												fontSize: width * 0.055,
												color: colors.blueText,
												textAlign: 'center',
												marginTop: width * 0.1,
												fontFamily: Fonts.circular_black,
											},
										]}
									>
										{__('Learn about' , this.props.language)}
									</Text>
									<Text
										style={{
											textAlign: 'center',
											// paddingHorizontal: width * 0.05,
											paddingHorizontal: Width(2.9),
											marginTop: width * 0.04,
											fontSize: width * 0.038,
											color: '#000000',
											fontFamily: Fonts.circular_book,
										}}
									>
										{__(' About your cluster errors & messages with reasons & recommendations, you can also review others\' experience & add yours.' , this.props.language)}
									</Text>
								</View>
								<View style={{ width: width, height: '95%', justifyContent: 'center' }}>
									<Text
										style={[
											{
												fontSize: width * 0.055,
												// fontWeight: 'bold',
												color: colors.blueText,
												textAlign: 'center',
												paddingHorizontal: width * 0.2,
												marginTop: width * 0.12,
												fontFamily: Fonts.circular_black,
											},
										]}
									>
										{__('Your opinion matters' , this.props.language)}
									</Text>
									<Text
										style={{
											textAlign: 'center',
											// paddingHorizontal: width * 0.05,
											paddingHorizontal: Width(2.9),
											marginTop: width * 0.04,
											fontSize: width * 0.038,
											color: '#000000',
											fontFamily: Fonts.circular_book,
										}}
									>
										{__('Support your Benz community by rating your experience with the service provider.' , this.props.language)}
									</Text>
								</View>
								<View style={{ width: width, height: '95%', justifyContent: 'center' }}>
									<Text
										style={[
											{
												fontSize: width * 0.055,
												// fontWeight: 'bold',
												color: colors.blueText,
												textAlign: 'center',
												paddingHorizontal: width * 0.2,
												marginTop: width * 0.15,
												fontFamily: Fonts.circular_black,
											},
										]}
									>
										{__('Discover more.' , this.props.language)}
									</Text>
									<Text
										style={{
											textAlign: 'center',
											// paddingHorizontal: width * 0.05,
											paddingHorizontal: Width(2.9),
											marginTop: width * 0.04,
											fontSize: width * 0.038,
											color: '#000000',
											fontFamily: Fonts.circular_book,
										}}
									>
										{__('Quick and easy access to all the services around you, with verified & accredited reviews from other owners.' , this.props.language)}</Text>
								</View>
								<View style={{ width: width, height: '95%', justifyContent: 'center' }}>
									<Text
										style={[
											{
												fontSize: width * 0.055,
												color: '#11455F',
												textAlign: 'center',
												paddingHorizontal: width * 0.2,
												// marginTop: width * 0.125,
												marginTop: width * 0.07,
												fontFamily: Fonts.circular_black,
											},
										]}
									>
										{__('Enjoy a new experience' , this.props.language)}
									</Text>
									<Text
										style={{
											textAlign: 'center',
											// paddingHorizontal: width * 0.05,
											paddingHorizontal: Width(2.9),
											marginTop: width * 0.04,
											fontSize: width * 0.038,
											// fontSize: 16,
											color: '#000000',
											fontFamily: Fonts.circular_book,
										}}
									>
										{__('Please enable your location & notifications to get access to the nearest providers & promotions.' , this.props.language)}</Text>
								</View>



							</ScrollView>
							:
							<ScrollView
								overScrollMode="never"
								style={{ flex: 1 }}
								pagingEnabled
								horizontal
								scrollEventThrottle={16}
								onScroll={this.__changeView}
							>
								<View style={{ width: width, height: '95%', justifyContent: 'center' }}>
									<Text
										style={[
											{
												fontSize: width * 0.055,
												color: '#11455F',
												textAlign: 'center',
												paddingHorizontal: width * 0.2,
												// marginTop: width * 0.125,
												marginTop: width * 0.07,
												fontFamily: Fonts.circular_black,
											},
										]}
									>
										{__('Enjoy a new experience' , this.props.language)}
									</Text>
									<Text
										style={{
											textAlign: 'center',
											// paddingHorizontal: width * 0.05,
											paddingHorizontal: Width(2.9),
											marginTop: width * 0.04,
											fontSize: width * 0.038,
											// fontSize: 16,
											color: '#000000',
											fontFamily: Fonts.circular_book,
										}}
									>
										{__('Please enable your location & notifications to get access to the nearest providers & promotions.' , this.props.language)}</Text>
								</View>

								<View style={{ width: width, height: '95%', justifyContent: 'center' }}>
									<Text
										style={[
											{
												fontSize: width * 0.055,
												// fontWeight: 'bold',
												color: colors.blueText,
												textAlign: 'center',
												paddingHorizontal: width * 0.2,
												marginTop: width * 0.15,
												fontFamily: Fonts.circular_black,
											},
										]}
									>
										{__('Discover more.' , this.props.language)}
									</Text>
									<Text
										style={{
											textAlign: 'center',
											// paddingHorizontal: width * 0.05,
											paddingHorizontal: Width(2.9),
											marginTop: width * 0.04,
											fontSize: width * 0.038,
											color: '#000000',
											fontFamily: Fonts.circular_book,
										}}
									>
										{__('Quick and easy access to all the services around you, with verified & accredited reviews from other owners.' , this.props.language)}</Text>
								</View>

								<View style={{ width: width, height: '95%', justifyContent: 'center' }}>
									<Text
										style={[
											{
												fontSize: width * 0.055,
												// fontWeight: 'bold',
												color: colors.blueText,
												textAlign: 'center',
												paddingHorizontal: width * 0.2,
												marginTop: width * 0.12,
												fontFamily: Fonts.circular_black,
											},
										]}
									>
										{__('Your opinion matters' , this.props.language)}
									</Text>
									<Text
										style={{
											textAlign: 'center',
											// paddingHorizontal: width * 0.05,
											paddingHorizontal: Width(2.9),
											marginTop: width * 0.04,
											fontSize: width * 0.038,
											color: '#000000',
											fontFamily: Fonts.circular_book,
										}}
									>
										{__('Support your Benz community by rating your experience with the service provider.' , this.props.language)}
									</Text>
								</View>
								<View style={{ width: width, height: '95%', justifyContent: 'center' }}>
									<Text
										style={[
											{
												fontSize: width * 0.055,
												color: colors.blueText,
												textAlign: 'center',
												marginTop: width * 0.1,
												fontFamily: Fonts.circular_black,
											},
										]}
									>
										{__('Learn about' , this.props.language)}
									</Text>
									<Text
										style={{
											textAlign: 'center',
											// paddingHorizontal: width * 0.05,
											paddingHorizontal: Width(2.9),
											marginTop: width * 0.04,
											fontSize: width * 0.038,
											color: '#000000',
											fontFamily: Fonts.circular_book,
										}}
									>
										{__(' About your cluster errors & messages with reasons & recommendations, you can also review others\' experience & add yours.' , this.props.language)}
									</Text>
								</View>

								<View style={{ width: width, justifyContent: 'center'  }}>
									<Text
										style={[
											{
												fontSize: width * 0.055,
												color: colors.blueText,
												textAlign: 'center',
												paddingHorizontal: width * 0.2,
												// marginTop: width * 0.05,
												marginTop: width * 0.01,
												fontFamily: Fonts.circular_black,
											},
										]}
									>
										{__('Parts hub' , this.props.language)}
									</Text>
									<Text
										style={{
											textAlign: 'center',
											// paddingHorizontal: width * 0.05,
											paddingHorizontal: Width(2.9),
											marginTop: width * 0.04,
											fontSize: width * 0.038,
											color: '#000000',
											fontFamily: Fonts.circular_book,
										}}
									>
										{__('Get access to the largest spare parts store through simple clicks with verified reviews and feedback from other members.' , this.props.language)}
									</Text>
								</View>
							</ScrollView>


					}
				</View>

			</View>
		);
	}

}

mapStateToProps = (state) => {
	return {
		language: state.language,
	}
}

export default connect(mapStateToProps, null)(HowToScreen);
