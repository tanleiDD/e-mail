import router from '@system.router';
import prompt from '@system.prompt';
import apiService from '../../utils/apiService.js'

export default {
    data: {
        msg: '',
    },
    onInit() {
    },
    formatDate(date) {
        // mail 页面传过来的 params 里面的 date，被转成字符串了，因此还需要 new 一下
        date = new Date(date);

        return (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
    },
    handleBackClick () {
        router.back();
    },

    async handleDeleteClick () {
        // 如果是在已删除信箱，就从服务器彻底删除
        if (this.mailboxName === 'Deleted') {
            await apiService.addFlags({
                uids: [this.mail.uid],
                flags: ['Deleted'],
            })
        } else {
            await apiService.moveMail({
                from: this.mailboxName,
                to: 'Deleted',
                uids: [this.mail.uid],
            })
        }

        prompt.showToast({
            message: '删除成功',
            duration: '2000',
            bottom: '50%'
        })

        router.back();
    },
}
