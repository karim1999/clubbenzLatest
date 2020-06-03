import React, {PureComponent} from "react";

import { Text, Image, StyleSheet, View, TouchableOpacity ,Linking} from "react-native";
import {IMG_PREFIX_URL} from '../../config/constant';
import { styles, metrics } from '../../themes';
class ListingAd extends PureComponent {
  constructor(props) {
    super(props);
  }

  onPress = () => {
    if (this.props.home_ads.link != '') {
      Linking.openURL(this.props.home_ads.link).catch((err) => console.error('An error occurred', err));
    }
  }
  render() {
    return (
      <TouchableOpacity onPress={this.onPress} style={[listingAdStyle.ad, styles.center, {marginTop: this.props.marginTop,}]}>
      <View style={{width: metrics.deviceWidth - this.props.marginHorizontal,}}>
      <Image
        
          style={{
            height:110,
           }}
          source={{uri:IMG_PREFIX_URL+this.props.home_ads.image}}
      />
      </View>
    </TouchableOpacity>
    );
  }
}

export default ListingAd;

const listingAdStyle = StyleSheet.create({
  ad: {
      flex:1,
	},
})