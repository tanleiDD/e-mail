const sqlite = require("sqlite3");

const DATABASE_FILENAME = "sqliteDB.db";

// 创建并打开数据库，若已存在则仅打开
const db = new sqlite.Database(DATABASE_FILENAME, sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE)

db.serialize(() => {
    // 创建 users 表
    db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            account TEXT,
            name TEXT
        );`
    )

    // 创建 contacts 表，并添加联合主键
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
            user_id INT NOT NULL,
            account TEXT NOT NULL,
            name TEXT
        );
        
        CREATE UNIQUE INDEX IK_CONTACTS ON contacts (
            user_id,
            account
        );`
    )
    
})

function getUserInfo (account) {
    return new Promise ((resolve, reject) => {
        if (!account) {
            resolve();
        }
        db.get(`SELECT * FROM users WHERE account = $account`, {
            $account: account,
        }, (err, row) => {
            if (err) {
                reject(err)
            } else {
                resolve(row)
            }
        })
    })
}

function upsertUserInfo (values) {
    const {
        account,
        name = '',
    }  = values || {};

    if (!account) {
        return;
    }

    db.get(`SELECT * FROM users WHERE account = $account`, {
        $account: account,
    }, (err, row) => {
        // 不存在则 insert，存在则 update
        if (!row) {
            db.run(`INSERT INTO users (account, name) VALUES($account, $name)`, {
                $account: account,
                $name: name,
            })
        } else {
            db.run(`UPDATE users SET name=$name WHERE account=$account`, {
                $account: account,
                $name: name,
            })
        }
    })
}

function getContactsInfo (user_id) {
    return new Promise ((resolve, reject) => {
        if (!user_id) {
            resolve()
        }
        db.all(`SELECT * FROM contacts WHERE user_id = $user_id`, {
            $user_id: user_id,
        }, (err, row) => {
            if (err) {
                reject(err)
            } else {
                resolve(row)
            }
        })
    })
}

function upsertContactsInfo (values) {
    const {
        user_id,
        account,
        name,

    }  = values || {};

    if (!user_id || !account) {
        return;
    }

    db.get(`SELECT * FROM contacts WHERE user_id=$user_id AND account=$account`, {
        $user_id: user_id,
        $account: account
    }, (err, row) => {
        // 不存在则 insert，存在则 update
        if (!row) {
            db.run(`INSERT INTO contacts (user_id, account, name) VALUES($user_id, $account, $name)`, {
                $user_id: user_id,
                $account: account,
                $name: name
            })
        } else {
            db.run(`UPDATE contacts SET account=$account, name=$name WHERE user_id=$user_id AND account=$account`, {
                $user_id: user_id,
                $account: account,
                $name: name || row.name
            })
        }
    })
}

function delContactsInfo (values) {
    const {
        user_id,
        account
    } = values || {}
    return new Promise ((resolve, reject) => {
        if (!user_id) {
            resolve()
        }
        db.run(`DELETE FROM contacts WHERE user_id = $user_id AND account=$account`, {
            $user_id: user_id,
            $account: account,
        }, err => {
            if (!err) {
                resolve();
            } else {
                reject();
            }
        })
    })
}

module.exports = {
    getUserInfo,
    upsertUserInfo,
    getContactsInfo,
    upsertContactsInfo,
    delContactsInfo
}