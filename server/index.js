const express = require("express");
const nodemailer = require("nodemailer");

const dbUtils = require("./databaseUtils");
const constants = require("./constants");
const hmailUtils = require("./hmailUtils");
const imapUtils = require("./imapUtils");
const fs = require("fs");
const formidable = require('formidable');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}))

/**
 * 解决 harmony 提交http请求时的问题：
 * req.body 本应该为 {"account": "tanleidd"}，却被提交为 {'{"account": "tanleidd"}': ''}
 */

 app.use((req, res, next) => {
    const { body = {} } = req;

    const key = Object.keys(body)[0];

    try {
        req.body = JSON.parse(key);
    } catch (error) {}

    next();

})

// 处理身份认证
app.use(async (req, res, next) => {
    if (req.url === '/signup_login' || req.url === '/upload') {
        next();

        return;
    }

    const { rawHeaders } = req;

    let index = rawHeaders.findIndex(item => item === 'Cookie');

    // 没有找到 Cookie
    if (!~index) {
        res.status(constants.AUTHORIZATION_INVALID).send('登录失效');
        
        return;
    }
    
    const cookie = rawHeaders[index+1];

    const cookieObj = cookie.split('; ').reduce((obj, str) => {
        const [k, v] = str.split('=');
        obj[k] = v;

        return obj;
    }, {})

    const token = JSON.parse(cookieObj.token || '{}');
    const { account } = token

    index = imapPool.findIndex(item => item.user.account === account)

    if (~index) {
        req.imap = imapPool[index];

        next();
    } else {
        res.status(constants.AUTHORIZATION_INVALID).send('登录失效');

        return;
    }

})

const router= express.Router()

// imap 连接池，缓存建立的 imap 对象
const imapPool = [];

// 登录/注册 邮箱账号
router.post('/signup_login', async (req, res) => {
    console.log('/signup_login');
    const { account, password } = req.body;

    if (!account || !password) {
        res.status(constants.PARAMS_ERROR).send("参数错误");
        
        return;
    }

    // 检查账号是否存在
    const accountId = hmailUtils.getMailAccountId(account);

    let imap;
    // 存在则判断密码
    if (accountId !== null) {
        // 由于数据库中的密码是加密过的，所以无法进行明文对比
        // 因此这里通过尝试登录的方式进行判断
        try {
            imap = await imapUtils.imapLogin(account, password);
        } catch (error) {
            res.status(constants.AUTHORIZATION_FAILED).send('登录失败');

            return;
        }

    } else {    // 不存在则创建
        hmailUtils.createMailAccount(account, password);
        imap = await imapUtils.imapLogin(account, password);
    }

    // 默认邮箱只有 INBOX 即：收件箱，需要再添加其他信箱
    const boxes = Object.keys(await imapUtils.getBoxes(imap));

    ['已发送', '已删除'].forEach(async (mailboxName) => {
        if (!boxes.includes(mailboxName)) {
            await imapUtils.addBox(imap, mailboxName);
        }
    })

    // 检查一下 account 在不在 user 表里面，不在就插入
    const user = await dbUtils.getUserInfo(account);

    if (!user) {
        dbUtils.upsertUserInfo({
            account,
            name: ''
        })
    }

    // 先找一下连接池里有没有已存在的
    const index = imapPool.findIndex(item => item.user.account === account)

    // 给 imap 添加 user 属性
    imap.user = {
        account,
        password,
    }

    // 没有则直接 push
    if (!~index) {
        imapPool.push(imap)
    } else { // 有则替换
        imapPool.splice(index, 1, imap)
    }

    // 设置身份信息到前端
    res.setHeader('Set-Cookie', `token={"account": "${account}"}; Max-Age=86400; Path=/`).send('登录成功');

})

// 上传文件
router.post('/upload', async (req, res) => {
    console.log('/upload');
    const form = new formidable.IncomingForm();

    form.encoding = 'utf-8';
    form.uploadDir = path.join(__dirname + "./static");
    form.keepExtensions = true;//保留后缀
    // form.maxFieldsSize = 2 * 1024 * 1024;

    //处理图片
    form.parse(req, function (err, fields, files){
        // var filename = files.img.name
        // var nameArray = filename.split('.');
        // var type = nameArray[nameArray.length - 1];
        // var name = '';
        // for (var i = 0; i < nameArray.length - 1; i++) {
        //     name = name + nameArray[i];
        // }
        // name += '.' + type;
        // var newPath = form.uploadDir + "/" + avatarName;

        // fs.renameSync(files.img.path, newPath);  //重命名
        console.log(files);
        res.send({
            code: 200,
            message: "上传成功",
            data: "/static/"+avatarName
        })
    })
})

