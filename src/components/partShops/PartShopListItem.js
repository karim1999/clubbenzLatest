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
const { width, height } = Dimensions.get("window");

_selectImage = pic => {
  switch (pic) {
    case 1:
      return (
        <Image
          style={{
            height: width * 0.15,
            width: width * 0.15,
            resizeMode: "contain"
          }}
          source={require("../../resources/icons/ic_tires.png")}
        />
      );

    case 2:
      return (
        <Image
          style={{
            height: width * 0.15,
            width: width * 0.15,
            resizeMode: "contain"
          }}
          source={require("../../resources/icons/ic_petrol.png")}
        />
      );

    case 3:
      return (
        <Image
          style={{
            height: width * 0.15,
            width: width * 0.15,
            resizeMode: "contain"
          }}
          source={require("../../resources/icons/ic_carwash.png")}
        />
      );

    default:
      return (
        <Image
          style={{
            height: width * 0.15,
            width: width * 0.15,
            resizeMode: "contain"
          }}
          source={require("../../resources/icons/ic_workshops.png")}
        />
      );
  }
};
const PartShopListItem = ({ item, onPress }) => {
  const item_image = IMG_PREFIX_URL + item.partShop_logo_image;
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.wrapper}>
          <Image
            style={{
              height: width * 0.15,
              width: width * 0.15,
              resizeMode: "contain"
            }}
            source={
              item_image
                ? { uri: item_image }
                : require("../../resources/icons/ic_carwash.png")
            }
          />
        </View>
      </TouchableOpacity>
      <Text style={{ textAlign: "center", color: "#000" }}>{item.name}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { marginHorizontal: width * 0.02, marginTop: height * 0.01 },
  wrapper: {
    height: width * 0.23,
    width: width * 0.23,
    borderRadius: width * 0.2,
    backgroundColor: "#e5ebee",
    marginHorizontal: width * 0.03,
    marginVertical: height * 0.01,
    justifyContent: "center",
    alignItems: "center"
  }
});
export default PartShopListItem;
