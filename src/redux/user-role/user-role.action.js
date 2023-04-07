import { asyncTypes } from '@redux/helpers';

export const GET_LIST_USER_ROLE_ASYNC = asyncTypes('app/GET_LIST_USER_ROLE_ASYNC');


export const getListUserRoleAsync = ctx => ({ type: GET_LIST_USER_ROLE_ASYNC.HANDLER, ctx });
