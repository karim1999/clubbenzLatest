import React, { PureComponent } from "react";
import {
    View,
    StyleSheet,
    Text,
    StatusBar, ScrollView, TouchableOpacity, Modal, FlatList,
} from "react-native";


import { colors, styles, metrics } from "../themes";
import NavigationService from "../NavigationService";
import { connect } from 'react-redux';
import __ from '../resources/copy';

import { Fonts } from '../resources/constants/Fonts';

import SplitHeading from "../components/common/splitHeading";

class ProviderInfoScreen extends PureComponent {

    constructor(props) {
        super(props);
        this.state.provider= this.props.provider
    }
    state = {
        provider : {}
    };

    render() {
        return (
            <View style={[styleProviderInfoScreen.container]}>
                <ScrollView>
                    {/*<SplitHeading*/}
                    {/*    text={"Location"}*/}
                    {/*    headingStyle={{ padding: 5, marginTop: 15, marginBottom: 2 }}*/}
                    {/*    lineColor={{ backgroundColor: 'rgba(6,0,41, 0.2)' }}*/}
                    {/*    textColor={{ color: colors.grey93, fontFamily: Fonts.circular_medium }}*/}
                    {/*/>*/}
                    <View style={styleProviderInfoScreen.innerContainer}>
                        <View>
                            <Text style={styleProviderInfoScreen.shopAddress}>
                                <Text style={{color: "black"}}>Address:</Text> {this.state.provider.address}
                            </Text>
                            <Text style={styleProviderInfoScreen.shopAddress}>
                                <Text style={{color: "black"}}>City:</Text> {this.state.provider.city}
                            </Text>
                            <Text style={styleProviderInfoScreen.shopAddress}>
                                <Text style={{color: "black"}}>State:</Text> {this.state.provider.governorate}
                            </Text>
                            <Text style={styleProviderInfoScreen.shopAddress}>
                                <Text style={{color: "black"}}>Country:</Text> {this.state.provider.country}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
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

export default connect(mapStateToProps, null)(ProviderInfoScreen)
const styleProviderInfoScreen = StyleSheet.create({
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
        marginTop: 18,
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
        borderTopWidth: 0.5,
        borderBottomWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderStyle: 'solid',
        alignItems:"center",
        justifyContent: 'center',
        // borderColor: '#3F3F3F',
    },
    btnText: {
        fontSize: 18,
        color: "#11455F",
        fontFamily: Fonts.CircularMedium,
    },
    modalInnerView:{
        borderRadius: metrics.radius15,
    },
    modelStyle:{
        flex:0.7,
        justifyContent:'flex-end',
        marginRight: metrics.deviceWidth - (metrics.deviceWidth - 5),
        marginLeft: metrics.deviceWidth - (metrics.deviceWidth - 5),
        borderRadius: metrics.radius15,
        marginBottom: 20,
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
