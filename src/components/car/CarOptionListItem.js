import React, { PureComponent } from "react";
import { Text, Image, StyleSheet, View, TouchableOpacity } from "react-native";
import { colors, fonts, metrics, styles } from "../../themes";
import { Fonts } from "../../resources/constants/Fonts";



class CarOptionListItem extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View style={[styles.center, styles.row, styles.spaceBetween, carOptionListItemStyle.carOptionListItem]}>
                    <View style={{flex:6}}>
                        <Text style={carOptionListItemStyle.carOptionHeading}>{this.props.carOptionHeading}</Text>
                        <Text style={carOptionListItemStyle.carOptionDetail}>{this.props.carOptionDetail}</Text>
                    </View>
                    <View style={{flex:1}}>
                    <Image resizeMode='contain'
                            style={{
                                width: 45,
                                height: 45
                            }}
                            source={require('../../resources/icons/arrow-big.png')} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default CarOptionListItem;

const carOptionListItemStyle = StyleSheet.create({
    carOptionListItem: {
        borderWidth: 1,
        borderColor: colors.lightGray,
        paddingHorizontal: metrics.basePadding,
        paddingVertical: metrics.basePadding,
        marginTop: metrics.margin18,
    },
    carOptionHeading: {
        color: colors.black,
        fontSize: 24,
        // fontWeight: fonts.fontWeight.bold,
        fontFamily: Fonts.CircularBold,
    },
    carOptionDetail: {
        // color: '#0F2834',
        color: 'rgba(15,40,52, 0.5)',
        fontSize: 14,
        fontFamily: Fonts.CircularBold,
    }
})