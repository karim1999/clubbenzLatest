import React, {Component} from "react"
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    Dimensions,
    ImageBackground,
    StatusBar, InteractionManager, AsyncStorage, Alert, Platform, PermissionsAndroid, Share, Linking, FlatList, I18nManager
} from "react-native"
import NetInfo from "@react-native-community/netinfo";

import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome"
import {bindActionCreators} from "redux";
import * as authAction from "../redux/actions/auth";
import * as initAction from "../redux/actions/init";
import {connect} from "react-redux";
import Advertisement from "../components/advertisement/advertisement";
import moment from "moment";
import {IMG_PREFIX_URL} from "../config/constant";
import {colors, metrics} from "../themes";
import Title from "../components/NewHomeScreen/Title";
import Service from "../components/NewHomeScreen/Service";
import StaticUsersView from "../components/common/staticUsersView";
import {returnProfilePicture} from "../components/profile/ProfilePicture";
import HomeAd from "../components/common/homeAd";
import ShareButton from "../components/NewHomeScreen/ShareButton";
import Header from "../components/NewHomeScreen/Header";
import Footer from "../components/NewHomeScreen/Footer";
import SimpleToast from "react-native-simple-toast";
import * as homeAction from "../redux/actions/home";
import Permissions from "react-native-permissions";
import Geolocation from "react-native-geolocation-service";
import NavigationService from "../NavigationService";
import ServiceItem from "../components/services/Service";
import RoundedButton from "../components/common/RoundedButton";
const { width, height } = Dimensions.get('window');
import __ from '../resources/copy';
import BackgroundFetch from "react-native-background-fetch";
import {scheduleNotification} from '../redux/actions/workshops';
import {store} from '../redux/create';
import {UPDATE_INDICATOR_FLAG} from '../redux/actions/types';
import firebase from 'react-native-firebase';

class NewHomeScreen extends Component {

    constructor(props){
        super(props)
        NetInfo.fetch().then(isConnected => {
            if (isConnected) {
            }
            else
                SimpleToast.show('Not connected to internet', SimpleToast.BOTTOM)
        })
    }

    state = {
        computationDone: false,
        searchText: '',
        locationPermission: '',
        shareText: __('Don’t miss the unique opportunity to gain excellent advice and insights from leading car experts – Clubenz application will help you pamper your car. To download, click on the below link', this.props.language),
        data: [
            {
                serviceName: 'Workshops',
                arabic_serviceName: 'مراكز الخدمة',
                serviceUrl: require("./../resources/images/service1.png"),
                path: 'WorkShopListScreen',
                Location: true
            },
            {
                serviceName: 'Part shops',
                arabic_serviceName: 'محلات قطع غيار',
                // serviceUrl: require('../resources/icons/ic_partshops.png'),
                serviceUrl: require("./../resources/images/service2.png"),
                path: 'PartShopScreen',
                Location: true
            },
            {
                serviceName: 'Special Service Centers',
                arabic_serviceName: 'خدمات متخصصة',
                serviceUrl: require("./../resources/images/service3.png"),
                path: 'ServiceListScreen',
                Location: true
            },
            {
                serviceName: 'Part Catalogue',
                arabic_serviceName: 'كتالوج قطع الغيار',
                serviceUrl: require("./../resources/images/service4.png"),
                // path: 'PartListScreen',
                path: 'CategoriesScreen',
            },
            {
                serviceName: 'Cluster Error',
                arabic_serviceName: 'اخطاء العداد',
                serviceUrl: require("./../resources/images/service5.png"),
                path: 'SpecificationScreen',
            },
            // {
            // 	serviceName: 'Tires',
            // 	serviceUrl: require('../resources/icons/ic_tires.png'),
            // 	path: 'ServiceListScreen',
            // 	Location:true
            // },
        ],
        viewSearchSection: false,
        viewServicesSection: false,
        active_index: 1,
        slider_images: [],
    };

    componentDidMount() {
        // console.log(this.props.preferences)
        if(this.props.language.isArabic)
            I18nManager.forceRTL(true)
        else
            I18nManager.forceRTL(false)
        if(!this.props.preferences.activate_part_catalogue){
            let newData= [...this.state.data]
            newData.splice(3,1)
            this.setState({data: newData})
        }
        window.navigation = this.props.navigation;
        InteractionManager.runAfterInteractions(() => {
            this.serviceHome();
            this.displayOverlay();
            this.getSliderImages();
            AsyncStorage.getItem('Notification').then((data) => {

                // alert(JSON.stringify(data))
            })
        })
        // console.log(this.props.user)


    }

