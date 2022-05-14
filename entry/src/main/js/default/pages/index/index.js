import apiService from '../../utils/apiService.js'

export default {
    data: {
        bars: [
            {
                icon: '/common/images/mail.svg',
                activeIcon: '/common/images/mail-active.svg',
                text: '邮件',
                show: true,
                // icon 大小尺寸不一，需要指定宽高让视觉上自然一些
                iconSize: {
                    width: '32px',
                    height: '32px',
                    margin: '0px',
                },
                activeIconSize: {
                    width: '32px',
                    height: '32px',
                    margin: '0px',
                }
            },
            {
                icon: '/common/images/contacts.svg',
                activeIcon: '/common/images/contacts-active.svg',
                text: '通讯录',
                show: false,
                // icon 大小尺寸不一，需要指定宽高让视觉上自然一些
                iconSize: {
                    width: '36px',
                    height: '36px',
                    margin: '-2px',
                },
                activeIconSize: {
                    width: '32px',
                    height: '32px',
                    margin: '0px',
                }
            },
            {
                icon: '/common/images/profile.svg',
                activeIcon: '/common/images/profile-active.svg',
                text: '我',
                show: false,
                // icon 大小尺寸不一，需要指定宽高让视觉上自然一些
                iconSize: {
                    width: '26px',
                    height: '26px',
                    margin: '3px',
                },
                activeIconSize: {
                    width: '26px',
                    height: '26px',
                    margin: '3px',
                }
            }
        ],
        curMailbox: {
            mailboxName: 'INBOX',
            mails: [],
        },
        index: 0,
    },
    change: function(e) {
        const index = e.index;
        this.index = index;
        let bar;
        for (let i=0; i<this.bars.length; i++) {
            bar = this.bars[i];
            bar.show = false;
        }
        this.bars[index].show = true;
    },
    async getMailbox(mailboxName) {
        const mailboxNameMap = {
            INBOX: apiService.getINBOXMailbox,
            Send: apiService.getSendMailbox,
            Deleted: apiService.getDeletedMailbox,
        }

        const response = await mailboxNameMap[mailboxName]();
        let { result: mails } = response;

        mails = JSON.parse(mails);

        mails = mails.map(mail => {
            const { from: _from, to, subject, date, text, } = mail;
            const { uid, flags } = mail.attributes;

            return {
                text,
                _from: _from.value.map(item => {
                    if (!item.name) {
                        return {
                            name: item.address,
                            address: item.address,
                        }
                    }
                    return item;
                }),
                to: to.value.map(item => {
                    if (!item.name) {
                        return {
                            name: item.address,
                            address: item.address,
                        }
                    }
                    return item;
                }),
                subject,
                date: new Date(date),
                flags,
                uid,
                unread: !flags.includes('\\Seen')
            }
        })

        return mails;
    },

    async fetchMails (mailboxName) {
        const mails = await this.getMailbox(mailboxName);

        this.curMailbox.mails = mails;

        return mails;
    },

    async setMailboxName (mailboxName) {
        this.curMailbox.mailboxName = mailboxName;
    },
    async onShow() {
        await this.fetchMails(this.curMailbox.mailboxName)
    },
    onInit() {
        this.$watch('curMailbox.mailboxName', this.fetchMails)
    }
}
