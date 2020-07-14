import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions, TouchableOpacity, Image, Platform } from 'react-native';
import NavigationComponent from '../components/navigation/navigation';
import { colors, styles, metrics, fonts } from '../themes';
import { list } from '../resources/constants/ShopListConstant';
import ListItem from '../components/list/ListItem';
import NavigationService from '../NavigationService';
import __ from '../resources/copy';
import { Fonts } from '../resources/constants/Fonts';

const { height, width } = Dimensions.get('window');

import { RNCamera } from 'react-native-camera';
import SimpleToast from 'react-native-simple-toast';

import * as authAction from './../redux/actions/auth'

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { store } from "./../redux/create"
import axios from "axios"
class SearchVinScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrOfText: [],
            isFound: false,
            cameraReady: false,
            inProccess: false,
            movedToManual: false,
        }
    }

    componentDidMount() {
        this.props.navigation.addListener("didFocus", () => {
            // user has navigated to this screen
            this.setState({ isFound: false, movedToManual: false })
        });

        // this.interval = setInterval(() => {
        //     if (this.state.cameraReady) {
        //         // if (!this.state.isFound)
        //         //     this.takePic()
        //     }
        // }, 1500)

    }

    componentWillUnmount() {
        // clearInterval(this.interval)
        // if (!this.state.isFound && !this.state.inProccess)
        //     clearInterval(this.interval)
    }

    detectText = async () => {

        console.log('Entered')
        console.log(this.camera.state)
        if (this.camera.state.isAuthorized) {
            if (!this.state.isFound) {
                try {
                    const options = {
                        quality: 0.8,
                        // quality: 0.5,
                        base64: true,
                        skipProcessing: true,
                    };

                    const { uri } = await this.camera.takePictureAsync(options);

                    const visionResp = await RNTextDetector.detectFromUri(uri);
                    this.setState({
                        arrOfText: visionResp,
                    })

                    if (visionResp.length > 0) {
                        var textArr = visionResp;
                        textArr.forEach(item => {
                            if (item.text.length == 17) {



                                if (!(/\s/.test(item.text))) {

                                    var prefix = item.text.substring(3, 9);
                                    console.log(prefix)
                                    SimpleToast.show('Your VIN is ' + prefix, SimpleToast.SHORT)
                                    this.setState({ isFound: true })

                                    console.log('VIN', item)

                                    authAction.getCarByVin({ vin_prefix: prefix }).then(res => {
                                        if (res.success) {
                                            // do work here
                                            // debugger
                                            this.props.updateUser({
                                                car_vin_prefix: res.data.vin_prefix,
                                                car_type_id: res.data.fuel_type,
                                                model_id: res.data.model_id,
                                                year_id: res.data.year_id,
                                            })
                                            NavigationService.navigate('RegisterScreen');
                                            // debugger
                                        } else {
                                            SimpleToast.show(res.message, SimpleToast.LONG, SimpleToast.BOTTOM)
                                        }
                                    })
                                } else {
                                    console.log('Contains white spaces', item)
                                }

                            } else {
                                console.log('NOT VIN', item)
                            }
                        });
                        // console.log('visionResp', visionResp);
                    }
                } catch (e) {
                    // debugger
                    // console.warn(e);
                    // console.log(e)
                }
            }
        }
    };

    noVinNumber = () => {
        this.setState({ movedToManual: true })
        NavigationService.navigate('LocateVinNumberScreen');
    }

    takePic = async function () {
        const self = this;
        // console.log('Scanning again')
        if (!this.state.isFound) {
            const options = { quality: 0.3, base64: true };
            if (!this.state.inProccess) {
                const data = await this.camera.takePictureAsync(options);
                console.log(data.uri);
                this.detectText(data.base64);
            } else {
                SimpleToast.show('Processing on picture. Please wait !!', SimpleToast.BOTTOM);
            }
        }
    }

    detectText = (base64) => {
        // debugger
        this.setState({ inProccess: true });
        // console.log(base64)
        axios.post("https://vision.googleapis.com/v1/images:annotate?key=" + "AIzaSyCX7hdA5Sj0TeyQuqL-ZyUewyt9GJ1mvZ0", {
            "requests": [{
                "image": { "content": base64 },
                "features": [
                    { "type": "TEXT_DETECTION" }
                ]
            }]
        })
            .then(response => {
                // console.log(response.data)
                // alert(JSON.stringify(response))
                return response.data
            })
            .then(jsonRes => {
                console.log(jsonRes)
                if(jsonRes.responses[0]){
                    let text = jsonRes.responses[0].fullTextAnnotation.text
                    text = text.trim('\n');
                    // console.log(text)
                    // debugger
                    // console.log(text)
                    if (text != 'undefined' && text.length > 0) {
                        // console.log('Text not null and greater than 0')
                        var textArr = text.split('\n');
                        // console.log(textArr.length)
                        // console.log(textArr[0])
                        textArr.forEach(item => {
                            console.log(item)
                            // item = item.trim(' ');
                            item = item.replace(/\s/g,'');
                            if (item.length == 17) {
                                SimpleToast.show('Scan Vin Number Found !')
                                // console.log('Item is 17')
                                if (!(/\s/.test(item))) {
                                    // console.log(item)
                                    var prefix = item.substring(3, 9);
                                    this.setState({ isFound: true, inProccess: false })
                                    // alert(prefix)

                                    authAction.getCarByVin({ vin_prefix: prefix }).then(res => {
                                        if (res.success) {
                                        debugger
                                            if (this.props.navigation.state.params && this.props.navigation.state.params.MyProfileScreen != null && this.props.navigation.state.params.MyProfileScreen == true) {
                                            debugger
                                                store.dispatch({
                                                    type: "UPDATE_SELECTED_CAR",
                                                    data: {
                                                        year: res.data.year_id,
                                                        model: res.data.model_id,
                                                        car_type: res.data.fuel_type,
                                                        car: res.data
                                                    }
                                                });
                                                NavigationService.navigate('MyProfileScreen', {updateCar: true});
                                            } else {
                                                this.props.updateUser({
                                                    car_vin_prefix: res.data.vin_prefix,
                                                    car_type_id: res.data.fuel_type,
                                                    model_id: res.data.model_id,
                                                    year_id: res.data.year_id,
                                                })
                                                NavigationService.navigate('RegisterScreen');
                                            }
                                        } else {
                                            SimpleToast.show(res.message, SimpleToast.LONG, SimpleToast.BOTTOM)
                                            this.setState({ inProccess: false, isFound: false })
                                        }
                                    })
                                }
                            } else {
                                this.setState({ inProccess: false })
                            }
                        })
                    }

                }else{
                    console.log("No response")
                    this.setState({ inProccess: false, isFound: false })
                }

            }).catch(err => {
                this.setState({ inProccess: false, isFound: false })
                console.log('Error', err)
            })
    }

    componentWillMount() {
        // alert('Welcome back');
    }

    detectData = async (text) => {
        if(text){
            // alert(text)
        }
    }
    render() {

        // setTimeout(() => {
        //     console.log('yahoo !')
        //     this.detectText();
        // }, 1000)

        return (
            <View style={{ flex: 1, backgroundColor: '#0E2D3C' }}>
                <StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>
                <NavigationComponent    navigation={this.props.navigation}
                                                        goBack={() => {this.setState({ movedToManual: true }); this.props.navigation.goBack()}} title={__("Scan your Vin", this.props.language)} />
                <View style={{ flex: 0.1, justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Text style={{ textAlign: "center", color: 'white', fontFamily: Fonts.CircularMedium, fontSize: 14, }}>{__("17 character alpha/numeric serial number", this.props.language)} {"\n"} {__("unique to each vehicle", this.props.language)}</Text>
                </View>
                <View style={{ flex: 0.6, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{
                        width: metrics.deviceWidth - 24,
                        height: metrics.deviceWidth * 0.5,
                        borderRadius: 16,
                        overflow: "hidden",
                        borderColor: colors.white,
                        borderWidth: 1,
                        borderStyle: 'solid',
                    }}>

                        <RNCamera
                            ref={ref => {
                                this.camera = ref;
                            }}
                            style={{
                                width: metrics.deviceWidth - 24,
                                height: metrics.deviceWidth * 0.5,
                                borderRadius: 16,
                                borderColor: colors.white,
                                borderWidth: 1,
                                borderStyle: 'solid',
                            }}

                            type={RNCamera.Constants.Type.back}

                            flashMode={RNCamera.Constants.FlashMode.off}

                            androidCameraPermissionOptions={{
                                title: 'Permission to use camera',
                                message: 'We need your permission to use your camera',
                                buttonPositive: 'Ok',
                                buttonNegative: 'Cancel',
                            }}
                            onCameraReady={() => this.setState({ cameraReady: true })}
                            // onTextRecognized={this.detectData}
                            // onCameraReady={() => Platform.OS === 'android ' ? this.detectText() : this.takePic()}

                            // onCameraReady={() => this.detectText()}

                            // androidRecordAudioPermissionOptions={{
                            //     title: 'Permission to use audio recording',
                            //     message: 'We need your permission to use your audio',
                            //     buttonPositive: 'Ok',
                            //     buttonNegative: 'Cancel',
                            // }}

                            // onGoogleVisionBarcodesDetected={({ barcodes }) => {
                            //     console.log(barcodes);
                            // }}

                            captureAudio={false}
                        />

                    </View>
                </View>
                <View style={{ flex: 0.15, marginBottom: 30, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.takePic()}>
                        <View style={styleSearchVinScreen.btnStyle}>
                            <Text style={styles.tapButtonStyleTextWhite}>{__("Check Vin Number", this.props.language)}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 0.15, marginBottom: 30, alignItems: 'center' }}>
                    <TouchableOpacity onPress={this.noVinNumber}>
                        <View style={styleSearchVinScreen.btnStyle}>
                            <Text style={styles.tapButtonStyleTextWhite}>{__("Can’t locate your Vin", this.props.language)}</Text>
                        </View>
                    </TouchableOpacity>
                </View>


            </View>
        );
    }
}

mapStateToProps = (state) => {
    return {
        services: state.init.services,
        preferences: state.init.preferences,
        user: state.auth.user,
        isIndicator: state.init.is_loading_indicator,
        language: state.language,
    }
}

mapDispatchToProps = (dispatch) => bindActionCreators(
    {
        updateUser: authAction.updateUser
    },
    dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(SearchVinScreen)

const styleSearchVinScreen = StyleSheet.create({
    container: {
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: '#0E2D3C',
        padding: metrics.basePadding,
        justifyContent: "space-between",
    },
    infoText: {
        color: colors.white,
        fontSize: 14,
        textAlign: "center",
        marginTop: metrics.doubleBaseMargin
    },
    btnStyle: {
        width: metrics.deviceWidth - 40,
        height: 60,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: "transparent",
        borderColor: colors.white,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: metrics.radius40,
        marginVertical: 18
    }
});
