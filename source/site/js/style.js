//
// Event handlers
//

function onResize()
{
    console.info("[JVE] Resize event called...");
    updateHeader();
}

function onReady()
{
    console.info("[JVE] On-ready event called...");
    updateHeader();
}

//
// Global utilities
//

function updateHeader()
{    
	var clientHeight = this.innerHeight / 2;
	var clientWidth = this.innerWidth;
	$("div#parent").css('width', clientWidth + 'px');
	$("div#top").css('height', clientHeight + 'px');
}

//
// Initialization
//

jQuery(document).ready(onReady);
jQuery(window).on('resize', onResize);
