import { all, fork } from 'redux-saga/effects';

import authSaga from './auth/authSaga';
// import dashboardSaga from './dashboard/dashboardSaga';
// import logSaga from './log/logSaga';
// import partnerSaga from './partner/partner.saga';
// import serviceSaga from './service/serviceSaga';
import userRoleSaga from './user-role/user-role.saga';
// import userSaga from './user/user.saga';

export default function* rootSaga() {
  yield all([
    fork(authSaga),
    // fork(dashboardSaga),
    // fork(logSaga),
    // fork(partnerSaga),
    // fork(serviceSaga),
    fork(userRoleSaga),
    // fork(userSaga)
  ]);
}
