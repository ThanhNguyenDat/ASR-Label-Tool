import { asyncTypes } from '../helpers';

export const SIGN_IN_ASYNC = asyncTypes('SIGN_IN_ASYNC');

export const GET_LOGIN_INFO_ASYNC = asyncTypes('GET_LOGIN_INFO_ASYNC');

export const CHANGE_USER_PASSWORD_ASYNC = asyncTypes('CHANGE_USER_PASSWORD_ASYNC');

export const signInAsync = ctx => ({ type: SIGN_IN_ASYNC.HANDLER, ctx });

export const getLoginInfoAsync = ctx => ({ type: GET_LOGIN_INFO_ASYNC.HANDLER, ctx });

export const changeUserPasswordAsync = ctx => ({ type: CHANGE_USER_PASSWORD_ASYNC.HANDLER, ctx });
