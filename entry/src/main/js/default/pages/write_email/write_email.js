import router from '@system.router';

export default {
    data: {
        sendMailDisabled: true,
        recipient: '',
    },
    handleRecipientChange (target) {
        if (target.value) {
            this.sendMailDisabled = false;
        } else {
            this.sendMailDisabled = true;
        }

        this.recipient = target.value;
    },
    handlePlaneClick () {

    },
    handleCloseClick () {
        router.back();
    }
}
