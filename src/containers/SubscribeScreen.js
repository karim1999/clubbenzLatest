import React, { PureComponent } from 'react';
import {
    View,
    StyleSheet,
    StatusBar,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Dimensions,
    Alert,
    Image,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {colors, fonts, metrics} from '../themes';
import * as authAction from './../redux/actions/auth'
import __ from '../resources/copy'

import {NavigationEvents} from 'react-navigation';
import Header from "../components/NewHomeScreen/Header";
import ImagePicker from 'react-native-image-picker';
import Permissions from 'react-native-permissions';
import Toast from 'react-native-simple-toast';
import {Fonts} from '../resources/constants/Fonts';
const { width, height } = Dimensions.get('window');

class SubscribeScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.state= {
            nid: "",
            idFront: "",
            idBack: "",
            licenceFront: "",
            licenceBack: "",
            idFrontPhoto: null,
            idBackPhoto: null,
            licenceFrontPhoto: null,
            licenceBackPhoto: null,
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

    subscribeForm(){
        if(this.state.idBack && this.state.idFront && this.state.licenceBack && this.state.licenceFront && this.state.nid) {
            this.props.navigation.navigate("MembershipAddress", {...this.state, membership: this.props.navigation.state.params.membership})
        }else{
            setTimeout(() => {
                Toast.show(__("All Fields are required", this.props.language), Toast.LONG)
            }, 100)
        }
    }
    render() {
        return (
            <View style={Style.container}>
                <NavigationEvents/>
                <StatusBar hidden={false} backgroundColor={"#0e2d3c"} barStyle='light-content' />
                <Header noSearch title={"Subscribe"} navigation={this.props.navigation} goBack={true}/>
                <ScrollView style={{flex: 1, marginTop: 120}} >
                    <View style={Style.card}>
                        <View style={Style.cardHeader}>
                            <Text style={Style.h1}>{this.props.navigation.state.params.name}</Text>
                            <Text style={Style.h1}>{this.props.navigation.state.params.price} {__('EGP', this.props.language)}</Text>
                        </View>
                        <View style={Style.cardContent}>
                                <Text style={{textAlign: "center", marginTop: 10, color: 'white'}}>{__("Please enter the following details:", this.props.language)}</Text>

                            {/*{*/}
                            {/*    !this.state.address &&*/}
                            {/*    <Text style={{textAlign: "center", marginTop: 10, color: 'red'}}>All the inputs are required.</Text>*/}
                            {/*}*/}
                            <TextInput
                                style={{borderColor: 'white', borderBottomWidth: 1, marginTop: 20, color: "white"}}
                                onChangeText={text => this.setState({nid: text})}
                                placeholder={__("ID Number", this.props.language)}
                                placeholderTextColor = "#fff"
                                value={this.state.nid}
                            />
                            <View style={[Style.uploadArea, {alignSelf: 'stretch'}]}>
                                <TouchableOpacity onPress={() => this.showImagePicker("idFront")} style={Style.staticImages}>
                                    <View style={{ height: 100, width: 100, overflow: 'hidden', justifyContent: 'center', }}>
                                        <Image
                                            resizeMode='cover'
                                            style={{ width: 100, height: 100, paddingRight: 10 }}
                                            source={this.state.idFront == '' ? require('../resources/images/upload_image.png') : { uri: this.state.idFront }}
                                        />
                                    </View>
                                    <Text style={{color: "white"}}>{__("ID Front", this.props.language)}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.showImagePicker("idBack")} style={Style.staticImages}>
                                    <View style={{ height: 100, width: 100, overflow: 'hidden', justifyContent: 'center', }}>
                                        <Image
                                            resizeMode='cover'
                                            style={{ width: 100, height: 100, paddingRight: 10 }}
                                            source={this.state.idBack == '' ? require('../resources/images/upload_image.png') : { uri: this.state.idBack }}
                                        />
                                    </View>
                                    <Text style={{color: "white"}}>{__("ID Back", this.props.language)}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[Style.uploadArea, {alignSelf: 'stretch'}]}>
                                <TouchableOpacity onPress={() => this.showImagePicker("licenceFront")} style={Style.staticImages}>
                                    <View style={{ height: 100, width: 100, overflow: 'hidden', justifyContent: 'center', }}>
                                        <Image
                                            resizeMode='cover'
                                            style={{ width: 100, height: 100, paddingRight: 10 }}
                                            source={this.state.licenceFront == '' ? require('../resources/images/upload_image.png') : { uri: this.state.licenceFront }}
                                        />
                                    </View>
                                    <Text style={{color: "white"}}>{__("License Front", this.props.language)}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.showImagePicker("licenceBack")} style={Style.staticImages}>
                                    <View style={{ height: 100, width: 100, overflow: 'hidden', justifyContent: 'center', }}>
                                        <Image
                                            resizeMode='contain'
                                            style={{ width: 100, height: 100, paddingRight: 10 }}
                                            source={this.state.licenceBack == '' ? require('../resources/images/upload_image.png') : { uri: this.state.licenceBack }}
                                        />
                                    </View>
                                    <Text style={{color: "white"}}>{__("License Back", this.props.language)}</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => this.subscribeForm()}>
                                    <View style={Style.btn}>
                                        <Text
                                            style={{color: "#0e2d3c", fontSize: 15}}
                                        >{__("Next", this.props.language)}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                    <View></View>
                </ScrollView>
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


});


export default connect(mapStateToProps, null)(SubscribeScreen)
