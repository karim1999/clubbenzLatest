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
    ActivityIndicator,
    FlatList, AsyncStorage, Alert, Image, Modal,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {colors, fonts, metrics} from '../themes';
import * as authAction from './../redux/actions/auth'
import NavigationComponent from '../components/navigation/navigation';
import __ from '../resources/copy'

import NavigationService from "../NavigationService";
import NotificationItem from "../components/list/NotificationItem";
import {bookingList} from "../redux/actions/workshops";
import {IMG_PREFIX_URL, REGISTER_ERROR1, REGISTER_ERROR2} from '../config/constant';
import {NavigationEvents} from 'react-navigation';
import Header from "../components/NewHomeScreen/Header";
import {getMemberships, subscribe} from "../redux/actions/membership";
import ImagePicker from 'react-native-image-picker';
import Permissions from 'react-native-permissions';
import Toast from 'react-native-simple-toast';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Fonts} from '../resources/constants/Fonts';
const { width, height } = Dimensions.get('window');

class SubscribeScreen extends PureComponent {
    constructor(props) {
        super(props);
        this.state= {
            memberships: [],
            current: null,
            isDone: false,
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
            isLoading: false,
        }
    }
    updateList(){
        // let memberships= getMemberships(this.props.user.id).then(res => {
        //     this.setState({memberships: res.memberships, current: res.current, isDone: true})
        // })
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
    isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    }

    subscribe(){
        // alert(this.props.navigation.state.params.name)
        if(this.state.address, this.state.idBack, this.state.idFront, this.state.licenceBack, this.state.licenceFront){
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

            subscribe(this.props.user.id, this.props.navigation.state.params.membership.id, this.state.address, idFrontPhoto, idBackPhoto, licenseFrontPhoto, licenseBackPhoto, this.state.nid).then((res) => {
                // alert(JSON.stringify(res))
                console.log(res)
                this.props.navigation.navigate("MembershipsScreen", {msg: "Your have subscribed successfully."})
            }).catch((err) => {
                alert(JSON.stringify(err))
            }).then(() => {
                this.setState({isLoading: false})
            })

        }else{
            setTimeout(() => {
                Toast.show("All Fields are required", Toast.LONG)
            }, 100)
        }
    }

