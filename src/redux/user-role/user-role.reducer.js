import { GET_LIST_USER_ROLE_ASYNC } from './user-role.action';

const initialUserRoleState = {
  list: [],
  fetching: false,
};

export default function userRoleReducer(state = initialUserRoleState, action) {
  switch (action.type) {
    case GET_LIST_USER_ROLE_ASYNC.START: {
      return { ...state, fetching: true };
    }


    case GET_LIST_USER_ROLE_ASYNC.SUCCESS: {
      return { ...state, list: action.data, fetching: false };
    }


    case GET_LIST_USER_ROLE_ASYNC.FAIL: {
      return { ...state, fetching: false };
    }

    default:
      return { ...state };
  }
}
