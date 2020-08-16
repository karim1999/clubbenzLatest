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
import Icon from 'react-native-vector-icons/FontAwesome';

class MembershipsScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.state= {
            memberships: [],
            states: [],
            cities: [],
            current: null,
            isDone: false,
            address: "",
            modal2Visible: false,
            ar_msg: "",
            en_msg: "",
            cardModal: false,
            benifits: [],
            all: {},
            isLoading: true
        }
    }
    updateList(){
        let memberships= getMemberships(this.props.user.id).then(res => {
            console.log(res.cities)
            this.setState({all: res, states: res.states, cities: res.cities, memberships: res.memberships, current: res.current, isDone: true, cardModal: (res.current && this.props.navigation.state.params.card != undefined)})
            // alert(JSON.stringify(res))
            if(res.current)
                this.setState({ar_msg: res.current.msg_ar, en_msg: res.current.msg_en})
            this.setState({isLoading: false})
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
        this.props.navigation.navigate("SubscribeScreen", {membership: membership, name: membership.name, price: price, cities: this.state.cities, states: this.state.states})
        // })
    }
    benifitsToggle(id){
        let benifits= this.state.benifits.slice()
        if(this.state.benifits.includes(id)){
            var index = benifits.indexOf(id);
            if (index !== -1){
                benifits.splice(index, 1)
            }
        }else {
            benifits.push(id)
        }
        this.setState({benifits})
    }

    render() {
        return (
            <View style={Styles.container}>
                <NavigationEvents onDidFocus={() => this.updateList()} />
                <Header noSearch title={__('Memberships')} navigation={this.props.navigation} goBack={true}/>
                <View style={{flex: 1, marginTop: 120}} >
                    {/*{*/}
                    {/*    (this.props.navigation.state.params && this.props.navigation.state.params.msg) &&*/}
                    {/*    <Text style={{textAlign: "center", marginTop: 10, color: 'green'}}>Your have subscribed successfully.</Text>*/}
                    {/*}*/}
                    {
                        !this.state.isLoading && this.state.memberships && this.state.memberships.length == 0 &&
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{textAlign: 'center', fontSize: 24, alignSelf: 'center'}}>{__('Coming Soon', this.props.language)}</Text>
                            </View>
                    }
                    <FlatList
                        horizontal={true}
                        data={this.state.memberships}
                        keyExtractor={(item, index) => item.id}
                        renderItem={({item}) => (
                            <View style={Styles.card}>
                                <View style={Styles.cardHeader}>
                                    <Text style={Styles.h1}>{item.name}</Text>
                                    <Text style={Styles.h1}>{item.price} {__('EGP', this.props.language)}</Text>
                                </View>
                                <View style={Styles.cardContent}>
                                    <FlatList
                                        data={item.benefits}
                                        keyExtractor={(item, index) => item.id}
                                        renderItem={({item}) => (
                                            <View style={{flex: 1, alignItems: 'flex-start', justifyContent: "center"}}>
                                                <TouchableOpacity onPress={() => this.benifitsToggle(item.id)} style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', maxWidth: 300, paddingTop: 20}}>
                                                    <Icon style={{marginHorizontal: 5}} name={this.state.benifits.includes(item.id) ? "minus-circle" : "plus-circle"} size={15} color="white" />
                                                    <Text style={Styles.h3}>{item.name_ar ? this.props.language.isArabic ? item.name_ar : item.name : item.name}</Text>
                                                </TouchableOpacity>
                                                {
                                                    this.state.benifits.includes(item.id) &&
                                                    <View>
                                                        {
                                                            item.details.map(info => <Text key={info.id} style={Styles.h3}> {info.details_ar ? this.props.language.isArabic ? info.details_ar: info.details: info.details}</Text> )
                                                        }
                                                    </View>
                                                }
                                            </View>
                                        )}
                                    />
                                    <View>
                                        {
                                            (!this.state.current || this.state.all.allow)&&
                                            <TouchableOpacity onPress={() => this.subscribe(item,item.price)}>
                                                <View style={[Styles.btn, {marginHorizontal: 20}]}>
                                                    <Text style={[Styles.h1, {color: "#0e2d3c", textAlign: 'center'}]}>{__("Subscribe", this.props.language)}</Text>
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
                                <View style={{flex: 1, flexDirection: "row"}}>
                                    <TouchableOpacity
                                        style={{
                                            justifyContent: 'center',
                                        }}
                                        onPress={() => this.setState({ modal2Visible: false })}
                                    >
                                        {/* <Text >X</Text> */}
                                        <Image style={{ width: 35, height: 35 }} source={require('../resources/images/cross_image.png')} />
                                    </TouchableOpacity>
                                    <View style={{alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>
                                        <Text style={{fontSize: 15, color: "white"}}>{__("Confirmation", this.props.language)}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={Styles.modalContent}>
                                <Text style={[Styles.modalContentText, {paddingBottom: 40}]}>
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
                                        <ImageBackground resizeMode={"stretch"} style={{width: '100%', minHeight: 200}} source={require('./../resources/images/membership-card.png')}>
                                            <View style={{justifyContent: 'center', flexDirection: 'row', flex: 1, marginTop: 20}}>
                                                <Text style={{color: 'white', fontSize: 15}}>{this.state.current ? this.state.current.name : null}</Text>
                                            </View>
                                        </ImageBackground>
                                        <View style={{justifyContent: 'space-between', flexDirection: 'row', top: -55, width: '100%', paddingHorizontal : 30}}>
                                            <View style={{flexDirection: 'column'}}>
                                                <Text style={{color: 'white', fontSize: 10}}>{this.props.user.first_name+" "+this.props.user.last_name}</Text>
                                                <Text style={{color: 'white', fontSize: 10}}>{__('License ID:', this.props.language)} {this.state.current ? this.state.current.license_id : null}</Text>
                                            </View>
                                            <View style={{flexDirection: 'column'}}>
                                                <Text style={{color: 'white', fontSize: 10}}>{__('ID Number:', this.props.language)} {this.state.current ? this.state.current.nid : null}</Text>
                                                <Text style={{color: 'white', fontSize: 10}}>{__('Expiring Date:', this.props.language)} {this.state.current ? this.state.current.end_date.substring(0, 10) : null}</Text>
                                            </View>
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
        paddingLeft: 10,
        color: "white",
        maxWidth: 280
    },
    cardContent: {
        flex: 3,
        minWidth: 300,
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
        paddingHorizontal: 10,
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
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
    modalContentText: {
        fontWeight: "bold",
        fontSize: 15
    },

});


export default connect(mapStateToProps, null)(MembershipsScreen)
