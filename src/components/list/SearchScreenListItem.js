import React from 'react';
import { Text, View, Dimensions, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { colors } from '../../themes';
import { Fonts } from '../../resources/constants/Fonts';
const { width, height } = Dimensions.get('window');


const SearchScreenListItem = ({ item, index }) => {

    return (
        <TouchableOpacity>
            <View style={[styleSearchScreenListItem.container]}>
                <View style={styleSearchScreenListItem.leftContainer}>
                    <View style={styleSearchScreenListItem.backView}>
                        <Image
                            style={styleSearchScreenListItem.backImage}
                            source={require('../../resources/images/ic_menu_userplaceholder.png')}
                        />
                    </View>
                </View>
                <View style={styleSearchScreenListItem.midContainer}>
                    <View style={styleSearchScreenListItem.textWrapper}>
                        <Text style={styleSearchScreenListItem.name}>{item.name}</Text>
                    </View>
                    <Text style={styleSearchScreenListItem.data}>{item.data}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
const styleSearchScreenListItem = StyleSheet.create({
    container: {
        marginHorizontal: width * 0.02,
        marginTop: height * 0.02,
        borderRadius: width * 0.02,
        backgroundColor: '#fff',
        flexDirection: 'row',
        height: height * 0.12,
    },
    leftContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: width * 0.15,
        width: width * 0.15,
        resizeMode: 'contain',
    },
    midContainer: {
        flex: 3,
        justifyContent: 'center',
    },
    backView: {
        position: 'absolute',
    },
    backImage: {
        height: width * 0.17,
        width: width * 0.17,
        resizeMode: 'contain',
    },
    name: {
        color: '#000',
        fontSize: width * 0.05,
        paddingBottom: height * 0.01,
        fontFamily: Fonts.CircularMedium,
    },
    dis: {
        color: colors.lightGray,
        fontFamily: Fonts.CircularMedium,
    },
    data: {
        color: colors.lightGray,
        fontFamily: Fonts.CircularMedium,
    },
});
export default SearchScreenListItem;
