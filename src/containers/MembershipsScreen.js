import React, { PureComponent } from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    Text,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    Image,
    FlatList, AsyncStorage, Modal,
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
            address: "",
            modal2Visible: false,
            ar_msg: "",
            en_msg: "",
            cardModal: false
        }
    }
    updateList(){
        let memberships= getMemberships(this.props.user.id).then(res => {
            this.setState({memberships: res.memberships, current: res.current, isDone: true, cardModal: (res.current && this.props.navigation.state.params.card != undefined)})
            // alert(JSON.stringify(res))
            if(res.current)
                this.setState({ar_msg: res.current.msg_ar, en_msg: res.current.msg_en})
        })
        if(this.props.navigation.state.params && this.props.navigation.state.params.msg)
            this.setState({modal2Visible: true})
    }
    componentDidMount(){
    }

    // onBookingClick(id){
    //     AsyncStorage.setItem("workshopId", id);
    //     this.props.navigation.navigate("WorkshopDetailScreen" , {preferences:this.props.preferences, language: this.props.language} );
    // }

    subscribe(membership, price){
        // subscribe(this.props.user.id, membership, this.state.address).then(() => {
        this.props.navigation.navigate("SubscribeScreen", {membership: membership, name: membership.name, price: price})
        // })
    }

    render() {
        return (
            <View style={Styles.container}>
                <NavigationEvents onDidFocus={() => this.updateList()} />
                <Header title={__('Memberships')} navigation={this.props.navigation} goBack={true}/>
                <View style={{flex: 1, marginTop: 120}} >
                    {/*{*/}
                    {/*    (this.props.navigation.state.params && this.props.navigation.state.params.msg) &&*/}
                    {/*    <Text style={{textAlign: "center", marginTop: 10, color: 'green'}}>Your have subscribed successfully.</Text>*/}
                    {/*}*/}
                    <FlatList
                        horizontal={true}
                        data={this.state.memberships}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({item}) => (
                            <View style={Styles.card}>
                                <View style={Styles.cardHeader}>
                                    <Text style={Styles.h1}>{item.name}</Text>
                                    <Text style={Styles.h1}>${item.price}</Text>
                                </View>
                                <View style={Styles.cardContent}>
                                    <FlatList
                                        data={item.benefits}
                                        keyExtractor={(item, index) => item.id}
                                        renderItem={({item}) => (
                                            <View style={{flex: 1, alignItems: 'center', justifyContent: "center"}}>
                                                {/*<Text style={Styles.h2}>{item.name}</Text>*/}
                                                {
                                                    item.details.map(info => <Text key={info.id} style={Styles.h3}>{info.details}</Text> )
                                                }
                                            </View>
                                        )}
                                    />
                                    <View>
                                        {
                                            (!this.state.current || (this.state.current.id && item.id != this.state.current.membership_id && this.state.current.price < item.price) )&&
                                            <TouchableOpacity onPress={() => this.subscribe(item,item.price)}>
                                                <View style={Styles.btn}>
                                                    <Text style={[Styles.h1, {color: "#0e2d3c"}]}>{__("Subscribe", this.props.language)}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                    <View></View>
                </View>
                <Modal
                    visible={this.state.modal2Visible}
                    transparent
                    onRequestClose={() => this.setState({ modal2Visible: false })}
                    animationType="fade"
                >
                    <View style={Styles.modalContainer}>
                        <View style={Styles.modal}>
                            <View style={Styles.modalTop}>
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                    }}
                                    onPress={() => this.setState({ modal2Visible: false })}
                                >
                                    {/* <Text >X</Text> */}
                                    <Image style={{ width: 35, height: 35 }} source={require('../resources/images/cross_image.png')} />
                                </TouchableOpacity>
                            </View>
                            <View style={Styles.modalContent}>
                                <Text style={Styles.modalContentText}>
                                    {this.props.language.isArabic ? this.state.ar_msg : this.state.en_msg}
                                </Text>
                            </View>
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={this.state.cardModal}
                    transparent
                    onRequestClose={() => this.setState({ cardModal: false })}
                    animationType="fade"
                >
                    <View style={Styles.modalContainer}>
                        <View style={Styles.modal}>
                            <View style={Styles.modalTop}>
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                    }}
                                    onPress={() => this.setState({ cardModal: false })}
                                >
                                    {/* <Text >X</Text> */}
                                    <Image style={{ width: 35, height: 35 }} source={require('../resources/images/cross_image.png')} />
                                </TouchableOpacity>
                            </View>
                            <View style={Styles.modalContent}>
                                <View style={[Styles.modalContent, {padding: 0}]}>
                                    <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                        <ImageBackground resizeMode={"contain"} style={{width: 300, height: 150}} source={require('./../resources/images/membership-card.png')}>
                                        </ImageBackground>
                                        <View style={{justifyContent: 'space-between', flexDirection: 'row', top: -45, width: 220}}>
                                            <Text style={{color: 'white', fontSize: 12}}>{this.props.user.first_name+" "+this.props.user.last_name}</Text>
                                            <Text style={{color: 'white', fontSize: 12}}>{this.state.current ? this.state.current.nid : null}</Text>
                                        </View>
                                        <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{fontSize: 18}}>{__("Membership:")} <Text style={{fontWeight: 'bold'}}>{this.state.current ? this.state.current.name : null}</Text></Text>
                                            <Text style={{fontSize: 18}}>{__("Expiring Date:")} <Text style={{fontWeight: 'bold'}}>{this.state.current ? this.state.current.end_date.substring(0, 10) : null}</Text></Text>
                                        </View>
                                        <Image style={{width: 150, height: 150, alignSelf: 'center'}} source={require('./../resources/images/qrcode.png')}/>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
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
        flex: 1,
        margin: 20,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#0e2d3c",
        borderRadius: 20,
        padding: 10,
    },
    cardHeader: {
        flex: .5,
        minWidth: 300,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
        borderBottomColor: "white",
        borderBottomWidth: 1,
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
        paddingTop: 10,
        color: "white",
    },
    h3: {
        fontSize: 18,
        marginTop: 10,
        width: 300,
        paddingLeft: 10,
        color: "white",
        textAlign: "center"
    },
    cardContent: {
        flex: 3,
        minWidth: 300,
        alignItems: "center",
        justifyContent: "space-between",
    },
    btn: {
        backgroundColor: "white",
        fontSize: 20,
        borderRadius: 5,
        marginTop: 20,
        paddingHorizontal: 30,
        paddingVertical: 10,
        marginBottom: 20
    },
    modalContainer: {
        paddingVertical: 50,
        paddingHorizontal: 40,
        flex: 1,
        justifyContent: 'center',
        backgroundColor: "rgba(142,142,142,0.32)"
    },
    modal: {
        borderRadius: 10,
        borderColor: "rgb(0,0,0)",
        borderWidth: 1,
        shadowRadius: 20,
        shadowOffset: {
            width: 0,
            height: -1,
        },
        shadowColor: 'rgb(0,0,0)',
        elevation: 1,
    },
    modalTop: {
        backgroundColor: '#0e2d3c',
        height: 50,
        padding: 10,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 5,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
    modalContentText: {
        fontWeight: "bold",
        fontSize: 15
    },

});


export default connect(mapStateToProps, null)(MembershipsScreen)
