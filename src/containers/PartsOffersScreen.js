import React, { PureComponent } from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Text,
    TextInput,
    FlatList,
    Modal,
    Clipboard,
    Image
} from "react-native";

import { Madoka } from 'react-native-textinput-effects';
import { styles, fonts, colors, metrics } from "../themes";
const { width, height } = Dimensions.get('window');
import NavigationService from '../NavigationService';
import NavigationComponent from '../components/navigation/navigation';
import SplitHeading from "../components/common/splitHeading";

import { list } from '../resources/constants/ShopListConstant';
import OfferItem from '../components/offer/OfferItem';
import * as partShopAction from "../redux/actions/partsShop";

import __ from '../resources/copy';
import Share from 'react-native-share';
import { Fonts } from '../resources/constants/Fonts';
import Toast from "react-native-simple-toast";

import { connect } from "react-redux";

import { ShareDialog } from 'react-native-fbsdk';
import SendSMS from 'react-native-sms';

class PartsOffersScreen extends PureComponent {

    static navigationOptions = ({ navigation }) => ({
		title: __('Offers', '')
	});

    constructor(props) {
        super(props);
        this.partShopDetail()
    }
    state = {
        data: [{}],
        shareModalVisible: false,
        offer_title: '',
        link: '',
    }

    partShopDetail() {
        partShopAction
            .partShopDetail()
            .then(res => {
                this.setState({ data: res.data.offers })
            })
            .catch(err => {
                console.log("error" + JSON.stringify(err));
            });
    }

    showAlertDialog = (offer) => {
        this.setState({ shareModalVisible: !this.state.shareModalVisible, offer_title: offer ? offer.offer_text : '', link: offer.link });
    }

    shareWHATSAPP = (a) => {
        const shareOptions = {
         title: 'Share via',
         url: this.state.link,
         social: Share.Social.WHATSAPP
       };
       Share.shareSingle(shareOptions);
     }

     shareFACEBOOK = () => {
          const shareOptions = {
             // title: 'Share via',
             // url: 'https://google.com',
             // social: Share.Social.FACEBOOK

             title: "Share Via",
             message: "Facebook",
             url: "http://facebook.github.io/react-native/",
             subject: "Share Link" //  for email
           };

           const shareLinkContent = {
             contentType: 'link',
             contentUrl: this.state.link,
             contentTitle: this.state.link,
             // contentDescription: 'Facebook sharing is easy!'
             contentDescription: this.state.link,
             setQuote: this.state.link,
           };

           this.shareLinkWithShareDialog(shareLinkContent);
        }

        shareLinkWithShareDialog(shareLinkContent) {
            var tmp = this;
            ShareDialog.canShow(shareLinkContent).then(
              function(canShow) {
                if (canShow) {
                  return ShareDialog.show(shareLinkContent);
                }
              }
            ).then(
              function(result) {
                if (result.isCancelled) {
                  // alert('Share cancelled');
                } else {
                  // alert('Share success with postId: ' + result.postId);
                }
              },
              function(error) {
                // alert('Share fail with error: ' + error);
              }
            );
          }

          copyLink = () =>{
              Clipboard.setString(this.state.link + '');
              this.setState({shareModalVisible:!this.state.shareModalVisible})
              setTimeout(() => {
                Toast.show('Coppied Content Successfully', Toast.LONG);
            }, 100)
            }

