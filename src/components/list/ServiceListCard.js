import React from "react";
import {
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { IMG_PREFIX_URL } from "../../config/constant";
import { Fonts } from "../../resources/constants/Fonts";
import { fonts, colors } from "../../themes";
const { width, height } = Dimensions.get("window");
import ListingAd from '../../components/common/listingAd';

import __ from '../../resources/copy';

renderAds = (preferences) => {

  // debugger

  // for (i = 0; i < preferences.home_ads.length; i++) {
  //   if (preferences.home_ads[i].type === "Listing Page") {
  //     return <ListingAd home_ads={preferences.home_ads[i]} marginTop={12} marginHorizontal={20} />;
  //   }
  // }

  if (preferences.banner[1] != null && preferences.banner[1].status === 'active' && preferences.banner[1].type == 'Provider Listing') {
    // debugger
    return <ListingAd home_ads={preferences.banner[1]} marginTop={12} marginHorizontal={20} />;
  } else {
    return null;
  }

}

const ServiceListCard = ({ item, index, onPress, language, preferences }) => {
  // debugger
  const item_image = IMG_PREFIX_URL + item.logo;

  return (
    <View style={styles.container1}>
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.container]}>
          <View style={styles.leftContainer}>
            <View style={styles.backView}>
              <Image
                style={styles.backImage}
                //   source={require("../../resources/images/ic_menu_userplaceholder.png")}
                source={
                  item_image
                    ? { uri: item_image }
                    : require("../../resources/images/ic_menu_userplaceholder.png")
                }
              />
            </View>
          </View>
          <View style={styles.midContainer}>
            <View style={styles.textWrapper}>
              <Text style={styles.name}>{language.isArabic == true ? item.arabic_name : item.name}</Text>
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.dis}>{item.dis} {item.distance + " "}{__('km', '')}</Text>
              <Text numberOfLines={1} style={styles.data}>{item.city}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        {/* <View style={styles.addContainer}> */}
        {/* <Text>ad here</Text> */}

        {/* {this.renderAds(preferences)} */}

        {
          (index + 1) % 5 === 0 && (index + 1) != 0 ?
            preferences.banner[1] != null && preferences.banner[1].status === 'active' && preferences.banner[1].type === 'Provider Listing' ? <ListingAd home_ads={preferences.services[index % preferences.services.length]} marginTop={12} marginHorizontal={20} /> : null : null
        }

        {/* </View> */}
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container1: {},
  container: {
    marginHorizontal: width * 0.02,
    marginTop: height * 0.02,
    borderRadius: width * 0.02,
    backgroundColor: "#fff",
    flexDirection: "row",
    height: height * 0.12
  },
  textWrapper: {
    flexDirection: "row",
    paddingHorizontal: width * 0.02
  },
  leftContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    height: width * 0.15,
    width: width * 0.15,
    resizeMode: "contain"
  },
  midContainer: {
    flex: 3,
    justifyContent: "center"
  },
  backView: {
    position: "absolute"
  },
  backImage: {
    height: width * 0.17,
    width: width * 0.17,
    resizeMode: "contain"
  },
  backImageVerified: {
    height: width * 0.17,
    width: width * 0.17,
    // width: 54,
    // height: 18,
    resizeMode: "contain",
    // marginLeft:-8
    marginLeft: -10,
  },
  name: {
    color: colors.blueButton,
    // fontSize: width * 0.05,
    fontSize: 16,
    paddingBottom: height * 0.01,
    fontFamily: Fonts.circular_medium,
  },
  dis: {
    // color: "#b6b6b7",
    color: '#9C9C9D',
    fontFamily: Fonts.CircularMedium,
  },
  data: {
    // color: "#b6b6b7",
    color: '#9C9C9D',
    // paddingLeft: width * 0.07,
    paddingLeft: 12,
    fontFamily: Fonts.CircularMedium,
    maxWidth: 140,
  },
  addContainer: {
    // marginHorizontal: width * 0.02,
    marginTop: height * 0.02,
    borderRadius: width * 0.02,
    // height: height * 0.12
    // backgroundColor: 'red',
    height: 100,
  },
});
export default ServiceListCard;
