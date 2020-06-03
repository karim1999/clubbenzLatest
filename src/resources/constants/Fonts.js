import {Platform} from 'react-native';
export const Fonts = {
    ...Platform.select({
        ios: {
            CircularBold: 'CircularStd-Bold',
            CircularBoldItalic: 'CircularStd-BoldItalic',
            CircularMedium: 'CircularStd-Medium',
            CircularMediumItalic: 'CircularStd-MediumItalic',
            CircularBlack: 'CircularStd-Black',
            CircularBook: 'CircularStd-Book',
            GE_SS_MEDIUM: 'GESSTwoMedium-Medium',
            Oswald: 'Oswald',
            circular_book: 'CircularStd-Book',
            circular_black: 'CircularStd-Black',
            circular_medium: 'CircularStd-Medium',
        },
        android: {
            CircularBold: 'circular_bold',
            CircularBoldItalic: 'circular_bold_italic',
            CircularMedium: 'circular_medium',
            CircularMediumItalic: 'circular_medium_italic',
            CircularBlack: 'circular_black',
            CircularBook: 'circular_book',
            GE_SS_MEDIUM: 'ge_ss_two__edium',
            Oswald: 'oswald',
            circular_book: 'CircularStd_Book',
            circular_black: 'CircularStd_Black',
            circular_medium: 'CircularStd_Medium',
        },
    })
}