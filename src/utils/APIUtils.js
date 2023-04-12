import 'whatwg-fetch';

export default class APIUtils {
  static headerCommonConfig = {
    'Content-Type': 'application/json',
  };

  static errorHandler = (err, next) => {
    console.log("errorHandler: ", err)
    return next(err)
  };

  static responseHandler = (returnedValue, resolve, reject) => {
    if (returnedValue.error_code == 0) {
      console.log("responseHandler data: ", returnedValue)
      const { data } = returnedValue;
      resolve(data);
    } else {
      console.log("responseHandler error: ", returnedValue)
      this.errorHandler(returnedValue, err => reject(err));
    }
  };

  static Get = url =>
    new Promise((resolve, reject) =>
      fetch(url, { credentials: 'include', method: 'get', headers: this.headerCommonConfig })
        .then(resp => resp.json())
        .then(returnedValue => this.responseHandler(returnedValue, resolve, reject))
        .catch(err => this.errorHandler(err, reject))
    );

  // static Post = (url, data) =>
  //   new Promise((resolve, reject) =>
  //     fetch(url, {
  //       method: 'post',
  //       credentials: 'include',
  //       headers: this.headerCommonConfig,
  //       body: JSON.stringify(data),
  //     })
  //       .then(resp => resp.json())
  //       .then(returnedValue => this.responseHandler(returnedValue, resolve, reject))
  //       .catch(err => this.errorHandler(err, reject))
  //   );


  static Post = (url, data) =>
  {
    return new Promise((resolve, reject) =>
    fetch(url, {
      method: 'post',
      credentials: 'include',
      headers: this.headerCommonConfig,
      body: JSON.stringify(data),
    })
      .then(resp => resp.json())
      .then(returnedValue => this.responseHandler(returnedValue, resolve, reject))
      .catch(err => this.errorHandler(err, reject))    
    );
  }

  static PostFormData = (url, formData) =>
    new Promise((resolve, reject) =>
      fetch(url, {
        method: 'post',
        credentials: 'include',
        body: formData,
      })
        .then(resp => resp.json())
        .then(returnedValue => this.responseHandler(returnedValue, resolve, reject))
        .catch(err => this.errorHandler(err, reject))
    );

  

  static PostWithoutEncrypt = (url, data) =>
    new Promise((resolve, reject) =>
      fetch(url, {
        method: 'post',
        credentials: 'include',
        headers: this.headerCommonConfig,
        body: JSON.stringify(data),
      })
        .then(resp => resp.json())
        .then(returnedValue => this.responseHandler(returnedValue, resolve, reject))
        .catch(err => this.errorHandler(err, reject))
    );

  static PostWithFormUrlencoded = (url, data) =>
    new Promise((resolve, reject) =>
      fetch(url, {
        method: 'post',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data),
      })
        .then(resp => resp.json())
        .then(returnedValue => this.responseHandler(returnedValue, resolve, reject))
        .catch(err => this.errorHandler(err, reject))
    );
}
