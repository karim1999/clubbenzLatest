import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
  ImageBackground,
  ScrollView, Alert,
  FlatList,
  Modal,
  PermissionsAndroid,
  Platform
} from "react-native";


import { styles, fonts, colors, metrics } from "../themes";
const { width, height } = Dimensions.get("window");
import SplitHeading from "../components/common/splitHeading";
import NavigationService from "../NavigationService";
import * as partShopAction from "../redux/actions/partsShop";
import { IMG_PREFIX_URL } from "../config/constant";
import { connect } from 'react-redux';
import CustomNewAd from '../components/common/customNewAd';
import RNImmediatePhoneCall from 'react-native-immediate-phone-call';
import OpenMap from "react-native-open-map";
import { Fonts } from '../resources/constants/Fonts';
import __ from '../resources/copy';
var part_type_arr = [];
var isMulti = false;
class PartShopInfoScreen extends PureComponent {

  static navigationOptions = ({ navigation }) => ({
    title: __('Info', '')
  });

  constructor(props) {
    super(props);

    this.partShopDetail();
  }
  state = {
    partShopAddress: "",
    openingHour: "",
    closingHour: "",
    off_day: '',
    workshopDetail: {},
    shareModalVisible: false,
    phoneArray: [],
    part_type: '',
    part_type_arr: part_type_arr,
  };

