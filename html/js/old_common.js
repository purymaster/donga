// 'use strict';

/****************************************
*			    COMMON.js               *
****************************************/
$(function(){
	// side tip button
	$(".page-tip-block").click(function(){
		var $tipbox = $(".page-tip-block .tip-box"),
			dir = 'left', ani_josn = {},
			width = $tipbox.outerWidth();

		width -= 60;
		
		if($tipbox.parent().hasClass('right')){
			dir = 'right';
		}

		if($tipbox.hasClass('on')){
			ani_josn[dir] = "-"+width+"px";
			$tipbox.animate(ani_josn, 300, function(){
				$tipbox.find(".text-block").hide();
			});
			$tipbox.removeClass('on')
		}
		else {
			ani_josn[dir] = 0;
			$tipbox.find(".text-block").show();
			$tipbox.animate(ani_josn, 300);
			$tipbox.addClass('on')
		}

	});

	// popup button
	$(".popup-btn").click(function(){
		var target = $(this).data('target'),
		$target = $(target);
		$target.show();
	});

	$(".popup-close").click(function(){
		var $target = $(this).closest(".popup");
		$target.hide();
	});

	// Tooltip 
	$(".tooltip-btn").click(function(){

		var $target = $(this).parent().find(".tooltip");
		var margin_top = 15;
		var left = $target.data("left");
		if ( typeof left == 'undefined' ) {
			left = 0;
		}

		if ( $target.is(':visible') ){
			$target.hide();
			return;
		}

		$(".tooltip").hide();
		
		var widthSize = $target.outerWidth();
		var heightSize = $target.outerHeight();
		var left_pos = ((widthSize+left)*-1) +  "px";
		var top_pos = ((heightSize+margin_top)*-1) + "px";

		if($target.hasClass("left")){
			left_pos = 0;
		}
		if($target.hasClass("bottom")){
			top_pos = ((heightSize-margin_top)) + "px";
		}

		$target.css({
			"display":"block", 
			"top":top_pos, 
			"left" :left_pos,
		});
		
		// $target.show();

	});

	// Audio Layer
	$(".audio-btn").click(function(){
		$('.audio-layer').hide();

		if ( $(this).hasClass("active") ){
			$(this).removeClass("active");
			$(this).next('.audio-layer').hide();
		}
		else {
			$(this).addClass("active");
			$(this).next('.audio-layer').show();
		}

	});

	$(".audio-layer .close-btn").click(function(){
		$('.audio-layer').hide();
		var $btn = $(this).parent().prev();

		if ( $btn.hasClass("active") ){
			$btn.removeClass("active");
			$btn.next('.audio-layer').hide();
		}

	});
	
	// Audio Layer
	$(".player-btn").click(function(){
		$('.player-layer').hide();

		if ( $(this).hasClass("active") ){
			$(this).removeClass("active");
			$(this).next('.player-layer').hide();
		}
		else {
			$(this).addClass("active");
			$(this).next('.player-layer').show();
		}

	});

	$(".player-block").on('click', '.audiobtnClose', function(){
		var $popup = $(this).closest('.player-layer');
		$popup.prev().removeClass('active');
	});
	
	// Answer Check
	$(".answer-check-btn.type-show").click(function(){
		
		var $target = $($(this).data("scope"));

		if ( $(this).hasClass("active") ){
			$(this).removeClass("active");
			$target.find('.answer-result').hide();
		}
		else {
			$(this).addClass("active");
			$target.find('.answer-result').show();
		}

	});

	$(".answer-check-btn.type-input").click(function(){
		
		var $target = $($(this).data("scope"));

		if ( $(this).hasClass("active") ){
			$(this).removeClass("active");
			$target.find('.answer-result').hide();
		}
		else {
			$(this).addClass("active");
			$target.find('.answer-result').each(function(){
				var $input = $(this).prev(),
				width = $input.outerWidth(),
				height = $input.outerHeight();
				$(this).css({
					'width' :(width) + 'px',
					'margin-left' :(width*-1) + 'px',
					'margin-top' :(height*1) + 'px'
				}).show();
			});
		}

	});

	// 체크박스 정답 처리
	$(".answer-check-btn.type-check").click(function(){
		
		var $target = $($(this).data("scope")),
		correct = $target.find("correctResponse").text(),
		user_check = $target.find("input:checked").val();

		if ( $(this).hasClass("active") ){
			$(this).removeClass("active");
			$target.find("input").prop("disabled", false);
			
			$target.find(".check-icon").removeClass("check-icon-correct");
			$target.find(".correct-answer").removeClass("correct-answer answer-yes answer-no");

		}
		else {
			$(this).addClass("active");
			$target.find("input").prop("disabled", true);

			if ( correct == user_check ) {
				$target.find("input:checked").next(".check-icon").addClass("check-icon-correct");
				$target.find(".answer-title").addClass("correct-answer answer-yes");
			}
			else {
				$target.find("input[value='"+correct+"']").next(".check-icon").addClass("check-icon-correct");
				$target.find(".answer-title").addClass("correct-answer answer-no");
			}
		}

	});
	
	
	$(".answer-check-btn.type-check-multi").click(function(){
		
		var $target = $($(this).data("scope"));

		$target.find("assessmentItem").each(function(){
			var $parent = $target,
			$target = $(this);

			var correct = $target.find("correctResponse").text(),
			user_check = $target.find("input:checked").val();
	
			if ( $(this).hasClass("active") ){
				$(this).removeClass("active");
				$target.find("input").prop("disabled", false);
				
				$target.find(".check-icon").removeClass("check-icon-correct");
				$target.find(".correct-answer").removeClass("correct-answer answer-yes answer-no");
	
			}
			else {
				$(this).addClass("active");
				$target.find("input").prop("disabled", true);
	
				if ( correct == user_check ) {
					$target.find("input:checked").next(".check-icon").addClass("check-icon-correct");
					$target.find(".answer-title").addClass("correct-answer answer-yes");
				}
				else {
					$target.find("input[value='"+correct+"']").next(".check-icon").addClass("check-icon-correct");
					$target.find(".answer-title").addClass("correct-answer answer-no");
				}
			}

		});

	});
	
	// Bottom Slide
	(function(){
		var slide_bottom_up = function($block){
			var h = $block.data("height");
			$block.css({'z-index':420}).animate({top:((h-19)*-1) + 'px' }, 300);
		}
		var slide_bottom_down = function($block){
			var h = $block.data("height");
			$block.css({'z-index':420}).animate({top:'-19px' }, 300);
		}
		$(".bottom-slide-block .btn-diy").click(function(){
			$(".bottom-slide-block .slide-cover > button").hide();
			$(".selfcheck-block").css({'z-index':410});
			slide_bottom_up($(".diy-block"));
			$(".bottom-slide-block .btn-diy-down").show();
			$(".bottom-slide-block .btn-self-down").show();
		});

		$(".bottom-slide-block .btn-self").click(function(){
			$(".bottom-slide-block .slide-cover > button").hide();
			$(".diy-block").css({'z-index':410});
			slide_bottom_up($(".selfcheck-block"));
			$(".bottom-slide-block .btn-diy-down").show();
			$(".bottom-slide-block .btn-self-down").show();
		});

		$(".bottom-slide-block .btn-diy-down").click(function(){
			$(".selfcheck-block").css({'z-index':410});
			slide_bottom_down($(".diy-block"));
			$(".bottom-slide-block .slide-cover > button").show();
			$(".bottom-slide-block .btn-diy-down").hide();
			$(".bottom-slide-block .btn-selfcheck-down").hide();
		});	

		$(".bottom-slide-block .btn-self-down").click(function(){
			$(".diy-block").css({'z-index':410});
			slide_bottom_down($(".selfcheck-block"));
			$(".bottom-slide-block .slide-cover > button").show();
			$(".bottom-slide-block .btn-diy-down").hide();
			$(".bottom-slide-block .btn-self-down").hide();
		});
	})();

	// 단어 뜻보기 버튼
	$(".word-mean-btn").click(function(){

		if ( $(this).hasClass("active") ){
			$(this).removeClass("active");
			$(".word-block .mean").hide();
		}
		else {
			$(this).addClass("active");
			$(".word-block .mean").show();
		}
		
	});

	/* 음성 처리 */
	$('.btnAudio1').click(function(e) {
		// all audio listen button click
		allAudioListenStart();
	});

	if ( $(".audioControl").length ) {
		$(".audioControl").audioControl({
			"audioFile" :"audioFile",
			"playClass" :"clickColor"
		});
	}


});