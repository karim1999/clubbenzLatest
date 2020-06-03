import React, { PureComponent } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Text,
    Image,
    ImageBackground,
    ScrollView,
    Modal,
    FlatList,
    PermissionsAndroid,
    InteractionManager,
    Platform
} from "react-native";

import CustomNewAd from '../components/common/customNewAd';
import { styles, fonts, colors, metrics } from "../themes";
import SplitHeading from "../components/common/splitHeading";
import * as serviceShopAction from "./../redux/actions/services";
import OpenMap from "react-native-open-map";
const { width, height } = Dimensions.get("window");
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import { connect } from 'react-redux';
import { Fonts } from '../resources/constants/Fonts';
import __ from '../resources/copy';

class ServicesContactScreen extends PureComponent {

    static navigationOptions = ({ navigation }) => ({
        title: __('Contacts', '')
    });

    constructor(props) {
        super(props);
        // this.serviceShopDetail();
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.serviceShopDetail();
        });
    }

    state = { serviceShopAddress: "", openingHour: "",  closingHour:"",day_off:"" , shareModalVisible:false,phoneArray:[] , serviceShopDetail:{}};

    serviceShopDetail() {
        serviceShopAction
            .serviceShopDetail()
            .then(res => {
                // debugger
                var address = JSON.stringify(res.shop_detail.address);
                address = address.replace(/"/g, "");
                var openhour = JSON.stringify(res.shop_detail.opening_hours);
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



                var closinghour = JSON.stringify(res.shop_detail.closing_hours);
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


                var day_off = res.shop_detail.off_day;
                const serviceTags = res.shop_detail.service_tag.map(tag => this.props.language.isArabic == true ? tag.arabic_name : tag.name)
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
                this.setState({ serviceShopAddress: address, openingHour: openhour,closingHour: to + " " + closinghour , phoneArray: phoneArray, serviceTags ,day_off: arabic_english ,serviceShopDetail:res.shop_detail});
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
            <View style={{width: metrics.deviceWidth - 20, flex: 1, flexDirection: 'row', marginLeft: 0, marginRight: 10, marginTop: 18}}>
                <View style={[styles.row, {width: metrics.deviceWidth / 2}]}>
                    <Image
                        resizeMode="contain"
                        style={styleServicesInfoScreen.tickImage}
                        source={require("../resources/icons/tick.png")}/>
                    <Text numberOfLines={1} style={[styleServicesInfoScreen.serviceTitle, {width: metrics.deviceWidth / 2.8, textAlign: 'left'}]}>{tag1}</Text>
                </View>
                {tag2 &&
                <View style={[styles.row, {width: metrics.deviceWidth / 2, marginLeft: 0,}]}>
                    <Image
                        resizeMode="contain"
                        style={styleServicesInfoScreen.tickImage}
                        source={require("../resources/icons/tick.png")}/>
                    <Text numberOfLines={1} style={[styleServicesInfoScreen.serviceTitle, {width: metrics.deviceWidth / 2.8, textAlign: 'left'}]}>{tag2}</Text>
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

    onMapIconPress = ()=>{

        OpenMap.show({
            latitude: this.state.serviceShopDetail.location_latitude,
            longitude: this.state.serviceShopDetail.location_longitude,
            title: this.state.serviceShopDetail.name,
            cancelText: 'Close',
            actionSheetTitle: 'Chose app',
            actionSheetMessage: 'Available applications '
        });
    }
    getServiceTagView = () => {
        let tags = this.state.serviceTags
        if (!tags) return null
        let index = 0
        const length = tags.length
        let views = []
        if (length > 0) {
            if (length == 1) {
                // alert('1')
                views.push(this.getTagView(tags[0]))
            } else {
                // alert('greater than 1')
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


    render() {
        return (
            <View style={[styleServicesInfoScreen.container]}>
                    <View style={{flex:1,backgroundColor:'#08080847'}} >
                        <View style={{flex:0.3 }}></View>
                        <View style={styleServicesInfoScreen.modelStyle}>
                            <View style={[styleServicesInfoScreen.modalInnerView, {backgroundColor: '#FFFFFF' }]}>
                                <View style={styles.center}>

                                    <Text style={{height: 30, fontSize: 13,alignItems:"center", justifyContent: 'center', fontFamily: Fonts.CircularBold, color: '#5A5A5A', marginTop: 10, width: metrics.deviceWidth - 10, textAlign: 'center'}}>{__('Contact Us' , this.props.language)}</Text>

                                    <FlatList
                                        // data={['03366024409' ,'03366024409' , '03366024409' ]}
                                        data={this.state.phoneArray}
                                        keyExtractor={(item, index) => item.id}
                                        renderItem={({ item, index }) =>

                                            <TouchableOpacity style={styles.center}  onPress={() => RNImmediatePhoneCall.immediatePhoneCall(item)}>

                                                <View style={styleServicesInfoScreen.btnStyle}>
                                                    <Text style={styleServicesInfoScreen.btnText} >{item}</Text>
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
export default connect(mapStateToProps, null)(ServicesContactScreen)

const styleServicesInfoScreen = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignContent: "center"
    },
    partServicesContainer: {
        flexDirection: "row",
        // marginHorizontal: 18,
        marginHorizontal: 15,
        marginTop: 18,
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
        fontFamily: Fonts.CircularMedium,
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
        marginHorizontal: 18,
        marginTop: 8
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
        fontSize: 18,
        color: "#11455F",
        fontFamily: Fonts.CircularMedium,
    },
    modalInnerView:{
        borderRadius: metrics.radius15,
    },
    modelStyle:{
        flex:0.7,
        justifyContent:'flex-end',
        marginRight: metrics.deviceWidth - (metrics.deviceWidth - 5),
        marginLeft: metrics.deviceWidth - (metrics.deviceWidth - 5),
        borderRadius: metrics.radius15,
        marginBottom: 100,
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
