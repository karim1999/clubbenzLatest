import React, { PureComponent } from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    Text,
    FlatList
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { colors } from '../themes';
import * as authAction from './../redux/actions/auth'
import NavigationComponent from '../components/navigation/navigation';
import __ from '../resources/copy'

import NavigationService from "../NavigationService";
import {NavigationEvents} from 'react-navigation';
import {getFavorites} from "../redux/actions/favorite";
import ListItem from "../components/list/ListItem";
import Header from "../components/NewHomeScreen/Header";

class FavoritesScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.state= {
            favorites: [],
            isDone: false
        }
    }
    updateList(){
        let favorites= getFavorites(this.props.user.id).then(res => {
            this.setState({favorites: res, isDone: true})
        })
    }

    onPartClick(partItem){
        this.props.navigation.navigate('DetailScreen' , {partItem:partItem})
    }

    render() {
        return (
            <View style={styleWorkShopListScreen.container}>
                <NavigationEvents onDidFocus={() => this.updateList()} />
                <StatusBar hidden={false} backgroundColor={"#0e2d3c"} barStyle='light-content' />
                {/*<StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>*/}
                {/*<NavigationComponent*/}
                {/*    homeButton={false}*/}
                {/*    navigation={this.props.navigation}*/}
                {/*    goBack={() => NavigationService.goBack()}*/}
                {/*    title={__('Favorites' , this.props.language)}*/}
                {/*/>*/}
                <Header noSearch title={__('Favorites' , this.props.language)} navigation={this.props.navigation} goBack={true}/>
                <View style={{flex: 1, marginTop: 80}} >
                    <FlatList
                        data={this.state.favorites}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({ item, index }) => (
                            <ListItem item={item.part} index={index} onPress={ () => this.onPartClick(item.part) } language={this.props.language} length={this.state.favorites.length} preferences={this.props.preferences} />
                        )}
                        ListEmptyComponent={() => (this.state.isDone ? <Text style={{flex: 1, textAlign: "center"}}>No items was found</Text> : null)}
                    />
                    <View></View>
                </View>
            </View>

        );
    }
}

mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        preferences: state.init.preferences,
        language: state.language,
    }
}

mapDispatchToProps = (dispatch) => bindActionCreators(
    {
        updateUser:authAction.updateUser
    },
    dispatch
);
const styleWorkShopListScreen = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e1e4e6"
    },
    div:{
        flex: 1,
        flexDirection: "row"
    },
});


export default connect(mapStateToProps, null)(FavoritesScreen)
