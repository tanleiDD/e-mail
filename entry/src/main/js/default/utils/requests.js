import http from '@ohos.net.http';
import storageUtil from './storageUtil.js'

// 访问本地不可以用 localhost 或 127.0.0.1，需要查出本机的地址
const BASE_URL = 'http://192.168.31.135:3000'
//const BASE_URL = 'http://192.168.43.14:3000'

export default async function requests (url='', options={}) {
    const httpRequest = http.createHttp();

    url = `${BASE_URL}${url}`;

    const storage = await storageUtil.getStorage('/http_cookies');
    const token = JSON.parse(storage.getSync('token', '{}'));

    let header = {
    };
    // 如果 token 存在
    if (token.key) {
        const baseTime = token.baseTime;
        const maxAge = token['Max-Age'] || 0;

        const expires = (baseTime + maxAge) * 1000;

        if (expires > Date.now()) {
            header = {
                Cookie: token.key + '=' + token[token.key],
                ...header,
            }
        }
    }

    options = {
        extraData: options.data,
        header,
        ...options
    };

    return new Promise ((resolve, reject) => {

        httpRequest.request(url, options, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}