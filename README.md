# Passport.js

The passport utility library to create request to authorization providers at browser-side.

### Install

```sh
$ npm install @weflex/passport.js
```

### Example

```js
import {
  WeChatProvider,
  Passport
} from '@weflex/passport.js';

const wechat = new WeChatProvider({
  appid: 'appid',
  secret: 'secret',
  redirectUri: location.href
});

// get url for requesting code
const url = wechat.getUrlForCode();
// here you can pass url or set in `location.href`

const passport = new Passport({ wechat });

// directly goto url
await passport.auth('wechat');

// print payload
console.log(passport.payload);
```

### License

MIT Licensed @ WeFlex, Inc
