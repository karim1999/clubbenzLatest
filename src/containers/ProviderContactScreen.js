import React, { PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity, PermissionsAndroid, ScrollView,
} from "react-native";


import { colors, styles, metrics } from "../themes";
import NavigationService from "../NavigationService";
import { connect } from 'react-redux';
import __ from '../resources/copy';

import { Fonts } from '../resources/constants/Fonts';

import RNImmediatePhoneCall from "react-native-immediate-phone-call";
import SplitHeading from "../components/common/splitHeading";

class ProviderContactScreen extends PureComponent {

    constructor(props) {
        super(props);
        this.state.provider= this.props.provider
    }
    state = {
        provider : {}
    };

    requestCallPermission = async (item) => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CALL_PHONE,
                {
                    title: __("Get permission to call Providers", this.props.language),
                    message:
                        __("Clubenz needs the permission to call so you can reach the provider you want.", this.props.language),
                    buttonNeutral: __("Ask Me Later", this.props.language),
                    buttonNegative: __("Cancel", this.props.language),
                    buttonPositive: __("OK", this.props.language)
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // alert(JSON.stringify(item))
                RNImmediatePhoneCall.immediatePhoneCall(item)
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    render() {
        return (
            <View style={[styleProviderContactScreen.container]}>
                <SplitHeading
                    text={__("Location", this.props.language)}
                    headingStyle={{ padding: 5, marginTop: 15, marginBottom: 2 }}
                    lineColor={{ backgroundColor: 'rgba(6,0,41, 0.2)' }}
                    textColor={{ color: colors.grey93, fontFamily: Fonts.circular_medium }}
                />
                <View style={styleProviderContactScreen.innerContainer}>
                    <View>
                        <Text style={styleProviderContactScreen.shopAddress}>
                            <Text style={{color: "black"}}>{__("Address:", this.props.language)}</Text> {this.state.provider.address}
                        </Text>
                        <Text style={styleProviderContactScreen.shopAddress}>
                            <Text style={{color: "black"}}>{__("City:", this.props.language)}</Text> {this.state.provider.city}
                        </Text>
                        <Text style={styleProviderContactScreen.shopAddress}>
                            <Text style={{color: "black"}}>{__("State:", this.props.language)}</Text> {this.state.provider.governorate.name}
                        </Text>
                        <Text style={styleProviderContactScreen.shopAddress}>
                            <Text style={{color: "black"}}>{__("Country:", this.props.language)}</Text> {this.state.provider.country.name}
                        </Text>
                    </View>
                </View>
                <SplitHeading
                    text={__('Contact Us' , this.props.language)}
                    headingStyle={{ padding: 5, marginTop: 15, marginBottom: 2 }}
                    lineColor={{ backgroundColor: 'rgba(6,0,41, 0.2)' }}
                    textColor={{ color: colors.grey93, fontFamily: Fonts.circular_medium }}
                />
                <View style={{flex:1,backgroundColor:'white'}} >
                    <View style={styles.center}>
                        {/*<Text style={{height: 30, fontSize: 13,alignItems:"center", justifyContent: 'center', fontFamily: Fonts.CircularBold, color: '#5A5A5A', marginTop: 10, width: metrics.deviceWidth - 10, textAlign: 'center'}}>{__('Contact Us' , this.props.language)}</Text>*/}
                        <TouchableOpacity onPress={() => this.requestCallPermission(this.state.provider.user_mobile)}>
                            <View style={styleProviderContactScreen.btnStyle}>
                                <Text style={styleProviderContactScreen.btnText} >{this.state.provider.user_mobile}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
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

export default connect(mapStateToProps, null)(ProviderContactScreen)
const styleProviderContactScreen = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignContent: "center"
    },
    innerContainer: {
        flexDirection: "row",
        marginTop: metrics.margin18,
        justifyContent: "space-between",
        marginHorizontal: 18
    },
    shopAddress: {
        fontSize: 14,
        color: "#11455F",
        lineHeight: 22,
        width: 250,
        fontFamily: Fonts.circular_medium,
    },
    shopTimings: {
        lineHeight: 22,
        fontSize: 14
    },
    loactionCircleImage: {
        width: 106,
        height: 106,
        borderRadius: 80,
        justifyContent: "center",
        alignItems: "center"
    },
    innerLocationImage: {
        width: 34,
        height: 43
    },
    shopServicesContainer: {
        flexDirection: "row",
        // marginHorizontal: 18,
        marginHorizontal: 15,
        marginTop: 100,
    },
    tickImage: {
        width: 23,
        height: 19
    },
    serviceTitle: {
        color: "#1E313E",
        fontSize: 14,
        marginLeft: 10,
        fontFamily: Fonts.circular_medium,
        // width: width / 2.5,
    },
    ad: {
        width: metrics.deviceWidth - 8,
        height: 110,
        marginVertical: 8
    },
    btnStyle: {
        width: metrics.deviceWidth - 10,
        height: 60,
        borderBottomWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderStyle: 'solid',
        alignItems:"center",
        justifyContent: 'center',
        // borderColor: '#3F3F3F',
    },
    btnText: {
        fontSize: 15,
        color: "#11455F",
        fontFamily: Fonts.CircularMedium,
    },
    modalInnerView:{
        // borderRadius: metrics.radius15,
    },
    modelStyle:{
        flex:1,
        justifyContent:'flex-start',
        // marginRight: metrics.deviceWidth - (metrics.deviceWidth - 5),
        // marginLeft: metrics.deviceWidth - (metrics.deviceWidth - 5),
        // borderRadius: metrics.radius15,
        // marginBottom: 20,
    },

    cancelBtnStyle: {
        width: metrics.deviceWidth - 10,
        height: 60,
        marginTop: 15,
        marginBottom: 20,
        backgroundColor: '#E6EFF9',
        borderRadius: metrics.radius40,
        alignItems:"center",
        justifyContent: 'center',
    },
    cancelBtnText: {
        color: '#0E2D3C',
        fontSize: 18,
        fontFamily: Fonts.CircularBold,
        textAlign: 'center',
    },
    contactBtnStyle: {
        width: metrics.deviceWidth - 40,
        height: 60,
        fontFamily: Fonts.CircularMedium,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#11455F',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: metrics.radius40,
        marginBottom: 4,
    }
});