  partShopDetail() {
    const self = this;
    partShopAction
      .partShopDetail()
      .then(res => {
        if (res) {
          // debugger
          var address = JSON.stringify(res.data.shop_detail.address);
          address = address.replace(/"/g, "");
          var openhour = JSON.stringify(res.data.shop_detail.opening_hours);
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

          var closinghour = JSON.stringify(res.data.shop_detail.closing_hours);
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

          // var closinghour = JSON.stringify(res.data.shop_detail.closing_hours);
          // closinghour = closinghour.replace(/"/g, "");
          // var closeHourArr= closinghour.split(":");
          // if (parseInt(closeHourArr[0]) < 12){
          //   closinghour=closeHourArr[0]+ ":" + closeHourArr[1] + "AM";
          // }
          // else {
          //   closinghour=((parseInt(closeHourArr[0]))-12).toString() + ":" + closeHourArr[1] +"PM";
          // }

          var off_day = res.data.shop_detail.off_day;
          let phone = JSON.stringify(res.data.shop_detail.phone)
          phone = phone.replace(/"/g, "");

          var part_type = res.data.shop_detail.part_type;

          var part_lower_case = part_type.toLowerCase();

          if (part_lower_case.includes('new') && part_lower_case.includes('used')) {

            // alert('It has new and used both parts')

            isMulti = true;

            var arr = [];

            arr.push('New Parts')
            arr.push('Used Parts')

            part_type_arr = arr;
          }
          else {
            isMulti = false;
          }

          var phoneArray = phone.split(",");
          const serviceTags = res.data.shop_detail.service_tag.map(tag => this.props.language.isArabic == true ? tag.arabic_name : tag.name)
          // debugger
          const brands = res.data.shop_detail.brand.map(brand => brand.image)
          var to = __('to', this.props.language);
          to = "";
          var daysOff = off_day.split(",");
          var arabic_english = '';
          if (off_day.length > 0 && off_day != '') {
            for (var i = 0; i < daysOff.length; i++) {
              var val = __(daysOff[i], this.props.language);
              if (i == daysOff.length - 1)
                arabic_english += val;
              else
                arabic_english += val + ',';
            }
          }
          self.setState({
            partShopAddress: address,
            openingHour: openhour,
            closingHour: to + " " + closinghour,
            off_day: arabic_english,
            phone,
            phoneArray,
            serviceTags,
            brands,
            workshopDetail: res.data.shop_detail,
            part_type: part_type,
            part_type_arr: part_type_arr,
          });

        }
      })
      .catch(err => {
        console.log("error" + JSON.stringify(err));
      });
  }

  showContact = async () => {
    // Alert.alert('Contact Info', this.state.phone);
    if (Platform.OS === 'android') {
      // debugger
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
        this.setState({ shareModalVisible: !this.state.shareModalVisible });
      }
    } else if (Platform.OS === 'ios') {
      this.setState({ shareModalVisible: !this.state.shareModalVisible });
    }


  };

  renderItem = ({ item, index }) => {
    const img = IMG_PREFIX_URL + item

    return <Image style={stylePartsInfoScreen.brandImage} source={{ uri: img }} />;
  };

  getTagView = (tag1, tag2) => {
    return (
      <View style={stylePartsInfoScreen.partServicesContainer}>
        <View style={[styles.row, { width: width / 2, }]}>
          <Image
            resizeMode="contain"
            style={stylePartsInfoScreen.tickImage}
            source={require("../resources/icons/tick.png")} />
          <Text numberOfLines={1} style={[stylePartsInfoScreen.serviceTitle, { width: metrics.deviceWidth / 2.8 }]}>{tag1}</Text>
        </View>
        {tag2 &&
          <View style={[styles.row, { width: width / 2, justifyContent: "flex-start", }]}>
            <Image
              resizeMode="contain"
              style={stylePartsInfoScreen.tickImage}
              source={require("../resources/icons/tick.png")} />
            <Text numberOfLines={1} style={[stylePartsInfoScreen.serviceTitle, { width: metrics.deviceWidth / 2.8, marginRight: 10 }]}>{tag2}</Text>
          </View>
        }
      </View>
    )
  }

  getPartShopServiceTagsView = () => {
    let tags = this.state.serviceTags
    if (!tags) return null
    let index = 0
    const length = tags.length
    let views = []
    if (length > 0) {
      if (length == 1) {
        views.push(this.getTagView(tags[0]))
      } else {
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

  getPartShopUsedUnusedTagViews = () => {

  }

  // renderAds = () => {

  //   for (i = 0; i < this.props.preferences.home_ads.length; i++) {
  //     if (this.props.preferences.home_ads[i].type === "Detail page") {
  //       return <CustomNewAd home_ads={this.props.preferences.home_ads[i]} margin={10} />;
  //     }
  //   }

  // }

  renderAds = () => {
    // debugger
		if (this.props.preferences.banner[2] != null && this.props.preferences.banner[2].status === 'active' && this.props.preferences.banner[2].type === 'Company Profile') {
			return <CustomNewAd home_ads={this.props.preferences.banner[2]} margin={10} />;
		} else {
      return null;
    }
  }

  onMapIconPress = () => {

    OpenMap.show({
      latitude: this.state.workshopDetail.location_latitude,
      longitude: this.state.workshopDetail.location_longitude,
      title: this.state.workshopDetail.name,
      cancelText: 'Close',
      actionSheetTitle: 'Chose app',
      actionSheetMessage: 'Available applications '
    });
  }
  render() {
    return (
      <View style={[stylePartsInfoScreen.container]}>
        <ScrollView>
          <View style={stylePartsInfoScreen.innerContainer}>
            <View>
              <Text style={stylePartsInfoScreen.shopAddress}>
                {this.state.partShopAddress}
              </Text>
              <View style={[styles.row]}>
                <Text
                  style={[
                    stylePartsInfoScreen.shopTimings,
                    {
                      color: colors.blueText,
                      fontFamily: Fonts.circular_black,
                    }
                  ]}
                >
                  {__('Open From', this.props.language)}
                </Text>
                <Text
                  style={[
                    stylePartsInfoScreen.shopTimings,
                    {
                      color: colors.grey93,
                      fontFamily: Fonts.CircularBold,
                    }
                  ]}
                >
                  {" "}
                  {this.state.openingHour}
                  {" "}
                </Text>
                <Text>
                <Text style={[
                    stylePartsInfoScreen.shopTimings,
                    {
                      color: colors.blueText,
                      fontFamily: Fonts.circular_black,
                    }
                  ]}>{__('to', this.props.language)}</Text>
                  {this.state.closingHour}
                </Text>
              </View>
              {this.state.off_day ? <View style={[styles.row]}>
                <Text
                  style={[
                    stylePartsInfoScreen.shopTimings,
                    {
                      color: colors.blueText,
                      fontFamily: Fonts.circular_black,
                    }
                  ]}
                >
                  {__('Days off', this.props.language)}
                </Text>
                <Text
                  style={[
                    stylePartsInfoScreen.shopTimings,
                    {
                      color: colors.grey93,
                      fontFamily: Fonts.CircularBold,
                    }
                  ]}
                >
                  {" "}
                  {this.state.off_day}
                </Text>
              </View> : null}
            </View>
            <TouchableOpacity style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
              onPress={() => this.onMapIconPress()}>


              <View
                style={{
                  height: width * 0.2,
                  width: width * 0.2,
                  borderRadius: width * 0.2,
                }}
              >
                {/*<Image*/}
                {/*  source={require('../resources/icons/mask_group.png')}*/}
                {/*  style={{ flex: 1, height: null, width: null }}*/}
                {/*/>*/}
              </View>
              <View style={{ position: 'absolute', height: width * 0.1, width: width * 0.1 }}>
                <Image
                  style={{ flex: 1, height: null, width: null, resizeMode: 'contain' }}
                  source={require('../resources/icons/ic_pin_selected.png')}
                />
              </View>

            </TouchableOpacity>
          </View>

          <SplitHeading
            text={__('Offered parts condition', this.props.language)}
            headingStyle={{ padding: 5, marginVertical: 5 }}
            lineColor={{ backgroundColor: 'rgba(6,0,41, 0.2)' }}
            textColor={{ color: colors.grey93, fontFamily: Fonts.circular_medium }}
          />

          <FlatList style={{ marginHorizontal: 5, marginTop: 5 }}
            horizontal={true}
            data={this.state.brands}
            renderItem={this.renderItem}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />

          <View style={stylePartsInfoScreen.partServicesContainer}>
            <View
              style={[
                styles.row,
                { flex: 1, alignItems: "center", justifyContent: "flex-start" }
              ]}
            >
              {
                !isMulti ?
                  <View style={styles.row}>
                    <Image
                      resizeMode="contain"
                      style={stylePartsInfoScreen.tickImage}
                      source={require("../resources/icons/tick.png")}
                    />
                    <Text style={stylePartsInfoScreen.serviceTitle}>{this.state.part_type != '' ? this.state.part_type + ' parts' : this.state.part_type}</Text>
                  </View>
                  :
                  <View style={styles.row}>
                    <View style={[styles.row, { width: width / 2 }]}>
                      <Image
                        resizeMode="contain"
                        style={stylePartsInfoScreen.tickImage}
                        source={require("../resources/icons/tick.png")}
                      />
                      <Text style={stylePartsInfoScreen.serviceTitle}>{this.state.part_type_arr[0]}</Text>

                    </View>

                    <View style={[styles.row, { width: width / 2 }]}>
                      <Image
                        resizeMode="contain"
                        style={stylePartsInfoScreen.tickImage}
                        source={require("../resources/icons/tick.png")}
                      />
                      <Text style={stylePartsInfoScreen.serviceTitle}>{this.state.part_type_arr[1]}</Text>

                    </View>
                  </View>

              }

            </View>

          </View>

          <SplitHeading
            text={__('parts group', this.props.language)}
            headingStyle={{ padding: 5, marginVertical: 5 }}
            lineColor={{ backgroundColor: 'rgba(6,0,41, 0.2)' }}
            textColor={{ color: colors.grey93, fontFamily: Fonts.circular_medium }}
          />

          {this.getPartShopServiceTagsView()}

            <View style={{ padding: 10 }}>
            {this.renderAds()}
            </View>


          <TouchableOpacity style={styles.center} onPress={this.showContact}>
            <View style={stylePartsInfoScreen.contactBtnStyle}>
              <Text style={stylePartsInfoScreen.btnText}>{__('Contact now', this.props.language)}</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
        <Modal
          transparent={true}
          visible={this.state.shareModalVisible}
          animationType="slide"
          onRequestClose={() => {
            this.showContact();
          }}
          style={{ alignItems: 'flex-end' }}
        >
          <View style={{ flex: 1, backgroundColor: '#08080847' }} >
            <View style={{ flex: 0.3 }}></View>
            <View style={stylePartsInfoScreen.modelStyle}>
              <View style={[stylePartsInfoScreen.modalInnerView, { backgroundColor: '#FFFFFF' }]}>
                <View style={styles.center}>
                  <Text style={{ height: 30, fontSize: 13, alignItems: "center", justifyContent: 'center', fontFamily: Fonts.CircularBold, color: '#5A5A5A', marginTop: 10, width: metrics.deviceWidth - 10, textAlign: 'center' }}>{__('Contact Us', this.props.language)}</Text>

                  <FlatList
                    // data={['03366024409' ,'03366024409' , '03366024409' ]}
                    data={this.state.phoneArray}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({ item, index }) =>

                      <TouchableOpacity style={styles.center} onPress={() => RNImmediatePhoneCall.immediatePhoneCall(item)}>

                        <View style={stylePartsInfoScreen.btnStyle}>
                          <Text style={stylePartsInfoScreen.btnText} >{item}</Text>
                        </View>
                      </TouchableOpacity>}
                  // ListFooterComponent={this._renderFooter}
                  />

                </View>
              </View>
              <TouchableOpacity style={styles.center} onPress={this.showContact}>
                <View style={[stylePartsInfoScreen.cancelBtnStyle, { backgroundColor: '#E6EFF9' }]}>
                  <Text style={stylePartsInfoScreen.cancelBtnText}>{__('Cancel', this.props.language)}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
export default connect(mapStateToProps, null)(PartShopInfoScreen)

const stylePartsInfoScreen = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignContent: "center"
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
    fontFamily: Fonts.circular_medium,
  },
  partTitle: {
    fontSize: 14,
    color: "#11455F",
    lineHeight: 22
  },
  partPrice: {
    lineHeight: 22,
    fontSize: 14
  },
  partHeading: {
    lineHeight: 22,
    fontSize: 14
  },
  partDescription: {
    fontSize: 14,
    color: "#11455F",
    lineHeight: 22,
    width: 250
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
  partServicesContainer: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginTop: 18
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
    textAlign: 'left'
  },
  ad: {
    width: metrics.deviceWidth - 8,
    height: 110,
    marginVertical: metrics.basePadding
  },
  btnStyle: {
    width: metrics.deviceWidth - 10,
    height: 60,
    borderTopWidth: 0.5,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderStyle: 'solid',
    alignItems: "center",
    justifyContent: 'center',
    // borderColor: '#3F3F3F',
  },
  btnText: {
    fontSize: 18,
    color: "#11455F",
    fontFamily: Fonts.CircularMedium,
  },
  modalInnerView: {
    borderRadius: metrics.radius15,
  },
  serviceItemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  brandImage: {
    // height: width * 0.17,

    height: 34,
    width: 122,

    // width: width * 0.17,
    // marginHorizontal: 5,

    resizeMode: "contain"
  },
  modelStyle: {
    flex: 0.7,
    justifyContent: 'flex-end',
    marginRight: metrics.deviceWidth - (metrics.deviceWidth - 5),
    marginLeft: metrics.deviceWidth - (metrics.deviceWidth - 5),
    borderRadius: metrics.radius15,
    marginBottom: 20,
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
