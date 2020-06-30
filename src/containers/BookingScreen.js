import React, { PureComponent } from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    Text,
    FlatList, AsyncStorage
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { colors } from '../themes';
import * as authAction from './../redux/actions/auth'
import NavigationComponent from '../components/navigation/navigation';
import __ from '../resources/copy'

import NavigationService from "../NavigationService";
import NotificationItem from "../components/list/NotificationItem";
import {bookingList} from "../redux/actions/workshops";
import {IMG_PREFIX_URL} from "../config/constant";
import {NavigationEvents} from 'react-navigation';
import Header from "../components/NewHomeScreen/Header";

class BookingScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.state= {
            bookings: [],
            isDone: false
        }
    }
    updateList(){
        let bookings= bookingList(this.props.user.id).then(res => {
            this.setState({bookings: res.bookings, isDone: true})
        })
    }

    onBookingClick(id){
        AsyncStorage.setItem("workshopId", id);
        this.props.navigation.navigate("WorkshopDetailScreen" , {preferences:this.props.preferences, language: this.props.language} );
    }

    render() {
        return (
            <View style={styleWorkShopListScreen.container}>
                <NavigationEvents onDidFocus={() => this.updateList()} />
                {/*<StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>*/}
                {/*<NavigationComponent*/}
                {/*    homeButton={false}*/}
                {/*    navigation={this.props.navigation}*/}
                {/*    goBack={() => NavigationService.goBack()}*/}
                {/*    title={__('Booking' , this.props.language)}*/}
                {/*/>*/}
                <Header noSearch title={__('Booking Info' , this.props.language)} navigation={this.props.navigation} goBack={true}/>
                <View style={{flex: 1, marginTop: 80}} >
                    <FlatList
                        data={this.state.bookings}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({ item, index }) => (
                            <NotificationItem onPress={() => this.onBookingClick(item.workshop_id)} title={item.workshop_details.name} date={item.date} pic={IMG_PREFIX_URL + item.workshop_details.workshop_logo} details={item.status}/>
                        )}
                        ListEmptyComponent={() => (this.state.isDone ? <Text style={{flex: 1, textAlign: "center"}}>{__("No bookings was found", this.props.language)}</Text> : null)}
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


export default connect(mapStateToProps, null)(BookingScreen)
