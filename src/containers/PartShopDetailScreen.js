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
  Clipboard,
  Linking,
  Platform,
  InteractionManager,
} from "react-native";

import TabNavigator from "../PartShopTabNavigator";

import { colors, styles, metrics, fonts } from "../themes";
import NavigationService from "../NavigationService";
import SplitHeading from '../components/common/splitHeading';
import * as partShopAction from "../redux/actions/partsShop";
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

class PartShopDetailScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.partShopDetail();
  }
  state = {
    partShopName: "",
    partShopLogo: "",
    partShopBgImage: "",
    shareModalVisible: false,
    shopShareURL: '',
    shopId: -1,
  };

  componentDidMount() {
    // InteractionManager.runAfterInteractions(() => {
    //   this.partShopDetail();
    // });
  }

  partShopDetail() {
    partShopAction
      .partShopDetail()
      .then(res => {
        var name = JSON.stringify(this.props.language.isArabic == true ? res.data.shop_detail.arabic_name : res.data.shop_detail.name);
        name = name.replace(/"/g, "");
        var logoImage = JSON.stringify(res.data.shop_detail.service_logo_image);
        logoImage = logoImage.replace(/"/g, "");
        logoImage = IMG_PREFIX_URL + logoImage;
        var bgImage = JSON.stringify(res.data.shop_detail.service_bg_image);
        bgImage = bgImage.replace(/"/g, "");
        bgImage = IMG_PREFIX_URL + bgImage;
        var shopId = JSON.stringify(res.data.shop_detail.id);
        shopId = shopId.replace(/"/g, "");
        // alert(shopId)
        this.setState({
          partShopName: name,
          partShopLogo: logoImage,
          partShopBgImage: bgImage,
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
      new firebase.links.DynamicLink('https://example.com/partshop/' + this.state.shopId, 'https://clubenz.page.link')
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

  //   shareWHATSAPP = (a) => {
  //     const shareOptions = {
  //      title: 'Share via',
  //      url: this.state.shopShareURL,
  //      social: Share.Social.WHATSAPP
  //    };
  //    Share.shareSingle(shareOptions);
  //  }

  shareWHATSAPP = () => {
    Linking.openURL(`whatsapp://send?text=${this.state.shopShareURL}`);
  }

  openShareDialog = () => {

    const shareLinkContent = {
      contentType: 'link',
      contentUrl: this.state.shopShareURL,
      contentDescription: 'Wow, check out this part shop!',
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
      <View style={{ flex: 1, backgroundColor: colors.black }}>
        <StatusBar
          hidden={false}
          backgroundColor={colors.navgationBar}
        />

        <ImageBackground
          style={stylePartsDetailScreen.backgroundImage}
          source={{ uri: this.state.partShopBgImage }}
        >
          <ImageBackground
            style={stylePartsDetailScreen.backgroundImage1}
            source={require('../resources/images/transparent-layer-1.png')}
          >
            <View style={stylePartsDetailScreen.topBar}>
              <TouchableWithoutFeedback onPress={this.goToBackScreen}>
                <Image
                  style={stylePartsDetailScreen.topBarImage}
                  resizeMode="contain"
                  source={require("../resources/images/ic-back.png")}
                />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={this.share}>
                <Image
                  style={stylePartsDetailScreen.topBarImage}
                  source={require("../resources/icons/ic-share.png")}
                />
              </TouchableWithoutFeedback>
            </View>
            <View style={stylePartsDetailScreen.shopLogoContainer}>
              <Image
                resizeMode="cover"
                style={stylePartsDetailScreen.shopLogo}
                source={{ uri: this.state.partShopLogo }}
              />
              <Text style={stylePartsDetailScreen.shopName}>
                {this.state.partShopName}
              </Text>
            </View>
          </ImageBackground>
        </ImageBackground>
        <View
          style={{
            flex: 600
          }}
        />

        <View style={stylePartsDetailScreen.tabNavigatorContainer}>
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
            <View style={stylePartsDetailScreen.modelStyle}>
              <View style={stylePartsDetailScreen.modalInnerView}>
                <View style={[styles.center, { backgroundColor: '#FFFFFF', borderRadius: metrics.radius15, }]}>

                  <Text style={{ height: 30, fontSize: 13, alignItems: "center", justifyContent: 'center', fontFamily: Fonts.CircularBold, color: '#5A5A5A', marginTop: 10, borderBottomColor: '#000000', width: metrics.deviceWidth - 10, textAlign: 'center' }}>{__('Share Via', this.props.language)}</Text>

                  <TouchableOpacity style={styles.center} onPress={() => this.openShareDialog()}>
                    <View style={stylePartsDetailScreen.btnStyle}>
                      <Text style={stylePartsDetailScreen.btnText} >{__('Facebook', this.props.language)}</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.center} onPress={this.shareWHATSAPP}>
                    <View style={stylePartsDetailScreen.btnStyle}>
                      <Text style={stylePartsDetailScreen.btnText} >{__('WhatsApp', this.props.language)}</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.center} onPress={() => this.sendSMS()}>
                    <View style={stylePartsDetailScreen.btnStyle}>
                      <Text style={stylePartsDetailScreen.btnText} >{__('SMS', this.props.language)}</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.center} onPress={this.copyLink}>
                    <View style={stylePartsDetailScreen.btnStyle}>
                      <Text style={stylePartsDetailScreen.btnText} >{__('Copy Link', this.props.language)}</Text>
                    </View>
                  </TouchableOpacity>

                </View>

              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.center} onPress={this.share}>
            <View style={[stylePartsDetailScreen.cancelBtnStyle, { backgroundColor: '#E6EFF9' }]}>
              <Text style={stylePartsDetailScreen.cancelBtnText}>{__('Cancel', this.props.language)}</Text>
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

export default connect(mapStateToProps, null)(PartShopDetailScreen);

const stylePartsDetailScreen = StyleSheet.create({
  backgroundImage: {
    flex: 400,
    width: metrics.deviceWidth,
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
  backgroundImage1: {
    width: metrics.deviceWidth,
    flex: 400

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
  shopLogoContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: metrics.smallMargin
  },
  shopName: {
    color: colors.white,
    fontSize: metrics.deviceWidth * 0.07,
    textAlign: "center",
    fontFamily: Fonts.CircularBold,
  },
  tabNavigatorContainer: {
    width: metrics.deviceWidth,
    flex: 600,
    height: metrics.deviceHeight / 1.6,
    position: "absolute",
    backgroundColor: colors.white,
    borderTopEndRadius: metrics.radius20,
    borderTopStartRadius: metrics.radius20,
    bottom: 0,
    left: 0,
    right: 0
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
