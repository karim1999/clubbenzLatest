import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	StatusBar,
	Text,
	FlatList,
	TouchableOpacity,
	Dimensions,
	Image,
	ImageBackground,
	TouchableWithoutFeedback,
	Platform,
	Linking,
	I18nManager,
	ScrollView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { styles, fonts, colors, metrics } from '../themes';
import { Width } from '../config/dimensions';
import { Fonts } from '../resources/constants/Fonts';
import { connect } from 'react-redux';
import __ from '../resources/copy';
import * as homeAction from "./../redux/actions/home";

const { width, height } = Dimensions.get('window');

class PrivacyScreen extends Component {
	constructor(props) {
		super(props);
	}

	state = {
		text: ''
	};

	componentDidMount() {
		homeAction.privacyService().then(res => {
            if (res && res.data_privacy) {
                this.setState({ text: this.props.language == 'ar' ? res.data_privacy[0].name_ar : res.data_privacy[0].name_en });
            }
        })
	}

	render() {
		return (
			<View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
                <View style={{height: height / 3}}>
                    <StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>
                    <ImageBackground
                        source={require('../resources/images/bg_top.png')}
                        style={{width: '100%', height: '100%', flex: 1}} >
                        <View style={{ backgroundColor:'transparent'}}>
                            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                <View style={{  marginLeft: 20,marginTop: Platform.OS == 'android' ? 10 : 25, height: 32,width: 32 }}>
                                    <Image
                                        source={require('../resources/images/ic-back.png')}
                                        style={{ flex: 1, height: 32, width: 32, resizeMode: 'contain', transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]  }}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[{justifyContent:"center",alignItems:'center'}]}>
                            <Image style={{ marginTop: 50 }} source={require('../resources/images/logo_big.png')} />
                        </View>
                    </ImageBackground>
                </View>
				<ScrollView style={{ flexWrap: 'wrap', flex: 1 }}>
                    <View style={{
                                        width: metrics.deviceWidth,
                                        marginTop: -20,
                                        backgroundColor: colors.white,
                                        borderTopEndRadius: metrics.radius15,
                                        borderTopStartRadius: metrics.radius15,
                                        flex: 1,
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        paddingLeft: 20,
                                        paddingRight: 20,
                                        paddingTop: 20}}>
                        <View style={{marginBottom: 20}}>
                            <Text style={{
                                    textAlign: 'center',
                                    // paddingHorizontal: width * 0.01,
                                    marginTop: width * 0.025,
                                    // fontSize: width * 0.043,
                                    fontSize: 16,
                                    color: '#000000',
                                    fontFamily: Fonts.circular_book,
                                    paddingHorizontal: Width(2.9),
                                }}>
                                {this.state.text}
                            </Text>
                        </View>
                    </View>
				</ScrollView>
		    </View>
		);
	}
}

mapStateToProps = state => {
  return {
    language: state.language
  };
};

export default connect(mapStateToProps, null)(PrivacyScreen);
