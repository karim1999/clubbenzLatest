import React, { PureComponent, Modal } from "react";
import { TouchableOpacity, ImageBackground, StyleSheet, View, Text, Image, Linking } from "react-native";
import { colors, metrics, styles, fonts } from "../../themes";

import NavigationService from '../../NavigationService';
import { IMG_PREFIX_URL } from "../../config/constant";
import { Fonts } from '../../resources/constants/Fonts'

handleLink = (uri) => {
    // we are supposing that we are getting http from server
    if (uri != '')
        Linking.openURL(uri);
}

const OfferItem = ({ offer, language, showAlertDialog }) => {
    return (
        <TouchableOpacity onPress={() => handleLink(offer.link)}>
            <View style={styleOfferItem.offerItemContainer}>

                <ImageBackground style={{
                    flex: 1,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    paddingBottom: metrics.basePadding
                }}
                    source={{ uri: IMG_PREFIX_URL + offer.image }}
                    resizeMode="cover"
                >

                    <View style={styleOfferItem.offer}>

                        <View style={{ flex: 2 }}>

                            <Text style={styleOfferItem.offerText}>{language.isArabic == true ? offer.offer_text_arabic : offer.offer_text}</Text>

                        </View>

                        <View style={{ flex: 1, alignItems: 'flex-end', }}>
                            <TouchableOpacity style={{ backgroundColor: '#F4F4F4', borderRadius: 56, width: 53, height: 53, alignItems: 'center', justifyContent: 'center' }} onPress={() => showAlertDialog(offer) }>

                                <Image source={require("../../resources/icons/ic-share_blue.png")} />

                            </TouchableOpacity>
                        </View>


                    </View>

                </ImageBackground>

            </View >
            
        </TouchableOpacity >
    );
};

export default OfferItem;

const styleOfferItem = StyleSheet.create({
    offerItemContainer: {
        width: metrics.deviceWidth - 12,
        height: 310,
        borderRadius: 12,
        marginVertical: 8,
        overflow: 'hidden'
    },
    offerText: {
        color: colors.blueText,
        fontSize: metrics.deviceWidth * 0.05,
        fontFamily: Fonts.CircularBold,
    },
    offer: {
        backgroundColor: "white",
        height: 95,
        width: metrics.deviceWidth - 34,
        borderRadius: 13,
        flexDirection: "row",
        alignItems: "center",
        padding: metrics.baseMargin
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
