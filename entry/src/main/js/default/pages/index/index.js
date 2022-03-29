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
    },
    change: function(e) {
        const index = e.index;
        let bar;
        for (let i=0; i<this.bars.length; i++) {
            bar = this.bars[i];
            bar.show = false;
        }
        this.bars[index].show = true;
    },
}
