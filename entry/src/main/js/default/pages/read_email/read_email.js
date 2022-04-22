import router from '@system.router';

export default {
    data: {
        msg: '',
    },
    handleBackClick () {
        router.back();
    },
    async handleDeleteClick () {
        var actionData = {};
        var action = {};
        action.bundleName = 'com.tanleidd.email';
        action.abilityName = '.ServiceAbility';
        action.messageCode = 1001;
        action.data = actionData;
        action.abilityType = 0;
        action.syncOption = 0;
        var result = await FeatureAbility.callAbility(action);
        var ret = JSON.parse(result);
        if (ret.code == 0) {
            console.log(ret);
        } else {
            console.error(JSON.stringify(ret.code));
        }
        this.msg = ret.deviceType;

    }
}
