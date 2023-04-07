/* eslint-disable no-bitwise */
import CryptoJS from 'crypto-js';

import Global from '../constants/Global';


export default class Cipher {
  static encrypt(data) {
    try {
      const key = CryptoJS.enc.Utf8.parse(Global.ek);
      const iv = CryptoJS.enc.Hex.parse(Cipher.toHexString([11, 22, 33, 44, 99, 88, 77, 66, 11, 22, 33, 44, 99, 88, 77, 66]));
      const result = CryptoJS.AES.encrypt(
        data,
        key,
        {
          iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      return result.toString();
    } catch (err) {
      console.log(err);
      return '';
    }
  }

  static toHexString(byteArray) {
    return Array.from(byteArray, byte => (`0${(byte & 0xff).toString(16)}`).slice(-2)).join('');
  }

  static decrypt(data) {
    try {
      if (!data) return data;
      const key = CryptoJS.enc.Utf8.parse(Global.ek);
      const iv = CryptoJS.enc.Hex.parse(Cipher.toHexString([11, 22, 33, 44, 99, 88, 77, 66, 11, 22, 33, 44, 99, 88, 77, 66]));
      data = CryptoJS.enc.Base64.parse(data);
      const result = CryptoJS.AES.decrypt(
        {
          ciphertext: data
        },
        key,
        {
          iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      return result.toString(CryptoJS.enc.Utf8);
    } catch (err) {
      return '';
    }
  }

  static decryptWithKey(data, key) {
    if (!data) return data;
    // const key = CryptoJS.enc.Utf8.parse(Global.ek)
    const iv = CryptoJS.enc.Hex.parse(Cipher.toHexString([11, 22, 33, 44, 99, 88, 77, 66, 11, 22, 33, 44, 99, 88, 77, 66]));
    data = CryptoJS.enc.Base64.parse(data);
    const result = CryptoJS.AES.decrypt(
      {
        ciphertext: data
      },
      key,
      {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    return result.toString(CryptoJS.enc.Utf8);
  }
}
