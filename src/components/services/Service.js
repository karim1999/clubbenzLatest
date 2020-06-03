import React, { } from "react";
import { TouchableWithoutFeedback, StyleSheet, View, Text, Image } from "react-native";
import { colors, metrics, styles, fonts } from "../../themes";
import { IMG_PREFIX_URL } from '../../config/constant';
import { Fonts } from "../../resources/constants/Fonts";


const MARGIN = 2;
const WIDTH_WIDGET = (metrics.deviceWidth - MARGIN * 3) / 3;
const WIDTH_IMAGE = WIDTH_WIDGET * 2 / 3;

const Service = ({ data, navigate, language }) => {

    return (
        <TouchableWithoutFeedback onPress={() => navigate(data)} style={{ backgroundColor: "red" }}>
            <View style={styleServiceItem.container}>

                <View style={styleServiceItem.imageContainer}>
                    <View
                        style={[
                            {
                                zIndex: 1,
                                alignItems: "center",
                                justifyContent: "center"
                            }
                        ]}
                    >
                    {data.show_services =="on"   ? <Image resizeMode="cover" style={styleServiceItem.imgSmall} source={{uri:IMG_PREFIX_URL+data.image}} />: <Image resizeMode="cover" style={styleServiceItem.imgSmall} source={data.serviceUrl} />}
                        {/* <Image
                            source={{ uri: String(data.serviceUrl) }}
                            style={styleServiceItem.imgSmall}
                        /> */}

                        {/* {console.log(language)} */}
                            
                        {/* <Text style={styleServiceItem.title}>{data.show_services =="on" ? ( language.isArabic == true ? data.arabic_name : data.name) :language.isArabic == true ? data.arabic_serviceName :data.serviceName}</Text> */}

                        <Text style={styleServiceItem.title}>{data.show_services =="on" ? ( language.isArabic == true ? data.arabic_name : data.name) :(language.isArabic == true ? data.arabic_serviceName :data.serviceName)}</Text>

                    </View>

                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default Service;

const styleServiceItem = StyleSheet.create({
    container: {
        width: WIDTH_WIDGET,
        height: WIDTH_WIDGET,
        justifyContent: "center",
        alignItems: "center"
    },
    imageContainer: {
        width: WIDTH_WIDGET,
        height: WIDTH_WIDGET,
        justifyContent: "center",
        alignItems: "center",
    },
    imgSmall: {
        justifyContent: "center",
        width: metrics.deviceWidth / 6,
        height: metrics.deviceWidth / 6,
        // borderRadius: metrics.deviceWidth / 6,
        // borderColor: colors.lightGray,
        // borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: fonts.size.h10,
        paddingHorizontal: 7,
        // fontFamily: fonts.type.base,
        fontFamily: Fonts.CircularBook,
        fontSize: fonts.size.small,
        color: colors.black,
        textAlign: "center",
        paddingTop: metrics.smallMargin
    },
});

// map state to props to fetch the language data from the store
