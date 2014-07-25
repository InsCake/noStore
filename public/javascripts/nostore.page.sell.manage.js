$(function () {
	$('.commodity_list').on('click', '.title', function() {
        $('#modal_updateCommodity #c1_id').val($(this).parent().parent().parent().attr('class').slice(24));
        $('#modal_updateCommodity #c1_name').val($(this).parent().parent().parent().find('.title').html().split('&nbsp;-&nbsp;')[0]);
        $('#modal_updateCommodity #c1_subtitle').val($(this).parent().parent().parent().find('.title').html().split('&nbsp;-&nbsp;')[1]);
        $('#modal_updateCommodity #c1_price').val($(this).parent().parent().parent().find('.price em').html());
        $('#modal_updateCommodity #c1_category').val($(this).parent().parent().parent().find('.category span').html());
        $('#modal_updateCommodity #c1_school').val($(this).parent().parent().parent().find('.position a').html());
        $('#modal_updateCommodity').modal('show');
	});
	$('.order_id').on('click', function() {
		$('.detail_iframe').attr('src', '/sell/orderdetail?id=' + $(this).html());
		$('#modal_order_detail').modal('show');
	});

    var i = 2;
    $('.form_img').on('click', '.add_img', function() {
        $(this).before('<div class="form-group"><label for="img' + i + '">图片' + i + '</label><input type="file" class="form-control" id="img' + i + '" name="img' + i + '"></div>')
        i++;
    });
});