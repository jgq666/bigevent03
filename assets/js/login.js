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
        return alert('两次密码不一致')
      }
    }
  })

  //4.注册功能
  $('#form_reg').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: 'http://ajax.frontend.itheima.net/api/reguser',
      data: {
        username: $('.reg-box input[name=username]').val(),
        password: $('.reg-box input[name=password]').val()
      },
      success: function (res) {
        if (res.status !== 0) {
          return alert(res.message)
        }
        alert(res.message)
      }
    })
  })
})