            sendSMS = () => {
                SendSMS.send({
                  body: this.state.link,
                  recipients: [''],
                  successTypes: ['sent', 'queued'],
                  allowAndroidSendWithoutReadPermission: false
              }, (completed, cancelled, error) => {
                  this.setState({shareModalVisible: false})
                  console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);

              });
              }

    render() {
        return (
            <View style={[stylePartsOffersScreen.container, {
                alignItems: "center",
                paddingTop: 8
            }]}>
            {
                this.state.data != null ? (this.state.data.length > 0 ?
                <FlatList
                    data={this.state.data}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item, index }) => <OfferItem offer={item} index={index} language={this.props.language} showAlertDialog={(item) => this.showAlertDialog(item)} />}
                    // ListEmptyComponent={this.ListEmptyView}
                //ListFooterComponent={this._renderFooter}
                /> : this.ListEmptyView() ) : this.ListEmptyView()
            }
                <Modal
                    transparent={true}
                    visible={this.state.shareModalVisible}
                    animationType="slide"
                    onRequestClose={() => {
                        this.setState({shareModalVisible: !this.state.shareModalVisible});
                    }}
                    style={{ alignItems: 'flex-end' }}
                >

                    <View style={{ flex: 1, backgroundColor: '#08080847' }} >
                        <View style={{ flex: 0.3, }}></View>
                        <View style={stylePartsOffersScreen.modelStyle}>
                            <View style={stylePartsOffersScreen.modalInnerView}>
                                <View style={[styles.center, { backgroundColor: '#FFFFFF', borderRadius: metrics.radius15, }]}>
                                    <Text style={{ height: 30, fontSize: 13, alignItems: "center", justifyContent: 'center', fontFamily: Fonts.CircularBold, color: '#5A5A5A', marginTop: 10, borderBottomColor: '#000000', width: metrics.deviceWidth - 10, textAlign: 'center' }}>{__('Share Via', this.props.language)}</Text>

                                    <TouchableOpacity style={styles.center} onPress={this.shareFACEBOOK}>
                                        <View style={stylePartsOffersScreen.btnStyle}>
                                            <Text style={stylePartsOffersScreen.btnText} >{__('Facebook', this.props.language)}</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.center} onPress={this.shareWHATSAPP}>
                                        <View style={stylePartsOffersScreen.btnStyle}>
                                            <Text style={stylePartsOffersScreen.btnText} >{__('WhatsApp', this.props.language)}</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.center} onPress={() => this.sendSMS()}>
                                        <View style={stylePartsOffersScreen.btnStyle}>
                                            <Text style={stylePartsOffersScreen.btnText} >{__('SMS', this.props.language)}</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.center} onPress={this.copyLink}>
                                        <View style={stylePartsOffersScreen.btnStyle}>
                                            <Text style={stylePartsOffersScreen.btnText} >{__('Copy Link', this.props.language)}</Text>
                                        </View>
                                    </TouchableOpacity>

                                </View>

                            </View>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.center} onPress={() => this.setState({shareModalVisible: !this.state.shareModalVisible})}>
                        <View style={[stylePartsOffersScreen.cancelBtnStyle, { backgroundColor: '#E6EFF9' }]}>
                            <Text style={stylePartsOffersScreen.cancelBtnText}>{__('Cancel', this.props.language)}</Text>
                        </View>
                    </TouchableOpacity>

                </Modal>

            </View>
        );
    }
    ListEmptyView = () => {
        return (
            <View style={[styles.center, {flex: 1,}]}>

                {/* <Text style={{ textAlign: 'center' }}> Sorry, No Data Present</Text> */}

                        <View style={{flex: 0.2}}></View>
                        <View style={[styles.center, {flex: 0.6}]}>
                            <Image source={require('../resources/images/discount.png')} style={{height: 60, width: 55, justifyContent: 'center'}}/>
                            <Text style={{fontSize: 25, fontFamily: Fonts.CircularBook, color: colors.blueButton}}>{__('No offers here yet', this.props.language)}</Text>
                            <Text style={{fontSize: 14, fontFamily: Fonts.CircularBook, color: colors.grey93}}>{__('Looks like this shop doesn’t have any offers yet', this.props.language)}</Text>
                        </View>
                        <View style={{flex: 0.2}}></View>


            </View>

        );
    }

}

mapStateToProps = state => {
    return {
        language: state.language,
    };
};

export default connect(mapStateToProps, null)(PartsOffersScreen);

const stylePartsOffersScreen = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    btnText: {
		fontSize: 18,
    color: '#11455F',
    fontFamily: Fonts.CircularBold,
	},
	modalInnerView:{
		// borderTopEndRadius: metrics.radius15,
    // borderTopStartRadius: metrics.radius15,
    borderRadius: metrics.radius15,
	},
	modelStyle:{
		flex:0.7,
    justifyContent:'flex-end',
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
    alignItems:"center",
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
    alignItems:"center",
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#0E2D3C',
    fontSize: 18,
    fontFamily: Fonts.CircularBold,
    textAlign: 'center',
  },
});
