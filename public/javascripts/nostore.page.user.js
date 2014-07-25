$(function() {
    // 点击修改密码
    $('#submitChangePwd').on('click', function() {
        var ori_pwd = $('#ori_pwd').val(),
            new_pwd = $('#new_pwd').val(),
            new_pwd_again = $('#new_pwd_again').val();
        $.ajax({
            url: "/changepassword",
            type: "POST",
            data: {
                "ori_pwd": ori_pwd,
                "new_pwd": new_pwd,
                "new_pwd_again": new_pwd_again
            },
            success: function(data) {
                if (data.status == "success") {
                    $('#msg_modal').modal('show');
                }
            }
        });
    });
    // 点击弹出修改地址弹窗
    $('.update_address_btn').on('click', function() {
        $('#modal_update_address #add_id').val($(this).parent().parent().parent().attr('class').slice(11));
        $('#modal_update_address #add_sign_name').val($(this).parent().parent().parent().find('.address_name').html());
        $('#modal_update_address #add_address_detail').val($(this).parent().parent().parent().find('.address_detail').html().split(',')[0]);
        $('#modal_update_address #add_phone').val($(this).parent().parent().parent().find('.address_detail').html().split(',')[1]);
        $('#modal_update_address').modal('show');
    });
});