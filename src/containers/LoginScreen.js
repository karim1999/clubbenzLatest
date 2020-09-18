import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  StatusBar,
  AsyncStorage,
  TextInput,
  Platform, I18nManager,
  ScrollView
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import {NavigationActions} from 'react-navigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import TextInput from "../vendor/react-native-material-textinput/lib/Input";
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

class LoginScreen extends React.Component {

  constructor(props) {
    super(props);
    // this.onChangePassword();
  }

  state = {
    email: '',
    password: '',
    // fcm_token: global.android_token
    fcm_token: '',
    wrongPhone: false,
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
    fetch(
      `https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=${token}`,
    )
      .then(responJson => responJson.json())
      .then(function(response) {
        authAction
          .loginWithFbUser({fcm_token: fcm_token, social_id: response.id})
          .then(res => {
            if (res.success) {
              AsyncStorage.setItem('user', JSON.stringify(res.user));
              NavigationService.reset('HomeScreen');
            } else {
              setTimeout(() => {
                Toast.show(res.message, Toast.LONG);
              }, 100);
            }
          })
          .catch(err => {
            alert(JSON.stringify(err));
          });
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
                <Text style={styles.tapButtonStyleTextWhite}>
                  {__('Continue with Facebook', this.props.language)}
                </Text>
              </View>
            </TouchableOpacity>

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
                {__('Please add country code (Ex: +201 2xx xxx xxx)', this.props.language)}
              </Text>
            ) : null}

            <View style={styleLoginScreen.innerContainer}>
              <TextInput
                style={[styles.inputField, {borderColor: '#E5E5EA'}]}
                placeholder={__('Mobile Number', this.props.language)}
                keyboardType={'phone-pad'}
                returnKeyType="done"
                textInputStyle={{
                  textAlign: 'center',
                  fontFamily: Fonts.CircularMedium,
                  color: '#FFFFFF',
                }}
                placeholderTextColor="#999999"
                value={this.state.email}
                onChangeText={email => this.checkPhoneNumber(email)}
              />

              <TextInput
                style={[
                  styles.inputField,
                  {borderColor: '#E5E5EA', marginTop: 10},
                ]}
                placeholder={__('Password', this.props.language)}
                secureTextEntry={true}
                textInputStyle={{
                  textAlign: 'center',
                  fontFamily: Fonts.CircularMedium,
                  color: '#FFFFFF',
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
