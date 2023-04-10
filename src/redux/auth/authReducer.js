import { GET_LOGIN_INFO_ASYNC } from './authActions';


const initialAuthData = {
  fetching: false,
  logged: false,
  user: null,
  apiKey: ''
};

export default function authReducer(state = initialAuthData, action) {
  switch (action.type) {
    case GET_LOGIN_INFO_ASYNC.SUCCESS: {
      console.log("GET_LOGIN_INFO_ASYNC.SUCCESS reducer: ", action)
      return { ...state, logged: true, user: action.data };
    }
    default:
      return state;
  }
}
