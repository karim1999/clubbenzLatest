import React, { PureComponent } from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    Image,
    ImageBackground,
    AsyncStorage,
    FlatList
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { colors } from '../themes';
import * as authAction from './../redux/actions/auth'
import NavigationComponent from '../components/navigation/navigation';
import __ from '../resources/copy'
import NavigationService from "../NavigationService";
import NotificationItem from "../components/list/NotificationItem";
import {NavigationEvents} from "react-navigation";
import {notificationList} from "../redux/actions/workshops";
import {IMG_PREFIX_URL} from "../config/constant";
import Header from "../components/NewHomeScreen/Header";

class NotificationScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            isDone: false
        }
    }
    updateList(){
        let notifications= notificationList(this.props.user.id).then(res => {
            this.setState({notifications: res, isDone: true})
        })
    }

    onBookingClick(item){
        let id= item.shop_id;
        if(item.shop_type == "workshop"){
            AsyncStorage.setItem("workshopId", id);
            this.props.navigation.navigate("WorkshopDetailScreen" , {preferences:this.props.preferences, language: this.props.language} );
        }else if(item.shop_type == "partsshop"){
            AsyncStorage.setItem("partShopId", id);
            this.props.navigation.navigate("PartShopDetailScreen" , {preferences:this.props.preferences, language: this.props.language});
        }else if(item.shop_type == "serviceshop"){
            AsyncStorage.setItem("serviceShopId", id);
            this.props.navigation.navigate("ServicesDetailScreen" , {preferences:this.props.preferences, language: this.props.language});
        }
    }
    render() {
        return (
            <View style={styleWorkShopListScreen.container}>
                <NavigationEvents onDidFocus={() => this.updateList()} />
                <StatusBar hidden={false} backgroundColor={"#0e2d3c"} barStyle='light-content' />
                {/*<NavigationComponent*/}
                {/*    homeButton={false}*/}
                {/*    navigation={this.props.navigation}*/}
                {/*    goBack={() => NavigationService.goBack()}*/}
                {/*    title={__('Notifications' , this.props.language)}*/}
                {/*/>*/}
                <Header noSearch title={__('Notifications' , this.props.language)} navigation={this.props.navigation} goBack={true}/>
                <View style={{flex: 1, marginTop: 80}} >
                    <FlatList
                        data={this.state.notifications}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({ item, index }) => (
                            <NotificationItem onPress={() => this.onBookingClick(item)}  title={item.title} date={item.created_at} pic={item.shop_details && ((typeof (item.shop_details.workshop_logo) === "undefined") ? IMG_PREFIX_URL+item.shop_details.service_logo_image : IMG_PREFIX_URL+item.shop_details.workshop_logo)} details={item.message}/>
                        )}
                        ListEmptyComponent={() => (this.state.isDone ? <Text style={{flex: 1, textAlign: "center"}}>No notifications was found</Text> : null)}
                    />
                </View>
            </View>

        );
    }
}

mapStateToProps = (state) => {
    return {
        user: state.auth.user,
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


export default connect(mapStateToProps, null)(NotificationScreen)
