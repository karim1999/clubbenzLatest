import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Image,
  ImageBackground,
  StatusBar,
  Modal,
  TouchableOpacity,
  InteractionManager,
  Clipboard,
  Linking,
  Platform
} from "react-native";

import TabNavigator from "../ServicesTabNavigator";

import { colors, styles, metrics } from "../themes";
import NavigationService from "../NavigationService";
import SplitHeading from '../components/common/splitHeading';
import * as serviceShopAction from "../redux/actions/services";
import { IMG_PREFIX_URL } from "../config/constant";
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import Share from 'react-native-share';
import { Fonts } from "../resources/constants/Fonts";
import { connect } from 'react-redux';
import __ from '../resources/copy';
import Toast from "react-native-simple-toast";
import { ShareDialog } from 'react-native-fbsdk';
import SendSMS from 'react-native-sms';
import firebase from 'react-native-firebase';

class ServicesDetailScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.serviceShopDetail();
  }

  componentDidMount() {
    // InteractionManager.runAfterInteractions(() => {
    //   this.serviceShopDetail();
    // });
  }

  state = {
    serviceShopName: "",
    serviceShopLogo: "",
    serviecShopBgImage: "",
    shareModalVisible: false,
    shopShareURL: '',
    shopId: -1,
  };

  serviceShopDetail() {
    serviceShopAction
      .serviceShopDetail()
      .then(res => {
        var service_bg_image = JSON.stringify(res.shop_detail.service_bg_image);
        service_bg_image = service_bg_image.replace(/"/g, "");
        service_bg_image = IMG_PREFIX_URL + service_bg_image;
        var service_logo_image = JSON.stringify(
          res.shop_detail.service_logo_image
        );
        service_logo_image = service_logo_image.replace(/"/g, "");
        service_logo_image = IMG_PREFIX_URL + service_logo_image;
        var name = JSON.stringify(this.props.language.isArabic == true ? res.shop_detail.arabic_name : res.shop_detail.name);
        name = name.replace(/"/g, "");
        var shopId = JSON.stringify(res.shop_detail.id);
        shopId = shopId.replace(/"/g, "");
        this.setState({
          serviceShopName: name,
          serviceShopLogo: service_logo_image,
          serviecShopBgImage: service_bg_image,
          shopId: shopId,
        });
      })
      .catch(err => {
        console.log("error" + JSON.stringify(err));
      });
  }

  goToBackScreen = () => {
    NavigationService.goBack();
  };

  share = () => {
    this.setState({ shareModalVisible: !this.state.shareModalVisible });
    this.createURL();
  };

  createURL = () => {

    const link =
      new firebase.links.DynamicLink('https://example.com/serviceshop/' + this.state.shopId, 'https://clubenz.page.link')
        .android.setPackageName('com.clubbenz')
        .ios.setBundleId('org.reactjs.native.example.ClubBenz')
        .ios.setFallbackUrl('https://twitter.com')
        .android.setFallbackUrl('https://twitter.com');
    debugger
    firebase.links().createShortDynamicLink(link, "SHORT").then((url) => {
      this.setState({
        shopShareURL: url,
      })
      console.log(url)
      const tokenizd = url.split('/');
      debugger
    }).catch((err) => {
      console.log(err)
    })

  }

  // shareWHATSAPP = (a) => {
  //   const shareOptions = {
  //     title: 'Share via',
  //     url: this.state.shopShareURL,
  //     social: Share.Social.WHATSAPP
  //   };
  //   Share.shareSingle(shareOptions);
  // }

  shareWHATSAPP = () => {
    Linking.openURL(`whatsapp://send?text=${this.state.shopShareURL}`);
  }

  openShareDialog = () => {

    const shareLinkContent = {
      contentType: 'link',
      contentUrl: this.state.shopShareURL,
      contentDescription: 'Wow, check out this service shop!',
    };

    ShareDialog.canShow(shareLinkContent).then(
      function (canShow) {
        return ShareDialog.show(shareLinkContent);
      }
    ).then(
      function (result) {
        if (result.isCancelled) {
          console.log('Share cancelled');
        } else {
          console.log('Share success with postId: '
            + result.postId);
        }
      },
      function (error) {
        console.log('Share fail with error: ' + error);
      }
    );
  }

  copyLink = () => {

    Clipboard.setString(this.state.shopShareURL + '');
    this.setState({ shareModalVisible: !this.state.shareModalVisible })
    setTimeout(() => {
      Toast.show('Coppied Content Successfully', Toast.LONG, Toast.BOTTOM);
    }, 100)
  }

  sendSMS = () => {
    SendSMS.send({
      body: this.state.shopShareURL,
      recipients: [''],
      successTypes: ['sent', 'queued'],
      allowAndroidSendWithoutReadPermission: false
    }, (completed, cancelled, error) => {
      this.setState({ shareModalVisible: false })
      console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);

    });
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: colors.black, }}>
        <StatusBar
          hidden={false}
          backgroundColor={colors.navgationBar}
        />
        <ImageBackground
          style={styleServicesDetailScreen.backgroundImage}
          source={{ uri: this.state.serviecShopBgImage }}
        >
          <ImageBackground
            style={styleServicesDetailScreen.backgroundImage1}
            source={require('../resources/images/transparent-layer-1.png')}
          >
            <View style={styleServicesDetailScreen.topBar}>
              <TouchableWithoutFeedback onPress={this.goToBackScreen}>
                <Image
                  style={styleServicesDetailScreen.topBarImage}
                  resizeMode="contain"
                  source={require("../resources/images/ic-back.png")}
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={this.share}>
                <Image
                  style={styleServicesDetailScreen.topBarImage}
                  source={require("../resources/icons/ic-share.png")}
                />
              </TouchableWithoutFeedback>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-start",
                alignItems: "center",
                paddingTop: metrics.smallMargin
              }}
            >
              <Image
                resizeMode="cover"
                style={styleServicesDetailScreen.shopLogo}
                source={{ uri: this.state.serviceShopLogo }}
              />
              <Text style={styleServicesDetailScreen.shopName}>
                {this.state.serviceShopName}
              </Text>
            </View>
          </ImageBackground>
        </ImageBackground>
        <View
          style={{
            flex: 600
          }}
        />

        <View style={styleServicesDetailScreen.tabNavigatorContainer}>
          <TabNavigator />
        </View>
        <Modal
          transparent={true}
          visible={this.state.shareModalVisible}
          animationType="slide"
          onRequestClose={() => {
            this.share();
          }}
          style={{ alignItems: 'flex-end' }}
        >

          <View style={{ flex: 1, backgroundColor: '#08080847' }} >
            <View style={{ flex: 0.3, }}></View>
            <View style={styleServicesDetailScreen.modelStyle}>
              <View style={styleServicesDetailScreen.modalInnerView}>
                <View style={[styles.center, { backgroundColor: '#FFFFFF', borderRadius: metrics.radius15, }]}>
                  <Text style={{ height: 30, fontSize: 13, alignItems: "center", justifyContent: 'center', fontFamily: Fonts.CircularBold, color: '#5A5A5A', marginTop: 10, borderBottomColor: '#000000', width: metrics.deviceWidth - 10, textAlign: 'center' }}>{__('Share Via', this.props.language)}</Text>

                  <TouchableOpacity style={styles.center} onPress={() => this.openShareDialog()}>
                    <View style={styleServicesDetailScreen.btnStyle}>
                      <Text style={styleServicesDetailScreen.btnText} >{__('Facebook', this.props.language)}</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.center} onPress={this.shareWHATSAPP}>
                    <View style={styleServicesDetailScreen.btnStyle}>
                      <Text style={styleServicesDetailScreen.btnText} >{__('WhatsApp', this.props.language)}</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.center} onPress={() => this.sendSMS()}>
                    <View style={styleServicesDetailScreen.btnStyle}>
                      <Text style={styleServicesDetailScreen.btnText} >{__('SMS', this.props.language)}</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.center} onPress={this.copyLink}>
                    <View style={styleServicesDetailScreen.btnStyle}>
                      <Text style={styleServicesDetailScreen.btnText} >{__('Copy Link', this.props.language)}</Text>
                    </View>
                  </TouchableOpacity>

                </View>

              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.center} onPress={this.share}>
            <View style={[styleServicesDetailScreen.cancelBtnStyle, { backgroundColor: '#E6EFF9' }]}>
              <Text style={styleServicesDetailScreen.cancelBtnText}>{__('Cancel', this.props.language)}</Text>
            </View>
          </TouchableOpacity>

        </Modal>
      </View>
    );
  }
}

