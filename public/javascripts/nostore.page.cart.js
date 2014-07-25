$(function() {
	// ajax 移出购物车
    // $('.cart_table .commodity-tr .operation').on('click', 'a', function() {
    // 	var commodity_id = $(this).parent().parent().attr('id').slice(10);
    // 	$.get("/rmvFromCart?commodity_id=" + commodity_id, function(data, status) {
    //         console.log("Data: " + data + "\nStatus: " + status);
    //     });
    // });
	var price_total = 0;
	$('.c_price').each(function () {
		price_total += +$(this).children('em').text();
	});
	$('.total-price em').text(price_total);
});