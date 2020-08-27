import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  StatusBar,
  Modal,
  Platform,
  InteractionManager,
  TextInput,
  Alert
} from 'react-native';
// import TextInput from '../vendor/react-native-material-textinput/lib/Input'
import ImagePicker from 'react-native-image-picker';
import { AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Toast from 'react-native-simple-toast';
import { styles, fonts, colors, metrics } from '../themes';
const { width, height } = Dimensions.get('window');
import NavigationService from '../NavigationService';
import NavigationComponent from '../components/navigation/navigation';
import SplitHeading from '../components/common/splitHeading';
import * as authAction from './../redux/actions/auth'
import { REGISTER_ERROR1, REGISTER_ERROR2, REGISTER_ERROR3 } from '../config/constant';
import { ScrollableComponent } from 'react-native-keyboard-aware-scroll-view';
import { Fonts } from '../resources/constants/Fonts';
import __ from '../resources/copy'
import firebase from 'react-native-firebase';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Permissions, {request, PERMISSIONS} from 'react-native-permissions';

class RegisterScreen extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      mobile: '',
      password: '',
      last_name: '',
      first_name: '',
      profile_picture: '',
      fcm_token: '',
      acceptTerms: false,
      clickAccept: true,
      modalVisible: false,
      user: props.user,
      app_type: Platform.OS,
      image_url: '',
      social_id: '',
      photo: {},
      fb_picture: '',
      autoFocuTextInput: true,
      wrongPhone: false
    };

    this._responseInfoCallback = this._responseInfoCallback.bind(this);
  }

  signIn = () => { };

  goBack() {
    NavigationService.goBack();
  }

  fillFacebookInfo = () => {
    LoginManager.logOut();
    const self = this;
    AccessToken.getCurrentAccessToken().then((data) => {
      if (data == null) {
        if (Platform.OS === "android") {
          LoginManager.setLoginBehavior("web_only")
        }
        LoginManager.logInWithPermissions(["public_profile"]).then(
          function (result) {
            if (result.isCancelled) {
              console.log("Login cancelled");
            } else {
              console.log("Login success with permissions: " +
                result.grantedPermissions.toString());
              // alert(JSON.stringify(result))

              AccessToken.getCurrentAccessToken().then((data) => {
                self.afterLoginComplete(data.accessToken);
              })

            }
          },
          function (error) {
            console.log("Login fail with error: " + error);
          }
        );
      } else {
        self.afterLoginComplete(data.accessToken);
      }
    })



    // LoginManager.logInWithReadPermissions(['public_profile', 'email']).then((result)=>{
    //   if(result.isCancelled) {
    //     throw null;
    //   }
    //   AccessToken.getCurrentAccessToken().then((data)=>{
    //     if(!data) {
    //       throw new Error("Something wen't wrong. Try Again.");
    //     }
    //     else{
    //      this.afterLoginComplete(data.accessToken)
    //     }
    //   }).catch((error)=>console.log(error));
    // }).catch((error)=>console.log(error))
  };

  _responseInfoCallback(error, result) {
    let self = this;
    if (error) {
      // alert('Error fetching image: ' + error.toString());
    } else {
      // alert('Success fetching image: ' + result.toString());
      var url = result.picture.data.url;

      self.setState({
        image_url: url,
        profile_picture: url,
        fb_picture: url,
      })
    }
  }

  afterLoginComplete = async (token) => {
    let self = this;
    fetch(`https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=${token}`)
      .then(responJson => responJson.json()).then(function (response) {

        let full_name = response.name.split(' ')
        let id = response.id;
        self.setState({ first_name: full_name[0], last_name: full_name[1], email: response.email, social_id: response.id }, () => {

          // commenting right now, we just need date to be set in the fields
          // self.registerUserWithFb()

          const infoRequest = new GraphRequest(id,
            {
              parameters: {
                fields: {
                  string: 'picture.type(large)'
                }
              }
            },
            self._responseInfoCallback,
          )

          new GraphRequestManager().addRequest(infoRequest).start();

        })
      }).catch(err => [
        alert(err)
      ])
  }

  registerUser = () => {
    if(this.state.wrongPhone)
      return;
    let self = this
    const { first_name, last_name, email, password, mobile, acceptTerms, profile_picture, fcm_token, user, app_type, social_id, fb_picture } = this.state
    // debugger
    if (first_name == '' || last_name == '' || email == '' && password == '' || mobile == '') {
      setTimeout(() => {
        Toast.show(__(REGISTER_ERROR1, this.props.language), Toast.LONG)
      }, 100)
    }
    else if (profile_picture == '') {
      setTimeout(() => {
        Toast.show(REGISTER_ERROR2, Toast.LONG)
      }, 100)
    }
    else if (acceptTerms == true) {
      // debugger
      var data = {};
      var userProfilePicture = '';
      if (social_id != '') {
        if ((self.state.photo && self.state.photo.uri)) {
          userProfilePicture = {
            name: self.state.photo.fileName ? self.state.photo.fileName : 'profile_' + Date.now() + '.JPG',
            type: self.state.photo.type ? self.state.photo.type : "image/jpeg",
            uri: self.state.photo.uri,
          }
          // debugger
          data = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
            mobile: mobile,
            model_id: user.model_id.id,
            car_type_id: user.car_type_id.id,
            year_id: user.year_id,
            car_vin_prefix: user.car_vin_prefix,
            // profile_picture: userProfilePicture,
            fb_picture: userProfilePicture,
            fcm_token: fcm_token,
            social_id: social_id,
            app_type: app_type,
          }

        } else {
          // debugger
          data = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
            mobile: mobile,
            model_id: user.model_id.id,
            car_type_id: user.car_type_id.id,
            year_id: user.year_id,
            car_vin_prefix: user.car_vin_prefix,
            fcm_token: fcm_token,
            social_id: social_id,
            app_type: app_type,
            fb_picture: fb_picture,
          }
          // debugger
        }
      } else {
        userProfilePicture = {
          name: self.state.photo.fileName ? self.state.photo.fileName : 'profile_' + Date.now() + '.JPG',
          type: self.state.photo.type ? self.state.photo.type : "image/jpeg",
          uri: self.state.photo.uri,
        }
        data = {
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: password,
          mobile: mobile,
          model_id: user.model_id.id,
          car_type_id: user.car_type_id.id,
          year_id: user.year_id,
          car_vin_prefix: user.car_vin_prefix,
          profile_picture: userProfilePicture,
          fcm_token: fcm_token,
          // social_id: social_id,
          app_type: app_type,
        }

        // debugger

      }

      // const data = {
      //   first_name: first_name,
      //   last_name: last_name,
      //   email: email,
      //   password: password,
      //   mobile: mobile,
      //   model_id: user.model_id.id,
      //   car_type_id: user.car_type_id.id,
      //   year_id: user.year_id,
      //   car_vin_prefix:user.car_vin_prefix,
      //   profile_picture: social_id != '' ? '' : {
      //     name: self.state.photo.fileName,
      //     type: self.state.photo.type ? self.state.photo.type:"image/jpeg",
      //     uri: self.state.photo.uri,
      //   },
      //   fcm_token: fcm_token,
      //   social_id: social_id,
      //   app_type:app_type,
      //   fb_picture: fb_picture,

      //   profile_picture : (self.state.social_id.length != 0) ? (self.state.image_url + '') : {
      //     name: self.state.photo.fileName,
      //     type: self.state.photo.type ? self.state.photo.type:"image/jpeg",
      //     uri: self.state.photo.uri,
      //  }
      // }

      // debugger
      console.log(data);
      authAction.registerUser(data)
        .then(res => {
          console.log(res)
          if (res.success) {
            // debugger
            self.props.updateUser(Object.assign(res.user, { verification_code: res.verification_code }))
            self.props.navigation.navigate('ForgotPasswordScreen', { fromscreen: 'Register', mobile, verification_code: res.verification_code });
          }
          else {
            // debugger
            setTimeout(() => {
              Toast.show(res.message, Toast.LONG)
            }, 100)
          }
        }).catch(err => {
          // debugger
          alert(JSON.stringify(err))
        })
    }
    else {
      setTimeout(() => {
        Toast.show(REGISTER_ERROR3, Toast.LONG)
      }, 100)
    }
  };

  registerUserWithFb = () => {
    let self = this
    const { first_name, last_name, email, password, mobile, acceptTerms, profile_picture, fcm_token, user, app_type, social_id } = this.state
    const data = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: password,
      mobile: mobile,
      model_id: user.model_id.id,
      car_type_id: user.car_type_id.id,
      year_id: user.year_id,
      car_vin_prefix: user.car_vin_prefix,
      fcm_token: fcm_token,
      social_id: social_id,
      app_type: app_type
    }
    authAction.registerUser(data, [profile_picture])
      .then(res => {
        if (res.success) {
          self.props.updateUser(Object.assign(res.user, { verification_code: res.verification_code }))
          self.props.navigation.navigate('ForgotPasswordScreen');
        }
        else {
          setTimeout(() => {
            Toast.show(res.message, Toast.LONG)
          }, 100)
        }
      }).catch(err => {
        alert(JSON.stringify(err))
      })
  };

  isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
  }

  showImagePicker = async() => {

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
      debugger
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
            this.setState({ profile_picture, photo })
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
            this.setState({ profile_picture, photo })
          }
        });
      }
    })
  }

  checkPhoneNumber(mobile) {
    this.setState({mobile})
    if(mobile.includes("+"))
      this.setState({wrongPhone: false})
    else
      this.setState({wrongPhone: true})
  }

  async componentDidMount() {
    const fcmtoken = await firebase.messaging().getToken();
    if (fcmtoken)
      this.setState({ fcm_token: fcmtoken })
  }

  render() {
    const profile_picture = this.state.profile_picture
    // const profile_picture = this.state.image_url;
    const image_url = this.state.image_url

    return (
      <View style={[styleRegisterScreen.container]}>
        <StatusBar hidden={false} backgroundColor={colors.navgationBar} barStyle='light-content' />
        <NavigationComponent
            homeButton={false}
            navigation={this.props.navigation}
                                                title={__('Create your account', this.props.language)} subTitle={__('One step away', this.props.language)} goBack={this.goBack} />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <TouchableOpacity onPress={this.fillFacebookInfo}>
            <View style={[styles.fbLoginButton, styleRegisterScreen.btnStyle]}>
              <Text style={styles.tapButtonStyleTextWhite}>{__('Fill your info Facebook', this.props.language)}</Text>
            </View>
          </TouchableOpacity>

          <SplitHeading
            text={__('Welcome to our Community', this.props.language)}
            headingStyle={{ padding: 10, marginTop: 5 }}
            lineColor={{ backgroundColor: colors.blueButton }}
            textColor={{ color: colors.blueButton, fontFamily: Fonts.CircularMedium }}
          />

          <View
            style={{
              paddingHorizontal: 0,
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 15,
            }}
          >
            <View style={styleRegisterScreen.staticImages}>
              <Image
                resizeMode="contain"
                style={styleRegisterScreen.sampleImages}
                source={require('../resources/images/MaskGroup6.png')}
              />
            </View>
            <View style={styleRegisterScreen.staticImages}>
              <Image
                resizeMode="contain"
                style={styleRegisterScreen.sampleImages}
                source={require('../resources/images/MaskGroup5.png')}
              />
            </View>
            <TouchableOpacity onPress={() => this.showImagePicker()} style={styleRegisterScreen.staticImages}>
              <View style={{ height: 70, width: 70, borderRadius: 60, overflow: 'hidden', justifyContent: 'center', }}>
                <Image
                  resizeMode='cover'
                  style={{ width: 70, height: 70, paddingRight: 10 }}
                  source={profile_picture == '' ? require('../resources/images/ic_menu_userplaceholder.png') : { uri: profile_picture }}
                />
              </View>
            </TouchableOpacity>
            <View style={styleRegisterScreen.staticImages}>
              <Image
                resizeMode="cover"
                style={styleRegisterScreen.sampleImages}
                source={require('../resources/images/MaskGroup7.png')}
              />
            </View>
            <View style={styleRegisterScreen.staticImages}>
              <Image
                resizeMode="cover"
                style={styleRegisterScreen.sampleImages}
                source={require('../resources/images/MaskGroup8.png')}
              />
            </View>
          </View>
          <View style={{ height: 22 }}>
            <Text style={[styleRegisterScreen.placeHolder]}>{__("Add your photo", this.props.language)}</Text>
          </View>

          <View style={styleRegisterScreen.innerContainer}>
            {
              this.state.wrongPhone ?
                  <Text style={{color: "red", textAlign: "center"}}>Please add country code (Ex: +201 2xx xxx xxx)</Text>
                  :null
            }
            <View style={{ flexDirection: 'row', marginVertical: 10, }}>
              <View style={[{ flex: 1, }]}>
                <TextInput
                  style={[styles.inputField, { borderColor: '#E5E5EA' }]}
                  placeholder={__('First name', this.props.language)}
                  textInputStyle={{ textAlign: "center", fontFamily: Fonts.CircularMedium, color: '#FFFFFF' }}
                  placeholderTextColor='#999999'
                  value={this.state.first_name}
                  onChangeText={first_name => this.setState({ first_name })}
                />
              </View>
              <View style={[{ flex: 1, marginLeft: 13, }]}>
                <TextInput
                  style={[styles.inputField, { borderColor: '#E5E5EA' }]}
                  placeholder={__('Surname', this.props.language)}
                  textInputStyle={{ textAlign: "center", fontFamily: Fonts.CircularMedium, color: '#FFFFFF' }}
                  placeholderTextColor='#999999'
                  value={this.state.last_name}
                  onChangeText={last_name => this.setState({ last_name })}
                />
              </View>
            </View>
            <TextInput
              style={[styles.inputField, { borderColor: '#E5E5EA' }]}
              placeholder={__('Email Address', this.props.language)}
              textInputStyle={{ textAlign: "center", fontFamily: Fonts.CircularMedium, color: '#FFFFFF' }}
              placeholderTextColor='#999999'
              value={this.state.email}
              onChangeText={email => this.setState({ email })}
            />

            <TextInput
              style={[styles.inputField, { borderColor: '#E5E5EA', marginTop: 10 }]}
              placeholder={__('Mobile Number', this.props.language)}
              keyboardType={'phone-pad'}
              returnKeyType='done'
              textInputStyle={{ textAlign: "center", fontFamily: Fonts.CircularMedium, color: '#FFFFFF' }}
              placeholderTextColor='#999999'
              value={this.state.mobile}
              onChangeText={mobile => this.checkPhoneNumber(mobile)}
            />

            <TextInput
              style={[styles.inputField, { borderColor: '#E5E5EA', marginTop: 10 }]}
              placeholder={__('Password', this.props.language)}
              secureTextEntry={true}
              textInputStyle={{ textAlign: "center", fontFamily: Fonts.CircularMedium, color: '#FFFFFF' }}
              placeholderTextColor='#999999'
              value={this.state.password}
              onChangeText={password => this.setState({ password })}
            />

            {/* <TextInput
              style={styles.inputField}
              textInputStyle={{ textAlign: 'center', fontFamily: Fonts.CircularMedium, }}
              type={'email'}
              label={__('Email Address' , this.props.language)}
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
            />

            <TextInput
              style={styles.inputField}
              textInputStyle={{ textAlign: 'center', fontFamily: Fonts.CircularMedium, }}
              keyboardType={'phone-pad'}
              label={__('Mobile Number' , this.props.language)}
              onChangeText={mobile => this.setState({ mobile })}
              value={this.state.mobile}
            />
            <TextInput
              style={styles.inputField}
              textInputStyle={{ textAlign: 'center', fontFamily: Fonts.CircularMedium, }}
              secureTextEntry={true}
              label={__('Password' , this.props.language)}
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
              placeholderStyle={{fontFamily: Fonts.CircularMedium}}
            /> */}
          </View>
          <View style={styleRegisterScreen.agreeToView}>
            <TouchableOpacity onPress={() => this.setState({ modalVisible: true })}>
              <Text style={[styleRegisterScreen.agreeTo]}>
                {__('I agree to', this.props.language)}<Text style={[styleRegisterScreen.termsText]}>{__(' Terms & Conditions', this.props.language)}</Text>
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

          <TouchableOpacity onPress={this.registerUser}>
            <View style={[styles.tapableButton, styleRegisterScreen.btnStyle, { marginBottom: 30 }]}>
              <Text style={styles.tapButtonStyleTextWhite}>{__('Register', this.props.language)}</Text>
            </View>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
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
                <Text style={[styleRegisterScreen.termsTextModel, { textAlign: 'center', paddingTop: 3, fontFamily: Fonts.CircularMedium }]}>{__(' Terms & Conditions', this.props.language)}</Text>
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
      </View>
    );
  }
}

//export default RegisterScreen;
mapStateToProps = (state) => {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen)
const styleRegisterScreen = StyleSheet.create({
  container: {
    flex: 1,
  },
  sampleImages: {
    // borderRadius: 80,
    // borderWidth: 2,
    width: 45,
    height: 45,
    opacity: 0.3,
  },
  innerContainer: {
    marginTop: 20,
    borderColor: colors.grey93,
    borderTopWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  padding: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  placeHolder: {
    color: colors.grey93,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: Fonts.CircularBook,
    marginTop: 10,
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
    width: metrics.deviceWidth - 40,
    alignSelf: 'center',
    alignItems: 'center',
  },
  agreeTo: {
    color: colors.grey93,
    fontFamily: Fonts.CircularBold,
    fontSize: fonts.size.h13,

  },
  title: {
    fontFamily: fonts.type.base,
    fontSize: fonts.size.h14,
    color: colors.blueButton,
    textAlign: 'center',
    marginTop: 15,
  },
  staticImages: {
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
