"use strict";

import Url from 'url';

class BaseProvider {
  constructor(config) {
    this.config = config;
  }
  requestForCode() {
    throw new TypeError('not implemented');
  }
  requestForAccessToken(code) {
    throw new TypeError('not implemented');
  }
  requestForProfile(openid, accessToken) {
    throw new TypeError('not implemented');
  }
}

class WeChatProvider extends BaseProvider {
  constructor(config) {
    super(config);
    if (!config.appid) {
      throw new TypeError('appid required');
    }
    if (!config.secret) {
      throw new TypeError('secret required');
    }
    if (!config.redirectUri) {
      throw new TypeError('redirectUri required');
    }
    if (!config.scope) {
      config.scope = 'snsapi_base';
    }
    if (!config.state) {
      config.state = (Math.random() * 100) + '';
    }
  }
  getUrlForCode(state) {
    return 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
      `appid=${this.config.appid}&` +
      `redirect_uri=${this.config.redirectUri}&` +
      `response_type=code&` +
      `scope=${this.config.scope}&` +
      `state=${state || this.config.state}` +
      '#wechat_redirect';
  }
  requestForCode() {
    location.href = this.getUrlForCode();
  }
  async requestForAccessToken(code) {
    const url = 'https://api.weixin.qq.com/sns/oauth2/access_token?' + 
      `appid=${this.config.appid}&` +
      `secret=${this.config.secret}&` +
      `code=${code}&` +
      `grant_type=authorization_code`;
    const response = await fetch(url);
    if (response.status !== 200) {
      throw new Error(response.json());
    } else {
      return response.json();
    }
  }
  async requestForProfile(openid, accessToken) {
    if (this.config.scope !== 'snsapi_userinfo') {
      let err = new TypeError('you need use scope: snsapi_userinfo');
      console.warn(err);
      return;
    }
    const url = 'https://api.weixin.qq.com/sns/userinfo?access_token=' +
      accessToken + '&openid=' + openid + '&lang=zh_CN';
    const response = await fetch(url);
    if (response.status !== 200) {
      throw new TypeError(response.json());
    } else {
      return response.json();
    }
  }
}

class Passport {
  constructor(providers) {
    this.providers = providers;
    this.payload = {
      openid: null,
      accessToken: null,
      refreshToken: null,
      profile: null
    };
  }
  getAuthUrl(name) {
    return this.providers[name] && this.providers[name].requestForCode();
  }
  async auth(name) {
    const provider = this.providers[name];
    if (!(provider instanceof BaseProvider)) {
      throw new TypeError('Unknown provider with' + name);
    }
    const { query } = Url.parse(location.href, true);
    if (!query) {
      throw new TypeError('query required to be an object');
    }
    if (!query.code) {
      provider.requestForCode();
    } else {
      const tokens = await provider.requestForAccessToken();
      this.payload.openid = tokens['openid'];
      this.payload.accessToken = tokens['access_token'];
      this.payload.refreshToken = tokens['refresh_token'];
      this.payload.profile = await provider.requestForProfile(
        this.payload.openid, this.payload.accessToken);
      return this;
    }
  }
}

module.exports = {
  BaseProvider,
  WeChatProvider,
  Passport
};
