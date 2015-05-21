$(document).ready(function() {    
	var clientHeight = ($(HTMLDocument).innerHeight() / 2) + 'px';
	$(".top-half").css('height', clientHeight);
});

$(document).resize(function() {
    alert('hi');
});