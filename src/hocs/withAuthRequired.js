import React, { useCallback, useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';

import * as _ from 'lodash';

import { getLoginInfoAsync } from '@redux/auth/authActions';
import { getListUserRoleAsync } from '@redux/user-role/user-role.action';

import { getRoleNameById } from '@helpers/common';

import { withPromiseAndDispatch } from '../helpers';
import { useNavigate } from 'react-router-dom';


function AuthComponent ({children, roles}) {  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => state.authReducer.user);
  // const userRoles = useSelector(state => state.userRoleReducer?.list ?? []);
  
  // const getLoginInfo = useCallback(ctx => withPromiseAndDispatch(getLoginInfoAsync, ctx, dispatch), [dispatch]);
  // const getRoles = useCallback(ctx => withPromiseAndDispatch(getListUserRoleAsync, ctx, dispatch), [dispatch]);
  const [isAuthen, setIsAuthen] = React.useState(false);
  

  useEffect(() => {
    let checkUserPermission = (userRoleName, permissionRoles) => {
        if (!_.isEmpty(permissionRoles) && !permissionRoles.includes(userRoleName)) {
          return false
        }
        return true
    };

    if (user && checkUserPermission(user.roles[0], roles)) {
      setIsAuthen(true);
    } else {
      setIsAuthen(false);
      navigate("/notfound");
    }
  }, [])


  return (
    <>
      {isAuthen ? (
        <React.Suspense fallback={<div className='loading'/>}>
          {children}
        </React.Suspense>
      ) : <div className="loading"></div>}
    </>
  )
}

export default AuthComponent