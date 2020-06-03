import React, {PureComponent} from "react";

import { Text, Image, StyleSheet, View, TouchableOpacity ,Linking} from "react-native";
import {IMG_PREFIX_URL} from '../../config/constant';
import { styles, metrics } from '../../themes';
class reviewsAd extends PureComponent {
  constructor(props) {
    super(props);
  }

  onPress = () => {
    if (this.props.home_ads.link) {
      Linking.openURL(this.props.home_ads.link).catch((err) => console.error('An error occurred', err));
    }
  }
  render() {
    return (
      <TouchableOpacity onPress={this.onPress} style={[reviewsAdStyle.ad, styles.center]}>
      <Image
        
          style={{ 
            height:53,
            // aspectRatio:3.6,
            width: metrics.deviceWidth - 20,
            marginVertical: 10
           }}
          source={{uri:IMG_PREFIX_URL+this.props.home_ads.image}} />
    </TouchableOpacity>
    );
  }
}

export default reviewsAd;

const reviewsAdStyle = StyleSheet.create({
  ad: {
    flex:1,
	},
})