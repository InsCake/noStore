$(function () {
	$('.arb_detail_btn').on('click', function() {
		// alert($(this).parent().parent().attr('id').slice(2));
		$('#modal_arb_detail iframe').attr('src', '/backend/arborderdetail?id=' + $(this).parent().parent().attr('id').slice(2));
		$('#modal_arb_detail #arb_seller_btn').attr('href', '/backend/arbtoseller?id=' + $(this).parent().parent().attr('id').slice(2));
		$('#modal_arb_detail #arb_user_btn').attr('href', '/backend/arbtouser?id=' + $(this).parent().parent().attr('id').slice(2) + '&userid=' + $(this).parent().parent().find('.user_name').attr('id').slice(5));
		
		$('#modal_arb_detail').modal('show');
	});
});