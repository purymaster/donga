$(document).ready(function(){	
	$(".popup").each(function(){
		var $scope = $(this);
		var popup = $(this).data("pop");
	
		// 레이어팝업 or 슬라이드팝업 or 전체팝업
		if($(this).data("position")!=undefined){
			var position = $(this).data("position").split(" ");
			$(this).click(function(){
				$(".hiddenPopup").css("display", "none");
				$("." + popup).css({"position":"absolute","top":position[0] + "px", "left":position[1] + "px","display":"inline-block"});
			});
			
		}else if($(this).data("start")!=undefined && $(this).data("end")!=undefined){	
			var start = $(this).data("start").split(" ");
			var end = $(this).data("end").split(" ");
			var time = $(this).data("time");
			
			$(this).click(function(){
				$(".hiddenPopup").css("display", "none");
				$("." + popup).css({"position":"absolute","top":start[0] + "px", "left":start[1] + "px","display":"inline-block"});
				$("." + popup).animate({"top":end[0] + "px", "left":end[1] + "px"}, time);
			});
			
		}else{
			$(this).click(function(){
				$(".hiddenPopup").css("display", "none");
				$("." + popup).css({"position":"absolute","top":"0px", "left":"0px","width":"100%","height":"100%","display":"inline-block"});
			});
		}
		
		$("." + popup).find(".closePopup").click(function(){
			$("." + popup).css("display", "none");
		});			
	});
});