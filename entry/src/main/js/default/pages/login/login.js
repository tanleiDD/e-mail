import router from '@system.router';
import prompt from '@system.prompt';
import apiService from '../../utils/apiService.js'

export default {
    data: {
        account: 'test',
        password: '123.0123',
    },
    handleInput(type, target) {
        this[type] = target.value;
    },
    async handleLogin() {
        if (!this.account || !this.password) {
            prompt.showToast({
                message: '账号密码不能为空',
                duration: 3000,
                bottom: '50%',
            })
            return;
        }

        const res = await apiService.signupLogin({
            account: this.account,
            password: this.password,
        })

        prompt.showToast({
            message: res.result,
            duration: 3000,
            bottom: '50%',
        })

        if (res.responseCode === 200) {
            router.push({
                uri: 'pages/index/index',
            })
        }
    },
    async onInit () {
        // 尝试请求一下，如果 ok 说明已登录，则直接跳转到主页面
        const response = await apiService.getMailboxNames();

        if (response.responseCode === 200) {
            router.push({
                uri: 'pages/index/index',
            })
        }
    },
}
