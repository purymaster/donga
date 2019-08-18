$(document).ready(function(){
	
	function is_touch_device() {
		return 'ontouchstart' in window        // works on most browsers 
		  || navigator.maxTouchPoints;       // works on IE10/11 and Surface
	};

	// 모바일에서는 동작 제한
	if( !is_touch_device() ){

		$(".wordToast").mouseover(function(){

			var widthSize = $(this).outerWidth(), 
				heightSize = $(this).outerHeight(),
				margin = 5;
			
			var $explain = $(this).next(".explainToast");
			
			if($explain.hasClass("top")){
				$explain.css({
					'margin-left': '-' + ( ( $explain.width() / 2) - (widthSize / 2) ) + 'px',
					'margin-top': '-' + ( heightSize + $explain.height() + margin ) + 'px'
				});
			}
			else if($explain.hasClass("bottom")){
				$explain.css({
					'margin-left': '-' + ( ( $explain.width() / 2) - (widthSize / 2) ) + 'px',
					'margin-top':  ( margin) + 'px'
				});
			}

			$explain.show();

		});
		
		$(".wordToast").mouseout(function(){
			$(this).next(".explainToast").css("display", "none");
		});
	}
});