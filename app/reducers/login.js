import {
  LOGIN_USER,
  LOGOUT_USER,
  UPDATE_USER,
  UPDATE_TEST,
} from '../actions/login';

const initialState = {
  userLoginData: {
    userLoggedIn: false,
    uid: '',
    compVerified: false,
  },
  currentUser: {},
  testData: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        userLoginData: {
          uid: action.userData.uid || '',
          userLoggedIn: true,
          compVerified: action.userData.compVerified,
        },
        currentUser: action.userData || {},
      };

    case UPDATE_USER:
      return {
        ...state,
        currentUser: action.userData || {},
      };

    case UPDATE_TEST:
      return {
        ...state,
        testData: action.testData || {},
      };

    case LOGOUT_USER:
      return {
        ...state,
        userLoginData: {
          userLoggedIn: false,
          uid: '',
          isNotVerified: false,
        },
        currentUser: {},
      };

    default:
      return state;
  }
};
