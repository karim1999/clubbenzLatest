import {
    ENGLISH,
    ARABIC,
} from '../actions/types';
const initialState = { isArabic: false };

const language = (state = initialState, action) => {
      switch (action.type) {
          case ENGLISH:
              return { ...state, isArabic: false };
          case ARABIC:
              return { ...state, isArabic: true };
          default:
              return state;
    }
};

export default language;