    getAdvertisement = () => {
        // debugger
        if (this.props.preferences && this.props.preferences.timeDisplay && this.props.preferences.timeDisplay[0] !=null) {
            return this.props.preferences && this.props.preferences.timeDisplay ? this.props.preferences.timeDisplay[0] : null;
        }
        return '';
    }

    getTimer = () => {
        // debugger
        if (this.props.preferences && this.props.preferences.timeDisplay && this.props.preferences.timeDisplay[0] != null) {
            // debugger
            return this.compareAndReturnTime(this.props.preferences.timeDisplay[0].time_out);
        }
    }

    compareAndReturnTime = (time) => {
        var now = moment.utc();
        var then = moment(time);

        var duration = moment.duration(then.diff(now));

        // debugger

        var arr = [];

        // alert(duration)

        if (duration > 0) {
            arr.push(Math.floor(duration.asHours()));
            arr.push(Math.floor((duration.asMinutes() % 60)));
            arr.push(Math.floor((duration.asSeconds()) % 60));
            arr.push(Math.floor(duration));
            return arr;
        }
        // debugger

        return false;

    }

    renderAds = () => {
        // debugger
        if (this.props.preferences && this.props.preferences.banner && this.props.preferences.banner[0] != null && this.props.preferences.banner[0].status === 'active' && this.props.preferences.banner[0].type === 'Home Page Bottom') {
            // debugger
            return <HomeAd home_ads={this.props.preferences.banner[0]} />
        } else {
            return null;
        }
    }

    navigate(screen){
    console.log(screen);
        this.props.navigation.navigate(screen);
    }

    getSliderImages = () => {
        // var count = 0;
        // var images = [];
        // if (this.props.preferences.home_slide != null) {
        // 	images.push(this.props.preferences.home_slide[0])
        // 	images.push(this.props.preferences.home_slide[1])
        // 	images.push(this.props.preferences.home_slide[2])
        // 	slide_images = images;
        // 	console.log('Slider Images are')
        // 	console.log(slide_images)
        // } else {
        // 	// images.push('');
        // 	// images.push('');
        // 	// images.push('');
        // 	slide_images = images;
        // }
    }

    serviceHome() {
        homeAction
            .homeService()
            .then(res => {
                if (res.home_page_services === "Home page Services Not Available") {

                } else {
                    this.setState({ data: [...this.state.data, ...res.home_page_services] })
                }

            })
            .catch(err => {
                console.log("error" + JSON.stringify(err));
            });
    }

    displayOverlay = async () => {

        AsyncStorage.getItem("displayOverlays").then(value => {
            if (value != null) {

            } else {

                this.setState({
                    viewSearchSection: false,
                    viewServicesSection: false,
                });
            }
        });


    }

