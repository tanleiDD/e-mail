import router from '@system.router';

export default {
    data: {
    },
    handleLogout() {
        router.push({
            uri: 'pages/login/login'
        })
    }
}
