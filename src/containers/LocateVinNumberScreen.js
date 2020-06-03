import React, { Component } from 'react';
import NavigationService from '../NavigationService';
import { Text, View, StatusBar, ImageBackground, Dimensions, Image, Animated, ScrollView, TouchableOpacity } from 'react-native';
import { fonts, styles, colors, metrics } from '../themes';
const { width, height } = Dimensions.get('window');
import {Height,Width} from '../config/dimensions';
import { Fonts } from '../resources/constants/Fonts';
import { connect } from 'react-redux';
import __ from '../resources/copy';
import NavigationComponent from '../components/navigation/navigation';
const howto_shops = require('../resources/images/howto_shops.png')

class LocateVinNumberScreen extends Component {
	constructor(props) {
		super(props);

		this.state = {
			animation: new Animated.Value(0),
			active_index:1
		};
    }
    chooseManually () {
		NavigationService.navigate('CarSelectionScreen');
	  }
	
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
		  
	}
	render() {
		return (
			<View style={{ flex: 1 }}>
                <StatusBar hidden={false} backgroundColor={colors.navgationBar } barStyle='light-content'/>
				<NavigationComponent					navigation={this.props.navigation}
														goBack={() => this.props.navigation.goBack()} title={__("Simply locate your Vin" , this.props.language)} subTitle={__("In one of 3 places" , this.props.language)}/>
				
				<View
						style={[ 
							styles.center,
							{
								
								height: Height(26),
								width: Width(100),
								zIndex: -1,
								alignSelf: 'center',
							}
						]}
					>
                        {this.state.active_index==1?<Image
							source={require('../resources/images/screen60img.jpg')}
							resizeMode='cover'
							style={{ width: width, height: Height(32) }}
                        />:null}
						{this.state.active_index==2?<Image
							source={require('../resources/images/screen61img.jpg')}
							resizeMode='cover'
							style={{ width: width, height: Height(32) }}
                        />:null}
						{this.state.active_index==3?<Image
							source={require('../resources/images/screen62img.jpg')}
							resizeMode='cover'
							style={{ width: width, height: Height(32) }}
                        />:null}
                </View>
				<View
					style={{
						width: width,
						height: Height(30),
					}}
				>
                    
					<View style={{ position: 'absolute', }}>
						<View
							style={{
								backgroundColor: '#fff',
								width: width,
								borderTopLeftRadius: width * 0.05,
								borderTopRightRadius: width * 0.05,
								backgroundColor: '#fff',
								marginBottom: 10,
							}}
						>
                        <View style= {{marginTop: Height(30)}}>
                    <Text
                        style={{
                            textAlign: 'center',
                            paddingHorizontal: Width(2.9),
                            marginTop: width * 0.04,
                            fontSize: width * 0.038,
                            color: '#000000',
							fontFamily: Fonts.circular_book,
							backgroundColor: '#fff',
                        }}
                    >{__('If you find it hard you still can' , this.props.language)}</Text>
					
                    <TouchableOpacity onPress={this.chooseManually}>
                        <View style = {
                            {
                                width: metrics.deviceWidth - 40,
                                height: 60,
                                justifyContent: 'center',
                                alignSelf: 'center',
                                backgroundColor: "transparent",
                                borderColor: '#11455F',
                                borderWidth: 1,
                                borderStyle: 'solid',
                                borderRadius: metrics.radius40,
                                marginTop: 14,
                            }
                        }>
                            <Text style={{
                                textAlign: 'center',
                                paddingHorizontal: Width(2.9),
                                fontSize: width * 0.05,
                                color: '#11455F',
                                fontFamily: Fonts.circular_book,
                            }}>{__('Choose your car manually' , this.props.language)}</Text>
                        </View>
                    </TouchableOpacity>
                    </View>
                    </View>

                        
					</View>
                    
					<ScrollView
						overScrollMode="never"
						//style={{ flex: 1 }}
						pagingEnabled
						horizontal
						scrollEventThrottle={16}
                        onScroll={this.__changeView}
						showsHorizontalScrollIndicator={false}
						style={{ borderRadius: 25, zIndex: 1, }}
					>
						<View style={{ width: width, height: 100, justifyContent: 'center', }}>
							<Text
								style={[
									{
										fontSize: width * 0.055,
										color: '#11455F',
										textAlign: 'center',
										paddingHorizontal: width * 0.2,
										marginTop: width * 0.125,
										fontFamily: Fonts.circular_black,
										backgroundColor: '#fff'
									},
								]}
							>
								{__('Windshield' , this.props.language)}
							</Text>
							<Text
								style={{
									textAlign: 'center',
									// paddingHorizontal: width * 0.05,
									paddingHorizontal: Width(2.9),
									marginTop: width * 0.04,
									fontSize: width * 0.038,
									// fontSize: 16,
									fontSize: width * 0.038,
									color: '#000000',
									fontFamily: Fonts.circular_book,
								}}
							>
								{__('Can be viewed through the nearside base of the front windshield in bold white lettering.' , this.props.language)}</Text>
						</View>

						<View style={{ width: width, height: 80, justifyContent: 'center' }}>
							<Text
								style={[
									{
										fontSize: width * 0.055,
										color: '#11455F',
										textAlign: 'center',
										paddingHorizontal: width * 0.2,
										marginTop: width * 0.125,
										fontFamily: Fonts.circular_black,
										backgroundColor: '#fff'
									},
								]}
							>
								{__('Side Door Jam' , this.props.language)}
							</Text>
							<Text
								style={{
									textAlign: 'center',
									// paddingHorizontal: width * 0.05,
									paddingHorizontal: Width(2.9),
									marginTop: width * 0.04,
									fontSize: width * 0.038,
									// fontSize: 16,
									fontSize: width * 0.038,
									color: '#000000',
									fontFamily: Fonts.circular_book,
								}}
							>
								{__('Certification label below passenger’s door latch' , this.props.language)}</Text>
						</View>

						<View style={{ width: width, height: 80, justifyContent: 'center' }}>
							<Text
								style={[
									{
										fontSize: width * 0.055,
										// fontWeight: 'bold',
										color: colors.blueText,
										textAlign: 'center',
										paddingHorizontal: width * 0.2,
										marginTop: width * 0.125,
										fontFamily: Fonts.circular_black,
										backgroundColor: '#fff'
									},
								]}
							>
								{__('Passenger seat' , this.props.language)}
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
									backgroundColor: '#fff'
								}}
							>
								{__('Engraved under right passenger side rear seat' , this.props.language)}
							</Text>
						</View>
					</ScrollView>
                    <View
						style={{
							position: 'absolute',
							top: height * 0.25,
							width: width,
							flexDirection: 'row',
							justifyContent: 'center',
							zIndex: 3,
						}}
					>	
                    
						<ScrollView
						overScrollMode="never"
						style={{ flex: 1, }}
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
						</View>
						</ScrollView>
                        
					</View>
                    
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

export default connect(mapStateToProps, null)(LocateVinNumberScreen);