mapStateToProps = (state) => {
  return {
    language: state.language,
  }
}

export default connect(mapStateToProps, null)(ServicesDetailScreen);

const styleServicesDetailScreen = StyleSheet.create({
  backgroundImage: {
    flex: 400,
    width: metrics.deviceWidth,
    // paddingTop: 20,
    // paddingLeft: 10,
    // paddingRight: 10,
  },
  backgroundImage1: {
    width: metrics.deviceWidth,
    flex: 400

  },
  topBar: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    flex: 0.3,
    width: metrics.deviceWidth,
    marginTop: 15,

    // backgroundColor: 'rgba(17,69,95, 0.32)',

    // paddingHorizontal: metrics.deviceWidth * 0.01, 
  },
  topBarImage: {
    width: 32,
    height: 32,
    marginHorizontal: 10,
    marginTop: 10
  },
  shopLogo: {
    width: 66,
    height: 66
  },
  tabNavigatorContainer: {
    width: metrics.deviceWidth,
    // flex: 670,
    flex: 600,
    // height: metrics.deviceHeight / 1.53,
    height: metrics.deviceHeight / 1.6,
    position: "absolute",
    backgroundColor: colors.white,
    borderTopEndRadius: metrics.radius20,
    borderTopStartRadius: metrics.radius20,
    bottom: 0,
    left: 0,
    right: 0
  },
  shopName: {
    color: colors.white,
    fontSize: metrics.deviceWidth * 0.07,
    textAlign: "center",
    fontFamily: Fonts.CircularBold,
  },
  btnText: {
    fontSize: 18,
    color: '#11455F',
    fontFamily: Fonts.CircularBold,
  },
  modalInnerView: {
    // borderTopEndRadius: metrics.radius15,
    // borderTopStartRadius: metrics.radius15,
    borderRadius: metrics.radius15,
  },
  modelStyle: {
    flex: 0.7,
    justifyContent: 'flex-end',
    marginRight: metrics.deviceWidth - (metrics.deviceWidth - 5),
    marginLeft: metrics.deviceWidth - (metrics.deviceWidth - 5),
    borderRadius: metrics.radius15,
  },
  btnStyle: {
    width: metrics.deviceWidth - 10,
    height: 60,
    borderWidth: 0.7,
    borderTopWidth: 0.5,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderStyle: 'solid',
    alignItems: "center",
    justifyContent: 'center',
    // borderColor: '#3F3F3F',
  },

  cancelBtnStyle: {
    width: metrics.deviceWidth - 10,
    height: 60,
    marginTop: 15,
    marginBottom: 20,
    backgroundColor: '#E6EFF9',
    borderRadius: metrics.radius40,
    alignItems: "center",
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#0E2D3C',
    fontSize: 18,
    fontFamily: Fonts.CircularBold,
    textAlign: 'center',
  },
});
