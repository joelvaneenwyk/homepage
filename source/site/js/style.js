$(document).ready(function() {
    var fontSize = parseInt($(".bottom-align").height())+"px";
    alert(fontSize);
    $(".bottom-align").css('font-size', fontSize);
});
