import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
  ImageBackground,
  ScrollView,
  Alert
} from "react-native";

import { Madoka } from "react-native-textinput-effects";
import { styles, fonts, colors, metrics } from "../themes";
const { width, height } = Dimensions.get("window");
import NavigationService from "../NavigationService";
import NavigationComponent from "../components/navigation/navigation";
import SplitHeading from "../components/common/splitHeading";
import { FlatList } from "react-native-gesture-handler";
import * as partAction from "./../redux/actions/parts";
import CustomNewAd from '../components/common/customNewAd';
import { connect } from 'react-redux';

class PartsInfoScreen extends PureComponent {
  constructor(props) {
    super(props);

    this.partDetail();
  }
  state = {
    data: [
      {
        serviceUrl: require("../resources/images/bosch.png")
      },
      {
        serviceUrl: require("../resources/images/bosch.png")
      },
      {
        serviceUrl: require("../resources/images/bosch.png")
      },
      {
        serviceUrl: require("../resources/images/bosch.png")
      },
      {
        serviceUrl: require("../resources/images/bosch.png")
      },
      {
        serviceUrl: require("../resources/images/bosch.png")
      }
    ],

    partPrice: "",
    partDiscount: "",
    partDescription: ""
  };

  partDetail() {
    partAction
      .partDetail()
      .then(res => {
        var price = JSON.stringify(res.shop_detail.price);
        price = price.replace(/"/g, "");
        var discount = JSON.stringify(res.shop_detail.discount);
        discount = discount.replace(/"/g, "");
        var description = JSON.stringify(res.shop_detail.description);
        description = description.replace(/"/g, "");
        let phone = JSON.stringify(res.shop_detail.phone)
        phone = phone.replace(/"/g, "")
        this.setState({
          partPrice: price,
          partDiscount: discount,
          partDescription: description,
          phone
        });
      })
      .catch(err => {
        console.log("error" + JSON.stringify(err));
      });
  }

  showContact = () => {
    Alert.alert('Contact Info', this.state.phone);
  };

  renderItem = ({ item, index }) => {
    return <Image source={item.serviceUrl} />;
  };
  renderAds = () =>{

		for (i = 0; i < this.props.preferences.home_ads.length; i++) {
		  if(this.props.preferences.home_ads[i].type === "Home Page Bottom"){
			return   <CustomNewAd home_ads={this.props.preferences.home_ads[i]} margin={10} /> ;
		  }
		}
	  
	  }
  render() {
    return (
      <View style={[stylePartsInfoScreen.container]}>
        <ScrollView>
          <View style={stylePartsInfoScreen.innerContainer}>
            <View>
              <View style={[styles.row]}>
                <Text
                  style={[
                    stylePartsInfoScreen.partPrice,
                    {
                      color: colors.blueText,
                      // fontWeight: fonts.fontWeight.bold
                    }
                  ]}
                >
                  Price
                </Text>
                <Text
                  style={[
                    stylePartsInfoScreen.partPrice,
                    {
                      color: colors.grey93
                    }
                  ]}
                >
                  {" "}
                  {this.state.partPrice}
                </Text>
              </View>
              <View style={[styles.row]}>
                <Text
                  style={[
                    stylePartsInfoScreen.partPrice,
                    {
                      color: colors.blueText,
                      // fontWeight: fonts.fontWeight.bold
                    }
                  ]}
                >
                  Discount
                </Text>
                <Text
                  style={[
                    stylePartsInfoScreen.partPrice,
                    {
                      color: colors.grey93
                    }
                  ]}
                >
                  {" "}
                  {this.state.partDiscount}
                </Text>
              </View>
              <View style={[styles.row]}>
                <Text
                  style={[
                    stylePartsInfoScreen.partHeading,
                    {
                      color: colors.blueText,
                      // fontWeight: fonts.fontWeight.bold
                    }
                  ]}
                >
                  Description
                </Text>
                <Text
                  style={[
                    stylePartsInfoScreen.partDescription,
                    {
                      color: colors.grey93
                    }
                  ]}
                >
                  {" "}
                  {this.state.partDescription}
                </Text>
              </View>
            </View>
            {/* <ImageBackground
              style={stylePartsInfoScreen.loactionCircleImage}
              source={require("../resources/icons/mask_group.png")}
            >
              <Image
                resizeMode="contain"
                style={stylePartsInfoScreen.innerLocationImage}
                source={require("../resources/icons/ic_pin_selected.png")}
              />
            </ImageBackground> */}
          </View>
          <FlatList
            horizontal={true}
            data={this.state.data}
            renderItem={this.renderItem}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
          />

          <SplitHeading
            text={"Offered parts condition"}
            headingStyle={{ padding: 5, marginVertical: 5 }}
            lineColor={{ backgroundColor: colors.blueButton }}
            textColor={{ color: colors.grey93 }}
          />

          <View style={stylePartsInfoScreen.partServicesContainer}>
            <View
              style={[
                styles.row,
                { flex: 1, alignItems: "center", justifyContent: "flex-start" }
              ]}
            >
              <Image
                resizeMode="contain"
                style={stylePartsInfoScreen.tickImage}
                source={require("../resources/icons/tick.png")}
              />
              <Text style={stylePartsInfoScreen.serviceTitle}>New Parts</Text>
            </View>
            <View
              style={[
                styles.row,
                { flex: 1, alignItems: "center", justifyContent: "flex-start" }
              ]}
            >
              <Image
                resizeMode="contain"
                style={stylePartsInfoScreen.tickImage}
                source={require("../resources/icons/tick.png")}
              />
              <Text
                style={[
                  stylePartsInfoScreen.serviceTitle,
                  {
                    color: colors.grey93
                  }
                ]}
              >
                Used Parts
              </Text>
            </View>
          </View>

          <SplitHeading
            text={"parts group"}
            headingStyle={{ padding: 5, marginVertical: 5 }}
            lineColor={{ backgroundColor: colors.blueButton }}
            textColor={{ color: colors.grey93 }}
          />

          <View style={stylePartsInfoScreen.partServicesContainer}>
            <View
              style={[styles.row, stylePartsInfoScreen.serviceItemContainer]}
            >
              <Image
                resizeMode="contain"
                style={stylePartsInfoScreen.tickImage}
                source={require("../resources/icons/tick.png")}
              />
              <Text style={stylePartsInfoScreen.serviceTitle}>
                Breaks Parts
              </Text>
            </View>
            <View
              style={[styles.row, stylePartsInfoScreen.serviceItemContainer]}
            >
              <Image
                resizeMode="contain"
                style={stylePartsInfoScreen.tickImage}
                source={require("../resources/icons/tick.png")}
              />
              <Text style={stylePartsInfoScreen.serviceTitle}>
                Maintainance Parts
              </Text>
            </View>
          </View>

          <View style={stylePartsInfoScreen.partServicesContainer}>
            <View
              style={[styles.row, stylePartsInfoScreen.serviceItemContainer]}
            >
              <Image
                resizeMode="contain"
                style={stylePartsInfoScreen.tickImage}
                source={require("../resources/icons/tick.png")}
              />
              <Text style={stylePartsInfoScreen.serviceTitle}>
                Transmission Parts
              </Text>
            </View>
            <View
              style={[styles.row, stylePartsInfoScreen.serviceItemContainer]}
            >
              <Image
                resizeMode="contain"
                style={stylePartsInfoScreen.tickImage}
                source={require("../resources/icons/tick.png")}
              />
              <Text style={stylePartsInfoScreen.serviceTitle}>
                Oil & Lubricants
              </Text>
            </View>
          </View>
           {this.renderAds()}
          {/* <Image
            style={stylePartsInfoScreen.ad}
            source={require("../resources/images/ad_banner.png")}
          /> */}

          <TouchableOpacity style={styles.center} onPress={this.showContact}>
            <View style={stylePartsInfoScreen.btnStyle}>
              <Text style={stylePartsInfoScreen.btnText}>Contact now</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}


mapStateToProps = (state) => {
	return {
		preferences: state.init.preferences,	
	}
  }
export default connect(mapStateToProps, null)(PartsInfoScreen)

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
    marginHorizontal: 18,
    marginTop: 8
  },
  tickImage: {
    width: 23,
    height: 19
  },
  serviceTitle: {
    color: "#1E313E",
    fontSize: 14,
    marginLeft: 15
  },
  ad: {
    width: metrics.deviceWidth - 8,
    height: 110,
    marginVertical: metrics.basePadding
  },
  btnStyle: {
    width: metrics.deviceWidth - 40,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#11455F",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: metrics.radius40,
    marginBottom: 4
  },
  btnText: {
    fontSize: 18,
    color: "#11455F"
  },
  serviceItemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start"
  }
});
