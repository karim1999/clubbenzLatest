import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,Image,
  StatusBar,
  AsyncStorage,
  TextInput,
  Platform, I18nManager,
  ScrollView,ActivityIndicator
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {NavigationActions} from 'react-navigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-simple-toast';
import {AccessToken, LoginManager} from 'react-native-fbsdk';
import {styles, fonts, colors, metrics} from '../themes';
const {width, height} = Dimensions.get('window');
import NavigationService from '../NavigationService';
import NavigationComponent from '../components/navigation/navigation';
import SplitHeading from '../components/common/splitHeading';
import * as authAction from './../redux/actions/auth';
import {LOGIN_ERROR} from '../config/constant';
import {Fonts} from '../resources/constants/Fonts';
import {connect} from 'react-redux';
import __ from '../resources/copy';
import firebase from 'react-native-firebase';
import RNRestart from 'react-native-restart';
import appleAuth, {
  AppleButton,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
  AppleAuthError,
  AppleAuthCredentialState,
} from '@invertase/react-native-apple-authentication';
import axios from 'axios';

class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {
    email: '',
    password: '',
    fcm_token: '',
    wrongPhone: false
  };

  checkNumberVerified(value) {
    // debugger
    var ver_num = value.verification_phone;
    var mobile = value.phone;
    const data = {
      phone: mobile,
      description: '',
    };
    // debugger
    if (ver_num == 0) {
      authAction
        .verifiyNumber(data)
        .then(res => {
          if (res.success) {
            // this.props.navigation.reset([NavigationActions.navigate({ routeName: 'ForgotPasswordScreen', fromscreen: 'HomeScreen', mobile }, )], 0)
            this.props.navigation.navigate('ForgotPasswordScreen', {
              fromscreen: 'LoginScreen',
              mobile,
            });
          }
        })
        .catch(err => {
          alert(JSON.stringify(err));
        });
    } else {
      console.log(value);
      // debugger
      AsyncStorage.setItem('user', JSON.stringify(value));
      if(this.props.language.isArabic){
        I18nManager.forceRTL(false)
        setTimeout(() => {
          RNRestart.Restart();
        }, 200)
      }
      NavigationService.reset('HomeScreen');

    }
  }

  signIn = () => {
    let self = this;
    let {email, password, fcm_token} = this.state;
    if (email == '' || password == '') {
      setTimeout(() => {
        Toast.show(__(LOGIN_ERROR, this.props.language), Toast.LONG);
      }, 100);
    } else {
      var mobile_number = email;
      // debugger
      // need to change email with mobile_number, this is just a temporary workaround to make the login working untill it has been changed from login with email to login with mobile on server side
      authAction
        .loginUser({email, password, fcm_token})
        .then(res => {
          console.log(res);
          if (res.success) {
            //this.checkNumberVerified(res.user);
			      res.user.verification_phone = 1;
			      AsyncStorage.setItem('user', JSON.stringify(res.user))
			      self.props.navigation.reset([NavigationActions.navigate({ routeName: 'EnableNotificationScreen' })], 0);
            NavigationService.reset("HomeScreen");
          } else {
            setTimeout(() => {
              if(__(res.message, this.props.language)){
                Toast.show(__(res.message, this.props.language), Toast.LONG);
              }else{
                Toast.show(res.message, Toast.LONG);
              }
            }, 100);
          }
        })
        .catch(err => {
          alert(JSON.stringify(err));
        });
    }
  };

  continue = () => {
    this.props.navigation.reset(
      [NavigationActions.navigate({routeName: 'HomeScreen'})],
      0,
    );
  };

  onAppleButtonPress = async () => {
    let self = this;
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [
          appleAuth.Scope.EMAIL,
          appleAuth.Scope.FULL_NAME
        ]
      });
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user.toString());
      if (credentialState === appleAuth.State.AUTHORIZED) {
        console.log('User apple sign in auth authorized');
        self.loginWithSocialMedia(appleAuthRequestResponse.user.toString(),
        appleAuthRequestResponse.fullName.givenName + " " + appleAuthRequestResponse.fullName.familyName,
        appleAuthRequestResponse.email);
       /* axios
          .post('https://NGROK_URL/auth', {
            username: appleAuthRequestResponse.user,
            code: appleAuthRequestResponse.authorizationCode,
          })
          .then(res => {
            console.log(res.data);
            if (res.data.status) {
              self.loginWithSocialMedia(res.data.username);
            }
          })
          .catch(err => {
            this.setState({
              hideSigninButton: false,
            });
            console.log('Could not authenticate user.. ', err);
          });
        return;*/
      }
    } catch (err) {
      if (err === appleAuth.Error.CANCELED) {
        Alert.alert(
          'Authentication',
          'You canceled the authentication process'
        );
      }
      console.log(err);
    }
  };

  continueWithFb = () => {
    const self = this;
    // LoginManager.logOut();
    AccessToken.getCurrentAccessToken().then(data => {
      if (data == null) {
        if (Platform.OS === 'android') {
          LoginManager.setLoginBehavior('web_only');
        }
        LoginManager.logInWithPermissions(['public_profile']).then(
          function(result) {
            if (result.isCancelled) {
              console.log('Login cancelled');
            } else {
              console.log(
                'Login success with permissions: ' +
                  result.grantedPermissions.toString(),
              );
              // alert(JSON.stringify(result))

              AccessToken.getCurrentAccessToken().then(data => {
                self.afterLoginComplete(data.accessToken);
              });
            }
          },
          function(error) {
            console.log('Login fail with error: ' + error);
          },
        );
      } else {
        self.afterLoginComplete(data.accessToken);
      }
    });
  };

  afterLoginComplete = async token => {
    let self = this;
    let {fcm_token} = this.state;
    fetch(`https://graph.facebook.com/v2.5/me?fields=email,name&access_token=${token}`)
      .then(responseJson => responseJson.json())
      .then(function(response) {
            console.log(response);
            self.loginWithSocialMedia(response.id,response.name,response.email);
        
      });
  };

  loginWithSocialMedia = async (socialId,name,email) => {
    let self = this;
    let {fcm_token} = this.state;
    if(name == undefined || name == null || name == ""){
      name = socialId;
    }
    if(email == undefined || email == null || email == ""){
      email = socialId + "@clubenz.com";
    }
    authAction.loginWithFbUser({fcm_token: fcm_token, social_id: socialId, name: name, email: email})
          .then(res => {
            if (res.success) {
              res.user.verification_phone = 1;
              AsyncStorage.setItem('user', JSON.stringify(res.user));
              self.props.navigation.reset([NavigationActions.navigate({ routeName: 'EnableNotificationScreen' })], 0);
              if(res.user.phone == '+20100'){
                NavigationService.reset("MyProfileScreen");
              }
              else{
                NavigationService.reset("HomeScreen");
              }
            } else {
              setTimeout(() => {
                Toast.show(res.message, Toast.LONG);
              }, 100);
            }
          })
          .catch(err => {
            alert(JSON.stringify(err));
          });
  };

  register = () => {
    NetInfo.fetch().then(isConnected => {
      if (isConnected) {
        this.props.navigation.navigate('CarSelectionScreen', {
          MyProfileScreen: false,
        });
      } else {
        Toast.show('Not connected to internet', Toast.SHORT);
      }
    });
  };

  onForgotPassword = () => {
    this.props.navigation.navigate('ForgotPassScreen');
  };

  onChangePassword = () => {
    let token = 'YT829508';
    let password = 'test321';
    authAction
      .changePassword({token, password})
      .then(res => {
        if (res.success) {
          Toast.show(res.message);
        } else {
          setTimeout(() => {
            Toast.show(res.message, Toast.LONG);
          }, 100);
        }
      })
      .catch(err => {
        alert(JSON.stringify(err));
      });
  };

  async componentDidMount() {
    const fcmtoken = await firebase.messaging().getToken();
    if (fcmtoken) {
      this.setState({fcm_token: fcmtoken});
    }
    appleAuth.onCredentialRevoked(() => {
      console.log('User auth has been revoked');
    });
  }

  testFB = () => {
    LoginManager.logOut();
    LoginManager.logInWithPermissions(['public_profile']).then(
      function(result) {
        debugger;
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );
        }
      },
      function(error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  checkPhoneNumber(email) {
    this.setState({email});
    if (email.includes('+')) {
      this.setState({wrongPhone: false});
    } else {
      this.setState({wrongPhone: true});
    }
  }

  render() {
    return (

    <ScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{minHeight: height}}>
        <View style={[styleLoginScreen.container, styles.center]}>
          <StatusBar
            hidden={false}
            backgroundColor={colors.navgationBar}
            barStyle="light-content"
          />
          <NavigationComponent
            navigation={this.props.navigation}
            goBack={() => this.props.navigation.goBack()}
            title="Login"
            headerimageIcone={true}
          />
          <View style={styleLoginScreen.containerTop}>
            <TouchableOpacity onPress={this.continueWithFb}>
                <View style={[styles.fbLoginButton, styleLoginScreen.btnStyle]}>
                   <View style={{alignItems: 'center',justifyContent: 'center',flexDirection: 'row'}}>
                        <Image
                            style={{height:20,width:20, alignItems: 'center', marginHorizontal: 10 }}
                            resizeMode="contain"
                            source={require('../resources/icons/icon_facebook.png')}
                        />
                        <Text style={{color: colors.white,textAlign: 'center',fontFamily: Fonts.CircularMedium,fontSize: fonts.size.h6}}>
                          {__('Continue with Facebook', this.props.language)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
            {/*
            <AppleButton
                         buttonStyle={AppleButton.Style.BLACK}
                         buttonType={AppleButton.Type.CONTINUE}
                         cornerRadius="20"
                         style={{
                           height: 60,
                           width: 365,
                           justifyContent: 'center',
                           alignSelf: 'center',
                           borderRadius: metrics.radius40,
                           fontFamily: Fonts.CircularMedium,
                           fontSize: fonts.size.h6
                         }}
                         onPress={() => this.onAppleButtonPress()}
                       />
                        */}

            <SplitHeading
              text={__('Or', this.props.language)}
              headingStyle={{padding: 10}}
              lineColor={{backgroundColor: colors.splitHeading, opacity: 0.2}}
              textColor={{color: colors.blueButton, marginTop: 5}}
              textSize={{
                fontSize: fonts.size.h13,
                fontFamily: Fonts.CircularMedium,
              }}
            />

            {this.state.wrongPhone ? (
              <Text style={{color: 'red', textAlign: 'center'}}>
                {__('Please add country code (Ex: +201 xxx xxx xxx)', this.props.language)}
              </Text>
            ) : null}

            <View style={styleLoginScreen.innerContainer}>
              <TextInput
                style={[styles.inputField, {borderColor: '#E5E5EA',color: '#000000'}]}
                placeholder={__('Mobile Number', this.props.language)}
                keyboardType={'phone-pad'}
                returnKeyType="done"
                textInputStyle={{
                  textAlign: 'center',
                  fontFamily: Fonts.CircularMedium,color: '#000000'
                }}
                placeholderTextColor="#999999"
                value={this.state.email}
                onChangeText={email => this.checkPhoneNumber(email)}
              />

              <TextInput
                style={[
                  styles.inputField,
                  {borderColor: '#E5E5EA', marginTop: 10,color: '#000000'},
                ]}
                placeholder={__('Password', this.props.language)}
                secureTextEntry={true}
                textInputStyle={{
                  textAlign: 'center',
                  fontFamily: Fonts.CircularMedium,color: '#000000'
                }}
                placeholderTextColor="#999999"
                value={this.state.password}
                onChangeText={password => this.setState({password})}
              />
            </View>

            <TouchableOpacity onPress={this.signIn}>
              <View style={[styles.tapableButton, styleLoginScreen.btnStyle]}>
                <Text style={styles.tapButtonStyleTextWhite}>
                  {__('Login', this.props.language)}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.onForgotPassword}>
              <Text
                style={[
                  styleLoginScreen.noCodeText,
                  {
                    color: 'rgba(14,45,60, 0.5)',
                    fontSize: fonts.size.h13,
                    textAlign: 'center',
                  },
                ]}>
                {__('Forgot your password!', this.props.language)}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styleLoginScreen.containerBottom}>
            <SplitHeading
              text={__('Not registered yet', this.props.language)}
              fontSize={fonts.size.small}
              headingStyle={{padding: 10}}
              lineColor={{backgroundColor: '#060029', opacity: 0.2}}
              textColor={{color: colors.grey93}}
              textSize={{
                fontSize: fonts.size.small,
                fontFamily: Fonts.CircularMedium,
              }}
            />

            <TouchableOpacity onPress={this.register}>
              <View
                style={[styles.tapableButtonHollow, styleLoginScreen.btnStyle]}>
                <Text style={styles.tapButtonStyleTextBlue}>
                  {__('Create new account', this.props.language)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
    </ScrollView>

    );
  }

}

mapStateToProps = state => {
  return {
    language: state.language,
  };
};

export default connect(
  mapStateToProps,
  null,
)(LoginScreen);

const styleLoginScreen = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    // marginTop: 5,
    marginVertical: 5,
    marginHorizontal: 20,
    width: metrics.deviceWidth - 40,
  },
  placeHolder: {
    color: colors.grey93,
    textAlign: 'center',
    fontSize: fonts.size.h14,
  },
  btnStyle: {
    width: metrics.deviceWidth - 40,
    marginTop: 17,
    marginBottom: 5,
  },
  noCodeText: {
    marginTop: 20,
    textDecorationLine: 'underline',
    fontFamily: Fonts.CircularBold,
  },
  title: {
    fontFamily: fonts.type.base,
    fontSize: fonts.size.h14,
    color: colors.blueButton,
    textAlign: 'center',
    marginTop: 15,
  },
  containerTop: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  containerBottom: {
    height: height / 3.5,
    // marginTop: 35,
    marginTop: height / 7,
    width: metrics.deviceWidth,
    backgroundColor: '#f3f3f3',
    borderTopEndRadius: metrics.radius20,
    borderTopStartRadius: metrics.radius20,
  },
});
