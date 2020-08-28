export const LOGIN_USER = 'LOGIN_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const UPDATE_TEST = 'UPDATE_TEST';
export const LOGOUT_USER = 'LOGOUT_USER';

export const loginUser = user => ({
  type: LOGIN_USER,
  userData: user,
});

export const updateUser = user => ({
  type: UPDATE_USER,
  userData: user,
});

export const updateTest = data => ({
  type: UPDATE_TEST,
  testData: data,
});

export const logoutUser = () => ({
  type: LOGOUT_USER,
});
