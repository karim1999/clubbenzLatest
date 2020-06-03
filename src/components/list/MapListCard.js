import React from "react";
import {
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { colors } from "../../themes";
import { IMG_PREFIX_URL } from "../../config/constant";
import { Fonts } from "../../resources/constants/Fonts";
const { width, height } = Dimensions.get("window");

import __ from '../../resources/copy';

_dateFormate = (date) => {
  const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let current_datetime = new Date(date)
let formatted_date = current_datetime.getDate() + " " + months[current_datetime.getMonth()] + " " + current_datetime.getFullYear()
 return formatted_date;
}
const MapListCard = ({ item, index, onPress, language }) => {
console.log(item);
  // debugger;
  const item_image = IMG_PREFIX_URL + item.logo;
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.container, {justifyContent: 'center', alignItems: 'center', alignSelf: 'center'}]}>
          <View style={styles.leftContainer}>
            <View style={styles.backView}>
              <Image
                style={styles.backImage}
                // source={require("../../resources/images/ic_menu_userplaceholder.png")}
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
              <Text numberOfLines={1} style={styles.name}>{language.isArabic == true ? item.arabic_name : item.name}</Text>
            </View>
            <View style={styles.textWrapper}>
              {item.detail ? null:  <Text style={styles.dis}>{item.dis} {item.distance+" "}{__('km', '')}</Text> }
                <Text numberOfLines = {1} style={styles.data}>{item.city}</Text>
            </View>
          </View>
          <View style={styles.rightContainer}>
          {item.verified ? (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    position: "absolute",
                    top: -10,
                    zIndex: 1,
                    marginRight:-10,
                  }}
                >
                <Image
                    style={styles.backImageVerified}
                    source={{ uri: IMG_PREFIX_URL + item.photo_selection_arround_rating }}
                  />
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#2eac6d",
                    justifyContent: "center",
                    alignItems: "center",
                    height: height * 0.067,
                    marginRight: width * 0.02,
                    width: width * 0.12,
                    borderRadius: width * 0.045,
                    marginTop: height * 0.025
                  }}
                >
                  <Text style={{ color: "#2eac6d", fontSize: width * 0.04, fontFamily: Fonts.CircularMedium }}>
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
    );

};
const styles = StyleSheet.create({
  container1: {},
  container: {
    // marginHorizontal: width * 0.02,
    marginHorizontal: 10,
    marginTop: height * 0.02,
    borderRadius: width * 0.02,
    backgroundColor: "#fff",
    flexDirection: "row",
    width:width-50,
    paddingVertical: 10,
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
    flex: 2,
    justifyContent: "center"
  },
  backView: {
   // position: "absolute"
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
    marginLeft:-8
  },
  name: {
    color: "#000",
    fontSize: width * 0.05,
    paddingBottom: height * 0.01,
    fontFamily: Fonts.CircularMedium,
  },
  dis: {
    color: "#b6b6b7",
    fontFamily: Fonts.CircularMedium,
  },
  data: {
    color: "#b6b6b7",
    paddingLeft: width * 0.04,
    //width: 1,
    fontFamily: Fonts.CircularMedium,
    paddingRight: 70,

  }
});
export default MapListCard;