    _alertForLocationPermission() {
        Alert.alert(
            'Clubenz Location Permission',
            'Clubenz need to access your current location' +
            "to locate the nearest shops.",
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Permission denied'),
                    style: 'cancel',
                },
                this.state.locationPermission == 'undetermined'
                    ? { text: 'OK', onPress: this._requestPermission }
                    : { text: 'Open Settings', onPress: Permissions.openSettings },
            ],
        );
    }

    _requestPermission = () => {
        Permissions.request('location').then(response => {
            // Returns once the user has chosen to 'allow' or to 'not allow' access
            // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            this.setState({ locationPermission: response });
        });
    };

    getLocationAndNavigate = (data) => {
        console.log('start')
        store.dispatch({type:UPDATE_INDICATOR_FLAG,data:true})
        Geolocation.getCurrentPosition(
            (position) => {
                // console.log(position)
                const pos = {
                    coords: {
                        accuracy: 17.291000366210938,
                        altitude: 171.5,
                        heading: 0,
                        // latitude: 31.5429824,
                        // longitude: 74.4008077,
                        latitude: 0,
                        longitude: 0,
                        speed: 0
                    },
                    mocked: false,
                    timestamp: 1564646352931
                }
                // console.log(pos)

                var value = this.props.user.enableLocation == 'true' ? position : pos;
                console.log('end')
                store.dispatch({type:UPDATE_INDICATOR_FLAG,data:false})

                NavigationService.navigate(data.path, { position: value, preferences: this.props.preferences, homeButton: false });
            },
            (error) => {
                // See error code charts below.
                store.dispatch({type:UPDATE_INDICATOR_FLAG,data:false})
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    onMenuPress = async (data) => {

        if (data.Location) {

            if (this.props.user.enableLocation == 'true') {

                if (Platform.OS === "android") {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: "Clubenz Location Permission",
                            message:
                                "Clubenz needs access to your Location " +
                                "to locate the nearest shops."
                        }
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        this.getLocationAndNavigate(data)
                    } else {
                        alert(granted);
                    }
                } else {
                    // Geolocation.requestAuthorization();

                    Permissions.request('location').then(response => {
                        // Returns once the user has chosen to 'allow' or to 'not allow' access
                        // Response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'

                        if (response === 'authorized') {
                            console.log('authorized')

                            this.getLocationAndNavigate(data)

                        } else {
                            // asking for permission using Permissions dialog.
                            Alert.alert(
                                'Location Access',
                                'Clubenz needs access to your location',
                                [
                                    {
                                        text: 'Cancel',
                                        onPress: () => console.log('Permission denied'),
                                        style: 'cancel',
                                    },
                                    { text: 'Open Settings', onPress: Permissions.openSettings },
                                ],
                            );

                            console.log('denied')
                        }
                    });

                }

            } else {
                const pos = {
                    coords: {
                        accuracy: 17.291000366210938,
                        altitude: 171.5,
                        heading: 0,
                        // latitude: 31.5429824,
                        // longitude: 74.4008077,
                        latitude: 0,
                        longitude: 0,
                        speed: 0
                    },
                    mocked: false,
                    timestamp: 1564646352931
                }
                NavigationService.navigate(data.path, { position: pos, preferences: this.props.preferences, homeButton: false });
            }
        } else {

            // debugger

            if (data.path === "SpecificationScreen") {
                NavigationService.navigate(data.path, { selected_car: this.props.selected_car.car, selected_car_model: this.props.selected_car.model, selected_car_year: this.props.selected_car.year, user: this.props.user, preferences: this.props.preferences, homeButton: false });
            } else if (data.path === "CategoriesScreen") {
                // console.log(this.props.auth)
                // debugger
                // alert(JSON.stringify(this.props.user))
                NavigationService.navigate(data.path, { chassis: this.props.selected_car.car.chassis, selected_car: this.props.selected_car.car, preferences: this.props.preferences, homeButton: false });
            } else if (data.show_services == "on") {

                AsyncStorage.setItem("serviceId", data.id);

                if (this.props.user.enableLocation == "true") {

                    if (Platform.OS === "android") {
                        const granted = await PermissionsAndroid.request(
                            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                            {
                                title: "Clubenz Location Permission",
                                message:
                                    "Clubenz needs access to your Location " +
                                    "to locate the nearest shops."
                            }
                        );

                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                            Geolocation.getCurrentPosition(
                                (position) => {
                                    this.props.navigation.navigate("ServiceShopScreen", { position, preferences: this.props.preferences, homeButton: false });
                                },
                                (error) => {
                                    // See error code charts below.
                                    console.log(error.code, error.message);
                                },
                                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                            );
                        } else {
                            alert(granted);
                        }
                    } else {
                        console.log('IOS')
                    }

                } else {
                    const pos = {
                        coords: {
                            accuracy: 17.291000366210938,
                            altitude: 171.5,
                            heading: 0,
                            // latitude: 31.5429824,
                            // longitude: 74.4008077,
                            latitude: 0,
                            longitude: 0,
                            speed: 0
                        },
                        mocked: false,
                        timestamp: 1564646352931
                    }
                    this.props.navigation.navigate("ServiceShopScreen", { position: pos, preferences: this.props.preferences });
                }


            } else {
                NavigationService.navigate(data.path);
            }


        }

    };

    renderItem = ({ item, index }) => {
        // console.log('The length of data is ' + this.state.data.length);
        // console.log(this.state.data);
        return <Service onPress={this.onMenuPress.bind(this, item)} language={this.props.language} title={__(item.serviceName, this.props.language)} image={item.serviceUrl} />
        // return <ServiceItem data={item} navigate={this.onMenuPress} language={this.props.language} />;
    };

    onInviteOwnerPress = () => {
        const link =
          new firebase.links.DynamicLink('https://example.com/', 'https://clubenzz.page.link')
            .android.setPackageName('com.clubbenz')
            .ios.setBundleId('org.reactjs.native.example.ClubBenz')
            .ios.setFallbackUrl('https://apps.apple.com/us/app/id1507160684')
            .android.setFallbackUrl('https://play.google.com/store/apps/details?id=com.clubbenz');

        firebase.links().createShortDynamicLink(link, "SHORT").then((url) => {
          Share.share({ message: this.state.shareText.toString() +". "+ url }).then(result => console.log(result)).catch(errorMsg => console.log(errorMsg));
        }).catch((err) => {
          console.log(err)
        })
    };

    onDismissPress = async () => {

        this.setState({
            viewSearchSection: false,
            viewServicesSection: false,
        });
        AsyncStorage.setItem("displayOverlays", "Hide");
        // we will set state to hide the overlay view
    };

    onSlidePress = () => {
        this.props.navigation.openDrawer();
    };

    onNextPress = async (val) => {
        if (val == 'fromSearch') {
            this.setState({
                viewSearchSection: false,
                viewServicesSection: true,
            });
        } else {
            this.setState({
                viewSearchSection: false,
                viewServicesSection: false,
            });
        }
        AsyncStorage.setItem("displayOverlays", "Hide");
    };

    gotoPrevious = () => {
        let active_index = this.state.active_index
        active_index = active_index - 1
        if (active_index >= 1) {
            this.refs.car_slider.scrollTo({ x: width * (active_index - 1), y: 0, animated: true })
        }
    }

    gotoNext = () => {
        let active_index = this.state.active_index
        active_index = active_index + 1
        if (active_index <= 3) {
            this.refs.car_slider.scrollTo({ x: width * (active_index - 1), y: 0, animated: true })
        }
    }

    gotToSlider(num){
        let active_index = this.state.active_index
        active_index = active_index + (num - active_index)
        if (active_index <= 3) {
            this.refs.car_slider.scrollTo({ x: width * (active_index - 1), y: 0, animated: true })
        }
    }

    __changeView = (event: Object) => {
        if (event.nativeEvent.contentOffset.x == 0) {
            this.setState({ active_index: 1 })
        }
        else if (event.nativeEvent.contentOffset.x.toFixed(0) == width.toFixed(0)) {
            this.setState({ active_index: 2 })
        }
        else if (event.nativeEvent.contentOffset.x.toFixed(0) == (width * 2).toFixed(0)) {
            this.setState({ active_index: 3 })
        }
        else if (event.nativeEvent.contentOffset.x.toFixed(0) == (width * 3).toFixed(0)) {
            this.setState({ active_index: 4 })
        }
    }

    onPressAd = (link) => {
        // Linking.openURL(link).catch((err) => console.error('An error occurred', err));
        if (link !== '') {
            Linking.canOpenURL(link)
                .then((supported) => {
                    if (!supported) {
                        console.log("Can't handle url: " + link);
                    } else {
                        return Linking.openURL(link);
                    }
                })
                .catch((err) => {
                    console.log('An error occurred', err)
                });
        }
    }

    navigateToHomeListScreen = (searchText) => {
        Geolocation.getCurrentPosition(
            (position) => {
                var text = this.state.searchText;
                this.setState({ searchText: '' })
                this.props.navigation.navigate("HomeListScreen", { position, searchText, preferences: this.props.preferences });
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    onSeachSubmit = async (searchText) => {
        if (searchText) {


            if (Platform.OS == "android") {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Clubenz Location Permission",
                        message:
                            "Clubenz needs access to your Location " +
                            "to locate the nearest shops."
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    this.navigateToHomeListScreen(searchText)
                } else {
                    alert(granted);
                }
            } else {
                //  IOS app version

                // Geolocation.requestAuthorization();
                Permissions.request('location').then(response => {

                    if (response === 'authorized') {
                        console.log('authorized')

                        this.navigateToHomeListScreen(searchText)

                    } else {
                        // asking for permission using Permissions dialog.
                        Alert.alert(
                            'Location Access',
                            'Clubenz needs access to your location',
                            [
                                {
                                    text: 'Cancel',
                                    onPress: () => console.log('Permission denied'),
                                    style: 'cancel',
                                },
                                { text: 'Open Settings', onPress: Permissions.openSettings },
                            ],
                        );
                        console.log('denied')
                    }
                });

            }
        } else {
            alert('Please Enter Some Key To Search');
        }
    }

    render(){
        const user = this.props.user
        const profile_picture = returnProfilePicture(user);
        return (
            <View>
                <StatusBar hidden={false} backgroundColor={"#0e2d3c"} barStyle='light-content' />
                {/*<View style={Styles.margin}></View>*/}
                <ScrollView contentContainerStyle={Styles.mainContainer}>
                    <ScrollView
                        overScrollMode="never"
                        ref="car_slider"
                        pagingEnabled
                        horizontal
                        scrollEventThrottle={16}
                        showsHorizontalScrollIndicator={false}
                        onScroll={this.__changeView}>
                        {this.props.preferences && this.props.preferences.home_slide && this.props.preferences.home_slide.length > 0 ?
                            <TouchableOpacity onPress={() => this.onPressAd(this.props.preferences.home_slide[0].link)} >
                                <Image
                                    style={[Styles.pageViewer]}
                                    resizeMode="stretch"
                                    source={{ uri: IMG_PREFIX_URL + this.props.preferences.home_slide[0].image }} />
                            </TouchableOpacity> : null}
                        {this.props.preferences && this.props.preferences.home_slide && this.props.preferences.home_slide.length > 1 ?
                            <TouchableOpacity onPress={() => this.onPressAd(this.props.preferences.home_slide[1].link)} >
                                <Image
                                    style={Styles.pageViewer}
                                    resizeMode="stretch"
                                    source={{ uri: IMG_PREFIX_URL + this.props.preferences.home_slide[1].image }} />
                            </TouchableOpacity> : null}
                        {this.props.preferences && this.props.preferences.home_slide && this.props.preferences.home_slide.length > 2 ?
                            <TouchableOpacity onPress={() => this.onPressAd(this.props.preferences.home_slide[2].link)} >
                                <Image
                                    style={Styles.pageViewer}
                                    resizeMode="stretch"
                                    source={{ uri: IMG_PREFIX_URL + this.props.preferences.home_slide[2].image }} />
                            </TouchableOpacity> : null}
                    </ScrollView>
                    {
                        this.props.preferences && this.props.preferences.timeDisplay && this.props.preferences.timeDisplay[0] != null && this.props.preferences.timeDisplay[0].status === "active" && this.getTimer()?
                            <Advertisement ad={this.getAdvertisement()} time={this.getTimer()} /> : null
                    }

                    <View style={[Styles.controlsContainer, {transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}]}>
                        <View style={Styles.controls}>
                            <Icon onPress={this.gotoPrevious} style={Styles.icon} color={"black"} size={30} name={I18nManager.isRTL ? "angle-right" : "angle-left"} />
                            <Icon onPress={this.gotToSlider.bind(this, 1)} style={Styles.icon} size={10} name="circle-o" color={this.state.active_index == 1 ? "black" : "grey"} />
                            <Icon onPress={this.gotToSlider.bind(this, 2)} style={Styles.icon} size={10} name="circle-o" color={this.state.active_index == 2 ? "black" : "grey"} />
                            <Icon onPress={this.gotToSlider.bind(this, 3)} style={Styles.icon} size={10} name="circle-o" color={this.state.active_index == 3 ? "black" : "grey"} />
                            <Icon onPress={this.gotoNext} style={Styles.icon} color={"black"} size={30} name={I18nManager.isRTL ? "angle-left" : "angle-right"} />
                        </View>
                    </View>
                    <View style={Styles.services}>
                        <Title title={__("Pick your choice", this.props.language)} />
                        <FlatList
                            style={{ backgroundColor: colors.white }}
                            data={this.state.data}
                            renderItem={this.renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={{ flex: 1 }}
                        />
                    </View>
                    <View style={Styles.social}>
                        <Title title={__("Spread the Word", this.props.language)} />
                        {this.props.preferences.profile_pictures ? <StaticUsersView home={true} profile_picture={profile_picture} profile_pictures={this.props.preferences.profile_pictures} /> : null}
                        <Text style={{fontSize: 16, fontWeight: 'bold', textAlign: 'center', padding: 10}}>”{__("Expanding the network supports getting the best services", this.props.language)}”</Text>
                        <ShareButton onPress={this.onInviteOwnerPress.bind(this)} icon="check-square-o" title={__("Invite Owners", this.props.language)} />
                    </View>
                    {this.renderAds()}
                </ScrollView>
                <Footer navigation={this.props.navigation}/>
                <Header
                    notificationIcon
                    onSearch={this.onSeachSubmit} navigation={this.props.navigation}/>
            </View>
        )
    }

}

const Styles= StyleSheet.create({
    margin: {
        height: 100
    },
    mainContainer: {
        paddingTop: 100,
        paddingBottom: 130,
        zIndex: -2,
    },
    slider: {
    },
    controlsContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    controls: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderColor: "#eee",
        borderWidth: 1,
        width: 120,
        borderRadius: 30,
        padding: 10,
        backgroundColor: "white",
        position: "absolute"
    },
    services: {
        marginTop: 20
    },
    social: {

    },
    pageViewer: {
        // aspectRatio: 1.777,
        height: height / 2.77,
        width: metrics.deviceWidth,
        zIndex: -10,
    },
})

mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        preferences: state.init.preferences,
        selected_car: state.auth.selected_car,
        language: state.language,
        auth: state.auth,
    }
}

mapDispatchToProps = (dispatch) => bindActionCreators(
    {
        updateUser: authAction.updateUser,
        updateIndicator: initAction.updateIndicator
    },
    dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(NewHomeScreen)
