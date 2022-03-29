import prompt from '@system.prompt';
export default {
    data() {
        return {
            datas: {
                color_normal: '#878787',
                color_active: '#ff4500',
                show: true,
                list: [{
                           i: 0,
                           color: '#ff4500',
                           show: true,
                           title: 'List1'
                       }, {
                           i: 1,
                           color: '#878787',
                           show: false,
                           title: 'List2'
                       }, {
                           i: 2,
                           color: '#878787',
                           show: false,
                           title: 'List3'
                       }]
            }
        }
    },
    changeTabactive (e) {
        for (let i = 0; i < this.datas.list.length; i++) {
            let element = this.datas.list[i];
            element.show = false;
            element.color = this.datas.color_normal;
            if (i === e.index) {
                element.show = true;
                element.color = this.datas.color_active;
            }
        }
    }
}