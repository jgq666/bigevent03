$(function () {
  $('#link_login').on('click', function () {
    $('.login-box').show();
    $('.reg-box').hide();
  })
  $('#link_reg').on('click', function () {
    $('.login-box').hide();
    $('.reg-box').show();
  })

  //3.自定义验证规则
  var form = layui.form
  form.verify({
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    repwd: function (value) {
      var val = $('.reg-box input[name=password]').val()
      if (value != val) {
        return '两次密码不一致'
      }
    }
  })
  var layer = layui.layer
  //4.注册功能
  $('#form_reg').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/api/reguser',
      data: {
        username: $('.reg-box input[name=username]').val(),
        password: $('.reg-box input[name=password]').val()
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        layer.msg('注册成功请登录')
        //自动跳转到登录页面
        $('#link_login').click()
        //重置表单
        $('#form_reg')[0].reset()
      }
    })
  })

  //登录功能
  $('#form_login').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: "/api/login",
      data: $('#form_login').serialize(),
      success: function (res) {
        if (res.status !== 0) {
          // console.log(123);
          return layer.msg(res.message)
        }
        layer.msg(res.message)
        console.log(res.token);
        //保存token
        localStorage.setItem('token', res.token)
        //跳转
        location.href = "/index.html"
      }

    })
  })
})