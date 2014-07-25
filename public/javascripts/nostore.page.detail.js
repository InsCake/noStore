$(function() {
    // 点击线上购买，加到购物车
    var commodity_id = window.location.href.split('/').pop();
    $('#buyOnline').on('click', function() {
        $.get("/addToCart?commodity_id=" + commodity_id, function(data, status) {
            console.log("Data: " + data + "\nStatus: " + status);
        });
    });
});