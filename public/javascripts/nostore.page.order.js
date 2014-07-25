$(function() {
    // 获取订单参数 收货地址、支付方式
    var address_tr = $('.address input:checked').parent().parent(),
        address = address_tr.find('.address_name').html() + '/' + address_tr.find('.address_detail').html();
    var pay_method = $('.pay_method input:checked').parent().parent().find('.method_name').html();

    $('.settlement').on('click', '#submit_order', function() {
        var address_tr = $('.address input:checked').parent().parent(),
            address = address_tr.find('.address_name').html() + '/' + address_tr.find('.address_detail').html();
        var pay_method = $('.pay_method input:checked').parent().parent().find('.method_name').html();
        $.ajax({
            type: "POST",
            url: "/settle",
            data: {
                'address': address,
                'pay_method': pay_method
            },
            success: function(data) {
                if (data.msg == 'success') {
                    alert('下单成功！');
                    window.location.href = data.url;
                };
            }
        });
    });

    
    var price_total = 0;
    $('.c_price').each(function () {
        price_total += +$(this).children('em').text();
    });
    $('.total-price em').text(price_total);
});