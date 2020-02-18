 // 首先点击进来 就要发送ajax 请求 获得数据渲染页面 !!!
 //  利用模板 来渲染 
 let hub = new Vue();
 let vm = new Vue({
     el: "#app",
     data() {
         return {}
     },

     created() {


     },
     components: {
         //列表页面的组件
         'cpn': {
             template: '#cpn',
             data() {
                 return {
                     list: [],
                     b: '',
                     c: '',
                     d: '',
                     b: '',
                     page: '',
                     e: '',
                     flag: false
                 }
             },
             methods: {
                 // 删除的按钮
                 delclick(id) {
                     console.log(id);

                     // 第一种方法!!!
                     // $.ajax({
                     //     url: BigNew.article_delete,
                     //     type: 'post',
                     //     dataType: 'json',
                     //     data: {
                     //         id: $(this).attr('data-id')
                     //     },
                     //     success: function (backData) {
                     //         if (backData.code == 204) {
                     //             alert('删除成功');
                     //             window.location.reload();
                     //         } else {
                     //             alert(backData.msg);
                     //         }
                     //     }
                     // });

                     // 方法二:   这里没有重新渲染页面!!!
                     const params = new URLSearchParams();
                     // 传入id
                     params.append('id', id);
                     axios.post(BigNew.article_delete, params).then(({
                         data: ret
                     }) => {
                         if (ret.code == 204) {
                             alert(ret.msg);
                             // location.reload();
                             //  this.list = this.list.filter((n) => {
                             //      return n.id != id;
                             //  });
                             //  console.log(this.page);
                             //开始判断 当前页码数在不在 最后一页
                             console.log(this.e);
                             this.gong(this.c, this.d, this.page, null);
                             console.log('aaaa');
                             $('#pagination-demo').twbsPagination("changeTotalPages", this.e, this.page);
                         }
                     })
                 },
                 tclick(id) {
                     // url 传参 
                     location.href = './article_edit.html?id=' + id;
                 },
                 // 公共的函数!!
                 gong(type, state, page, fn) {
                     // 把令牌带过来 
                     $.ajax({
                         url: BigNew.article_query,
                         data: {
                             'type': type,
                             'state': state,
                             'page': page,
                             perpage: 3
                         },
                         success: (backData) => {
                             if (backData.code == 200) {
                                 //调用模板引擎核心方法
                                 // console.log(backData);
                                 this.list = backData.data.data;
                                 // e 页面一加载 获取的总页数
                                 let e = backData.data.totalPage
                                 this.e = e;
                                 if (e == this.page - 1 && backData.data.data.length == 0) {
                                     this.page = this.page - 1;
                                     $('#pagination-demo').twbsPagination("changeTotalPages", this.e, this.page);
                                 }
                                 this.$nextTick(() => {
                                     $('#pagination-demo').twbsPagination({
                                         totalPages: e,
                                         visiblePages: 8,
                                         first: '首页',
                                         prev: '上一页',
                                         next: '下一页',
                                         last: '尾页',
                                         onPageClick: (event, page) => {
                                             this.page = page
                                             // 点击分页 显示分页的内容
                                             this.gong(this.c, this.d, page, null);
                                         }
                                     })
                                 })
                             }
                         }
                     });
                 },

             },
             created() {
                 // 页面开始的时候渲染整个页面!!
                 this.gong(null, null, 1, null);
             },
             computed: {},
             mounted() {
                 //  监听兄弟组件发过来的数据
                 hub.$on('e', (a) => {
                     this.list = a;
                 });
                 // 监听兄弟组件发过来的数据
                 hub.$on('s', (b, c, d) => {
                     this.b = b;
                     this.c = c;
                     this.d = d

                     //  判断数据是否为空!!!
                     //  if (this.b == 0) {
                     //      $('#pagination-demo').hide();
                     //      $('#none').show();
                     //  } else {
                     //      $('#pagination-demo').show();
                     //      $('#none').none();
                     //  }
                 });

             },
         },
         // 删选的组件!
         'cps': {
             template: '#cps',
             data() {
                 return {
                     lists: [],
                     status: ['草稿', '已发布'],
                     name: '',
                     names: '',
                     page: 1
                 }
             },
             methods: {
                 // 筛选按钮
                 sclick() {
                     $.ajax({
                         url: BigNew.article_query,
                         data: {
                             type: this.names,
                             state: this.name,
                             page: this.page,
                             perpage: 3
                         },
                         success: (backData) => {
                             if (backData.code == 200) {
                                 //调用模板引擎核心方法
                                 console.log(backData);
                                 let a = backData.data.data;
                                 let b = backData.data.totalPage;
                                 // 爱生活类
                                 let c = this.names;
                                 // 草稿类
                                 let d = this.name;
                                 // 组件之间的传参
                                 if (b == 0) {
                                     $('#pagination-demo').hide();
                                     $('#pagination-demo').next().show(); //提示没有数据
                                 } else if (backData.data.data.length != 0) {
                                     //有数据了就应该把分页插件结构给显示
                                     $('#pagination-demo').show();
                                     $('#pagination-demo').next().hide();
                                     $('#pagination-demo').twbsPagination("changeTotalPages", b, 1);
                                 } 
                                 hub.$emit('e', a);
                                 hub.$emit('s', b, c, d);
                                 // 这里是分页的修改总页数的函数 传入筛选获取的总页数 和 默认在第一页的值
                                 // 但是这里要判断一下 筛选的 有没有内容!!

                             }
                         }
                     });
                 }
             },
             mounted() {},
             created() {
                 // 这里面先空着
                 //这里发送ajax 请求 获取文章的列表!!!
                 //请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
                 // 拦截器
                 let config = axios.interceptors.request.use(config => {
                     //为请求头对象，添加token验证的Authorization字段
                     config.headers.Authorization = window.sessionStorage.getItem("token");
                     return config
                 })
                 // 把令牌带过来 
                 axios.get(BigNew.category_list, config).then(({
                     data: res
                 }) => {
                     //{data : res} ES 解构
                     //  console.log(res);
                     this.lists = res.data;
                 });
             },
         }
     },
 });