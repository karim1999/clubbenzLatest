import React, { PureComponent } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    FlatList, AsyncStorage, Alert, TextInput, Modal, ScrollView, Image, Dimensions,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {colors, fonts, metrics} from '../themes';
import * as authAction from './../redux/actions/auth'
import __ from '../resources/copy'

import {IMG_PREFIX_URL} from "../config/constant";
import {NavigationEvents} from 'react-navigation';
import Header from "../components/NewHomeScreen/Header";
import Permissions from 'react-native-permissions';
import ImagePicker from "react-native-image-picker";
import Toast from 'react-native-simple-toast';
import {Fonts} from '../resources/constants/Fonts';
const { width, height } = Dimensions.get('window');
import RNPickerSelect from 'react-native-picker-select';
import csc, { ICountry, IState, ICity } from 'country-state-city'
import {getMemberships, subscribe} from "../redux/actions/membership";

class MembershipAddress extends PureComponent {
    constructor(props) {
        super(props);
        this.state= {
            tab: 1,
            isDone: false,
            memberships: [],
            current: null,
            address: "",
            nid: "",
            idFront: "",
            idBack: "",
            licenceFront: "",
            licenceBack: "",
            idFrontPhoto: null,
            idBackPhoto: null,
            licenceFrontPhoto: null,
            licenceBackPhoto: null,
            acceptTerms: false,
            clickAccept: true,
            modalVisible: false,
            modal2Visible: false,
            isLoading: false,
            countries: [
                {
                    key: "Egypt",
                    label: this.props.language.isArabic ? "مصر": "Egypt",
                    value: "Egypt"
                }
            ],
            states: csc.getStatesOfCountry(64).map(state => {
                return {
                    key: state.id,
                    label: state.name,
                    value: state.name
                }
            }),
            allCities: [],
            cities: [],
            country: "Egypt",
            state: null,
            city: "city",
            method: "Cash",
            methodError: false
        }
    }
    updateList(){
        if(this.props.navigation.state.params){
            let states= this.props.navigation.state.params.states;
            let cities= this.props.navigation.state.params.cities;
            if(states){
                states= states.map(state => {
                    let name= state.name_ar ? this.props.language.isArabic ? state.name_ar : state.name : state.name
                    return {
                        key: state.id,
                        label: name,
                        value: state.id
                    }
                })
            }
            console.log(cities)
            if(cities){
                cities= cities.map(city => {
                    let name= city.name_ar ? this.props.language.isArabic ? city.name_ar : city.name : city.name
                    return {
                        key: city.id,
                        label: name,
                        state: city.state_id,
                        value: city.id
                    }
                })
            }
            this.setState({...this.props.navigation.state.params, cities, states, allCities: cities }, () => {
                // console.log(this.state)
            })
        }
    }

