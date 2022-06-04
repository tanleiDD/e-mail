import router from '@system.router';
import prompt from '@system.prompt';
import apiService from '../../utils/apiService.js'
import document from '@ohos.document';
import request from '@ohos.request';
import { BASE_URL } from '../../utils/requests.js';

export default {
    data: {
        uri: '',
        name: '',
        avatarUri: '/common/images/temp-avatar.jpg',
        namePanelData: {
            saveNameDisabled: true,
            name: '',
        },
        avatarPanelData: {
            saveAvatarDisabled: true,
            uri: '/common/images/temp-avatar.jpg',
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
        this.avatarPanelData.uri = this.avatarUri;;
        this.$element('avatar-panel').close();
    },
    handleSaveAvatarClick () {
        this.avatarUri = this.avatarPanelData.uri;
        this.$element('avatar-panel').close();

        prompt.showToast({
            message: '更新成功',
            duration: 2000,
            bottom: '50%',
        })
    },

    /* update avatar end */

    handleLogout () {
        router.push({
            uri: 'pages/login/login'
        })
    },
    handleCameraClick () {
        this.$element('shoot-panel').show();
    },
    handleCameraClose () {
        this.$element('shoot-panel').close();
    },
    setAvatarUri (uri) {
        this.avatarPanelData.uri = uri;
    },
    async handleAlbumClick () {
        const uri =  await document.choose(['*']);
        this.avatarPanelData.uri = uri;
        console.log(uri)
    },
    async onInit() {
        const response = await apiService.getUser();
        const user = JSON.parse(response.result);

        if (user) {
            this.name = user.name;
        }
    },
    computed: {
        isAvatarChange () {
            return this.avatarUri !== this.avatarPanelData.uri;
        }
    }
}
