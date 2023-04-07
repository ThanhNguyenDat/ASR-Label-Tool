import _ from 'lodash';


export const asyncTypes = action => ({
  HANDLER: `${action}_HANDLER`,
  PENDING: `${action}_PENDING`,
  START: `${action}_START`,
  MORE: `${action}_MORE`,
  SUCCESS: `${action}_SUCCESS`,
  FAIL: `${action}_FAIL`,
});

export const callbackError = (ctx, result) => {
  if (ctx && ctx.reject && _.isFunction(ctx.reject)) {
    return ctx.reject(result || 'System error.');
  }
  if (ctx && ctx.onError && _.isFunction(ctx.onError)) {
    return ctx.onError(result || null);
  }
};

export const callbackSuccess = (ctx, result) => {
  if (ctx && ctx.reject && _.isFunction(ctx.resolve)) {
    return ctx.resolve(result || 'System error.');
  }
  if (ctx && ctx.onSuccess && _.isFunction(ctx.onSuccess)) {
    return ctx.onSuccess(result || null);
  }
};