// 因为 smtp 连接不如 imap 连接常用，因此不给 smtp 创建连接池
router.post('/send', async (req, res) => {
    const { imap } = req;
    const { user } = imap;
    const { account, password } = user;

    const transport = nodemailer.createTransport({
        host: 'smtp.tanleidd.fit',
        port: '25',
        secure: false,
        auth: {
            user: `${account}@tanleidd.fit`,
            pass: password,
        }
    });
  
    const { to, subject, text } = req.body;

    mailOptions={
        from: `${account}@tanleidd.fit`,
        to,
        subject,
        text,
        // attachments: [
        //     {
        //         path: './static/QQ图片20220527130340.jpg'
        //     }
        // ]
    };
  
    transport.sendMail(mailOptions, (err, info) => {
        console.log(err, info);
        if(err) {
            res.status(constants.INTERNAL_SERVER_ERROR).send('发生错误')
        } else {
            res.send('发送成功')
        }
    });

    // 再发一份给自己，并移动到已发送
    mailOptions={
        from: `${account}@tanleidd.fit`,
        to: `${account}@tanleidd.fit`,
        subject,
        text,
    };

    await transport.sendMail(mailOptions);

    const result = await imapUtils.getMailbox(imap, 'INBOX');

    const uids = result.filter(item => {
        const to = item.to.value[0].address;
        const from = item.from.value[0].address;

        return to === from;
    }).map(item => item.attributes.uid)

    await imapUtils.moveMail(imap, {
        from: 'INBOX',
        to: 'Send',
        uids
    })
})

// 获取邮箱账号中存在的信箱名称
router.get('/mailboxNames', async (req, res) => {
    const { imap } = req;

    const mailboxNames = Object.keys(await imapUtils.getBoxes(imap));

    res.send(mailboxNames);
})

// 获取信箱中的邮件
router.get('/mailbox/:mailboxName', async (req, res) => {
    const { imap } = req;
    const { mailboxName = 'INBOX'} = req.params;

    const mailboxNameMap = {
        INBOX: 'INBOX',
        Send: '已发送',
        Deleted: '已删除'
    }

    const result = await imapUtils.getMailbox(imap, mailboxNameMap[mailboxName]);

    // result.forEach(item => {
    //     const { attachments } = item;
        
    //     if (!attachments.length) {
    //         return;
    //     } 

    //     const attachment = attachments[0];
        
    //     fs.writeFile(`./static/${attachment.filename}`, attachment.content, console.log)
    // })
    
    if (mailboxName === 'INBOX') {
        res.send(result.filter(item => {
            const to = item.to.value[0].address;
            const from = item.from.value[0].address;
    
            return to !== from;
        }));
    } else {
        res.send(result)
    }
})


// 移动邮件
router.post('/move/mail', async (req, res) => {
    let { from, to, uids = [] } = req.body;

    if (typeof uids === 'string') {
        uids = JSON.parse(uids || '[]')
    }

    const { imap } = req;

    if (!from || !to || !uids.length) {
        res.status(constants.PARAMS_ERROR).send('参数错误')

        return;
    }

    try {
        await imapUtils.moveMail(imap, {
            from,
            to,
            uids
        })

        res.send('移动成功')
    } catch (error) {
        res.status(constants.INTERNAL_SERVER_ERROR).send('发生错误')
    }


})

// 添加flags
router.post('/add/flags', async (req, res) => {
    const { imap } = req;

    let { uids, flags } = req.body;

    if (typeof uids === 'string') {
        uids = JSON.parse(uids || '[]');
        flags = JSON.parse(flags || '[]');
    }

    flags = flags.map(flag => '\\' + flag);

    if (!uids.length || !flags.length) {
        res.status(constants.PARAMS_ERROR).send('参数错误')

        return;
    }

    try {
        await imapUtils.addFlags(imap, {
            uids,
            flags,
        })

        imap.expunge();

        res.send('添加成功')
    } catch (error) {
        res.status(constants.INTERNAL_SERVER_ERROR).send('发生错误')
    }
})

// 删除flags
router.post('/del/flags', async (req, res) => {
    const { imap } = req;

    let { uids, flags } = req.body;

    if (typeof uids === 'string') {
        uids = JSON.parse(uids || '[]');
        flags = JSON.parse(flags || '[]');
    }

    flags = flags.map(flag => '\\' + flag);

    if (!uids.length || !flags.length) {
        res.status(constants.PARAMS_ERROR).send('参数错误')

        return;
    }

    try {
        await imapUtils.delFlags(imap, {
            uids,
            flags,
        })

        res.send('删除成功')
    } catch (error) {
        res.status(constants.INTERNAL_SERVER_ERROR).send('发生错误')
    }
})

// 获取用户信息
router.get('/user', async (req, res) => {
    const { account } = req.imap.user;

    const user = (await dbUtils.getUserInfo(account)) || {};

    res.send(user);
})

router.post('/update/user', async (req, res) => {
    const { account } = req.imap.user;
    const { name } = req.body;

    dbUtils.upsertUserInfo({
        account,
        name
    })

    res.send('更新成功');
})

// 获取联系人
router.get('/contacts', async (req, res) => {
    const { imap } = req;
    const { user } = imap;
    const { account } = user;

    const { id } = (await dbUtils.getUserInfo(account)) || {};
    const contacts = await dbUtils.getContactsInfo(id)
    
    res.send(contacts);
})

// 添加联系人
router.post('/add/contacts', async (req, res) => {
    const { account } = req.imap.user;
    const { account: contacts_account, name } = req.body;

    const { id } = (await dbUtils.getUserInfo(account));
    
    dbUtils.upsertContactsInfo({
        user_id: id,
        account: contacts_account,
        name,
    })

    res.send('添加成功');
})

// 删除联系人
router.post('/del/contacts', async (req, res) => {
    const { account } = req.imap.user;
    const { account: contacts_account } = req.body;

    const { id } = (await dbUtils.getUserInfo(account)) || {};
    
    dbUtils.delContactsInfo({
        user_id: id,
        account: contacts_account,
    })

    res.send('删除成功');
})

app.use(router);

app.listen(3000)


