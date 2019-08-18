$(document).ready(function(){
	onAnswerMarkingEvent();
	
	$(".correctAnswerMarkingBtn").click(function(){
		var scope = "." + $(this).data("scope");
		$(scope +  " .answerMarking .select-txt").each(function(){	
			var $scope = $(this).parents(".answerMarking");
			var correctAnswer = $scope.find(".correctAnswer").text();
			var selectAnswer = $(this).data("num");
			
			if(correctAnswer==selectAnswer){
				$(this).find("div").addClass("marking answer");
			}
			
			$(scope + " .answerMarking .select-txt").off("click");
		});
	 });
	 
	$(".resetMarkingBtn").click(function(){
		var scope = "." + $(this).data("scope");
		$(scope +  " .answerMarking .select-txt > div").each(function(){
			$(this).removeClass("marking");
			$(this).removeClass("answer");
			$(scope + " .answerMarking .select-txt").off("click");
			onAnswerMarkingEvent(scope);
			
		});	
	 });
	
	// 보기 항목 선택 이벤트
	function onAnswerMarkingEvent(scope){
		var tmpScope = (scope==undefined) ? "" : scope;
		$(tmpScope + " .answerMarking .select-txt").click(function(){console.log('q');
			var $scope = $(this).parents(".answerMarking");
			$scope.find(".select-txt").not(this).find("div").removeClass("marking");
			
			if($(this).find("div").hasClass("marking")){
				$(this).find("div").removeClass("marking");
			}else{
				$(this).find("div").addClass("marking");
			}
		});
	}
});
