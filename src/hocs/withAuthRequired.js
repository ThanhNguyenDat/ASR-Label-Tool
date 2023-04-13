import React, { useCallback, useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';

import * as _ from 'lodash';

import { getLoginInfoAsync } from '@redux/auth/authActions';
import { getListUserRoleAsync } from '@redux/user-role/user-role.action';

import { getRoleNameById } from '@helpers/common';

import { withPromiseAndDispatch } from '../helpers';
import { useNavigate } from 'react-router-dom';


function AuthComponent (props) {
  const {children, roles, ...rest} = props;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => state.authReducer.user);
  const userRoles = useSelector(state => state.userRoleReducer?.list ?? []);
  
  const getLoginInfo = useCallback(ctx => withPromiseAndDispatch(getLoginInfoAsync, ctx, dispatch), [dispatch]);
  const getRoles = useCallback(ctx => withPromiseAndDispatch(getListUserRoleAsync, ctx, dispatch), [dispatch]);

  const [isAuthen, setIsAuthen] = React.useState(false);
  
  useEffect(() => {
    if (!user?.logged) { // haven't login yet
      setIsAuthen(true);
      bootstrapAsync();
    } else { // login
      const isPermissionAccess = checkUserPermission(user, userRoles, roles)
      setIsAuthen(false);
      navigate("/auth/login");
    }
  }, [])

  function checkUserPermission (user, allRoles, permissionRoles) {
    const userRoleNames = []    
    user.role_ids.forEach(role_id => {
      const userRoleName = getRoleNameById(role_id, allRoles);
      userRoleNames.push(userRoleName);
    });

    function checkPermission (permissionRoles, userRoleNames) {
      let check = false
      permissionRoles.forEach(permissionRole => {
        if (userRoleNames.includes(permissionRole)) {
          check = true
        }
      })
      return check
    }
  
    if (!_.isEmpty(permissionRoles) && !checkPermission(permissionRoles, userRoleNames)) {
      alert('Permission is denied !!!');
      return false
    }
    return true
  };

  const bootstrapAsync = async () => {
    try {
        const user = await getLoginInfo({});
        const userRoles = await getRoles({});
        const isPermissionAccess = checkUserPermission(user, userRoles, roles)
        
        // check here ! optimize here => code dang bi ngu
        if (!isPermissionAccess) {
          navigate("/react_label_ui") // redirect: public router
        }
    } catch (err) {
        console.error("err", err);
        navigate("/auth/login");
    }
  }

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