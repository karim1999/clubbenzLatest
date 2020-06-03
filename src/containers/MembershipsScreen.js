import React, { PureComponent } from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    Text,
    TouchableOpacity,
    ScrollView,
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

class MembershipsScreen extends PureComponent {
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
        let memberships= getMemberships(this.props.user.id).then(res => {
            this.setState({memberships: res.memberships, current: res.current, isDone: true})
        })
    }

    // onBookingClick(id){
    //     AsyncStorage.setItem("workshopId", id);
    //     this.props.navigation.navigate("WorkshopDetailScreen" , {preferences:this.props.preferences, language: this.props.language} );
    // }

    subscribe(membership, price){
        // subscribe(this.props.user.id, membership, this.state.address).then(() => {
            this.props.navigation.navigate("SubscribeScreen", {name: membership, price: price})
        // })
    }

    render() {
        return (
            <View style={Styles.container}>
                <NavigationEvents onDidFocus={() => this.updateList()} />
                <StatusBar hidden={false} backgroundColor={"#060029"} barStyle='light-content' />
                <Header title={__('Memberships')} navigation={this.props.navigation} goBack={true}/>
                <View style={{flex: 1, marginTop: 120}} >
                    {
                        this.props.navigation.state.params &&
                            <Text style={{textAlign: "center", marginTop: 10, color: 'green'}}>Your have subscribed successfully.</Text>
                    }
                    {
                        this.state.memberships.gold &&
                        <ScrollView horizontal={true}>
                            <View style={Styles.card}>
                                <View style={Styles.cardHeader}>
                                    <Text style={Styles.h1}>Gold</Text>
                                    <Text style={Styles.h1}>${this.state.memberships.gold ? this.state.memberships.gold.price : 0}</Text>
                                </View>
                                <View style={Styles.cardContent}>
                                    <FlatList
                                        data={this.state.memberships.gold.features}
                                        keyExtractor={(item, index) => item.id}
                                        renderItem={({ item, index }) => (
                                            <View>
                                                <Text style={Styles.h2}>{item.benefit}</Text>
                                                {
                                                    item.details.map(feature => <Text style={Styles.h3}>-{feature.details}</Text> )
                                                }
                                            </View>
                                        )}
                                    />
                                    <View>
                                        {
                                            (!this.state.current || (this.state.current && this.state.current.membership != "gold") )&&
                                            <TouchableOpacity onPress={() => this.subscribe('gold',this.state.memberships.gold.price)}>
                                                <View style={Styles.btn}>
                                                    <Text style={Styles.h1}>Subscribe</Text>
                                                </View>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                            </View>
                            <View style={Styles.card}>
                                <View style={Styles.cardHeader}>
                                    <Text style={Styles.h1}>Platinum</Text>
                                    <Text style={Styles.h1}>${this.state.memberships.platinum ? this.state.memberships.platinum.price : 0}</Text>
                                </View>
                                <View style={Styles.cardContent}>
                                    <FlatList
                                        data={this.state.memberships.platinum.features}
                                        keyExtractor={(item, index) => item.id}
                                        renderItem={({ item, index }) => (
                                            <View>
                                                <Text style={Styles.h2}>{item.benefit}</Text>
                                                {
                                                    item.details.map(feature => <Text style={Styles.h3}>-{feature.details}</Text> )
                                                }
                                            </View>
                                        )}
                                    />
                                    <View>
                                        {
                                            (!this.state.current || (this.state.current && this.state.current.membership != "platinum") )&&
                                            <TouchableOpacity onPress={() => this.subscribe('platinum',this.state.memberships.platinum.price)}>
                                                <View style={Styles.btn}>
                                                    <Text style={Styles.h1}>Subscribe</Text>
                                                </View>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                            </View>

                        </ScrollView>
                    }
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
        marginTop: 10,
        width: 300,
        paddingLeft: 10,
        fontWeight: "bold",
        paddingTop: 10
    },
    h3: {
        fontSize: 18,
        marginTop: 10,
        width: 300,
        paddingLeft: 10,
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


export default connect(mapStateToProps, null)(MembershipsScreen)
