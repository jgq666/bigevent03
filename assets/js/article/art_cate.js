$(function () {
    var layer = layui.layer
    initArtCateList();
    //封装函数
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                var str = template('tpl-art-cate', res)
                $('tbody').html(str)
            }
        })
    }
    //2.显示添加文章分类表单
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '251px'],
            title: '在线调试',
            content: $("#dialog-add").html()
        })
    })
    //3.添加文章分类
    var indexAdd = null
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList();
                layer.msg(res.message)
                layer.close(indexAdd)
            }
        })
    })
    //4.修改-展示表单
    var indexEdit = null;
    var form = layui.form
    $('tbody').on('click', '.btn-edit', function () {
        //4.1利用框架代码,显示提示添加文章类别区域
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '251px'],
            title: '修改文章类别',
            content: $("#dialog-edit").html()
        })
        //4.2获取Id,发送ajax获取数据,渲染页面
        var Id = $(this).attr('data-id')
        $.ajax({
            url: '/my/article/cates/' + Id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })
    //4.修改-提交
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault(),
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        console.log(111);
                        return layer.msg(res.message)
                    }
                    initArtCateList()
                    layer.msg(res.message)
                    layer.close(indexEdit)
                }
            })
    })
    //5.删除
    $('tbody').on('click', '.btn-delete', function () {
        var Id = $(this).attr('data-id')
        layer.confirm('是否确认删除', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    initArtCateList()
                    layer.msg(res.message)
                    layer.close(index)
                }
            })
        });
    })
})

