import { Dimensions, Platform, NativeModules } from 'react-native';

const { width, height } = Dimensions.get('window');

const deviceWidth = width < height ? width : height;
const deviceHeight = width < height ? height : width;

// Dynamique value for responsive elemenet ( margin , Radius , sizeImage .....)
const metrics = {
  deviceWidth,
  deviceHeight,
  base: 36,
  baseMargin: 12,
  margin18: 18,
  doubleBaseMargin: 24,
  smallMargin: 6,
  basePadding: 12,
  selectLanguageMargin: 88,
  doubleBasePadding: 24,
  trippleBasePadding: 28,
  tetraBasePadding: 42,
  smallPadding: 6,

  statusBarHeight: Platform.OS === "ios" ? 22 : NativeModules.HEIGHT,

  navBarHeight: (Platform.OS === 'ios') ? 64 + 22 : 64,
  radius: 5,
  radius7: 7,
  radius10: 10,
  radius15: 15,
  radius20: 20,
  radius35: 35,
  radius40: 40,

  buttonHeight: 45,
  inputHeight: 45,
  borderWidth: 1,
  rowHeight: 100,
  icons: {
    tiny: 15,
    small: 35,
    small_25: 25,
    medium: 45,
    lm: 72,
    large: 120,
    xl: 180,
  },
  images: {
    tiny: 12,
    small: 35,
    medium: 40,
    large: 90,
    xl: 120,
    logo: 180,
    flex: 360,
  },
  button: {
    small: 120,
    medium: 180,
    large: 240,
  }
};

export default metrics;
