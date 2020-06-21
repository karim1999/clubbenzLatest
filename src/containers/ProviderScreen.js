import React, { PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    Image,
    ImageBackground,
    StatusBar, I18nManager,
} from 'react-native';

import TabNavigator from "../ProviderTabNavigator";

import { colors, styles, metrics } from "../themes";
import NavigationService from "../NavigationService";
import { connect } from 'react-redux';
import __ from '../resources/copy';

import { Fonts } from '../resources/constants/Fonts';

import {getProviderDetails} from "../redux/actions/provider";
import {IMG_PREFIX_URL} from "../config/constant";

class ProviderScreen extends PureComponent {

    constructor(props) {
        super(props);
        this.getProviderData();
        this.state.provider= this.props.navigation.state.params.provider
    }
    state = {
        provider : {}
    };
    getProviderData() {
        getProviderDetails(this.props.navigation.state.params.provider.id).then(provider => {
            this.setState({provider});
        })
    }

    goToBackScreen = () => {
        NavigationService.goBack();
    };


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: colors.black, }}>
                <StatusBar
                    hidden={false}
                    backgroundColor={colors.navgationBar}
                />

                <ImageBackground
                    style={styleProviderScreen.backgroundImage}
                    source={{ uri: this.state.provider.store_name }}
                >
                    <ImageBackground
                        style={styleProviderScreen.backgroundImage1}
                        source={require('../resources/images/transparent-layer-1.png')}
                    >
                        <View style={styleProviderScreen.topBar}>
                            <TouchableWithoutFeedback onPress={this.goToBackScreen}>
                                <Image
                                    resizeMode="contain"
                                    style={[styleProviderScreen.topBarImage, {transform: [{scaleX: I18nManager.isRTL ? -1 : 1}] }]}
                                    source={require("../resources/images/ic-back.png")}
                                />
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={styleProviderScreen.shopLogoContainer}>
                            <Image
                                resizeMode="cover"
                                style={styleProviderScreen.shopLogo}
                                source={{ uri: IMG_PREFIX_URL + this.state.provider.logo }}
                            />
                            <Text style={styleProviderScreen.shopName}>
                                {this.state.provider.store_name}
                            </Text>
                        </View>

                    </ImageBackground>
                </ImageBackground>
                <View
                    style={{
                        flex: 600
                    }}
                />

                <View style={styleProviderScreen.tabNavigatorContainer}>
                    <TabNavigator screenProps={{provider: this.state.provider}} preferences={this.props.preferences} language={this.props.language} />
                </View>
            </View>
        );
    }
}

mapStateToProps = (state) => {
    return {
        language: state.language,
        preferences: state.init.preferences,
    }
}

export default connect(mapStateToProps, null)(ProviderScreen)

const styleProviderScreen = StyleSheet.create({
    backgroundImage: {
        flex: 400,
        width: metrics.deviceWidth,
        // paddingTop: 20,
        // paddingLeft: 10,
        // paddingRight: 10,
    },
    backgroundImage1: {
        width: metrics.deviceWidth,
        flex: 400

    },
    topBar: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        flex: 0.3,
        width: metrics.deviceWidth,
        marginTop: 15,

        // backgroundColor: 'rgba(17,69,95, 0.32)',

        // paddingHorizontal: metrics.deviceWidth * 0.01,
    },
    topBarImage: {
        width: 32,
        height: 32,
        marginHorizontal: 10,
        marginTop: 10
    },
    shopLogo: {
        width: 66,
        height: 66
    },
    shopLogoContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: metrics.smallMargin
    },
    shopName: {
        color: colors.white,
        fontSize: metrics.deviceWidth * 0.07,
        textAlign: "center",
        fontFamily: Fonts.CircularBold,
    },
    tabNavigatorContainer: {
        width: metrics.deviceWidth,
        flex: 600,
        height: metrics.deviceHeight / 1.6,
        position: "absolute",
        backgroundColor: colors.white,
        borderTopEndRadius: metrics.radius20,
        borderTopStartRadius: metrics.radius20,
        bottom: 0,
        left: 0,
        right: 0
    },

    btnText: {
        fontSize: 18,
        color: '#11455F',
        fontFamily: Fonts.CircularBold,
    },
    modalInnerView: {
        // borderTopEndRadius: metrics.radius15,
        // borderTopStartRadius: metrics.radius15,
        borderRadius: metrics.radius15,
    },
    modelStyle: {
        flex: 0.7,
        justifyContent: 'flex-end',
        marginRight: metrics.deviceWidth - (metrics.deviceWidth - 5),
        marginLeft: metrics.deviceWidth - (metrics.deviceWidth - 5),
        borderRadius: metrics.radius15,
    },
    btnStyle: {
        width: metrics.deviceWidth - 10,
        height: 60,
        borderWidth: 0.7,
        borderTopWidth: 0.5,
        borderBottomWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderStyle: 'solid',
        alignItems: "center",
        justifyContent: 'center',
        // borderColor: '#3F3F3F',
    },

    cancelBtnStyle: {
        width: metrics.deviceWidth - 10,
        height: 60,
        marginTop: 15,
        marginBottom: 20,
        backgroundColor: '#E6EFF9',
        borderRadius: metrics.radius40,
        alignItems: "center",
        justifyContent: 'center',
    },
    cancelBtnText: {
        color: '#0E2D3C',
        fontSize: 18,
        fontFamily: Fonts.CircularBold,
        textAlign: 'center',
    },

});
