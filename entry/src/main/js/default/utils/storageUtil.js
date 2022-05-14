import dataStorage from '@ohos.data.storage'
import featureAbility from '@ohos.ability.featureAbility'

export default {
    /**
     *
     * @param path = '/'， path 不支持多级路径，如: /http/cookies，约定用 _ 表示多级，如 /http_cookies
     */
    async getStorage (path = '/') {
        const context = featureAbility.getContext();
        const dir = await context.getFilesDir();

        const storage = dataStorage.getStorageSync(dir + path);

        return storage;
    }
}