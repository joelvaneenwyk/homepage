$(document).ready(function() {    
});

$(window).on('resize', function(){
	var clientHeight = ($(HTMLDocument).innerHeight() / 2) + 'px';
	var clientWidth = $(HTMLDocument).innerWidth() + 'px';
    $('body.div.div').height(clientHeight);
	$("div#top.row").css('height', clientHeight);
	$(".top").css('width', clientWidth);
	$(".top-body").css('width', $(".top-body").width());
});
