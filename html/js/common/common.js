// 'use strict';

/****************************************
*			    COMMON.js               *
****************************************/
$(function(){

	/****************************************/
	// 사이드 버튼  - 2017-10-12 //
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
	
	// Bottom Slide
	(function(){
		var slide_bottom_up = function($block){
			var h = $block.data("height");
			$block.css({'z-index':420}).animate({top: ((h-19)*-1) + 'px' }, 300);
		}
		var slide_bottom_down = function($block){
			var h = $block.data("height");
			$block.css({'z-index':420}).animate({top: '-19px' }, 300);
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


	/****************************************/
	// 팝업 버튼  - 2017-10-12 //
	$(".popup-btn").click(function(){
		var target = $(this).data('target'),
		$target = $(target);
		$target.show();
		// 미디어 플레이어 kill
		if(typeof resetAllMediaPlayer=="function") resetAllMediaPlayer();
		resetAllMediaPlayer()
	});

	$(".popup-close").click(function(){
		var $target = $(this).closest(".popup");
		$target.hide();
		// 미디어 플레이어 kill
		if(typeof resetAllMediaPlayer=="function") resetAllMediaPlayer();
		resetAllMediaPlayer()
	});

	/****************************************/
	// 레이어 오디오 수정 - 2017-10-12 //
	$(".audio-btn").click(function(){
		// 미디어 플레이어 kill
		if(typeof resetAllMediaPlayer=="function") resetAllMediaPlayer();
		resetAllMediaPlayer()

		var classId = $(this).attr("class").split(" ")[1];
		var audioLayerColor = "al_" + classId;
		//alert(audioLayerColor);
		$('.audio-layer').hide();

		$(this).parent().find(".audio-layer .btn-audio-pause").hide();
		$(this).parent().find(".audio-layer .btn-audio-play").show();

		if ( $(this).hasClass("active") ){
			$(this).removeClass("active");
			$(this).next('.audio-layer').hide();
			if(typeof resetAllMediaPlayer=="function") resetAllMediaPlayer();
		}
		else {
			$(".audio-btn").each(function(){
				$(this).removeClass("active");
			});
			$(this).addClass("active");
			$(this).next('.audio-layer').addClass(audioLayerColor);
			$(this).next('.audio-layer').show();

			var audioId = $(this).parent().find(".mp3_b").attr("data-mpid");
		if (audioId == null) audioId = $(this).parent().find(".mp3_c").attr("data-mpid");
			playMediaPlayer(audioId, this)
			$(this).parent().find(".audio-layer .btn-audio-pause").show();
			$(this).parent().find(".audio-layer .btn-audio-play").hide();
		}
	});

	/****************************************/
	// 레이어 오디오 수정 - 2017-10-12 //
	$(".audio-layer .close-btn").click(function(){
		$(".audio-btn").each(function(){
			$(this).parent().find(".audio-layer").hide();
			$(this).removeClass("active");
		});

		// 미디어 플레이어 kill
		if(typeof resetAllMediaPlayer=="function") resetAllMediaPlayer();
		resetAllMediaPlayer()
	});

	$(".mp3_a, .mp3_b, .mp3_c, mp4_a, .mp4_c").click(function(){
		$(".audio-btn").each(function(){
			$(this).parent().find(".audio-layer").hide();
			$(this).removeClass("active");
		});
	});

	$(".audio-layer .btn-audio-play").click(function(){
		$(this).hide();
		$(this).parent().find(".audio-layer .btn-audio-pause").show();
		//var audioId = $(this).parent().attr("data-layerid");
		var audioId = $(this).parent().find(".mp3_b").attr("data-mpid");
		if (audioId == null) audioId = $(this).parent().find(".mp3_c").attr("data-mpid");
		pauseMediaPlayer(audioId)

	});
	$(".audio-layer .btn-audio-pause").click(function(){
		$(this).hide();
		$(this).parent().find(".audio-layer .btn-audio-play").show();
		var audioId = $(this).parent().find(".mp3_b").attr("data-mpid");
		if (audioId == null) audioId = $(this).parent().find(".mp3_c").attr("data-mpid");
		pauseMediaPlayer(audioId)

	});
	$(".audio-layer .btn-audio-stop").click(function(){
		$(this).parent().find(".audio-layer .btn-audio-pause").hide();
		$(this).parent().find(".audio-layer .btn-audio-play").show();
		var audioId = $(this).parent().find(".mp3_b").attr("data-mpid");
		if (audioId == null) audioId = $(this).parent().find(".mp3_c").attr("data-mpid");
		stopMediaPlayer(audioId)
	});


	/****************************************/
	// 객관식 퀴즈 수정 - 2017-10-12 //
	$(".answer-check-btn.type-check").click(function(){
		var $target = $($(this).data("scope")),
		correct = $target.find("correctResponse").text(),
		user_check = $target.find("input:checked").val();

		if ( $(this).hasClass("active") ){
			$(this).removeClass("active");
			$target.find("input").prop("disabled", false);
			
			$target.find(".check-icon").removeClass("check-icon-correct");
			$target.find(".correct-answer").removeClass("correct-answer answer-yes answer-no");

			// 다시 풀기 추가 //
			//$(this).parent().find(".icon-reset").hide();

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

				// 다시 풀기 추가 //
				//$(this).parent().find(".icon-reset").show();
			}
		}
	});

	// 체크박스 다시풀기 추가
	$(".type-check.icon-reset").click(function(){
		var $target = $($(this).data("scope"));

		$target.find("input").prop("disabled", false);
		$target.find("input").prop("checked" , false);
		$target.find(".answer-check-btn.type-check").removeClass("active");
		$target.find(".check-icon").removeClass("check-icon-correct");
		$target.find(".correct-answer").removeClass("correct-answer answer-yes answer-no")
		
		//$(this).hide();
	});


	/****************************************/
	// 의견 입력 박스 내용 초기화 - 2017-10-12 //
	$(".reset-inputTxt").click(function(){
		var $target = $($(this).data("scope"));
		$target.find("input").prop("disabled", false);
		$target.find("input").val("");

		$target.find("textarea").prop("disabled", false);
		$target.find("textarea").val("");

		$target.find("input").prop("checked", false);

		var $targetTooltip = $(this).parent().find(".tooltip");
		$targetTooltip .hide();

		$(this).prev(".answer-check-btn").removeClass("active");
		$target.find('.answer-result').hide();
		//$(this).hide();
	});



	/****************************************/
	// 툴팁 생성 - 2017-10-12 //
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
			"top": top_pos, 
			"left" : left_pos,
		});
		
		// $target.show();
	});


	/****************************************/
	// Dictation 정답 보기 - 2017-10-12 //
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

	/****************************************/
	// 주관식 정답 보기 - 2017-10-12 //
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
					'width' : (width) + 'px',
					'margin-left' : (width*-1) + 'px',
					'margin-top' : (height*1) + 'px'
				}).show();
			});
		}
	});

	/****************************************/
	// 복수형 객관식 - 2017-10-12 //
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

	/****************************************/
	// 복수형 객관식 다시 풀기 - 2017-10-12 //
	$(".type-check-multi.icon-reset").click(function(){

		var $target = $($(this).data("scope"));
		$target.find("assessmentItem").each(function(){
			var $parent = $target,
			$target = $(this);

			var correct = $target.find("correctResponse").text(),
			user_check = $target.find("input:checked").val();

			$(this).removeClass("active");
			$target.find("input").prop("disabled", false);
			$target.find("input").prop("checked" , false);

			$target.find(".check-icon").removeClass("check-icon-correct");
			$target.find(".correct-answer").removeClass("correct-answer answer-yes answer-no");
		});
		//$(this).hide();
	});

	/****************************************/
	// 본학습 단어 뜻보기 - 2017-10-12 //
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

});