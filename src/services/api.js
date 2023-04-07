import APIUtils from '../utils/APIUtils';
import { parseJSONtoParam } from '../utils/commonUtils';

const BASE_URL = process.env.BASE_API_URL;

export const signInRequest = data => {
  console.log(data);
  return APIUtils.Post(`${BASE_URL}/api/account/signin`, data);
};

export const logoutRequest = () => APIUtils.Get(`${BASE_URL}/api/account/logout`);

export const getLoginInfo = () => APIUtils.Get(`${BASE_URL}/api/account/login-info`);

export const getListUserRole = () => APIUtils.Get(`${BASE_URL}/api/account/get-roles`);

export const getListUser = () => APIUtils.Get(`${BASE_URL}/api/account/get-users`);

export const assignUserRole = data => APIUtils.Post(`${BASE_URL}/api/account/assign-admin`, data);

export const signUpUser = data => APIUtils.Post(`${BASE_URL}/api/account/signup`, data);

export const deleteUser = data => APIUtils.Post(`${BASE_URL}/api/account/delete-user`, data);

export const changePassword = data => APIUtils.Post(`${BASE_URL}/api/account/change-password`, data);

export const updateUserStatus = data => APIUtils.Post(`${BASE_URL}/api/account/update-status`, data);

export const createPartner = data => APIUtils.Post(`${BASE_URL}/api/account/create-partner`, data);

export const updatePartner = data => APIUtils.Post(`${BASE_URL}/api/account/update-partner`, data);

export const getDashboardOverview = queryParams =>
  APIUtils.Get(`${BASE_URL}/api/v2/dashboard/overview?${parseJSONtoParam(queryParams)}`);

export const getDashboardExecuteTime = queryParams =>
  APIUtils.Get(`${BASE_URL}/api/v2/dashboard/executeTime?${parseJSONtoParam(queryParams)}`);

export const getListLog = queryParams =>
  APIUtils.Get(`${BASE_URL}/api/v2/session/logs?${parseJSONtoParam(queryParams)}`);

export const getDashboardByImageType = queryParams =>
  APIUtils.Get(`${BASE_URL}/api/v2/dashboard/chartByImgType?${parseJSONtoParam(queryParams)}`);

export const getListPartner = () => APIUtils.Get(`${BASE_URL}/api/account/get-partners`);

export const getListService = () => APIUtils.Get(`${BASE_URL}/api/service/getlist`);

export const getListStatus = () => APIUtils.Get(`${BASE_URL}/api/app/config`);

export const createFizaEkycLink = formData => APIUtils.PostFormData(`${BASE_URL}/api/service/createLink`, formData);

export const createPhotoUrl = data => APIUtils.Post(`${BASE_URL}/api/service/createUrl`, data);

export const getStatusChartByImageType = queryParams =>
  APIUtils.Get(`${BASE_URL}/api/v2/dashboard/statusChartByImgType?${parseJSONtoParam(queryParams)}`);

export const searchConfig = data => APIUtils.Post(`${BASE_URL}/api/account/search-apikey-config`, data);

export const changeConfig = data => APIUtils.Post(`${BASE_URL}/api/account/change-apikey-config`, data);

// eKYC
export const genSessionEKYC = async params => {
  return APIUtils.PostFormData(`${BASE_URL}/api/ekyc-demo/verify_ekyc_sync/gen_session?${parseJSONtoParam(params)}`);
};

export const sendImageEKYC = async (params, data) => {
  return APIUtils.PostFormData(`${BASE_URL}/api/ekyc-demo/verify_ekyc_async/send?${parseJSONtoParam(params)}`, data);
};

export const checkEKYC = async params => {
  return APIUtils.Post(`${BASE_URL}/api/ekyc-demo/verify_ekyc_async/check?${parseJSONtoParam(params)}`);
};

export const checkFraudEKYC = async params => {
  return APIUtils.Post(`${BASE_URL}/api/ekyc-demo/verify_ekyc_async/check/fraud?${parseJSONtoParam(params)}`);
};

export const getConfigEKYC = async params => {
  return APIUtils.Post(`${BASE_URL}/api/ekyc-demo/verify_ekyc_sync/get_config?${parseJSONtoParam(params)}`);
};

export const getCroppedEKYC = async params => {
  return APIUtils.Post(`${BASE_URL}/api/ekyc-demo/all/get_cropped?${parseJSONtoParam(params)}`);
};
