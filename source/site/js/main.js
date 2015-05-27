//
// Event handlers
//

function log(info)
{
    console.log("[JVE] " + info);
}

function onResize()
{
    log("Resize event called...");
    updateHeader();
}

function onReady()
{
    log("On ready called...");
    updateHeader();
}

//
// Global utilities
//

function updateHeader()
{    
    var height = this.innerHeight / 2;
    var width = this.innerWidth;
    
    if (height < 400) height = 400;
    if (width < 100) width = 100;
    
    // Force the width of the main container to be the width of the window
	$(".container.parent").css('width', width + 'px');
    // Set the top row to be half the page height
	$("div.row.top").css('height', height + 'px');
    
    // Center the top header row by setting the width and the margin-left offset
    var middleWidth = this.innerWidth;
    if (middleWidth > 550) middleWidth = 550;
	$(".row.header").css('width', middleWidth + 'px');
	$(".row.header.centered").css('margin-left', '-' + (middleWidth / 2) + 'px');
}

$(document).ready(function() {
    onReady();
    jQuery(window).on('resize', onResize);
});