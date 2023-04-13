// const { default: APIUtils } = require('../utils/APIUtils');
import * as APIUtils from '@utils/APIUtils';

export const signInRequest = data => {
    return APIUtils.post(`/api/account/signin`, data)
}

export const getLoginInfo = () => {
    return APIUtils.get(`/api/account/login-info`)
}


export const logoutRequest = () => {
    return APIUtils.get(`/api/account/logout`)
}

export const getListUserRole = () => {
    return APIUtils.get(`/api/account/get-roles`)
}

export const changePassword = data => {
    return APIUtils.post(`/api/account/change-password`, data)
}