    showImagePicker = async(type) => {

        const options = {
            title: 'Select Avatar',
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        Permissions.checkMultiple(['camera', 'photo']).then(response => {
            if (response.camera === 'denied' || response.photo === 'denied') {
                Alert.alert(
                    'Clubbenz needs camera and photos access',
                    'Clubbenz Camera and Photos Permission',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Permission denied'),
                            style: 'cancel',
                        },
                        { text: 'Open Settings', onPress: Permissions.openSettings },
                    ],
                );
            } else if (response.camera === 'authorized' && response.photo === 'authorized') {

                ImagePicker.showImagePicker(options, (response) => {
                    console.log('Response = ', response);

                    if (response.didCancel) {
                        console.log('User cancelled image picker');
                    } else if (response.error) {
                        console.log('ImagePicker Error: ', response.error);
                    } else if (response.customButton) {
                        console.log('User tapped custom button: ', response.customButton);
                    } else {
                        const profile_picture = response.uri;
                        const photo = response;
                        if(type == "idFront")
                            this.setState({ idFront: profile_picture, idFrontPhoto: photo })
                        if(type == "idBack")
                            this.setState({ idBack: profile_picture, idBackPhoto: photo })
                        if(type == "licenceFront")
                            this.setState({ licenceFront: profile_picture, licenceFrontPhoto: photo })
                        if(type == "licenceBack")
                            this.setState({ licenceBack: profile_picture, licenceBackPhoto: photo })
                    }
                });

            } else if (response.camera === 'undetermined' || response.photo === 'undetermined') {
                ImagePicker.showImagePicker(options, (response) => {
                    console.log('Response = ', response);

                    if (response.didCancel) {
                        console.log('User cancelled image picker');
                    } else if (response.error) {
                        console.log('ImagePicker Error: ', response.error);
                    } else if (response.customButton) {
                        console.log('User tapped custom button: ', response.customButton);
                    } else {
                        const profile_picture = response.uri;
                        const photo = response;
                        if(type == "idFront")
                            this.setState({ idFront: profile_picture, idFrontPhoto: photo })
                        if(type == "idBack")
                            this.setState({ idBack: profile_picture, idBackPhoto: photo })
                        if(type == "licenceFront")
                            this.setState({ licenceFront: profile_picture, licenceFrontPhoto: photo })
                        if(type == "licenceBack")
                            this.setState({ licenceBack: profile_picture, licenceBackPhoto: photo })
                    }
                });
            }
        })
    }

    // onBookingClick(id){
    //     AsyncStorage.setItem("workshopId", id);
    //     this.props.navigation.navigate("WorkshopDetailScreen" , {preferences:this.props.preferences, language: this.props.language} );
    // }

    subscribe(){
        // alert(this.props.navigation.state.params.name)
        if(this.state.address && this.state.idBack && this.state.idFront && this.state.licenceBack && this.state.licenceFront && this.state.acceptTerms && !this.methodError){
            this.setState({isLoading: true})
            let idFrontPhoto = {
                name: this.state.idFrontPhoto.fileName ? this.state.idFrontPhoto.fileName : 'profile_' + Date.now() + '.JPG',
                type: this.state.idFrontPhoto.type ? this.state.idFrontPhoto.type : "image/jpeg",
                uri: this.state.idFrontPhoto.uri,
            }
            let idBackPhoto = {
                name: this.state.idBackPhoto.fileName ? this.state.idBackPhoto.fileName : 'profile_' + Date.now() + '.JPG',
                type: this.state.idBackPhoto.type ? this.state.idBackPhoto.type : "image/jpeg",
                uri: this.state.idBackPhoto.uri,
            }
            let licenseFrontPhoto = {
                name: this.state.licenceFrontPhoto.fileName ? this.state.licenceFrontPhoto.fileName : 'profile_' + Date.now() + '.JPG',
                type: this.state.licenceFrontPhoto.type ? this.state.licenceFrontPhoto.type : "image/jpeg",
                uri: this.state.licenceFrontPhoto.uri,
            }
            let licenseBackPhoto = {
                name: this.state.licenceBackPhoto.fileName ? this.state.licenceBackPhoto.fileName : 'profile_' + Date.now() + '.JPG',
                type: this.state.licenceBackPhoto.type ? this.state.licenceBackPhoto.type : "image/jpeg",
                uri: this.state.licenceBackPhoto.uri,
            }

            subscribe(this.props.user.id, this.props.navigation.state.params.membership.id, this.state.address, idFrontPhoto, idBackPhoto, licenseFrontPhoto, licenseBackPhoto, this.state.nid, this.state.country,this.state.state,this.state.city, this.state.method, this.state.licenseID).then((res) => {
                // alert(JSON.stringify(res))
                console.log(res)
                this.props.navigation.navigate("MembershipsThanksScreen", {user: this.props.user})
            }).catch((err) => {
                alert(JSON.stringify(err))
            }).then(() => {
                this.setState({isLoading: false})
            })

        }else{
            setTimeout(() => {
                Toast.show(__("All Fields are required", this.props.language), Toast.LONG)
            }, 100)
        }
    }
    subscribeForm(){
        // alert(this.props.navigation.state.params.name)
        // if(this.state.idBack, this.state.idFront, this.state.licenceBack, this.state.licenceFront){
        this.setState({tab: 1})
        // }else{
        //     setTimeout(() => {
        //         Toast.show("All Fields are required", Toast.LONG)
        //     }, 100)
        // }
    }
    setCountry(country){
        this.setState({country})
        if(country){
            // let states= csc.getStatesOfCountry(country).map(state => {
            //     return {
            //         key: state.id,
            //         label: state.name,
            //         value: state.id
            //     }
            // })
            // this.setState({states})
        }
    }
    setCountryState(state){
        this.setState({state})
        let cities= this.state.allCities.filter(city => {
            console.log(city)
            return state == city.state
        })
        this.setState({cities})
    }
    setCity(city){
        this.setState({city})

    }
    setMethod(method){
        this.setState({method})
        if(method == "Credit"){
            this.setState({methodError: true})
        }else{
            this.setState({methodError: false})
        }

    }
    isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    }


    render() {
        return (
            <View style={Style.container}>
                <NavigationEvents onDidFocus={() => this.updateList()} />
                <Header noSearch navigation={this.props.navigation} goBack={true}/>
                <ScrollView style={{flex: 1, marginTop: 80}} >
                    <View style={Style.tab}>
                        <TouchableOpacity onPress={() => this.setState({tab: 1})} style={[Style.tabHeader, this.state.tab==1? Style.active: {}]}>
                            <Text style={[Style.tabHeaderText]}>{__("Delivery Info", this.props.language)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({tab: 2})} style={[Style.tabHeader, this.state.tab==2? Style.active: {}]}>
                            <Text style={Style.tabHeaderText}>{__("Payment Info", this.props.language)}</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.tab == 1 &&
                        <View style={Style.singleContainer}>
                            <Text style={Style.tabHeaderText}>{__("Address:", this.props.language)} </Text>
                            <RNPickerSelect
                                value={this.state.country}
                                style={{inputIOS: {color: "#0e2d3c", marginVertical: 20, alignSelf: 'flex-start'}, inputAndroid: {color: "#0e2d3c"}}}
                                placeholder={{label: __("Select a country", this.props.language), value: null}}
                                onValueChange={(value) => this.setCountry(value)}
                                items={this.state.countries}
                            />
                            <RNPickerSelect
                                value={this.state.state}
                                style={{inputIOS: {color: "#0e2d3c", marginVertical: 20, alignSelf: 'flex-start'}, inputAndroid: {color: "#0e2d3c"}}}
                                placeholder={{label: __("Select a state", this.props.language), value: null}}
                                onValueChange={(value) => this.setCountryState(value)}
                                items={this.state.states}
                            />
                            {/*<RNPickerSelect*/}
                            {/*    value={this.state.city}*/}
                            {/*    style={{inputIOS: {color: "#0e2d3c", marginVertical: 20, alignSelf: 'flex-start'}, inputAndroid: {color: "#0e2d3c"}}}*/}
                            {/*    placeholder={{label: __("Select a city", this.props.language), value: null}}*/}
                            {/*    onValueChange={(value) => this.setCity(value)}*/}
                            {/*    items={this.state.cities}*/}
                            {/*/>*/}
                            <TextInput
                                multiline={true}
                                numberOfLines={3}
                                minHeight={(Platform.OS === 'ios') ? (20 * 3) : null}
                                style={{borderColor: 'gray', borderWidth: 1, marginTop: 20, alignSelf: 'stretch', textAlign: this.props.language.isArabic ? 'right' : 'left'}}
                                onChangeText={text => this.setState({address: text})}
                                placeholder={__("Address", this.props.language)}
                                value={this.state.address}
                            />
                            <TouchableOpacity onPress={() => this.setState({tab: 2})} style={Style.button}>
                                <Text style={Style.btnText}>{__("Next", this.props.language)}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {
                        this.state.tab == 2 &&
                        <View style={Style.singleContainer}>
                            <Text style={Style.tabHeaderText}>{__("Payment Method:", this.props.language)} </Text>
                            <RNPickerSelect
                                value={this.state.method}
                                style={{inputIOS: {color: "#0e2d3c", marginVertical: 20, alignSelf: 'flex-start'}, inputAndroid: {color: "#0e2d3c"}}}
                                onValueChange={(value) => this.setMethod(value)}
                                items={[
                                    { label: __('Cash on Delivery', this.props.language), value: 'Cash' },
                                    { label: __('Credit', this.props.language), value: 'Credit' },
                                ]}
                            />
                            {
                                this.state.methodError && <Text style={{color: 'red', alignSelf: 'center'}}>{__("This method is not available right now.", this.props.language)}</Text>
                            }
                            <View style={Style.agreeToView}>
                                <TouchableOpacity onPress={() => this.setState({ modalVisible: true })}>
                                    <Text style={[Style.agreeTo]}>
                                        {__('I agree to', this.props.language)} <Text style={[Style.termsText]}>{__(' Terms & Conditions', this.props.language)}</Text>
                                    </Text>
                                </TouchableOpacity>
                                <View>
                                    <TouchableOpacity

                                        onPress={() => this.setState({ /*acceptTerms: !this.state.acceptTerms*/ modalVisible: true })}
                                    >
                                        <Image
                                            style={{ width: 25, height: 25 }}
                                            source={
                                                this.state.acceptTerms
                                                    ? require('../resources/images/checked.png')
                                                    : require('../resources/images/un-checked.png')
                                            }
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => this.subscribe()} style={Style.button}>
                                <Text style={Style.btnText}>{__("Subscribe", this.props.language)}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </ScrollView>

                <Modal
                    visible={this.state.modalVisible}
                    transparent
                    onRequestClose={() => this.setState({ modalVisible: false })}
                    animationType="fade"
                >
                    <View
                        style={{
                            width: width,
                            height: height,

                            paddingTop: height / 10,
                            paddingLeft: width / 9,
                            paddingRight: width / 9,
                            paddingBottom: height / 11,
                        }}
                    >

                        <View
                            style={{
                                borderWidth: 2,
                                flex: 1,
                                borderColor: 'grey',
                                backgroundColor: '#FFFFFF',
                            }}
                        >

                            {/* <Image
                  source={{uri:this.props.imageUrl}}
                  style={{ flex: 1, resizeMode: 'contain' }}
              /> */}
                            <ScrollView onScroll={({ nativeEvent }) => {
                                if (this.isCloseToBottom(nativeEvent)) {
                                    this.setState({ clickAccept: false, acceptTerms: true })
                                }
                            }}>
                                <Text style={[Style.termsTextModel, { textAlign: 'center', paddingTop: 3, fontFamily: Fonts.CircularMedium }]}>{__(' Terms & Conditions', this.props.language)}</Text>
                                <Text style={{ paddingHorizontal: 10, fontFamily: Fonts.CircularBook, textAlign: this.props.language.isArabic? 'right' : 'left' }}>{__("Clubenz logo and application is fully owned by Trade & Ship Poland and all intellectual property of Clubenz application is Copyrighted in the European Union and subject to EU laws. Any abuse or inappropriate usage of Clubenz shall put users under immediate termination to their account on Clubenz application, website and other properties. By accepting Clubenz terms and conditions users are clearly informed and aware of Clubenz application, website and other properties terms and conditions and all disputes (if any) are subject to Polish Law and EU intellectual property and reserved copyrights. Clubenz aims at excellence in services provided to its customers, those are Clubenz tips to help you enjoy providers services even better. Contracting Clubenz service provider outside the app voids your grantee and keeps you without any quality or cost control, so always use Clubenz for your aimed service needs. We always make sure our service providers are honest and all whilst building our providers network, our criteria of provider’s selection came out of car owners’ recommendations and sound reputation. The aim of the network is improving the quality of services rendered through providers; thus, your opinion really matters to help us to communicate with service providers on your experience to help them to improve and reach your competence. All offers and discounts can be found in the offers and/ or notifications tabs are authenticated through providers, please review offers validity carefully. Advanced booking option is made to ease your car maintenance visit and save your time, thus make sure whilst booking to select dates that suits your availability to serve you and other customers best. Cancelling & No show isn’t welcome at Clubenz. Please note that all data received through Clubenz customers are only and strictly used by Clubenz to help us to render our services appropriately. Any disclosed data are treated as top confidential and wont be disclosed to a third party or used for any marketing purposes through a third party without your consent. Make the most of Clubenz….", this.props.language)}</Text>
                            </ScrollView>
                            <View
                                style={{
                                    borderWidth: 1,
                                    borderColor: 'grey',
                                    position: 'absolute',
                                    top: -15,
                                    right: -8,
                                    // backgroundColor: 'white',
                                    width: 33,
                                    height: 33,
                                    borderRadius: 16,
                                }}
                            >
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}
                                    onPress={() => this.setState({ modalVisible: false })}
                                >
                                    {/* <Text >X</Text> */}
                                    <Image style={{ width: 35, height: 35 }} source={require('../resources/images/cross_image.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </Modal>
                <Modal
                    visible={this.state.modal2Visible}
                    transparent
                    onRequestClose={() => this.setState({ modal2Visible: false })}
                    animationType="fade"
                >
                    <View style={Style.modalContainer}>
                        <View style={Style.modal}>
                            <View style={Style.modalTop}>
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
                            <View style={Style.modalContent}>
                                <Text style={Style.modalContentText}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                                </Text>
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
const Style = StyleSheet.create({
    container: {
        flex: 1,
    },
    div:{
        flex: 1,
        flexDirection: "row"
    },
    tab: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
        borderTopColor: "rgba(209,209,209,0.16)",
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: -1,
        },
        shadowColor: 'rgba(216,216,216,0.15)',
        elevation: 1,
    },
    tabHeader: {
        flex: 1,
        fontSize: 20,
        paddingVertical: 20,
        alignItems: 'center',
    },
    tabHeaderText:{
        fontSize: 20,
        color: '#0e2d3c',
        fontWeight: 'bold',
    },
    active: {
        borderBottomColor: '#0e2d3c',
        borderBottomWidth: 1,
    },
    singleContainer: {
        padding: 50,
        fontWeight: "normal",
        alignItems: 'flex-start',

    },
    button: {
        paddingHorizontal: 80,
        marginTop: 30,
        paddingVertical: 15,
        alignSelf: 'center',
        borderRadius: 50,
        backgroundColor: '#0e2d3c',
    },
    btnText: {
        color: 'white',
        fontSize: 18,
    },
    btnStyle: {
        width: metrics.deviceWidth - 40,
        marginTop: 15,
        marginBottom: 10,
    },
    termsText: {
        color: colors.blueButton,
        textDecorationLine: 'underline',
        // fontSize: fonts.size.h8,
        fontWeight: '400',
    },
    termsTextModel: {
        color: colors.blueButton,
        fontSize: fonts.size.h8,
        fontWeight: '400',
    },
    agreeToView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // margin: 15,
        marginTop: 15,
        marginBottom: 10,
        width: 240,
        alignSelf: 'center',
        alignItems: 'center',
    },
    agreeTo: {
        color: colors.grey93,
        fontFamily: Fonts.CircularBold,
        fontSize: fonts.size.h13,

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
    card: {
        flex: 1,
        margin: 20,
        marginTop: 0,
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
        fontSize: 25
    },
    h2: {
        fontSize: 18,
        marginTop: 10,
        color: "white",
    },
    cardContent: {
        flex: 3,
        justifyContent: "space-between",
    },
    btn: {
        backgroundColor: "white",
        fontSize: 20,
        borderRadius: 50,
        marginTop: 20,
        paddingHorizontal: 40,
        paddingVertical: 10,
        marginBottom: 20,
        flexDirection: "row",
        alignSelf: 'center'
    },
    staticImages: {
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadArea: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
});


export default connect(mapStateToProps, null)(MembershipAddress)
