import React, {PureComponent} from 'react';
import {Alert, Image, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import {colors, fonts, metrics, styles} from '../themes';
import NavigationComponent from '../components/navigation/navigation';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import FacebookToggle from '../components/toggle/FacebookToggle';
import {submitReview} from "../redux/actions/reviews";
import { Fonts } from '../resources/constants/Fonts';
import Toast from "react-native-simple-toast";
import __ from '../resources/copy';
import SimpleToast from 'react-native-simple-toast';

import Permissions, {request, PERMISSIONS} from 'react-native-permissions';

const navigationOptions = {
    header: null,
};

class GiveReviewScreen extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        review: "",
        profile_picture: '',
        photo:{}
    }

    onDonePress = () => {
        const {navigation} = this.props
        const rating = navigation.getParam('rating', {})
        const payload = {
            providerId: rating.providerId,
            rate: rating.rate,
            service: rating.service || 0,
            value: rating.value || 0,
            cleanliness: rating.cleanliness || 0,
            competency: rating.competency || 0,
            detail: this.state.review,
            picture: this.state.profile_picture,
            shop_type: rating.shop_type,
            picture :{
				name: this.state.photo.fileName,
				type: this.state.photo.type,
				uri: this.state.photo.uri
			}
        };
        // alert(JSON.stringify(rating))
        // debugger
        // if (this.state.review == '' || this.state.review.length == 0) {
        //     setTimeout(() => {
        //         Toast.show('Please add comments or requests!', Toast.LONG);
        //     }, 100)
        // } else {
        submitReview(payload)
            .then((res) => {

                if (res){

                    // Alert.alert('Review Info', res.message, [{text: 'OK', onPress: () => navigation.goBack()}])
                    if(this.props.navigation.state.params.callBack){
                        this.props.navigation.state.params.callBack();
                        navigation.goBack();
                        navigation.navigate('ThanksScreen' , { goBack:navigation.goBack() , user:this.props.user });
                        // NetInfo.fetch().then(isConnected => {
                        //     debugger
                        //     if (isConnected) {
                        //         navigation.navigate('ThanksScreen' , { goBack:navigation.goBack() , user:this.props.user });
                        //     }
                        //     else
                        //         SimpleToast.show('Not connected to internet', SimpleToast.SHORT)
                        //   })
                    }
                }
            })
            .catch((err) => {
                console.error(err);
                Alert.alert('Review Info', 'Something gone wrong, Please try again.')
            })
        // }
    }

    changeToggleState = (value) => {
        //alert("The toggle state : " + value);
    }

    showImagePicker = async() => {

        const options = {
            title: 'Select Avatar',
            maxWidth: 1000,
            maxHeight: 1000,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        Permissions.checkMultiple(['camera', 'photo']).then(response => {
            debugger
            if (response.camera === 'denied' || response.photo === 'denied') {
              Alert.alert(
                'Clubenz needs camera and photos access',
                'Clubenz Camera and Photos Permission',
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
                        this.setState({profile_picture , photo})
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
                        this.setState({profile_picture , photo})
                    }
                });
            }
          })
    }

    render() {
        return (

            <View style={giveReviewScreenStyle.container}>
                <StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content'/>
                <NavigationComponent					navigation={this.props.navigation}
                                                        goBack={() => this.props.navigation.pop()} title={__('Rate your experience' , this.props.language)}/>
                <View style={giveReviewScreenStyle.reviewSection}>
                    <View style={{flex: 2, marginLeft: 5}}>
                        <Text style={{fontSize: 36, color: '#C7C7CC', fontFamily: Fonts.circular_book,}}>{__('How was it' , this.props.language)}</Text>
                        <TextInput
                            style={{
                                paddingLeft: 9, flex: 1,color: '#000000',
                                textAlignVertical: "top",
                                fontSize: 14,
                                fontFamily: Fonts.circular_book,
                            }}
                            placeholderTextColor='#C7C7CC'
                            placeholder={__('comments or requests' , this.props.language)}
                            multiline={true}
                            onChangeText={review => this.setState({review})}
                            value={this.state.review}
                            style={{fontFamily: Fonts.circular_book,}}
                        />
                    </View>
                    <TouchableOpacity onPress={this.showImagePicker}
                                      style={{flex: 1, alignItems: "center"}}>
                        <View style={giveReviewScreenStyle.preview}>
                            <Image style={giveReviewScreenStyle.camera}
                                   source={this.state.profile_picture == '' ? require("../resources/icons/add-image.png") : {uri: this.state.profile_picture}}
                                   resizeMode="cover"/>
                        </View>
                    </TouchableOpacity>
                </View>
                {/*<View style={giveReviewScreenStyle.shareContainer}>*/}
                {/*    <Text style={{*/}
                {/*        fontFamily: Fonts.CircularBold,*/}
                {/*        color: '#0E2D3C',*/}
                {/*        flex: 2,*/}
                {/*        marginLeft: 9*/}
                {/*    }}>{__('Share your opinion' , this.props.language)}</Text>*/}

                {/*    <View style={{flex: 1, alignItems: "center", }}>*/}
                {/*        <FacebookToggle toggle={this.changeToggleState} />*/}
                {/*    </View>*/}
                {/*</View>*/}

                <TouchableOpacity onPress={this.onDonePress}>
                    <View style={giveReviewScreenStyle.btnStyle}>
                        <Text style={styles.tapButtonStyleTextWhite}>{__('Done' , this.props.language)}</Text>
                    </View>
                </TouchableOpacity>

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
export default connect(mapStateToProps, null)(GiveReviewScreen)

const giveReviewScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    reviewSection: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: colors.grayLight,
        height: metrics.deviceWidth * 0.4,
        paddingTop: metrics.deviceWidth * 0.03
    },
    preview: {
        width: metrics.deviceWidth * 0.18,
        height: metrics.deviceWidth * 0.18,
        borderRadius: metrics.deviceWidth * 0.18,
        overflow: 'hidden'
    },
    camera: {
        width: metrics.deviceWidth * 0.18,
        height: metrics.deviceWidth * 0.18,
    },
    shareContainer: {
        height: metrics.deviceWidth * 0.14,
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: colors.grayLight,
        alignItems: "center"
    },
    btnStyle: {
        width: metrics.deviceWidth - 40,
        height: 60,
        justifyContent: 'center',
        backgroundColor: '#11455F',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: metrics.radius40,
        marginVertical: 18,
    },
});
