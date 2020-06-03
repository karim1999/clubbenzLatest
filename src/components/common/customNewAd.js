import React, {PureComponent} from "react";

import { Text, Image, StyleSheet, View, TouchableOpacity ,Linking} from "react-native";
import {IMG_PREFIX_URL} from '../../config/constant';
import { styles, metrics } from '../../themes';
class CustomNewAd extends PureComponent {
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
      <TouchableOpacity onPress={this.onPress} style={[customNewAdStyle.ad, styles.center]}>
      <View style={{marginTop: 20, width: metrics.deviceWidth - 20, marginBottom: this.props.margin,}}>
      <Image
        
          style={{
            height:110,
            // aspectRatio:3.6,

           }}
          source={{uri:IMG_PREFIX_URL+this.props.home_ads.image}} />
          </View>
    </TouchableOpacity>
    );
  }
}

export default CustomNewAd;

const customNewAdStyle = StyleSheet.create({
  ad: {
    flex:1,
	},
})