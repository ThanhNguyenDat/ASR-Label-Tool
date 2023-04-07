

class Global {
    static instance;
  
    constructor() {
      if (Global.instance) {
        return Global.instance;
      }
  
      this.ek = '';
      this.token = '';
      this.isEncrypt = '';
      this.versionCode = 0;
      this.platform = '';
      this.isNewVersion = false;
      if (process.env.NODE_ENV === 'development') {
        this.token = 'v2_m2pfGX+YmSgYcM6CeTy+flWCNhia0JZCVH/JER96pujdwW8Sav3RJ0yj8POUIkWXnG+cw6U6DxmcgcjXKY5k+w==';
      }
      Global.instance = this;
    }
  
    setEK = ek => {
      this.ek = ek;
    }
  
    setIsEncrypt = isEncrypt => {
      this.isEncrypt = isEncrypt;
    }
  
    setToken = token => {
      this.token = token;
    }
  
    setPlatfrom = platform => this.platform = platform;
  
    setIsNewVersion = isNewVersion => this.isNewVersion = isNewVersion;
  
    getCurrHost = () => {
      const curr = window.location.host;
      if (curr) {
        if (curr.indexOf('www.') === 0) {
          return `${curr.replace('www.', '')}_`;
        }
        return `${curr}_`;
      }
      return '';
    };
  
    readCookie = name => {
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
  
    readCookieByDomain = name => this.readCookie(this.getCurrHost() + name)
  
    readCookieFallback = (name = 'zacc_session') => {
      let ck = this.readCookieByDomain(name);
      if (!ck) {
        ck = this.readCookie(`zalo.me_${name}`);
      }
      if (!ck) {
        return this.readCookie(name);
      }
      return ck;
    }
  
    getAccessTokenFromCookie = () => {
      const accessToken = this.readCookieFallback();
      if (accessToken) return accessToken;
    }
  
    getVersionCodeFromCookie = (name = 'zversion') => this.readCookieFallback(name)
  
    getIsNewVersionFromCookie = (name = 'new_version') => this.readCookieFallback(name)
  
    setVersionCode = version => this.versionCode = version;
  }
  
  
  export default (new Global());
  