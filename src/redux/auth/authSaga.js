
import { takeLatest, call, put } from 'redux-saga/effects';

import { signInRequest, getLoginInfo, changePassword } from '@services/api';

import { callbackSuccess, callbackError } from '../helpers';
import { SIGN_IN_ASYNC, GET_LOGIN_INFO_ASYNC, CHANGE_USER_PASSWORD_ASYNC } from './authActions';
import { useCookies } from '../../hooks/useCookies';

function* handleGeSignIn({ ctx }) {
  try {
    const username = ctx?.username ?? '';
    const password = ctx?.password ?? '';
    yield put({ type: SIGN_IN_ASYNC.START });
    const result = yield call(signInRequest, { username, password });
    yield put({ type: SIGN_IN_ASYNC.SUCCESS, data: result.data }); // why put but dont ????
    
    // set tam cho nay nao co cach optimize hon thi lam => cach nay ngu qua
    document.cookie = `access_token=${result.data.user.access_token}`
    
    callbackSuccess(ctx, result); // why error system?
  } catch (err) {
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

export default function* auth() {
  yield takeLatest(SIGN_IN_ASYNC.HANDLER, handleGeSignIn);
  yield takeLatest(GET_LOGIN_INFO_ASYNC.HANDLER, handleGetLoginInfoInfo);
}
