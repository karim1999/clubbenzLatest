import fonts from './fonts';
import metrics from './metrics';
import colors from './colors';
import { Fonts } from '../resources/constants/Fonts';

const Styles = {
  screen: {
    mainContainer: {
      flex: 1,
      backgroundColor: colors.white,
    },

    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    title: {
      color: colors.snow,
    },
    topTitle: {
      fontSize: fonts.size.regular,
      width: metrics.deviceWidth * 2 / 3,
      marginLeft: metrics.baseMargin,
      paddingLeft: metrics.baseMargin,
      textAlign: 'center',
      color: colors.appGreen
    },

    subtitle: {
      color: colors.snow,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
  },
  columnContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  navigationComponent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    width: metrics.deviceWidth,
    height: metrics.navBarHeight,
    backgroundColor: colors.navgationBar,
    borderBottomEndRadius: metrics.radius15,
    borderBottomStartRadius: metrics.radius15,
    // borderBottomEndRadius: metrics.radius10,
    // borderBottomStartRadius: metrics.radius10,
  },

  navigationBackButton: {
    marginLeft: 20,
  },
  navigationMenuButton: {
    marginLeft: 20,
    height: 32,
    width: 32
  },
  tapableButtonHollow: {
    height: 55,
    justifyContent: 'center',
    backgroundColor: colors.transparent,
    alignSelf: 'center',
    borderColor: colors.blueText,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: metrics.radius40
  },
  tapableButton: {
    height: 55,
    justifyContent: 'center',
    backgroundColor: colors.blueButton,
    alignSelf: 'center',
    borderRadius: metrics.radius40,
  },
  fbLoginButton: {
    height: 60,
    justifyContent: 'center',
    backgroundColor: colors.fbBlueButton,
    alignSelf: 'center',
    borderRadius: metrics.radius40,
    fontFamily: Fonts.CircularMedium,

  },
  appleLoginButton: {
    height: 60,
    justifyContent: 'center',
    backgroundColor: colors.darkGray,
    alignSelf: 'center',
    borderRadius: metrics.radius40,
    fontFamily: Fonts.CircularMedium
  },
  toggleButtonContainer: {
    height: 55,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',

    // justifyContent: 'center',
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderStyle: 'solid',
    // alignSelf: 'center',
    borderRadius: metrics.radius40
  },
  tapButtonStyleTextWhite: {
    color: colors.white,
    textAlign: 'center',
    fontFamily: Fonts.CircularMedium,
    fontSize: fonts.size.h11,
  },
  tapButtonStyleTextBlue: {
    color: colors.blueText,
    textAlign: 'center',
    fontFamily: Fonts.CircularMedium,
    fontSize: fonts.size.h11,
  },
  tapButtonStyleTextUnderLine: {
    color: colors.grayDark,
    textAlign: 'center',
    fontFamily: Fonts.CircularBold,
    fontSize: fonts.size.h13,
  },
  containerBottomSmall: {
    height: metrics.deviceHeight - metrics.deviceHeight / 3,
    width: metrics.deviceWidth,
    marginTop: -30,
    backgroundColor: 'white',
    borderTopEndRadius: metrics.radius15,
    borderTopStartRadius: metrics.radius15,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 50

  },

  containerBottom: {
    height: metrics.deviceHeight / 2 - 40,
    width: metrics.deviceWidth,
    marginTop: -20,
    backgroundColor: colors.white,
    borderTopEndRadius: metrics.radius15,
    borderTopStartRadius: metrics.radius15,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20

  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  end: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  smallCircle: {
    height: metrics.icons.small * 2 / 3,
    width: metrics.icons.small * 2 / 3,
    borderRadius: (metrics.icons.small * 2 / 3) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediumCircle: {
    height: metrics.deviceWidth / 12,
    width: metrics.deviceWidth / 12,
    borderRadius: metrics.icons.small / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeCircle: {
    height: metrics.icons.large,
    width: metrics.icons.large,
    borderRadius: metrics.icons.large / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  xlCircle: {
    height: metrics.icons.xl,
    width: metrics.icons.xl,
    borderRadius: metrics.icons.xl / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContain: {
    flex: 1,
  },
  imageContainFlex: {
    flex: 1,
  },
  imageCover: {
    flex: 1
  },
  wrap: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  inputField: {
    height: 50,
    // borderBottomColor: '#E5E5EA',
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    marginBottom: 5,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    textAlign: "center",
    borderBottomWidth: 1 / 2,
    fontFamily: Fonts.CircularMedium,
  },
  commentInputField: {
    height: 100,
    width: metrics.deviceWidth - 20,
    borderColor: 'rgba(112,112,112, 0.2)',
    marginBottom: 5,
    // borderTopWidth: 1 / 2,
    // borderLeftWidth: 1 / 2,
    // borderRightWidth: 1 / 2,
    // borderBottomWidth: 1 / 2,
    borderRadius: 8,
    borderWidth: 1,
    // fontFamily: Fonts.CircularMedium,
  }
};

export default Styles;
