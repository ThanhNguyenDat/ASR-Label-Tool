import React, { Suspense, Component, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';

import { getLoginInfoAsync } from '@redux/auth/authActions';
import { getListUserRoleAsync } from '@redux/user-role/user-role.action';

import { getRoleNameById } from '@helpers/common';

import { withPromiseAndDispatch } from '../helpers';


function AuthComponent(Children, roles) {
  // console.log(Children)
  // console.log(roles)
  // const [loaded, setLoaded] = useState(false)

  // useEffect(() => {
    
  // }, [])

  function checkUserPermission(user, allRoles, permissionRoles) {
    if (user?.roleId === -1) {
      throw new Error(`RoleId: ${user?.roleId} is denied !!!`);
    }
  }


  return (
    <Suspense fallback={<div className='loading'/>}>
      <Children />
    </Suspense>
  )
}

const mapStateToProps = state => ({
  user: state.authReducer.user,
  userRoles: state.userRoleReducer?.list ?? [],
});

const mapDispatchToProps = dispatch => ({
  getLoginInfo: ctx => withPromiseAndDispatch(getLoginInfoAsync, ctx, dispatch),
  getRoles: ctx => withPromiseAndDispatch(getListUserRoleAsync, ctx, dispatch),
});

export default AuthComponent

// error: 
// export default connect(mapStateToProps, mapDispatchToProps)(AuthComponent);