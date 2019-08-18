$(document).ready(function(){
	
//오디오 
	$('.btnAudio1').click(function(e) {
		// all audio listen button click
		allAudioListenStart();
	});

	if ( $(".audioControl").length ) {
		$(".audioControl").audioControl({
			"audioFile" : "audioFile",
			"playClass" : "clickColor"
		});
	}

});