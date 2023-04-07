import { combineReducers } from 'redux';

// import settings from './settings/reducer';
// import menu from './menu/reducer';
// import dashboardReducer from './dashboard/dashboardReducer';
// import logReducer from './log/logReducer';
// import partnerReducer from './partner/partner.reducer';
// import serviceReducer from './service/serviceReducer';
import authReducer from './auth/authReducer';
import userRoleReducer from './user-role/user-role.reducer';
// import userReducer from './user/user.reducer';

const rootReducer = combineReducers({
  // settings,
  // menu,
  // dashboardReducer,
  // logReducer,
  // partnerReducer,
  // serviceReducer,
  authReducer,
  userRoleReducer,
  // userReducer
});

export default rootReducer;
