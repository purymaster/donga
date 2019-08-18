// 전체 단어 전역 배열
var global_wordData = [];
// 단어 list에 사용하는 임시 배열
var global_wordData_temp = [];
// 단어 학습 전역 배열
var global_wordData_way = [];
// 단어 학습 타이머 전역 변수
var wordInterval;

$(document).ready(function(){
	// 페이지에 단어장 컨텐츠 추가 
	$.ajax({  
	    type:"GET",  
	    url:"wordbook.xhtml",
	    data:"",
	    dataType:"html",
	    success:function(data){
	    	var htmlContent = data;
	    	htmlContent = htmlContent.match(/<body>[^]*<\/body>/);
	    	htmlContent = htmlContent[0].replace(/<(\/?)body>/g,"");
	    	$("body").append(htmlContent);
	    	
	    	// get wordData 
	    	$.ajax({
	    	    type:"GET",  
	    	    url:"./json/word.json",
	    	    data:"",
	    	    dataType:"json",
	    	    success:function(data){
	    	    	global_wordData = data;

	    			// 단어장 Click Event
	    			$(".vocabulary").click(function(){			
	    				$(".popup-wordnote input:radio[value=alphabet]").add(".popup-wordnote input:radio[value=asc]").add(".popup-wordnote input:checkbox[name=vocaOption]").prop("checked", true);
	    				$(".popup-wordnote .selLesson").find("option:eq(0)").prop("selected", true);
	    				
	    				$(".popup-wordnote .pop-sec .box img").css("visibility", "visible");
	    				$(".popup-wordnote .pop-sec .box .word-eng").css("visibility", "visible");
	    				$(".popup-wordnote .pop-sec .box .word-kor").css("visibility", "visible");	
	    				
	    				$(".popup-wordnote .btn-select").css("opacity", "0.7");
	    				getWord();
	    				
	    				// 미디어 플레이어 kill
	    				if(typeof resetAllMediaPlayer=="function") resetAllMediaPlayer();
	    				
	    				// 단어장이 아닌 팝업 비활성화
	    				$(".popupBack").add(".hiddenPopup").css("display", "none");
	    				$(".popup").removeClass("on");
	    				$(".popup-wordnote").css("display","inline-block");
	    			});		
	    			
	    			// 단어장 Close Event
	    			$(".popup-wordnote .icon-popup-close").click(function(){
	    				btnSelChk(0);
	    				audioStop();
	    				clearInterval(wordInterval);
	    				$(".popup-wordnote .pop-sec .head input:checkbox").prop("checked", false);
	    				$(".popup-wordnote .pop-sec").css("display","inline-block");
	    				$(".popup-wordnote .pop-detail").css("display","none");
	    				// display none이 되기전에 스크롤 초기화
	    				$(".popup-wordnote .pop-sec .body ul").scrollTop(0);
	    				$(".popup-wordnote").css("display","none");
	    			});

	    			
	    			// 알파벳 순서 보기 Click Event
	    			$(".popup-wordnote input:radio[value=alphabet]").click(function(){
	    				$(".popup-wordnote input:radio[value=asc]").prop("checked", true);
	    				getWord();
	    			});
	    			
	    			$(".popup-wordnote input:radio[name=sort]").click(function(){
	    				$(".popup-wordnote input:radio[value=alphabet]").prop("checked", true);
	    				$(".popup-wordnote input:radio[value=unit]").prop("checked", false);
	    				getWord();
	    			});
	    			
	    			
	    			// 단원별 보기 Click Event
	    			$(".popup-wordnote input:radio[value=unit]").click(function(){
	    				$(".popup-wordnote input:radio[name=sort]").prop("checked", false);
	    				getWord();
	    			});
	    			
	    			$(".popup-wordnote .selLesson").change(function(){
	    				$(".popup-wordnote input:radio[name=sort]").prop("checked", false);
	    				$(".popup-wordnote input:radio[value=unit]").prop("checked", true);
	    				getWord();
	    			});
	    			
	    			
	    			// 단어 학습 구성 preview
	    			$(".popup-wordnote .pop-sec input:checkbox[name=vocaOption]").click(function(){
	    				if($(".popup-wordnote .pop-sec input:checkbox[name=vocaOption]").is(":checked")){
	    					// 단어가 최소 하나 이상 선택 되었는지 확인
	    					if($(".popup-wordnote .pop-sec .body input:checkbox").is(":checked")) $(".popup-wordnote .btn-select").prop("disabled", false).css("opacity", "1");
	    				}else{
	    					$(".popup-wordnote .btn-select").prop("disabled", true).css("opacity", "0.7");
	    				}
	    				var option = $(this).val();
	    				var optionYn = $(this).prop("checked");
	    				if(option=="1"){
	    					if(optionYn) $(".popup-wordnote .pop-sec .box img").css("visibility", "visible");
	    					else $(".popup-wordnote .pop-sec .box img").css("visibility", "hidden");				
	    				}else if(option=="2"){
	    					if(optionYn) $(".popup-wordnote .pop-sec .box .word-eng").css("visibility", "visible");
	    					else $(".popup-wordnote .pop-sec .box .word-eng").css("visibility", "hidden");					
	    				}else if(option=="3"){
	    					if(optionYn) $(".popup-wordnote .pop-sec .box .word-kor").css("visibility", "visible");
	    					else $(".popup-wordnote .pop-sec .box .word-kor").css("visibility", "hidden");				
	    				}
	    			});

	    			
	    			// 단어 학습 Click Event
	    			$(".popup-wordnote .btn-select").click(function(){
	    				// 단어 학습 전역배열 초기화
	    				global_wordData_way = [];
	    				$(".popup-wordnote .pop-sec .body input:checkbox").each(function(){
	    					if($(this).prop("checked")){
	    						var tmpObj = {};
	    						tmpObj.wordEn = $(this).parent(".checkbox").parent("li").find(".wordEn").text();
	    						tmpObj.wordKo = $(this).parent(".checkbox").parent("li").find(".wordKo").text();
	    						tmpObj.wordFile = $(this).parent(".checkbox").parent("li").find(".wordFile").text();
	    						tmpObj.wordImgFile = $(this).parent(".checkbox").parent("li").find(".wordImgFile").text();
	    						global_wordData_way.push(tmpObj);
	    					}
	    				});
	    				// 오름차순 정렬
	    				global_wordData_way.sort(function(a,b){
	    					return (a.wordEn).toLowerCase()<(b.wordEn).toLowerCase() ? -1:1
	    				});				
	    				wordStudy(0);
	    				$(".popup-wordnote .pop-sec").css("display","none");
	    				$(".popup-wordnote .pop-detail").css("display","inline-block");
	    			});
	    			
	    			// 단어 학습 Close Event
	    			$(".popup-wordnote .npBtnReplay").click(function(){
	    				btnSelChk(0);
	    				audioStop();
	    				clearInterval(wordInterval);
	    				$(".popup-wordnote .pop-sec").css("display","inline-block");
	    				$(".popup-wordnote .pop-detail").css("display","none");
	    			});
	    			
	    			
	    			// 단어 학습 이전 버튼 Click Event
	    			$(".popup-wordnote .pop-detail .npBtnPrev").click(function(){
	    				var curPage = parseInt($(".popup-wordnote .pop-detail .npCurNum").text());
	    				wordStudy(curPage-2);
	    			});

	    			// 단어 학습 다음 버튼 Click Event
	    			$(".popup-wordnote .pop-detail .npBtnNext").click(function(){
	    				var curPage = parseInt($(".popup-wordnote .pop-detail .npCurNum").text());
	    				wordStudy(curPage);
	    			});
	    			
	    			
	    			// 단어 학습 자동 재생 
	    			$(".popup-wordnote .pop-detail .npBtnAuto").click(function(){
	    				btnSelChk(1);
	    				// 오름차순 정렬
	    				global_wordData_way.sort(function(a,b){
	    					return (a.wordEn).toLowerCase()<(b.wordEn).toLowerCase() ? -1:1
	    				});
	    				//wordStudy(0);
	    				clearInterval(wordInterval);
	    				wordInterval = setInterval(function(){
	    					var curPage = parseInt($(".popup-wordnote .pop-detail .npCurNum").text());
	    					if(curPage==global_wordData_way.length-1) btnSelChk(0);				
	    					if(curPage==global_wordData_way.length){
	    						btnSelChk(0);
	    						clearInterval(wordInterval);
	    					}else{
	    						wordStudy(curPage);
	    					}
	    				}, 3000);
	    			});
	    			
	    			// 단어 학습 무작위 재생
	    			$(".popup-wordnote .pop-detail .npBtnRandom").click(function(){
	    				btnSelChk(2);
	    				global_wordData_way.shuffle();
	    				//wordStudy(0);
	    				clearInterval(wordInterval);
	    				wordInterval = setInterval(function(){
	    					var curPage = parseInt($(".popup-wordnote .pop-detail .npCurNum").text());
	    					if(curPage==global_wordData_way.length-1) btnSelChk(0);
	    					if(curPage==global_wordData_way.length){
	    						btnSelChk(0);
	    						clearInterval(wordInterval);
	    					}else{
	    						wordStudy(curPage);
	    					}
	    				}, 3000);
	    			});
	    			
	    			// 단어 학습 정지
	    			$(".popup-wordnote .pop-detail .npBtnStop").click(function(){
	    				btnSelChk(3);
	    				clearInterval(wordInterval);
	    			});
	    			
	    			
	    			// 단어 게임 Click Event
	    			$(".popup-wordnote .btn-wordgame").click(function(){
	    				
	    			});
	    	    }
	    	});	
	    }
	});	
});

