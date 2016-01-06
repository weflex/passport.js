
import {
  WeChatProvider,
  Passport
} from '../passport.js';

const wechat = new WeChatProvider({
  appid: 'appid',
  secret: 'secret',
  redirectUri: location.href
});

console.log(wechat);
const passport = new Passport({ wechat });
console.log(passport);

passport.auth('wechat');
