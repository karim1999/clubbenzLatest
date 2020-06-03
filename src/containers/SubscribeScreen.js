import React, { PureComponent } from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
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
import {getMemberships, subscribe} from "../redux/actions/membership";

class SubscribeScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.state= {
            memberships: [],
            current: null,
            isDone: false,
            address: ""
        }
    }
    updateList(){
        // let memberships= getMemberships(this.props.user.id).then(res => {
        //     this.setState({memberships: res.memberships, current: res.current, isDone: true})
        // })
    }

    // onBookingClick(id){
    //     AsyncStorage.setItem("workshopId", id);
    //     this.props.navigation.navigate("WorkshopDetailScreen" , {preferences:this.props.preferences, language: this.props.language} );
    // }

    subscribe(){
        // alert(this.props.navigation.state.params.name)
        if(this.state.address){
            subscribe(this.props.user.id, this.props.navigation.state.params.name, this.state.address).then(() => {
                this.props.navigation.navigate("MembershipsScreen", {msg: "Your have subscribed successfully."})
            })

        }
    }

    render() {
        return (
            <View style={Styles.container}>
                <NavigationEvents onDidFocus={() => this.updateList()} />
                <StatusBar hidden={false} backgroundColor={"#060029"} barStyle='light-content' />
                <Header title={"Subscribe"} navigation={this.props.navigation} goBack={true}/>
                <View style={{flex: 1, marginTop: 120}} >
                    <View style={Styles.card}>
                        <View style={Styles.cardHeader}>
                            <Text style={Styles.h1}>{this.props.navigation.state.params.name}</Text>
                            <Text style={Styles.h1}>${this.props.navigation.state.params.price}</Text>
                        </View>
                        <View style={Styles.cardContent}>
                            {
                                !this.state.address &&
                                <Text style={{textAlign: "center", marginTop: 10, color: 'red'}}>The address field cannot be empty.</Text>
                            }
                            <TextInput
                                style={{ borderColor: 'gray', borderWidth: 1, marginTop: 20, width: 200 }}
                                onChangeText={text => this.setState({address: text})}
                                placeholder={"Address"}
                                value={this.state.address}
                            />
                            <TouchableOpacity onPress={() => this.subscribe()}>
                                <View style={Styles.btn}>
                                    <Text style={Styles.h1}>Subscribe</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
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
const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e1e4e6"
    },
    div:{
        flex: 1,
        flexDirection: "row"
    },
    card: {
        marginTop: 20,
        height: 300,
        margin: 20,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",

    },
    cardHeader: {
        flex: 1.5,
        minWidth: 300,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1e184d",
        paddingVertical: 20
    },
    h1: {
        color: "white",
        fontSize: 20
    },
    h2: {
        fontSize: 18,
        marginTop: 10
    },
    cardContent: {
        flex: 3,
        minWidth: 300,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white"
    },
    btn: {
        backgroundColor: "#1e184d",
        color: "white",
        fontSize: 20,
        borderRadius: 5,
        marginTop: 20,
        paddingHorizontal: 30,
        paddingVertical: 10,
        marginBottom: 20
    }
});


export default connect(mapStateToProps, null)(SubscribeScreen)
