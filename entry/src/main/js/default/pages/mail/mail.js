import router from '@system.router';

export default {
    data: {
        msg: 'loading',
        count: 0,
        // 当前所处的信箱
        curMail: {
            title: '收件箱',
        },
        mailPanelData: [
            {
                icon: '/common/images/received.png',
                activeIcon: '/common/images/received-active.png',
                text: '收件箱',
                show: true,
            },
            {
                icon: '/common/images/send.png',
                activeIcon: '/common/images/send-active.png',
                text: '已发送',
                show: false,
            },
            {
                icon: '/common/images/deleted.png',
                activeIcon: '/common/images/deleted-active.png',
                text: '已删除',
                show: false,
            }
        ]
    },
    handleExpand() {
        this.count++;
        this.$element('mail-panel').show();
    },
    handlePanelItemClick(e) {
        const idx = e.target.dataSet.index;

        for (let i=0; i<this.mailPanelData.length; i++) {
            this.mailPanelData[i].show = false;
        }

        this.mailPanelData[idx].show = true;
        this.curMail = {
            title: this.mailPanelData[idx].text,
        }

        this.$element('mail-panel').close();
    },

    handleEditClick () {
        router.push({
            uri: 'pages/write_email/write_email'
        })
    },
    handleMailClick () {
        router.push({
            uri: 'pages/read_email/read_email'
        })
    }

}
