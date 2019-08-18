$(document).ready(function(){

	// 텍스트 입력 (말풍선 타입)
	$(".correctAnswerTooltipBtn").click(function(){
		var scope = "." + $(this).data("scope");
		$(scope).append("<div class='correctAnswerTooltipArrow'></div>")
		
		var position = $(this).offset();
		var widthSize = $(this).outerWidth();
		var heightSize = $(this).outerHeight();
		
		if($(scope + " .correctAnswerTooltip.top").length>0){
			$(scope + " .correctAnswerTooltipArrow").css({"border-width":"12px 12px 0 12px", "border-color":"#a7bfef transparent transparent transparent"});
		}
		
		if($(scope + " .correctAnswerTooltip.bottom").length>0){
			$(scope + " .correctAnswerTooltipArrow").css({"border-width":"0 12px 12px 12px", "border-color":"transparent transparent #a7bfef transparent"});
		}
		
		var widthSize_arrow = $(scope + " .correctAnswerTooltipArrow").outerWidth();
		var heightSize_arrow = $(scope + " .correctAnswerTooltipArrow").outerHeight();
		var widthSize_arrow_answer = $(scope + " .correctAnswerTooltip").outerWidth();
		var heightSize_arrow_answer = $(scope + " .correctAnswerTooltip").outerHeight();
		
		//top left
		if($(scope + " .correctAnswerTooltip.top.left").length>0){
			$(scope + " .correctAnswerTooltipArrow").css({"display":"block", "top": (position.top - heightSize_arrow) + "px", "left" : (position.left + 10) + "px"});
			$(scope + " .correctAnswerTooltip").css({"display":"block", "top": (position.top - heightSize_arrow - heightSize_arrow_answer) + "px", "left" : position.left +  "px"});	
		}
	
		//top right
		if($(scope + " .correctAnswerTooltip.top.right").length>0){
			$(scope + " .correctAnswerTooltipArrow").css({"display":"block", "top":  (position.top - heightSize_arrow) + "px", "left" : (position.left + widthSize - widthSize_arrow - 10) + "px"});
			$(scope + " .correctAnswerTooltip").css({"display":"block", "top": (position.top - heightSize_arrow - heightSize_arrow_answer) + "px", "left" : (position.left - widthSize_arrow_answer + widthSize) +  "px"});
		}
		
		//bottom left
		if($(scope + " .correctAnswerTooltip.bottom.left").length>0){
			$(scope + " .correctAnswerTooltipArrow").css({"display":"block", "top": (position.top + heightSize) + "px", "left" : (position.left + 10) + "px"});
			$(scope + " .correctAnswerTooltip").css({"display":"block", "top": (position.top + heightSize + heightSize_arrow) + "px", "left" : position.left +  "px"});
		}
		
		//bottom right
		if($(scope + " .correctAnswerTooltip.bottom.right").length>0){
			$(scope + " .correctAnswerTooltipArrow").css({"display":"block", "top": (position.top + heightSize) + "px", "left" : (position.left + widthSize - widthSize_arrow - 10) + "px"});
			$(scope + " .correctAnswerTooltip").css({"display":"block", "top": (position.top + heightSize + heightSize_arrow) + "px", "left" : (position.left - widthSize_arrow_answer + widthSize) +  "px"});
		}	
	});
	
	$(".tooltipResetBtn").click(function(){
		var scope = "." + $(this).data("scope");
		$(scope +  " .correctAnswerTooltipArrow").each(function(){
			$(this).css("display", "none");
		});
		$(scope +  " .correctAnswerTooltip").each(function(){
			$(this).css("display", "none");
		});
	});
	
	//텍스트 입력 (하단 노출 타입)
	$(".correctAnswerUnderlineBtn").click(function(){
		var scope = "." + $(this).data("scope");
		$(this).addClass('disable');
		$(scope +  " .answerUnderline").each(function(){
			var position = $(this).offset();
			var heightSize = $(this).outerHeight();
			// $(this).next().css({"display":"block", "top": position.top + heightSize + "px", "left" : position.left +  "px"});
			// position relative 문제로 교정 - 송종윤
			var widthSize = $(this).outerWidth();
			$(this).next().css({"display":"inline-block", 'margin-top': (heightSize+3)+'px', 'margin-left' : '-'+widthSize+'px','width' : widthSize+'px' });
		});	
	});
	
	$(".underlineResetBtn").click(function(){
		var scope = "." + $(this).data("scope");
		$(scope +  " .correctAnswerUnderline").each(function(){
			$(this).css("display", "none");
		});	
	});

	

});