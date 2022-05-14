import router from '@system.router';
import apiService from '../../utils/apiService.js'
import prompt from '@system.prompt';

export default {
    data: {
        to: '',
        subject: '',
        text: '',
        mail: null,
    },
    handleInput(e) {
        const { field } = e.target.dataSet;
        this[field] = e.value;
    },

    async handlePlaneClick () {
        const {to, subject, text} = this;

        if (!to || !subject || !text) {
            prompt.showToast({
                message: '参数不全',
                duration: 2000,
                bottom: '50%'
            })
            return;
        }



        const response = await apiService.sendMail({
            to,
            subject,
            text,
        })

        if (response.responseCode === 200) {
            prompt.showToast({
                message: '发送成功',
                duration: 2000,
                bottom: '50%'
            })

            router.back();
        }
    },
    handleCloseClick () {
        router.back();
    },
    onInit() {
        const { mail } = this;
        if ( mail ) {
            this.to = mail.account;
        }
    }
}
