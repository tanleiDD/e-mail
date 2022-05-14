import storageUtil from './storageUtil.js';
import requests from './requests.js';
import prompt from '@system.prompt';
import router from '@system.router';

async function signupLogin(data) {
    const promise = requests('/signup_login', {
        method: 'POST',
        data,
    })

    const response = await promise;
    const { header } = response;
    // header 是 string，用正则把 cookie 取出来
    const cookies = JSON.parse(header.match(/"Set-Cookie":(\[".+?"\])/)[1])

    const storage = await storageUtil.getStorage(`/http_cookies`);

    cookies.forEach(cookie => {
        cookie = cookie.replace(/ /g, '');
        const kvReg = /.+?=.+?;/g;
        // 去掉末尾的 ;
        const kvList = cookie.match(kvReg).map(item => item.replace(/;$/, ''));

        const obj = {};
        kvList.forEach((item, idx) => {

            const [key, value] = item.split('=');
            // 该条 cookie 的 键名
            if (idx === 0) {
                obj.key = key;
                // 顺便再添加一条当前时间，跟 Max-Age 配合计算出 cookie 的过期时间
                obj.baseTime = ~~(Date.now() / 1000)
            }
            obj[key] = value;
        })

        // 存储在本地
        storage.putSync(obj.key, JSON.stringify(obj));
        storage.flushSync();
    })

    return promise;
}

function getMailboxNames () {
    return requests('/mailboxNames', {
        method: 'GET',
    })
}

// 收件箱
function getINBOXMailbox () {
    return requests('/mailbox/INBOX', {
        method: 'GET',
    })
}

// 发件箱/已发送
function getSendMailbox () {
    return requests('/mailbox/Send', {
        method: 'GET',
    })
}

// 已删除
function getDeletedMailbox () {
    return requests('/mailbox/Deleted', {
        method: 'GET',
    })
}

// 移动邮件
function moveMail (data) {
    return requests('/move/mail', {
        method: 'POST',
        data
    })
}

// 删除flag
function delFlags (data) {
    return requests('/del/flags', {
        method: 'POST',
        data,
    })
}

// 删除flag
function addFlags (data) {
    return requests('/add/flags', {
        method: 'POST',
        data,
    })
}

function sendMail (data) {
    return requests('/send', {
        method: 'POST',
        data,
    })
}
function getUser() {
    return requests('/user', {
        method: 'GET',
    })
}
function updateUser (data) {
    return requests('/update/user', {
        method: 'POST',
        data,
    })
}

function getContacts () {
    return requests('/contacts', {
        method: 'GET',
    })
}

function addContacts (data) {
    return requests('/add/contacts', {
        method: 'POST',
        data
    })
}

function delContacts (data) {
    return requests('/del/contacts', {
        method: 'POST',
        data
    })
}



export default {
    signupLogin,
    getMailboxNames,
    getINBOXMailbox,
    getSendMailbox,
    getDeletedMailbox,
    moveMail,
    addFlags,
    delFlags,
    sendMail,
    getUser,
    updateUser,
    getContacts,
    addContacts,
    delContacts
}