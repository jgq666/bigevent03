$(function () {
    //1.自定义校验规则
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度为1~6之间'
            }
        }
    })
    //2.用户渲染
    initUserInfo()
    var layer = layui.layer
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //成功后渲染
                layer.msg(res.message)
                form.val('formUserInfo', res.data)
            }
        })
    }
    //3.表单重置
    $('#btnReset').on('click', function (e) {
        e.preventDefault()
        initUserInfo()
    })
    // 4.修改用户信息
    $('.layui-form').on("submit", function (e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    // console.log(111);
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                initUserInfo()
                //调用父页面中的更新用户信息和头像方法
                window.parent.getUserInfo()
            }
        })
    })


})
