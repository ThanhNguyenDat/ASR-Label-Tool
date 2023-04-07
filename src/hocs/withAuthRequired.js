import React, { Suspense, Component } from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';

import { getLoginInfoAsync } from '@redux/auth/authActions';
import { getListUserRoleAsync } from '@redux/user-role/user-role.action';

import { getRoleNameById } from '@helpers/common';

import { withPromiseAndDispatch } from '../helpers';

export default function(ComposedComponent, roles = null) {
  class withAuthRequired extends Component {
    state = {
      loaded: false,
    };

    mounted = false;

    componentDidMount() {
      this.mounted = true;
      if (!this.props.user?.logged) {
        this.bootstrapAsync();
      } else {
        const isPermissionAccess = this.checkUserPermission(this.props.user, this.props.userRoles, roles);
        console.log('isPermissionAccess', isPermissionAccess);
        this.setState({ loaded: true });
      }
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    checkUserPermission = (user, allRoles, permissionRoles) => {
      if (user?.roleId === -1) {
        throw new Error(`RoleId: ${user?.roleId} is denied !!!`);
      }
      const userRoleName = getRoleNameById(user?.roleId, allRoles);
      if (!_.isEmpty(permissionRoles) && !permissionRoles.includes(userRoleName)) {
        alert('Permission is denied !!!');
        return false;
      }
      return true;
    };

    bootstrapAsync = async () => {
      try {
        const user = await this.props?.getLoginInfo({});
        const userRoles = await this.props?.getRoles({});

        const isPermissionAccess = this.checkUserPermission(user, userRoles, roles);
        console.log('isPermissionAccess', isPermissionAccess);
      } catch (err) {
        console.log(err);
        this.props.history.push('/auth/login');
      } finally {
        this.mounted && this.setState({ loaded: true });
      }
    };

    render() {
      if (!this.state.loaded) return <div className="loading" />;
      return (
        <Suspense fallback={<div className="loading" />}>
          <ComposedComponent {...this.props} />
        </Suspense>
      );
    }
  }

  const mapStateToProps = state => ({
    user: state.authReducer.user,
    userRoles: state.userRoleReducer?.list ?? [],
  });

  const mapDispatchToProps = dispatch => ({
    getLoginInfo: ctx => withPromiseAndDispatch(getLoginInfoAsync, ctx, dispatch),
    getRoles: ctx => withPromiseAndDispatch(getListUserRoleAsync, ctx, dispatch),
  });

  return connect(mapStateToProps, mapDispatchToProps)(withAuthRequired);
}
