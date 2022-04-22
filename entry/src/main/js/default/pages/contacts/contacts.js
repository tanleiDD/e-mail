import prompt from '@system.prompt';
import router from '@system.router';

export default {
    data: {
        contacts: [
            {
                title: 'A',
                mails: [
                    'acfun@163.com',
                    'abc@163.com',
                    'acfun@163.com',
                    'abc@163.com',
                    'acfun@163.com',
                    'abc@163.com',
                    'acfun@163.com',
                    'abc@163.com',
                ]
            },
            {
                title: 'E',
                mails: [
                    'acfun@163.com',
                    'abc@163.com',
                    'acfun@163.com',
                    'abc@163.com',
                ]
            },
            {
                title: 'I',
                mails: [
                    'acfun@163.com',
                    'abc@163.com',
                    'acfun@163.com',
                    'abc@163.com',
                ]
            },
            {
                title: 'J',
                mails: [
                    'acfun@163.com',
                    'abc@163.com',
                    'acfun@163.com',
                    'abc@163.com',
                ]
            },
        ],
        contactsPanelData: {
            saveDisabled: true,
            accountName: '', // 名称
            mailAccount: '', // 账号
        }
    },
    /* add user start */
    handleAddUserClick () {
        this.contactsPanelData.saveDisabled = true;
        this.$element('contacts-panel').show();
    },
    handleCancelClick () {
        this.$element('contacts-panel').close();
    },
    handleSaveClick () {
        // 发送请求将受控组件的值保存到数据库

        this.$element('contacts-panel').close();

        prompt.showToast({
            message: '添加成功',
            duration: 2000,
            bottom: '50%',
        })
    },
    handleAccountNameChange (target) {
        this.contactsPanelData.mailAccount = target.value;
    },
    handleMailAccountChange (target) {
        if (target.value) {
            this.contactsPanelData.saveDisabled = false;
        } else {
            this.contactsPanelData.saveDisabled = true;
        }

        this.contactsPanelData.mailAccount = target.value;
    },
    /* add user end */

    /* contacts item start */
    handleContactsItemClick () {
      this.$element('contacts-item-panel').show()
    },
    handleCancelContactsItemClick () {
        this.$element('contacts-item-panel').close();
    },
    /* contacts item end */
    handleSendMailClick (){
        router.push({
            uri: 'pages/write_email/write_email'
        })
    }
}
