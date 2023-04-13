/* eslint-disable camelcase */
/* eslint-disable no-restricted-globals */
import Global from '../constants/Global';
import Cipher from './Cipher';
import $ from 'jquery';

export const refreshToken = () => {
  // get new access token
}


export const parseJSONtoParam = obj => {
  const str = [];
  for (const key in obj) {
    str.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
  }
  return str.join('&');
};

export const getUrlParameter = name => {
  const urlParams = new URLSearchParams(location.search);
  if (urlParams.has(name)) return urlParams.get(name);
  return '';
};

export const validURL = str => {
  const pattern = new RegExp('^(https?:\\/\\/)?' // protocol
    + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
    + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
    + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
    + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
    + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
};

export const encryptData = data => {
  let result = data || '';
  if (data && data.constructor !== String && data.constructor !== FormData) {
    result = JSON.stringify(data);
  }
  if (Global.isEncrypt) {
    return Cipher.encrypt(result);
  }
  return result;
};

export const decryptData = data => {
  if (Global.isEncrypt) {
    return JSON.parse(Cipher.decrypt(data));
  }
  return data;
};


export const getCurrHost = () => {
  const curr = window.location.host;
  if (curr) {
    if (curr.indexOf('www.') === 0) {
      return `${curr.replace('www.', '')}_`;
    }
    return `${curr}_`;
  }
  return '';
};
export const readCookie = name => {
  let ck = document.cookie;
  if (ck) {
    ck = ck.split('; ');
    if (ck && ck.length > 0) {
      const nameLen = name.length + 1;
      for (let i = ck.length - 1; i >= 0; i--) {
        let item = ck[i];
        if (item && item.indexOf(name) === 0) {
          item = item.substring(nameLen, item.length);
          if (item) {
            item = item.replace(/["']/g, '');
            return item;
          }
        }
      }
    }
  }
  return null;
};


export const getMobileOperatingSystem = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/windows phone/i.test(userAgent)) {
    return 'Windows Phone';
  }

  if (/android/i.test(userAgent)) {
    return 'Android';
  }
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'iOS';
  }

  return 'unknown';
};

export const iOSversion = () => {
  if (/iP(hone|od|ad)/.test(navigator.platform)) {
    // supports iOS 2.0 and later: <http://bit.ly/TJjs1V>
    const v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
    const vers = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
    return vers[0];
  }
  return 0;
};


export const getChildrenCategoryByParentCateSlug = (cates, name) => {
  const cate = cates.find(item => item.slug === name);
  if (!cate || !cate.id) return [];
  const list = cates.filter(item => item.parent === cate.id && item.count > 0);
  return list || [];
};


export const isIncludeSpecialChar = str => {
  const regex = /[!@#$%^&*(),.?":{}|<>]/g;
  return regex.test(str);
};


export const formatNumber = number => number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');


export function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  // const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: 'image/png' });
}

export const isBase64Image = image => image?.search(/^data:image\/(png|jpg);base64,/) >= 0 ?? false;

export const getBase64Image = imgUrl => new Promise(resolve => {
  const img = new Image();

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    let dataURL = canvas.toDataURL('image/png');
    dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, '');

    resolve(dataURL);
  };
  // set attributes and src
  img.setAttribute('crossOrigin', 'anonymous'); //
  img.src = imgUrl;
});


export const urlToFile = (url, filename, mimeTypeConfig) => new Promise((resolve, reject) => {
  const mimeType = mimeTypeConfig || (url.match(/^data:([^;]+);/) || '')[1];
  return fetch(url)
    .then(res => res.arrayBuffer())
    .then(buf => resolve(new File([buf], filename, { type: mimeType })))
    .catch(err => reject(err));
});


export const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});


export function validateUploadImg(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) return 'You can only upload JPG/PNG file!';
  const isLt2M = file.size / 1024 < 5 * 1024;
  if (!isLt2M) return 'Image must smaller than 5MB!';
  return '';
}


export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getFileSizeToMB(file) {
  if (!file || !file.size) return 0;
  return Math.ceil(file.size / 1024) / 1000;
}


export function getAudioDuration(src) {
  return new Promise((resolve => {
    const audio = new Audio();
    $(audio).on('loadedmetadata', () => {
      resolve(audio.duration);
    });
    audio.src = src;
  }));
}


export const toMMSS = time => {
  const sec_num = parseInt(time, 10); // don't forget the second param
  let minutes = Math.floor((sec_num - (sec_num * 3600)) / 60);
  let seconds = sec_num - (minutes * 60);

  if (minutes < 10) { minutes = `0${minutes}`; }
  if (seconds < 10) { seconds = `0${seconds}`; }
  return `${minutes}:${seconds}`;
};
