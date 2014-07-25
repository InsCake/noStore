$(function () {
	$('.new_cs a').on('click', function() {
		// alert($(this).parent().attr('id').slice(2));
		$('#modal_new_commodity iframe').attr('src', '/backend/newcommoditydetail?id=' + $(this).parent().attr('id').slice(2));
		$('#modal_new_commodity #set_new_refused_btn').attr('href', '/backend/setnewrefused?id=' + $(this).parent().attr('id').slice(2));
		$('#modal_new_commodity').modal('show');
	});
});