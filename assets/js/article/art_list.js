$(function () {
    //3.为art-template 定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //1.定义查询对象
    var q = {
        pagenum: 1,        //页码值
        pagesize: 2,		//每页显示多少条数据
        cate_id: "",    	//文章分类的 Id
        state: "",    	//文章的状态，可选值有：已发布、草稿
    }
    //2.初始化文章列表
    initTable()
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var str = template('tpl-table', res)
                $('tbody').html(str)
                //分页
                renderPage(res.total)
            }
        })
    }

    //3.初始化分类
    var form = layui.form
    initCate()
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    // console.log(333);
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //根据select标签,渲染dl标签
                form.render()
            }
        })
    }

    //4.筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // console.log(111);
        var state = $('[name=state]').val()
        var cate_id = $('[name=cate_id]').val()
        q.state = state
        q.cate_id = cate_id
        // console.log(111);
        initTable()
    })
    //5.分页 
    var laypage = layui.laypage
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox',//注意，这里的pageBox是 ID，不用加 # 号
            count: total,//数据总数,从服务端得到
            limit: q.pagesize,//每页几条
            curr: q.pagenum,//第几页
            //分页模板设置
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //触发jump,分页初始化的时候,页码改变的时候
            jump: function (obj, first) {
                //obj:所有参数所存在的对象,first:是否第一次初始化分页
                //把最新的页码值,赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                //把最新的条目数,赋值到q这个查询参数对象的pagesize中
                q.pagesize = obj.limit
                //首次不执行
                if (!first) {
                    initTable()
                }
            }
        })
    }
    //6.删除
    var layer = layui.layer
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr("data-id")
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    //页面汇总删除按钮个数等于1,页码大于1
                    if ($(".btn-delete").length == 1 && q.pagenum > 1) {
                        q.pagenum--
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})

