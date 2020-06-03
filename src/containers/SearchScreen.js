import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import NavigationComponent from '../components/navigation/navWithTextInput';
import { colors, styles, metrics } from '../themes';
import { list } from '../resources/constants/ShopListConstant';
import SearchScreenListItem from '../components/list/SearchScreenListItem';
import { Fonts } from '../resources/constants/Fonts';
const { height, width } = Dimensions.get('window');


export default class SearchScreen extends Component {

    constructor(props) {
        super(props);
    }
    state = {
        data: [{
            id: '4',
            name: 'Fit & Fix',
            data: '6 October',
        },
        {
            id: '5',
            name: 'Fit & Fix',
            data: '6 October',
        },
        {
            id: '6',
            name: 'Fit & Fix',
            data: '6 October',
        },
        ]
    }

    searchData = (value) => {
        alert(value);
    }

    render() {
        return (
            <View style={styleSearchScreen.container}>
                <StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>
                <NavigationComponent					navigation={this.props.navigation}
                                                        text="Try Fit & Fix" onTextChange={(val) => { this.searchData(val) }} />
                <View style={styleSearchScreen.secondHeader}>
                    <Text style={{ color: colors.blueOpacity40, fontSize: 14, fontFamily: Fonts.CircularBold }}>Most Recent</Text>
                </View>
                <ScrollView>
                    <FlatList
                        data={this.state.data}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({ item, index }) => <SearchScreenListItem item={item} index={index} />}
                        ListFooterComponent={this._renderFooter}
                    />
                </ScrollView>
            </View>
        );
    }
}

const styleSearchScreen = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e1e4e6' },
    secondHeader: {
        height: height * 0.06,
        flexDirection: 'row',
        backgroundColor: '#cad0d4',
        marginTop: -8,
        borderBottomEndRadius: metrics.radius20,
        borderBottomStartRadius: metrics.radius20,
        alignItems: 'center',
        justifyContent: "center",
        paddingTop: 8,
        zIndex: -1
    },
    button: {
        borderWidth: 1,
        borderColor: '#717171',
        backgroundColor: "red",
        height: height * 0.09,
        justifyContent: 'center',
        paddingHorizontal: width * 0.02,
        borderRadius: width * 0.05,
        marginLeft: width * 0.03,
    },
    buttonText: {
        color: '#717171',
    },
});
