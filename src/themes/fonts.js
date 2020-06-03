import metrics from './metrics';
import colors from './colors';

const type = {
  base: 'HelveticaNeue',
  bold: 'HelveticaNeue-Bold',
  emphasis: 'HelveticaNeue-Italic',
};

const size = {
  h1: 38,
  h2: 30,
  h3: 27,
  h4: 25,
  h5: 24,
  h6: 22,
  h7: 21,
  h8: 20,
  h9: 19,
  h10: 18,
  h11: 17,
  h12: 15,
  h13: 14,
  input: 20,
  exlarge: 63,
  large: 45,
  regular: 16,
  medium: 14,
  small: 13,
  tiny: 12,
};

const fontWeight = {
  normal: 'normal', 
  bold: 'bold', 
  f100: '100', 
  f200: '200',  
};

const style = {
  headingTextBoldBlue: {
    fontFamily: type.bold,
    fontSize: size.h2,
    color:colors.blueText,
    textAlign: 'center',
    
  },
  titleTextBoldWhite: {
    fontFamily: type.bold,
    fontSize: size.h10,
    color:colors.blueText,
    textAlign: 'center',
  },
  descriptionTextBlack: {
    fontFamily: type.regular,
    fontSize: size.h12,
    color:colors.black,
    textAlign: 'center',
    
  },
  h1: {
    fontFamily: type.base,
    fontSize: size.h1,
  },
  h2: {
    fontSize: size.h2,
    fontFamily: type.base,
  },
  h3: {
    fontFamily: type.emphasis,
    fontSize: size.h3,
  },
  h4: {
    fontFamily: type.base,
    fontSize: size.h4,
  },
  h5: {
    fontFamily: type.base,
    fontSize: size.h5,
  },
  h6: {
    fontFamily: type.emphasis,
    fontSize: size.h6,
  },
  h7: {
    fontFamily: type.emphasis,
    fontSize: size.h7,
  },
  h8: {
    fontFamily: type.emphasis,
    fontSize: size.h8,
  },
  h9: {
    fontFamily: type.emphasis,
    fontSize: size.h9,
  },
  h10: {
    fontFamily: type.emphasis,
    fontSize: size.h10,
  },
  h11: {
    fontFamily: type.emphasis,
    fontSize: size.h11,
  },
  h12: {
    fontFamily: type.emphasis,
    fontSize: size.h12,
  },
  normal: {
    fontFamily: type.base,
    fontSize: size.regular,
  },
  small: {
    fontFamily: type.base,
    fontSize: size.small,
  },
  tiny: {
    fontFamily: type.base,
    fontSize: size.tiny,
  },
  description: {
    fontFamily: type.base,
    fontSize: size.medium,
  },
  textButton:{
    fontFamily: type.base,
    fontSize: size.medium,
    color: colors.white,
    textAlign: 'center',
  },
  textWhite: {
    color: colors.white
  },
  bold: {
    fontWeight: 'bold'
  },
  textInput: {
    color: colors.gray75, 
    fontSize: size.medium, 
    // fontWeight: fontWeight.normal, 
    paddingTop:-5 
  }, 
};

export default {
  type,
  size,
  style,
  fontWeight, 
};
