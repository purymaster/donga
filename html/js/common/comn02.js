$(document).ready(function(){
	
	onSelectAnswerEvent();
	
	$(".correctAnswerBtn").click(function(){
		var scope = "." + $(this).data("scope");
		if($(scope + " .checkExample .checkText").hasClass("correctAnswer")) return false;
		var correctAnswer = $(scope + " .checkExample .answer").text();
		var selectAnswer = $(scope + " .checkExample .checkItem input:radio[name=checkValue]:checked").val();

		if(correctAnswer==selectAnswer){
			reset(scope);
			$(scope + " .answerMark_o").css("display", "inline-block");
		}else{
			reset(scope, true); //사용자가 선택한 답 표시 여부
			$(scope + " .answerMark_x").css("display", "inline-block");
		}

		$(scope + " .checkExample .checkItem").each(function(){
			if(correctAnswer==$(this).data("num")){
				$(this).find(".correctAnswerMark").css("display", "inline-block");
				$(this).find(".checkText").addClass("correctAnswer");
				$(this).find(".checkText em").css({"font-weight":"400", "color":"red"});
				$(this).find("input:radio[name=checkValue][value=" + correctAnswer + "]").prop("checked", true);
			}			
		});
		$(scope + " .checkExample .checkItem .checkText").css("cursor", "default");
		$(scope + " .checkExample .checkItem .checkImg").css("cursor", "default");
		
		offSelectAnswerEvent(scope);
	});
	
	$(".resetBtn").click(function(){
		var scope = "." + $(this).data("scope");	
		reset(scope);
		offSelectAnswerEvent(scope);
		onSelectAnswerEvent(scope);
	});
	
	// 보기 항목 선택 이벤트
	function onSelectAnswerEvent(scope){
		var tmpScope = (scope==undefined) ? "" : scope;
		$(tmpScope + " .checkExample .checkItem .checkText, " + tmpScope + " .checkExample .checkItem .checkImg").click(function(){
			var $scope = $(this).parents(".checkExample");
			var num = $(this).parent(".checkItem").data("num");

			$scope.find(".checkItem .selectAnswerMark").css("display", "none");
			$scope.find(".checkItem .checkText").removeClass("correctAnswer");
			$scope.find(".checkItem .checkText em").css({"font-weight":"400", "cursor":"pointer"});
			$scope.find(".checkItem input:radio[name=checkValue]:checked").prop("checked", false);
			
			$scope.find(".checkItem").each(function(){
				if($(this).data("num")==num){
					$(this).find(".selectAnswerMark").css("display", "inline-block");
					$(this).find(".checkText em").css("font-weight", "700");
					$(this).find("input:radio[name=checkValue][value=" + num + "]").prop("checked", true);
				}
			});
		});
	}
	
	// 보기 항목 선택 이벤트 해제
	function offSelectAnswerEvent(scope){
		$(scope + " .checkExample .checkItem .checkText").off("click");
		$(scope + " .checkExample .checkItem .checkImg").off("click");
	}
	
	// 초기화
	function reset(scope, op){
		$(scope + " .answerMark_o").css("display", "none");
		$(scope + " .answerMark_x").css("display", "none");
		if(!op) $(scope + " .checkExample .checkItem .selectAnswerMark").css("display", "none");
		$(scope + " .checkExample .checkItem .correctAnswerMark").css("display", "none");
		$(this).find(".checkText").removeClass("correctAnswer");
		$(scope + " .checkExample .checkItem .checkText em").css({"font-weight":"400", "color":"black", "cursor":"pointer"});
		$(scope + " .checkExample .checkItem input:radio[name=checkValue]:checked").prop("checked", false);
	}
	
	/* 공통 모듈 추가 개선 처리 - 송종윤 170825 */

});

