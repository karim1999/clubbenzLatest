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
} from "react-native";
import NetInfo from "@react-native-community/netinfo";

import TabNavigator from "../PartsTabNavigator";

import { colors,styles, metrics } from "../themes";
import NavigationService from "../NavigationService";
import SplitHeading from '../components/common/splitHeading';
import * as partAction from "./../redux/actions/parts";
import { IMG_PREFIX_URL } from "../config/constant";
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import Share from 'react-native-share';
import Toast from "react-native-simple-toast";

class PartsDetailScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.partDetail();
  }
  state = {
    partName: "",
    partLogo: "",
    shareModalVisible:false
  };

  partDetail() {
    partAction
      .partDetail()
      .then(res => {
        var title = JSON.stringify(res.shop_detail.title);
        title = title.replace(/"/g, "");
        var image = JSON.stringify(res.shop_detail.image);
        image = image.replace(/"/g, "");
        image = IMG_PREFIX_URL + image;
        this.setState({
          partName: title,
          partLogo: image
        });
      })
      .catch(err => {
        console.log("error" + JSON.stringify(err));
      });
  }

  componentDidMount() {
    NetInfo.fetch().then(isConnected => {
			if (!isConnected) {
				Toast.show('Not connected to internet', Toast.BOTTOM)
			}
		})
  }

  goToBackScreen = () => {
    NavigationService.goBack();
  };

  share = () => {
    this.setState({shareModalVisible:!this.state.shareModalVisible});
  };
  shareWHATSAPP = (a) => {
    const shareOptions = {
     title: 'Share via',
     url: 'some share url',
     social: Share.Social.WHATSAPP
   };
   Share.shareSingle(shareOptions);
 }
 shareFACEBOOK = () => {
   const shareOptions = {
      title: 'Share via',
      url: 'https://google.com',
      social: Share.Social.FACEBOOK
    };
    Share.shareSingle(shareOptions);
  }
  copyLink = () =>{
   Clipboard.setString(this.state.partName)
   this.share();
   setTimeout(() => {
    Toast.show('Coppied Content Successfully', Toast.LONG, Toast.BOTTOM);  
  }, 100)
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          hidden={false}
          backgroundColor={colors.navgationBar}
        />
        <ImageBackground
          style={stylePartsDetailScreen.backgroundImage}
          source={require("../resources/images/bg_top.png")}
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
              source={{ uri: this.state.partLogo }}
            />
            <Text style={stylePartsDetailScreen.shopName}>
              {this.state.partName}
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
					style={{alignItems:'flex-end'}}
				>
        <View style={{flex:1,backgroundColor:'#08080847'}} >
					<View style={{flex:0.3}}></View>
					<View style={stylePartsDetailScreen.modelStyle}>
						<View style={stylePartsDetailScreen.modalInnerView}>
							<View style={styles.center}>
							<SplitHeading
								text={'Share Via'}
								headingStyle={{ padding: 10, marginTop: 5 }}
								lineColor={{ backgroundColor: colors.blueButton }}
								textColor={{ color: colors.blueButton }}
							/>
							<TouchableOpacity style={styles.center} onPress={this.shareFACEBOOK }>
							<View style={stylePartsDetailScreen.btnStyle}>
								<Text style={stylePartsDetailScreen.btnText} >{"Facebook"}</Text>
							</View>
							</TouchableOpacity>
							<TouchableOpacity style={styles.center} onPress={this.shareWHATSAPP }>
							<View style={stylePartsDetailScreen.btnStyle}>
								<Text style={stylePartsDetailScreen.btnText} >{"WhatsApp"}</Text>
							</View>
							</TouchableOpacity>
							<TouchableOpacity style={styles.center} onPress={this.copyLink }>
							<View style={stylePartsDetailScreen.btnStyle}>
								<Text style={stylePartsDetailScreen.btnText} >{"Copy Link"}</Text>
							</View>
							</TouchableOpacity>

							</View>
							<TouchableOpacity style={styles.center} onPress={this.share}>
								<View style={stylePartsDetailScreen.btnStyle}>
									<Text style={stylePartsDetailScreen.btnText}>Cancel</Text>
								</View>
							</TouchableOpacity>
						</View>
					</View>
          </View>
				</Modal>
      </View>
    );
  }
}

export default PartsDetailScreen;

const stylePartsDetailScreen = StyleSheet.create({
  backgroundImage: {
    // flex: 330,
    flex: 400,
    width: metrics.deviceWidth,
    // paddingTop: metrics.tetraBasePadding,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  topBar: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    // paddingHorizontal: metrics.deviceWidth * 0.01
  },
  topBarImage: {
    width: 32,
    height: 32
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
    textAlign: "center"
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

  backgroundImage1: {
    width: metrics.deviceWidth,
    flex: 400
    
  },
  btnText: {
		fontSize: 18,
		color: '#11455F',
	},
	modalInnerView:{
		backgroundColor:'#FFF',
		borderTopEndRadius: metrics.radius15,
		borderTopStartRadius: metrics.radius15,
	},
	modelStyle:{
		flex:0.7,	
		justifyContent:'flex-end'
  },
  btnStyle: {
		width: metrics.deviceWidth - 40,
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: '#11455F',
		borderWidth: 1,
		borderStyle: 'solid',
		borderRadius: metrics.radius40,
		marginBottom: 4,
	},
});
