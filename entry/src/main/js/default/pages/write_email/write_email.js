import router from '@system.router';
import apiService from '../../utils/apiService.js'
import prompt from '@system.prompt';
import document from '@ohos.document';

export default {
    data: {
        to: '',
        subject: '',
        text: '',
        mail: null,
        attachments: []
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
    async handleContinueAbility () {
        const {to, subject, text} = this;
        const result = await FeatureAbility.getDeviceList();
        const networkId = result.data[0].networkId

        const target = {
            bundleName: "com.tanleidd.email",
            abilityName: "com.tanleidd.email.MainAbility",
            networkId,
            url: "pages/write_email/write_email",
            data: {
                to,
                subject,
                text,
            }
        };

        await FeatureAbility.startAbility(target);
    },
    async handleChooseAttachment () {
        const uri =  await document.choose(['*']);

        this.attachments.push(uri);
    },
    handleDelAttach () {
      this.attachments.pop();
    },
    onInit() {
        const { mail } = this;
        if ( mail ) {
            this.to = mail.account;
        }
    }
}
