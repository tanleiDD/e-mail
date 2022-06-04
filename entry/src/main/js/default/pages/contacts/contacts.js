import prompt from '@system.prompt';
import router from '@system.router';
import apiService from '../../utils/apiService.js'

export default {
    data: {
        contacts: [],
        contactsPanelData: {
            name: '', // 名称
            account: '', // 账号
        },
        curContact: null, // 当前选中的联系人
    },
    props: {
        index: {
            default: 0,
        }
    },
    /* add user start */
    handleAddUserClick () {
        this.$element('contacts-panel').show();
    },
    handleCancelClick () {
        this.$element('contacts-panel').close();
    },
    async handleSaveClick () {
        // 发送请求将受控组件的值保存到数据库
        const { account, name } = this.contactsPanelData;

        if (!account || !name) {
            prompt.showToast({
                message: '参数不全',
                duration: 2000,
                bottom: '50%',
            })

            return;
        }
        await apiService.addContacts({
            account,
            name
        })

        this.fetchContacts()

        this.$element('contacts-panel').close();

        prompt.showToast({
            message: '添加成功',
            duration: 2000,
            bottom: '50%',
        })
    },
    handleInput(e) {
        const { field } = e.target.dataSet;
        this.contactsPanelData[field] = e.value;
    },
    /* add user end */

    /* contacts item start */
    handleContactsItemClick (e) {
        const { mail } = e.target.dataSet;
        this.curContact = mail;

        this.$element('contacts-item-panel').show()
    },
    handleCancelContactsItemClick () {
        this.curContact = null;
        this.$element('contacts-item-panel').close();
    },
    /* contacts item end */
    handleSendMailClick (){
        router.push({
            uri: 'pages/write_email/write_email',
            params: {
                mail: this.curContact,
            }
        })
    },
    async handleDelContacts () {
        await apiService.delContacts({
          account: this.curContact.account,
        })

        this.fetchContacts();

        this.handleCancelContactsItemClick()

        prompt.showToast({
            message: '删除成功',
            duration: 2000,
            bottom: '50%',
        })
    },
    async fetchContacts() {
        const response = await apiService.getContacts();
        const contacts = JSON.parse(response.result);

        // 将 contacts 分下组
        let groupedContacts = [];

        for (let i=97; i<97+26; i++) {
            groupedContacts.push({
                title: String.fromCharCode(i).toUpperCase(),
                mails: []
            });
        }

        for (let i=48; i<48+10; i++) {
            groupedContacts.push({
                title: String.fromCharCode(i),
                mails: []
            });
        }

        groupedContacts.push({
            title: '其他',
            mails: []
        });

        contacts.forEach(contact => {
            const { account, name } = contact;

            const charCode = account.toLowerCase().charCodeAt(0);

            let idx;

            if (charCode >= 97 && charCode <= 97 + 26) {
                idx = charCode - 97;
            } else if (charCode >=48 && charCode <= 48 + 10){
                idx = charCode - 48 + 26;
            } else {
                idx = 36;
            }

            groupedContacts[idx].mails.push({
                account,
                name
            })
        })

        groupedContacts = groupedContacts.filter(item => {
            return item.mails.length;
        })

        this.contacts = groupedContacts;

        if (this.index === 1) {
            this.$element('list').expandGroup({})
        }

    },
    onInit() {
        this.$watch('index', (index) => {
            if (index === 1) {
                this.fetchContacts();
            }
        });
    }

}
