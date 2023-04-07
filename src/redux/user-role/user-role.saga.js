import { takeLatest, call, put } from 'redux-saga/effects';

import { getListUserRole } from '@services/api';

import { callbackSuccess, callbackError } from '../helpers';
import { GET_LIST_USER_ROLE_ASYNC } from './user-role.action';

function* handleGetListUserRole({ ctx }) {
  try {
    yield put({ type: GET_LIST_USER_ROLE_ASYNC.START });
    const result = yield call(getListUserRole);
    yield put({ type: GET_LIST_USER_ROLE_ASYNC.SUCCESS, data: result });
    callbackSuccess(ctx, result);
  } catch (err) {
    console.error(err);
    yield put({ type: GET_LIST_USER_ROLE_ASYNC.SUCCESS, error: err });
    callbackError(ctx, err);
  }
}

export default function* userRoleSaga() {
  yield takeLatest(GET_LIST_USER_ROLE_ASYNC.HANDLER, handleGetListUserRole);
}
