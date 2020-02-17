let hub = new Vue();
let vm = new Vue({
    el: '#app',
    data() {
        return {
            lists: [],
            search: ''
        }
    },
    methods: {
        quclick(id) {
            b = this.huqu(id)
            hub.$emit('f', b)
        },
        qusclick(id) {
            b = this.huqu(id)
            hub.$emit('f', b)
        },
        // 文章搜索
        searchclick(search) {
            if (search == '') {
                alert('输入内容为空')
            } else {
                b = this.huqu(search)
                hub.$emit('f', b)
                this.search = ''
            }
        },
        huqu(id) {
            var b;
            $.ajax({
                type: 'get',
                url: 'http://localhost:8080/api/v1/index/search',
                dataType: 'json',
                async: false,
                data: {
                    page: 1,
                    perpage: 6,
                    key: id
                },
                success: (backData) => {
                    if (backData.code == 200) {
                        b = backData.data.data;
                    }
                }
            })
            return b;
        }
    },
    created() {
        axios.get('http://localhost:8080/api/v1/index/category').then(({
            data: res
        }) => {
            // console.log(res);
            if (res.code == 200) {
                this.lists = res.data;
            }
        })
    },
    components: {
        'cpa': {
            template: '#cpa',
            data() {
                return {
                    list: []
                }
            },
            methods: {
            },
            mounted() {
                hub.$on('f', (b) => {
                    this.list = b;
                });
            },
            created() {
                let value1 = location.href.split('=')[1];
                let value2 = location.href.split('=')[0];
                if (value2 == '') return location.href = './list.html';
                if (value2 == '?id') {
                    // 调用父组件中的函数
                    this.list = this.$parent.huqu(value1);
                } else {
                    value1 = decodeURI(value1);
                    this.list = this.$parent.huqu(value1);
                    console.log(this.list);
                }
                this.$nextTick(() => {
                    // 这个是分页的插件
                        $("#pagination").pagination({
                            currentPage: 1,
                            totalPage: 5,
                            callback: (current) => {
                                console.log(current);//点击谁打印出来的页码
                                $.ajax({
                                    type: 'get',
                                    url: 'http://localhost:8080/api/v1/index/search',
                                    dataType: 'json',
                                    async: false,
                                    data: {
                                        page: current,
                                        perpage: 6,
                                        key: value1
                                    },
                                    success: (backData) => {
                                        if (backData.code == 200) {
                                            this.list = backData.data.data;
                                        }
                                    }
                                })
                            }
                        });
                })
            },
        },
        'cpc': {
            template: '#cpc',
            data() {
                return {
                    list: [],
                    // 存类名
                    classs: ['first', 'second', 'third']
                }
            },
            created() {
                // 页面一加载发送ajax 请求渲染页面  
                axios.get('http://localhost:8080/api/v1/index/rank').then(({
                    data: res
                }) => {
                    // console.log(res);
                    if (res.code == 200) {
                        this.list = res.data;
                    }
                })
            },
        },
        'cpd': {
            template: '#cpd',
            data() {
                return {
                    list4: [],
                }
            },
            created() {
                // 页面一加载发送ajax 请求渲染页面  
                axios.get('http://localhost:8080/api/v1/index/latest_comment').then(({
                    data: res
                }) => {
                    // console.log(res);
                    if (res.code == 200) {
                        this.list4 = res.data;
                    }
                })
            },
        },
        'cpe': {
            template: '#cpe',
            data() {
                return {
                    list5: [],
                }
            },
            created() {
                // 页面一加载发送ajax 请求渲染页面  
                axios.get('http://localhost:8080/api/v1/index/attention').then(({
                    data: res
                }) => {
                    // console.log(res);
                    if (res.code == 200) {
                        this.list5 = res.data;
                    }
                })
            },
        }
    }
});