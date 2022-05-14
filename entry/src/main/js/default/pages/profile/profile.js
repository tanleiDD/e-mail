import router from '@system.router';
import prompt from '@system.prompt';
import apiService from '../../utils/apiService.js'

export default {
    data: {
        name: '',
        avatar: '/common/images/temp-avatar.jpg',
        namePanelData: {
            saveNameDisabled: true,
            name: '',
        },
        avatarPanelData: {
            saveAvatarDisabled: true,
            avatar: '',
        }
    },
    /* update name start */
    handleNameClick () {
        this.$element('name-panel').show();
    },
    handleCancelNameClick () {
        this.$element('name-panel').close();
    },
    async handleSaveNameClick () {
        this.name = this.namePanelData.name;

        await apiService.updateUser({
            name: this.name
        })
        this.$element('name-panel').close();

        prompt.showToast({
            message: '更新成功',
            duration: 2000,
            bottom: '50%',
        })
    },
    handleNameChange (target) {
        if (target.value) {
            this.namePanelData.saveNameDisabled = false;
        } else {
            this.namePanelData.saveNameDisabled = true;
        }

        this.namePanelData.name = target.value;
    },
    /* update name end */


    /* update avatar start */
    handleAvatarClick () {
        this.$element('avatar-panel').show();
    },
    handleCancelAvatarClick () {
        this.$element('avatar-panel').close();
    },
    handleSaveAvatarClick () {
        this.name = this.avatarPanelData.name;

        this.$element('avatar-panel').close();

        prompt.showToast({
            message: '更新成功',
            duration: 2000,
            bottom: '50%',
        })
    },
    handleAvatarChange (target) {
        if (target.value) {
            this.avatarPanelData.saveNameDisabled = false;
        } else {
            this.avatarPanelData.saveNameDisabled = true;
        }

        this.avatarPanelData.name = target.value;
    },
    /* update avatar end */

    handleLogout () {
        router.push({
            uri: 'pages/login/login'
        })
    },
    async onInit() {
        const response = await apiService.getUser();
        const user = JSON.parse(response.result);

        if (user) {
            this.name = user.name;
        }
    }
}
