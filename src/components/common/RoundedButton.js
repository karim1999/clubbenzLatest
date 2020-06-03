import React, { PureComponent } from "react";
import { TouchableOpacity, StyleSheet, View, Text, Image } from "react-native";
import { colors, metrics, styles, fonts } from "../../themes";


const RoundedButton = ({ buttonText, onPress }) => {


    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styleRoundedButton.btnStyle}>
                <Text style={styles.tapButtonStyleTextWhite}>{buttonText}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default RoundedButton;

const styleRoundedButton = StyleSheet.create({

    staticImages: {
        color: colors.white,
        textAlign: 'center',
        fontFamily: fonts.type.regular,
        fontSize: fonts.size.h11,
    },
    btnStyle: {
        width: metrics.deviceWidth - 40,
        height: 60,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: colors.blueText,
        borderColor: '#11455F',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: metrics.radius40,
        marginVertical: 18
    },
});