// word body 영역 내에 단어 컨텐츠 생성
function getWord(){
	global_wordData_temp = [];
	$(".popup-wordnote .pop-sec .head input:checkbox").prop("checked", false);
	$(".popup-wordnote .btn-select").prop("disabled", true).css("opacity", "0.7");
	
	if($(".popup-wordnote input:radio[value=alphabet]").prop("checked")){
		global_wordData_temp = global_wordData;
		// 단어 중복 제거 처리
	    var dup = unique(global_wordData_temp);
	    
		if($(".popup-wordnote input:radio[value=asc]").prop("checked")){
			// 오름차순 정렬
			dup.sort(function(a,b){
				return (a.wordEn).toLowerCase()<b.wordEn.toLowerCase() ? -1:1
			});
		}else if($(".popup-wordnote input:radio[value=desc]").prop("checked")){
			// 내림차순 정렬
			dup.sort(function(a,b){
				return (a.wordEn).toLowerCase()>(b.wordEn).toLowerCase() ? -1:1
			});
		}
	}else if($(".popup-wordnote input:radio[value=unit]").prop("checked")){	
		var unit = $(".popup-wordnote .selLesson").val();
		for(var i=0; i<global_wordData.length; i++){		
		    var wordData = global_wordData[i];
	    	if(wordData.lesson==unit) global_wordData_temp.push(wordData);
		}
		// 단어 중복 제거 처리
	    var dup = unique(global_wordData_temp);
	    
		// 오름차순 정렬
	    dup.sort(function(a,b){
			return (a.wordEn).toLowerCase()<(b.wordEn).toLowerCase() ? -1:1
		});
	}
	
	var html = "";
	for(var i=0; i<dup.length; i++){
	    var wordData = dup[i];
	    html += "<li><label class='checkbox'><input type='checkbox' name='voca'/>";
	    html  += "<span class='check-icon'></span></label> " + wordData.wordEn;
	    html += "<label class='wordEn' style='display:none;'>" + wordData.wordEn + "</label>";
	    html += "<label class='wordKo' style='display:none;'>" + wordData.wordKo + "</label>";				
	    html += "<label class='wordFile' style='display:none;'>" + wordData.wordFile + "</label>";			
	    html += "<label class='wordImgFile' style='display:none;'>" + wordData.wordImgFile + "</label></li>";			
	    $(".popup-wordnote .pop-sec .body ul").html(html);
	}
	
	// 단어 전체 선택/해지 Click Event
	$(".popup-wordnote .pop-sec .head input:checkbox").off("click");
	$(".popup-wordnote .pop-sec .head input:checkbox").click(function(){
		if($(this).prop("checked")){
			$(".popup-wordnote .pop-sec .body input:checkbox").prop("checked", true);
			// 단어 구성 내용이 최소 하나 이상 선택 되었는지 확인
			if($(".popup-wordnote .pop-sec input:checkbox[name=vocaOption]").is(":checked")) $(".popup-wordnote .btn-select").prop("disabled", false).css("opacity", "1");
		}else{
			$(".popup-wordnote .pop-sec .body input:checkbox").prop("checked", false);
			$(".popup-wordnote .btn-select").prop("disabled", true).css("opacity", "0.7");
		}
	});
	
	// 단어 전체 선택 버튼 활성화 처리
	$(".popup-wordnote .pop-sec .body input:checkbox").off("click");
	$(".popup-wordnote .pop-sec .body input:checkbox").click(function(){
		if($(".popup-wordnote .pop-sec .body input:checkbox").is(":checked")){
			// 단어 구성 내용이 최소 하나 이상 선택 되었는지 확인
			if($(".popup-wordnote .pop-sec input:checkbox[name=vocaOption]").is(":checked")) $(".popup-wordnote .btn-select").prop("disabled", false).css("opacity", "1");
		}else{
			$(".popup-wordnote .btn-select").prop("disabled", true).css("opacity", "0.7");
		}
		
		var tmp = true;
		$(".popup-wordnote .pop-sec .body input:checkbox").each(function(){
			if(!$(this).prop("checked")){
				tmp = false;
				return false;
			}
		});
		if(tmp) $(".popup-wordnote .pop-sec .head input:checkbox").prop("checked", true);
		else $(".popup-wordnote .pop-sec .head input:checkbox").prop("checked", false);
	});
}

