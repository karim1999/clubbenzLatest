import React, { PureComponent } from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Text,
    Image,
    ScrollView,
    PermissionsAndroid,
    FlatList,
    Modal,
    Platform
} from "react-native";

import { connect } from 'react-redux';
import CustomNewAd from '../components/common/customNewAd';
import { styles, fonts, colors, metrics } from "../themes";
const { width, height } = Dimensions.get("window");
import SplitHeading from "../components/common/splitHeading";
import * as workshopAction from "./../redux/actions/workshops";
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import OpenMap from "react-native-open-map";
import { Fonts } from "../resources/constants/Fonts";
import __ from '../resources/copy';

class WorkshopContactScreen extends PureComponent {

    static navigationOptions = ({ navigation }) => ({
        title: __('Contacts', '')
    });

    constructor(props) {
        super(props);
        this.workshopDetail();
    }

    state = { workshopAddress: "", openingHour: "" ,  closingHour:"" ,day_off:"",workshopDetail:{} ,  shareModalVisible:false,phoneArray:[] };

    workshopDetail() {
        workshopAction
            .workshopDetail()
            .then(res => {
                var address = JSON.stringify(res.shop_detail.address);
                address = address.replace(/"/g, "");
                var openhour = JSON.stringify(res.shop_detail.opening_hour);
                openhour = openhour.replace(/"/g, "");
                var openHourArr= openhour.split(":");
                if (parseInt(openHourArr[0]) < 12){
                    openhour=openHourArr[0]+ ":" + openHourArr[1] + "AM";
                }
                else if (parseInt(openHourArr[0]) == 12){
                    openhour=((parseInt(openHourArr[0]))).toString() + ":" + openHourArr[1] +"PM";
                }
                else {
                    openhour=((parseInt(openHourArr[0]))-12).toString() + ":" + openHourArr[1] +"PM";
                }


                var closinghour = JSON.stringify(res.shop_detail.closing_hour);
                closinghour = closinghour.replace(/"/g, "");
                var closeHourArr= closinghour.split(":");
                if (parseInt(closeHourArr[0]) < 12){
                    closinghour=closeHourArr[0]+ ":" + closeHourArr[1] + "AM";
                }
                else if(parseInt(closeHourArr[0]) == 12){
                    closinghour=((parseInt(closeHourArr[0]))).toString() + ":" + closeHourArr[1] +"PM";
                }
                else {
                    closinghour=((parseInt(closeHourArr[0]))-12).toString() + ":" + closeHourArr[1] +"PM";
                }

                var day_off = res.shop_detail.day_off;
                const serviceTags = res.shop_detail.service_tag.map(tag => this.props.language.isArabic == true ? tag.arabic_name : tag.name);
                var  phone = res.shop_detail.phone
                var phoneArray = phone.split(",");
                var to = __('to' , this.props.language);
                to = " " + to;
                var daysOff = day_off.split(",");
                var arabic_english = '';
                if (day_off.length > 0 && day_off != '') {
                    for (var i=0; i<daysOff.length; i++) {
                        var val = __(daysOff[i] , this.props.language);
                        if (i == daysOff.length - 1)
                            arabic_english += val;
                        else
                            arabic_english += val + ',';
                    }
                }

                this.setState({ workshopAddress: address, openingHour: openhour, closingHour: to + " " + closinghour ,phoneArray:phoneArray,day_off:arabic_english, serviceTags:serviceTags , workshopDetail:res.shop_detail });
            })
            .catch(err => {
                console.log("error" + JSON.stringify(err));
            });
    }

    showContact = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CALL_PHONE,
                {
                    title: 'Clubenz Need Call Permission',
                    message:
                        'Clubenz App needs access to make call ' +
                        'so you can call the delear.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {

                this.setState({shareModalVisible:!this.state.shareModalVisible});

            }
        } else if (Platform.OS === 'ios') {
            this.setState({ shareModalVisible: !this.state.shareModalVisible });
        }
    };

    getTagView = (tag1, tag2)=>{
        return (
            <View style={styleWorkshopInfoScreen.shopServicesContainer}>
                <View style={[styles.row, {width: width / 2, }]}>
                    <Image
                        resizeMode="contain"
                        style={styleWorkshopInfoScreen.tickImage}
                        source={require("../resources/icons/tick.png")}/>
                    <Text numberOfLines={1} style={[styleWorkshopInfoScreen.serviceTitle, {width: width / 2.8, textAlign: 'left'}]}>{tag1}</Text>
                </View>
                {tag2 &&
                <View style={[styles.row, {width: width / 2, justifyContent: "flex-end",}]}>
                    <Image
                        resizeMode="contain"
                        style={styleWorkshopInfoScreen.tickImage}
                        source={require("../resources/icons/tick.png")}/>
                    <Text numberOfLines={1} style={[styleWorkshopInfoScreen.serviceTitle, {width: width / 2.8, textAlign: 'left', marginRight: 10}]}>{tag2}</Text>
                </View>
                }
            </View>
        )
    }

    // renderAds = () =>{

    //   for (i = 0; i < this.props.preferences.home_ads.length; i++) {
    //     if(this.props.preferences.home_ads[i].type === "Detail page"){
    //       return   <CustomNewAd home_ads={this.props.preferences.home_ads[i]} margin={10} /> ;
    //     }
    //   }

    // }

    renderAds = () => {
        if (this.props.preferences.banner[2] != null && this.props.preferences.banner[2].status === 'active' && this.props.preferences.banner[2].type === 'Company Profile') {
            return <CustomNewAd home_ads={this.props.preferences.banner[2]} margin={10} />;
        } else {
            return null;
        }
    }

    getServiceTagView = () => {
        let tags = this.state.serviceTags
        if (!tags) return null
        let index = 0
        const length = tags.length
        let views = []
        if (length > 0) {
            if (length == 1) {
                views.push(this.getTagView(tags[0]))
            } else {
                while (index < length) {
                    const leftTag = tags[index]
                    const rightTag = index + 1 < length ? tags[index + 1] : null
                    views.push(this.getTagView(leftTag, rightTag))
                    index += 2
                }
            }
        }
        return (
            <View>
                {views}
            </View>
        )
    }

    onMapIconPress = ()=>{

        OpenMap.show({
            latitude: this.state.workshopDetail.location_lat,
            longitude: this.state.workshopDetail.location_lon,
            title: this.state.workshopDetail.name,
            cancelText: 'Close',
            actionSheetTitle: 'Chose app',
            actionSheetMessage: 'Available applications '
        });
    }
    requestCallPermission = async (item) => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CALL_PHONE,
                {
                    title: "Get permission to call Providers",
                    message:
                        "Clubbenz needs the permission to call" +
                        "so you can reach the provider you want.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // alert(JSON.stringify(item))
               RNImmediatePhoneCall.immediatePhoneCall(item)
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };
    render() {
        this.props.navigation.navigate('ScreenRegister', {title: 'WHATEVER'})
        return (
            <View style={[styleWorkshopInfoScreen.container]}>

                    <View style={{flex:1,backgroundColor:'white'}} >
                        {/*<View style={{flex:1 }}></View>*/}
                        <View style={styleWorkshopInfoScreen.modelStyle}>
                            <View style={[styleWorkshopInfoScreen.modalInnerView, {backgroundColor: '#FFFFFF' }]}>
                                <View style={styles.center}>
                                    <Text style={{height: 30, fontSize: 13,alignItems:"center", justifyContent: 'center', fontFamily: Fonts.CircularBold, color: '#5A5A5A', marginTop: 10, width: metrics.deviceWidth - 10, textAlign: 'center'}}>{__('Contact Us' , this.props.language)}</Text>

                                    <FlatList
                                        // data={['03366024409' ,'03366024409' , '03366024409' ]}
                                        data={this.state.phoneArray}
                                        keyExtractor={(item, index) => item.id}
                                        renderItem={({ item, index }) =>

                                            <TouchableOpacity style={styles.center}  onPress={() => this.requestCallPermission(item)}>

                                                <View style={styleWorkshopInfoScreen.btnStyle}>
                                                    <Text style={styleWorkshopInfoScreen.btnText} >{item}</Text>
                                                </View>
                                            </TouchableOpacity>}
                                        // ListFooterComponent={this._renderFooter}
                                    />

                                </View>
                            </View>

                        </View>
                    </View>

            </View>
        );
    }
}

mapStateToProps = (state) => {
    return {
        preferences: state.init.preferences,
        language: state.language,
    }
}

export default connect(mapStateToProps, null)(WorkshopContactScreen)


const styleWorkshopInfoScreen = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignContent: "center"
    },
    innerContainer: {
        flexDirection: "row",
        marginTop: metrics.margin18,
        justifyContent: "space-between",
        marginHorizontal: 18
    },
    shopAddress: {
        fontSize: 14,
        color: "#11455F",
        lineHeight: 22,
        width: 250,
        fontFamily: Fonts.circular_medium,
    },
    shopTimings: {
        lineHeight: 22,
        fontSize: 14
    },
    loactionCircleImage: {
        width: 106,
        height: 106,
        borderRadius: 80,
        justifyContent: "center",
        alignItems: "center"
    },
    innerLocationImage: {
        width: 34,
        height: 43
    },
    shopServicesContainer: {
        flexDirection: "row",
        // marginHorizontal: 18,
        marginHorizontal: 15,
        marginTop: 100,
    },
    tickImage: {
        width: 23,
        height: 19
    },
    serviceTitle: {
        color: "#1E313E",
        fontSize: 14,
        marginLeft: 10,
        fontFamily: Fonts.circular_medium,
        // width: width / 2.5,
    },
    ad: {
        width: metrics.deviceWidth - 8,
        height: 110,
        marginVertical: 8
    },
    btnStyle: {
        width: metrics.deviceWidth - 10,
        height: 60,
        borderTopWidth: 0.5,
        borderBottomWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        borderStyle: 'solid',
        alignItems:"center",
        justifyContent: 'center',
        // borderColor: '#3F3F3F',
    },
    btnText: {
        fontSize: 15,
        color: "#11455F",
        fontFamily: Fonts.CircularMedium,
    },
    modalInnerView:{
        // borderRadius: metrics.radius15,
    },
    modelStyle:{
        flex:1,
        justifyContent:'flex-start',
        // marginRight: metrics.deviceWidth - (metrics.deviceWidth - 5),
        // marginLeft: metrics.deviceWidth - (metrics.deviceWidth - 5),
        // borderRadius: metrics.radius15,
        // marginBottom: 20,
    },

    cancelBtnStyle: {
        width: metrics.deviceWidth - 10,
        height: 60,
        marginTop: 15,
        marginBottom: 20,
        backgroundColor: '#E6EFF9',
        borderRadius: metrics.radius40,
        alignItems:"center",
        justifyContent: 'center',
    },
    cancelBtnText: {
        color: '#0E2D3C',
        fontSize: 18,
        fontFamily: Fonts.CircularBold,
        textAlign: 'center',
    },
    contactBtnStyle: {
        width: metrics.deviceWidth - 40,
        height: 60,
        fontFamily: Fonts.CircularMedium,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#11455F',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: metrics.radius40,
        marginBottom: 4,
    }
});
