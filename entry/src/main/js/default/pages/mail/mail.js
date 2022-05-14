import router from '@system.router';
import apiService from '../../utils/apiService.js'

export default {
    data: {
        mailboxNameMap: {
            INBOX: '收件箱',
            Send: '已发送',
            Deleted: '已删除'
        },
        mailPanelData: [
            {
                icon: '/common/images/received.png',
                activeIcon: '/common/images/received-active.png',
                text: '收件箱',
                mailboxName: 'INBOX',
                show: true,
            },
            {
                icon: '/common/images/send.png',
                activeIcon: '/common/images/send-active.png',
                mailboxName: 'Send',
                text: '已发送',
                show: false,
            },
            {
                icon: '/common/images/deleted.png',
                activeIcon: '/common/images/deleted-active.png',
                text: '已删除',
                mailboxName: 'Deleted',
                show: false,
            }
        ]
    },
    props: {
        // 当前所处的信箱
        curMailbox: {
            default: {
                mailboxName: 'INBOX',
                mails: [],
            }
        },
        setMailboxName: {
            default: name => null,
        }
    },
    handleExpand() {
        this.$element('mail-panel').show();
    },
    handlePanelItemClick(e) {
        const idx = e.target.dataSet.index;

        for (let i=0; i<this.mailPanelData.length; i++) {
            this.mailPanelData[i].show = false;
        }

        this.mailPanelData[idx].show = true;
        this.setMailboxName(this.mailPanelData[idx].mailboxName);

        this.$element('mail-panel').close();
    },

    handleEditClick () {
        router.push({
            uri: 'pages/write_email/write_email'
        })
    },
    async handleMailClick (idx) {
        const mail = this.curMailbox.mails[idx];

        await apiService.addFlags({
            uids: [mail.uid],
            flags: ['Seen'],
        })
        router.push({
            uri: 'pages/read_email/read_email',
            params: {
                mail,
                mailboxName: this.curMailbox.mailboxName,
            }
        })
    },
}
