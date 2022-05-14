const Imap = require("imap");
const simpleParser = require('mailparser').simpleParser;

/**
 * 在邮箱服务器中设置 Auto-ban 允许登录尝试错误次数为0，表示可以无限次尝试
 * @param {*} account 
 * @param {*} password 
 * @returns 
 */
 async function imapLogin(account, password) {
    if (!account || !password) {
        return Promise.reject('参数不全');
    }

    var imap = new Imap({
        user: `${account}@tanleidd.fit`,
        password,
        host: 'imap.tanleidd.fit',
        port: 143,  // 虽然 port 跟 tls 都是默认值，但写出来清晰一点
        tls: false
    });
    
    return new Promise ((resolve, reject) => {
        imap.once('ready', function(err) {
            resolve(imap);
        });
        
        imap.once('error', function(err) {
            reject(err)
        });

        imap.connect();
    })
}

async function getBoxes(imap) {
    return new Promise((resolve, reject) => {
        imap.getBoxes((err, boxes)=>{
            if (err) {
                reject(err);
            } else {
                resolve(boxes)
            }
        })
    })
}

// addBox、delBox，可能出现的错误：邮箱已存在、邮箱不存在等，不是很重要，因此打印提示即可，不用向上抛出
async function addBox(imap, mailboxName) {
    return new Promise((resolve, reject) => {
        imap.addBox(mailboxName, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    }).catch(() => console.log('addBox Failed'));
}

async function delBox(imap, mailboxName) {
    return new Promise((resolve, reject) => {
        imap.delBox(mailboxName, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    }).catch(() => console.log('delBox Failed'));
}

async function getMailbox(imap, mailboxName = 'INBOX', options = {}) {
    const { criteria = ['ALL'], bodies = '' } = options;

    return new Promise((resolve, reject) => {
        imap.openBox(mailboxName, (err, box) => {
            if (err) {
                reject(err);
                
                return;
            }
    
            const result = [];
            
            imap.search(criteria, (err, uids) => {
                if (!uids.length) {
                    resolve([]);

                    return;
                }
                
                const imapFetch = imap.fetch(uids, { bodies });
    
                imapFetch.on('message', (message, seq) => {
                    seq--;
    
                    result[seq] = {
                        bodies: '',
                        attributes: null,
                    }
    
                    message.on('body', (stream, info) => {
                        stream.on('data', (chunk) => {
                            result[seq].bodies += chunk.toString();
                        })
                    })
    
                    message.once('attributes', (attributes) => {
                        result[seq].attributes = attributes;
                    })
                })
    
                imapFetch.once('end', async () => {
                    const promises = result.map(item => {
                        return simpleParser(item.bodies)
                    })
                    
                    const parsedMails = (await Promise.all(promises)).map((item, idx) => {
                        item.attributes = result[idx].attributes

                        return item;
                    });

                    parsedMails.sort((a, b) => new Date(b.date) - new Date(a.date))

                    resolve(parsedMails);
                })
            })
    
        })
    })
}

async function moveMail(imap, options) {
    const { from = 'INBOX', to = 'Deleted', uids = [] } = options;

    const mailboxNameMap = {
        INBOX: 'INBOX',
        Send: '已发送',
        Deleted: '已删除'
    }

    return new Promise((resolve, reject) => {
        imap.openBox(mailboxNameMap[from], (err, box) => {
            if (err) {
                reject(err);
                
                return;
            }

            imap.move(uids, mailboxNameMap[to], err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    })
}

async function addFlags(imap, options) {
    const { uids = [], flags = [] } = options;

    return new Promise((resolve, reject) => {
        imap.addFlags(uids, flags, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    })
}

async function delFlags(imap, options) {
    const { uids = [], flags = [] } = options;

    return new Promise((resolve, reject) => {
        imap.delFlags(uids, flags, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    })
}


module.exports = {
    imapLogin,
    getBoxes,
    addBox,
    delBox,
    getMailbox,
    moveMail,
    addFlags,
    delFlags,
}