// param : 단어 학습에 표시 할 단어의 index(global_wordData_way의 index)
function wordStudy(param){
	var ArrLength = global_wordData_way.length;
	var ArrData = global_wordData_way[param];
	
	$(".popup-wordnote .pop-detail .npBtnPrev").add(".popup-wordnote .pop-detail .npBtnNext").prop("disabled", false).css("opacity", "1");
	if(ArrLength==1) $(".popup-wordnote .pop-detail .npBtnPrev").add(".popup-wordnote .pop-detail .npBtnNext").prop("disabled", true).css("opacity", "0.5");
	if(param==0) $(".popup-wordnote .pop-detail .npBtnPrev").prop("disabled", true).css("opacity", "0.5");
	if(param==(ArrLength-1)) $(".popup-wordnote .pop-detail .npBtnNext").prop("disabled", true).css("opacity", "0.5");

	$(".popup-wordnote .pop-detail .npCurNum").text(param+1);
	$(".popup-wordnote .pop-detail .npTotNum").text(ArrLength);
	
	// 단어 오디오 재생
	$(".popup-wordnote .pop-detail .box .word-audio").remove();
	var html = "<audio class='word-audio'><source src='" + ArrData.wordFile + "' type='audio/mpeg'></source></audio>";
	$(".popup-wordnote .pop-detail .box").append(html);
	
	$(".popup-wordnote .pop-detail .box img").attr("src", ArrData.wordImgFile);
	$(".popup-wordnote .pop-detail .box .word-eng span").text(ArrData.wordEn);
	$(".popup-wordnote .pop-detail .box .word-kor").text(ArrData.wordKo);
	
	var imgOp = $(".popup-wordnote .pop-sec .checklist input:checkbox[value=1]").prop("checked");
	var engOp = $(".popup-wordnote .pop-sec .checklist input:checkbox[value=2]").prop("checked");
	var korOp = $(".popup-wordnote .pop-sec .checklist input:checkbox[value=3]").prop("checked");
	
	if(imgOp) $(".popup-wordnote .pop-detail .box img").css("visibility", "visible");
	else $(".popup-wordnote .pop-detail .box img").css("visibility", "hidden");
	
	if(engOp) $(".popup-wordnote .pop-detail .box .word-eng").css("visibility", "visible");
	else $(".popup-wordnote .pop-detail .box .word-eng").css("visibility", "hidden");
	
	if(korOp) $(".popup-wordnote .pop-detail .box .word-kor").css("visibility", "visible");
	else $(".popup-wordnote .pop-detail .box .word-kor").css("visibility", "hidden");
	
	$(".popup-wordnote .pop-detail .box .word-eng").off("click");
	$(".popup-wordnote .pop-detail .box .word-eng").click(function(){
		$(this).parent(".box").find(".word-audio").trigger("play");
	});	
}

