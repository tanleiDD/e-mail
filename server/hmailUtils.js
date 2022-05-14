const execSync = require("child_process").execSync;

function getMailAccountId (account) {
    if (!account) {
        return null;
    }

    const command = `cscript -nologo ./vbs/get_mail_account_id.vbs ${account}`
    // 获取结果，并去掉尾部多余回车
    const result = execSync(command).toString().replace(/\s+$/, '');
    
    // 如果是 数字，表示获取了正确 id
    if (/^\d+$/.test(result)) {
        return Number(result);
    }

    return null;
}

function createMailAccount (account, password) {
    if (!account || !password) {
        return;
    }

    const command = `cscript -nologo ./vbs/create_mail_account.vbs ${account} ${password}`
    execSync(command)
}

module.exports = {
    getMailAccountId,
    createMailAccount,
}