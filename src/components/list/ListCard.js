import React from "react";
import {
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import ListingAd from '../../components/common/listingAd';
import { IMG_PREFIX_URL } from "../../config/constant";
import { Fonts } from "../../resources/constants/Fonts";
import { colors } from "../../themes";
const { width, height } = Dimensions.get("window");

import __ from '../../resources/copy';

_selectImage = pic => {
  switch (pic) {
    case 1:
      return (
        <Image
          style={styles.image}
          source={require("../../resources/icons/ic_tires.png")}
        />
      );

    case 2:
      return (
        <Image
          style={styles.image}
          source={require("../../resources/icons/ic_petrol.png")}
        />
      );

    case 3:
      return (
        <Image
          style={styles.image}
          source={require("../../resources/icons/ic_carwash.png")}
        />
      );

    case 4:
      return (
        <Image
          style={styles.image}
          source={require("../../resources/images/ic_menu_userplaceholder-3.png")}
        />
      );

    case 5:
      return (
        <Image
          style={styles.image}
          source={require("../../resources/images/ic_menu_userplaceholder.png")}
        />
      );

    default:
      return (
        <Image
          style={styles.image}
          source={require("../../resources/icons/ic_workshops.png")}
        />
      );
  }
};
renderAds = (preferences) => {

  // for (i = 0; i < preferences.home_ads.length; i++) {
  //   if(preferences.home_ads[i].type === "Listing Page"){
  //   return    <ListingAd home_ads={preferences.home_ads[i]} marginTop={12} marginHorizontal={20} />;
  //   }
  // }


  if (preferences.banner[1] != null && preferences.banner[1].status === 'active' && preferences.banner[1].type == 'Provider Listing') {
    debugger
    return <ListingAd home_ads={preferences.banner[1]} marginTop={12} marginHorizontal={20} />;
  } else {
    return null;
  }


}
const ListCard = ({ item, index, onPress, preferences, language }) => {

  const item_image = IMG_PREFIX_URL + item.logo;
    return (
      <View style={styles.container1}>
        <TouchableOpacity onPress={onPress}>
          <View style={[styles.container]}>
            <View style={styles.leftContainer}>
              <View style={styles.backView}>
                <Image
                  style={styles.backImage}
                  source={
                    item_image
                      ? { uri: item_image }
                      : require("../../resources/images/ic_menu_userplaceholder.png")
                  }
                />
              </View>
              {/* {this._selectImage(item.pic)} */}
            </View>
            <View style={styles.midContainer}>
              <View style={styles.textWrapper}>

                <Text style={styles.name}>{language.isArabic == true ? item.arabic_name : item.name}</Text>
                {/* <Text style={styles.name}>{language.isArabic == true } {item.arabic_name} : {item.name}</Text> */}
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.dis}>{item.dis} {item.distance + " "}{__('km', '')}</Text>
                <Text numberOfLines={1} style={styles.data}>{item.city}</Text>
              </View>

            </View>
            <View style={styles.rightContainer}>
              {item.verified ? (
                <View style={[{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', alignContent: 'center', flexDirection: 'column', marginRight: -5 }]}>

                  <Image
                    style={{ width: 74, height: 24, justifyContent: 'center', alignItems: 'center', top: 12, zIndex: 1, resizeMode: 'cover' }}
                    source={{ uri: IMG_PREFIX_URL + item.photo_selection_arround_rating }}
                  />

                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: "#2eac6d",
                      justifyContent: "center",
                      alignItems: "center",
                      alignSelf: 'center',

                      borderRadius: width * 0.045,
                      width: 41,
                      height: 41,
                      backgroundColor: 'white',

                    }}
                  >
                    <Text style={{ color: "#2eac6d", /*fontSize: width * 0.06*/ fontSize: 20, fontFamily: Fonts.CircularBook }}>
                      {item.avg_rating}
                    </Text>
                  </View>
                </View>
              ) : (
                  undefined
                )}
            </View>
          </View>
        </TouchableOpacity>
        {/* <View style={styles.addContainer}> */}

        {/* {this.renderAds(preferences)} */}


        {
          (index + 1) % 5 === 0  && (index + 1) != 0 ? !item.isWorkshop ?
              preferences.partshops[1] != null ? <ListingAd home_ads={preferences.partshops[index % preferences.partshops.length]} marginTop={12} marginHorizontal={20} /> : null
              :
          preferences.workshop[1] != null ? <ListingAd home_ads={preferences.workshop[index % preferences.workshop.length]} marginTop={12} marginHorizontal={20} /> : null :null

        }

        {/* </View> */}
      </View>
    );
};
const styles = StyleSheet.create({
  container1: {},
  addContainer: {

    marginTop: height * 0.02,
    borderRadius: width * 0.02,

    height: 110,
  },
  container: {
    marginHorizontal: width * 0.02,
    marginTop: height * 0.02,
    borderRadius: width * 0.02,
    backgroundColor: "#fff",
    flexDirection: "row",
    height: height * 0.12,
    justifyContent: 'center',
    alignItems: 'center'
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
    resizeMode: "contain",
    marginLeft: -8
  },
  name: {

    color: colors.blueButton,

    fontSize: 16,
    paddingBottom: height * 0.01,
    fontFamily: Fonts.CircularMedium,
  },
  dis: {

    color: '#9C9C9D',
    fontFamily: Fonts.CircularMedium,
  },
  data: {

    color: '#9C9C9D',
    paddingLeft: 12,

    fontFamily: Fonts.CircularMedium,
    maxWidth: 140,
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
export default ListCard;
