$(document).ready(function(){

	$(".popup-btn").click(function(){
		
		var target_id = target_id = $(this).attr('data-target');

		$(".popup-btn").removeClass('disable');

		var margin_w = 30, margin_h = 10, 
			$target = $(target_id);

		if( $target.is(':visible') ) {
			$target.fadeOut('fast');
			$(this).removeClass('disable');
		}
		else {
			
			$(".popup").fadeOut('fast');

			$(this).addClass('disable');

			var pos = $(this).attr('data-pos');
			var left = (14 - ($target.width()/2));
/*
			if ( left < 0 ) { 
				left = 10;
			}
			else if( left + ($target.width()) > 768 ){
				left = 768 - 20 - $target.width();
			}
*/
			
			if ( pos == 'full' ) {
				$target.css({
					'left':  '50px',
					'top': '50px'
				});
			}
			else {

				if ( pos == 'bottom' ) {
					$target.css({
						'margin-left': left + 'px',
						'margin-top': margin_h  + 'px'
					});
				}
				else if ( pos == 'top' ) {
					$target.css({
						'margin-left': left + 'px',
						'margin-top': '-' + (margin_h + $target.height() + $(this).height())  + 'px'
					});
				}
				else if ( pos == 'left' ) {
					$target.css({
						'margin-top': '-' + ($target.height() / 2 + $(this).height() / 2 )  + 'px',
						'margin-left':  '-' + ($target.width() + margin_w)  + 'px',
					});
				}
				else if ( pos == 'right' ) {
					$target.css({
						'margin-top': '-' + ($target.height() / 2  + $(this).height() / 2)  + 'px',
						'margin-left':  margin_w + 'px',
					});
				}
			}

			$target.fadeIn('fast');

		}

	});

	$(".star-mark-text").click(function(e){
		
		if (e.target !== this)
			return;

		var target_id = '#popupWord';

		var margin_w = 30, margin_h = 10, 
			$target = $(target_id);
		
		if( $target.is(':visible') ) {

			$target.fadeOut('fast');
			$(this).removeClass('disable');

		}
		else {
		
			$(this).addClass('disable');

			var pos = $(this).attr('data-pos');
			var left = (14 - ($target.width()/2));
			
			$target.css({
				'margin-left': left + 'px',
				'margin-top': margin_h  + 'px'
			});

			$target.detach().appendTo(this).fadeIn('fast');

		}



	});

   $(".star-mark-text .popup").click(function(e) {
        e.stopPropagation();
   });

	$(".popup .close").click(function(){
		var $parent = $(this).parent(),
		popup_id = $parent.attr('id');
		$parent.fadeOut('fast');
		
		$('.popup-btn[data-target="#'+popup_id+'"]').removeClass('disable');
	});

	$(".popupChecker .check label, #popupSelfcheck .check label").click(function(){
		var $parent = $(this).parent(),
			$checker = $parent.find('.checker'),
			offset = $(this).offset(),
			parent_offset = $parent.offset();

			$checker.css({
				'left' : (offset.left - parent_offset.left - 3) + 'px',
				'top' : '2px',
			});

			$checker.show();
	});

	$(".popup .tab li").click(function(){
		var $target = $($(this).data('target'));
		$(".popup .tab li").removeClass('active');
		$(this).addClass('active');
		$(".popup .tab-block").hide();
		$target.show();
	});

	$(".btn-tab").click(function(){
		var $target = $($(this).data('target'));
		$(".btn-tab").removeClass('active');
		$(this).addClass('active');
		$(".popup .tab-block").hide();
		$target.show();
	});

});