// 자동 재생, 무작위 재생, 정지 활성화 처리
// param : 1(자동 재생) or 2(무작위 재생) or 3(정지)
function btnSelChk(param){
	if(param==0){
		$(".popup-wordnote .pop-detail .npBtnAuto").prop("disabled", false).css("opacity", "1");
		$(".popup-wordnote .pop-detail .npBtnRandom").prop("disabled", false).css("opacity", "1");
	}else if(param==1){
		$(".popup-wordnote .pop-detail .npBtnAuto").prop("disabled", true).css("opacity", "0.5");
		$(".popup-wordnote .pop-detail .npBtnRandom").prop("disabled", false).css("opacity", "1");
	}else if(param==2){
		$(".popup-wordnote .pop-detail .npBtnAuto").prop("disabled", false).css("opacity", "1");
		$(".popup-wordnote .pop-detail .npBtnRandom").prop("disabled", true).css("opacity", "0.5");
	}else if(param==3){
		$(".popup-wordnote .pop-detail .npBtnAuto").prop("disabled", false).css("opacity", "1");
		$(".popup-wordnote .pop-detail .npBtnRandom").prop("disabled", false).css("opacity", "1");
	}	
}

// 단어 학습 audio stop
function audioStop(){
	var $wordAudio = $(".popup-wordnote .pop-detail .box .word-audio");
	$wordAudio.trigger("pause");
	$wordAudio.prop("currentTime", 0);
}

//단어 중복 제거
function unique(array) {
    var result = [];
    result.push(array[0]);
    for(var i=0; i<array.length; i++){
    	var tmp = true;
    	for(var j=0; j<result.length; j++){
    		if(array[i].wordEn==result[j].wordEn){
    			tmp = false;
    			break;
    		}
    	}
    	if(tmp) result.push(array[i]);
    }
    return result;
}

//배열 셔플
Array.prototype.shuffle = function() {
    var j, x, i;
    for(i=this.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = this[i - 1];
        this[i - 1] = this[j];
        this[j] = x;
    }
}

