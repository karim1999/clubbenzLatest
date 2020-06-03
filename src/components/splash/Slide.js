import React, { Component, PureComponent} from "react";
import { Text, Image, StyleSheet, View } from "react-native";

import ButtonGradient from "../common/ButtonGradient";

import { colors, fonts, metrics, styles } from "../../themes";

class Slide extends PureComponent {

  static defaultProps = {
    image: "",
    title: null,
    description: null,
    textButton: "NEXT",
    onPress: () => {},
    icon: null
  };

  render() {
    return (
      <View style={styles.screen.mainContainer}>
        <View style={styleOnboardingScreen.container}>
          <View style={{ justifyContent: "center" }}>
            <Image
              style={{
                resizeMode: "cover",
                height: 300,
                width: metrics.deviceWidth
              }}
              source={this.props.image}
            />
          </View>
          <View
            style={[
              styles.center,
              {
                flex: 2,
                paddingTop: 55
              }
            ]}
          >
            <Text
              style={[
                fonts.style.h5,
                fonts.style.bold,
                {
                  textAlign: "center"
                }
              ]}
            >
              {this.props.title}
            </Text>
            <View style={styleOnboardingScreen.ligne} />
            {this.props.description}
          </View>
          <View style={{ flex: 1 }}>
            <ButtonGradient
              styleButton={styleOnboardingScreen.styleButton}
              styleText={[
                fonts.style.h12,
                {
                  color: colors.white
                }
              ]}
              text={this.props.textButton}
              onPress={this.props.onPress}
              icon={this.props.icon}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default Slide;

const styleOnboardingScreen = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  ligne: {
    width: metrics.deviceWidth / 3,
    height: 5,
    backgroundColor: colors.appBleu,
    top: 5
  },
  styleButton: {
    backgroundColor: colors.appBleu,
    padding: metrics.baseMargin,
    borderRadius: metrics.radius,
    width: metrics.deviceWidth * 2 / 3,
    height: metrics.buttonHeight,
    justifyContent: "center",
    marginVertical: metrics.baseMargin
  },
  pagination: {
    position: "absolute",
    top: 0
  },
  dot: {
    backgroundColor: colors.white,
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: colors.appBleu
  },
  activeDot: {
    backgroundColor: colors.appBleu,
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3
  }
});