    render() {
        return (
            <View style={Styles.container}>
                <NavigationEvents onDidFocus={() => this.updateList()} />
                <StatusBar hidden={false} backgroundColor={"#060029"} barStyle='light-content' />
                <Header title={"Subscribe"} navigation={this.props.navigation} goBack={true}/>
                <ScrollView style={{flex: 1, marginTop: 120}} >
                    <View style={Styles.card}>
                        <View style={Styles.cardHeader}>
                            <Text style={Styles.h1}>{this.props.navigation.state.params.name}</Text>
                            <Text style={Styles.h1}>${this.props.navigation.state.params.price}</Text>
                        </View>
                        <View style={Styles.cardContent}>
                            {/*{*/}
                            {/*    !this.state.address &&*/}
                            {/*    <Text style={{textAlign: "center", marginTop: 10, color: 'red'}}>All the inputs are required.</Text>*/}
                            {/*}*/}
                            <TextInput
                                style={{ borderColor: 'gray', borderWidth: 1, marginTop: 20, width: 200 }}
                                onChangeText={text => this.setState({nid: text})}
                                placeholder={"ID Number"}
                                value={this.state.nid}
                            />
                            <TextInput
                                style={{ borderColor: 'gray', borderWidth: 1, marginTop: 20, width: 200 }}
                                onChangeText={text => this.setState({address: text})}
                                placeholder={"Address"}
                                value={this.state.address}
                            />
                            <View style={Styles.uploadArea}>
                                <TouchableOpacity onPress={() => this.showImagePicker("idFront")} style={Styles.staticImages}>
                                    <View style={{ height: 70, width: 70, borderRadius: 60, overflow: 'hidden', justifyContent: 'center', }}>
                                        <Image
                                            resizeMode='cover'
                                            style={{ width: 70, height: 70, paddingRight: 10 }}
                                            source={this.state.idFront == '' ? require('../resources/images/ic_menu_userplaceholder.png') : { uri: this.state.idFront }}
                                        />
                                    </View>
                                    <Text>ID Front</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.showImagePicker("idBack")} style={Styles.staticImages}>
                                    <View style={{ height: 70, width: 70, borderRadius: 60, overflow: 'hidden', justifyContent: 'center', }}>
                                        <Image
                                            resizeMode='cover'
                                            style={{ width: 70, height: 70, paddingRight: 10 }}
                                            source={this.state.idBack == '' ? require('../resources/images/ic_menu_userplaceholder.png') : { uri: this.state.idBack }}
                                        />
                                    </View>
                                    <Text>ID Back</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={Styles.uploadArea}>
                                <TouchableOpacity onPress={() => this.showImagePicker("licenceFront")} style={Styles.staticImages}>
                                    <View style={{ height: 70, width: 70, borderRadius: 60, overflow: 'hidden', justifyContent: 'center', }}>
                                        <Image
                                            resizeMode='cover'
                                            style={{ width: 70, height: 70, paddingRight: 10 }}
                                            source={this.state.licenceFront == '' ? require('../resources/images/ic_menu_userplaceholder.png') : { uri: this.state.licenceFront }}
                                        />
                                    </View>
                                    <Text>License Front</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.showImagePicker("licenceBack")} style={Styles.staticImages}>
                                    <View style={{ height: 70, width: 70, borderRadius: 60, overflow: 'hidden', justifyContent: 'center', }}>
                                        <Image
                                            resizeMode='cover'
                                            style={{ width: 70, height: 70, paddingRight: 10 }}
                                            source={this.state.licenceBack == '' ? require('../resources/images/ic_menu_userplaceholder.png') : { uri: this.state.licenceBack }}
                                        />
                                    </View>
                                    <Text>License Back</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <View style={Styles.agreeToView}>
                                    <TouchableOpacity onPress={() => this.setState({ modalVisible: true })}>
                                        <Text style={[Styles.agreeTo]}>
                                            {__('I agree to', this.props.language)}<Text style={[Styles.termsText]}>{__(' Terms & Conditions', this.props.language)}</Text>
                                        </Text>
                                    </TouchableOpacity>
                                    <View>
                                        <TouchableOpacity

                                            onPress={() => this.setState({ /*acceptTerms: !this.state.acceptTerms*/ modalVisible: true })}
                                        >
                                            <Image
                                                style={{ width: 35, height: 35 }}
                                                source={
                                                    this.state.acceptTerms
                                                        ? require('../resources/images/checked.png')
                                                        : require('../resources/images/un-checked.png')
                                                }
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => this.subscribe()}>
                                    <View style={Styles.btn}>
                                        <Text style={Styles.h1}>Subscribe</Text>
                                        {/*{*/}
                                        {/*    this.state.isLoading &&*/}
                                        {/*    <ActivityIndicator size="large" color="white" />*/}
                                        {/*}*/}
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                    <View></View>
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
                                <Text style={[Styles.termsTextModel, { textAlign: 'center', paddingTop: 3, fontFamily: Fonts.CircularMedium }]}>{__(' Terms & Conditions', this.props.language)}</Text>
                                <Text style={{ paddingHorizontal: 10, textAlign: 'justify', fontFamily: Fonts.CircularBook }}>{"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Why do we use it? It is a lonLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Why do we use it? It is a lonLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Why do we use it? It is a lonLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Why do we use it? It is a lonLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Why do we use it? It is a lonLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Why do we use it? It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."}</Text>
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
        flex: 1,
        margin: 20,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",

    },
    cardHeader: {
        flex: .5,
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
        marginBottom: 20,
        flexDirection: "row"
    },
    staticImages: {
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadArea: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: 200,
        marginTop: 20
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
