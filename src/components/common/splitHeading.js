import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import { Text, Image, StyleSheet, View, TouchableOpacity } from "react-native";
import { colors, fonts, metrics, styles } from "../../themes";



class SplitHeading extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[splitHeadingStyle.container,this.props.headingStyle]}>
        <View style={[splitHeadingStyle.lineStyle , this.props.lineColor, this.props.textSize,]} />
        <Text 
        style={[splitHeadingStyle.textStyle , this.props.textColor, this.props.textSize]}
        >{this.props.text} </Text>
        <View style={[splitHeadingStyle.lineStyle , this.props.lineColor]} />
      </View>
    );
  }
}

export default SplitHeading;

const splitHeadingStyle = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    paddingHorizontal: 48,
  },
  lineStyle:{
    width:45,
    height:1,
    // opacity: 0.2,
    // backgroundColor:'red'

  },
  textStyle:{
    marginHorizontal:18,
    marginVertical: 6
  }
})