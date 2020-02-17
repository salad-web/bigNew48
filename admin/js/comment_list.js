let vm = new Vue({
    el: '#app',
    data() {
        return {
        }
    },
    components: {
        'cpn': {
            template: '#cpn',
            data() {
                return {
                    list: [],
                    totalPage: '',
                    page: ''
                }
            },
            methods: {
                // 写一个回调函数
                hh(page, callback) {
                    $.ajax({
                        url: BigNew.comment_list,
                        dataType: 'json',
                        data: {
                            'page': page,
                            'perpage': 6, //每页返回10条数据
                        },
                        success: (backData) => {
                            // console.log(backData);
                            if (backData.code == 200) {
                                //调用模板引擎核心方法
                                let e = backData.data.totalPage;
                                this.totalPage = e;
                                // console.log(e);
                                this.list = backData.data.data;
                                if (backData.data.data.length != 0 && callback != null) {
                                    // callback(backData) 下面那个 省去了传参这一步!!
                                    callback(backData)
                                    console.log('aa');
                                } else if (backData.data.totalPage == this.page - 1 && backData.data.data.length == 0) {
                                    this.page -= 1;
                                    this.hh(this.page, () => {
                                        //调用changeTotalPages 这个方法 根据新的总页数 重新生成分页结构. 
                                        $('#pagination-demo').twbsPagination('changeTotalPages',
                                            backData.data.totalPage, this.page);
                                    });
                                }
                                this.$nextTick(() => {
                                    $('#pagination-demo').twbsPagination({
                                        totalPages: e,
                                        visiblePages: 7,
                                        first: '首页',
                                        prev: '上一页',
                                        next: '下一页',
                                        last: '尾页',
                                        onPageClick: (event, page) => {
                                            this.page = page;
                                            this.hh(page, null);
                                        }
                                    })
                                })
                            }
                        }
                    })
                },
                //删除评论
                delclick(id) {
                    let config = axios.interceptors.request.use(config => {
                        //为请求头对象，添加token验证的Authorization字段
                        config.headers.Authorization = window.sessionStorage.getItem("token");
                        return config
                    })
                    const params = new URLSearchParams();
                    params.append('id', id);
                    axios.post(BigNew.comment_delete, params, config).then(res => {
                        // console.log(res);
                        if (res.data.code == 200) {
                            alert('删除成功');
                            //  ()=>{} 这是上面的 回调函数!! 执行下面的回调函数 改变页码
                            this.hh(this.page, ()=> {
                                //重新渲染页面条
                                //调用changeTotalPages 这个方法 根据新的总页数 重新生成分页结构. 
                                $('#pagination-demo').twbsPagination('changeTotalPages',
                                            this.totalPage, this.page);
                            });
                        }
                    })
                },
                //批准评论
                appclick(id) {
                    let config = axios.interceptors.request.use(config => {
                        //为请求头对象，添加token验证的Authorization字段
                        config.headers.Authorization = window.sessionStorage.getItem("token");
                        return config
                    })
                    const params = new URLSearchParams();
                    params.append('id', id);
                    axios.post(BigNew.comment_pass, params, config).then(res => {
                        // console.log(res);
                        if (res.data.code == 200) {
                            alert('批准成功');
                            this.hh(this.page, null);
                        }
                    })
                },
                // 通过评论
                paseclick(id) {
                    let config = axios.interceptors.request.use(config => {
                        //为请求头对象，添加token验证的Authorization字段
                        config.headers.Authorization = window.sessionStorage.getItem("token");
                        return config
                    })
                    const params = new URLSearchParams();
                    params.append('id', id);
                    axios.post(BigNew.comment_reject, params, config).then(res => {
                        // console.log(res);
                        if (res.data.code == 200) {
                            alert('拒绝成功');
                            this.hh(this.page, null);
                        }
                    })
                }
            },
            created() {
                this.hh(1,null);
            },
        }
    }
});