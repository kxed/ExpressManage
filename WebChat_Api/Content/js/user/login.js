EL= {
    username:$("#txtUserName"),
    pwd:$("#txtPwd"),
    btnSubmit:$("#btnSubmit"),
    bindEvent:function(){
        EL.btnSubmit.on('click',function(){
            if (EL.username.val() == "")
            {
                mutual.tipsDialog("用户名不能为空");
                return;
            }
            if (EL.pwd.val() == "") {
                mutual.tipsDialog("密码不能为空");
                return;
            }
            $.post("/UserManage/CheckLogin", {uname:EL.username.val(),pwd:EL.pwd.val()}, function (data) {
                if (data.status) {
                    window.location.href = data.redirect;
                } else {
                    mutual.tipsDialog(data.errormessage);
                }
            });
        });
    }
}