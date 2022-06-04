import prompt from '@system.prompt';
import router from '@system.router';

export default {
    data: {
        deviceposition: 'back',
        avatarUri: '',
    },
    props: {
        setAvatarUri: {
            default: uri => null,
        },
        closeCamera: {
            default: () => null,
        }
    },
    cameraError(){
        prompt.showToast({
            message: "授权失败！"
        });
    },
    handleShootClick () {
        if (this.avatarUri) {
            this.setAvatarUri(this.avatarUri);
            this.avatarUri = '';
            this.closeCamera();

            return;
        }

        const camera = this.$refs.camera;

        camera.takePhoto({
            quality: 'high',
            success: async (data) => {
                const { uri } = data;
                this.avatarUri = uri;
                console.log(uri);
            }
        })
    },
    handleBackClick () {
        if (this.avatarUri) {
            this.avatarUri = '';
        } else {
            this.closeCamera();
        }
    },

    handleReverseClick () {
        this.deviceposition = this.deviceposition === 'back'
            ? this.deviceposition = 'front'
            : this.deviceposition = 'back'
    },
    onInit() {
        console.log('test')
    }
}