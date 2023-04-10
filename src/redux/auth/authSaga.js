import { takeLatest, call, put } from 'redux-saga/effects';

import { signInRequest, getLoginInfo, changePassword } from '@services/api';

import { callbackSuccess, callbackError } from '../helpers';
import { SIGN_IN_ASYNC, GET_LOGIN_INFO_ASYNC, CHANGE_USER_PASSWORD_ASYNC } from './authActions';

function* handleGeSignIn({ ctx }) {
  try {
    const username = ctx?.username ?? '';
    const password = ctx?.password ?? '';
    yield put({ type: SIGN_IN_ASYNC.START });
    console.log('handleGeSignIn before call api: ', username)
    const result = yield call(signInRequest, { username, password });
    console.log('handleGeSignIn after call api: ', result);

    yield put({ type: SIGN_IN_ASYNC.SUCCESS, data: result.data }); // why put but dont ????
    
    callbackSuccess(ctx, result); // why error system?
    console.log('handleGeSignIn Final: ', result);
  } catch (err) {
    console.error(`handleGeSignIn Error: ${err}`);
    callbackError(ctx, err);
  }
}

function* handleGetLoginInfoInfo({ ctx }) {
  try {
    yield put({ type: GET_LOGIN_INFO_ASYNC.START });
    const result = yield call(getLoginInfo);
    yield put({ type: GET_LOGIN_INFO_ASYNC.SUCCESS, data: result });
    callbackSuccess(ctx, result);
  } catch (err) {
    console.error(err);
    callbackError(ctx, err);
  }
}

function* handleChangeUserPassword({ ctx }) {
  try {
    const userId = ctx?.userId;
    const password = ctx?.password;
    const oldPassword = ctx?.oldPassword;
    yield put({ type: CHANGE_USER_PASSWORD_ASYNC.START });
    const result = yield call(changePassword, { password, userId, oldPassword });
    yield put({ type: CHANGE_USER_PASSWORD_ASYNC.SUCCESS, data: result });
    callbackSuccess(ctx, result);
  } catch (err) {
    console.error(err);
    callbackError(ctx, err);
  }
}

export default function* auth() {
  yield takeLatest(SIGN_IN_ASYNC.HANDLER, handleGeSignIn);
  yield takeLatest(GET_LOGIN_INFO_ASYNC.HANDLER, handleGetLoginInfoInfo);
  yield takeLatest(CHANGE_USER_PASSWORD_ASYNC.HANDLER, handleChangeUserPassword);
}
