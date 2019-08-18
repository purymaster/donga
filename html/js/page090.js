// *************************************************************************
// svg : 생성 - from keris
function CESVG (target, type) {
	var svgContainer = document.createElementNS('http://www.w3.org/2000/svg', type);
    $(target).append(svgContainer);
    return svgContainer;
}

var lineClass = 'answerLine';
var correctLineClass = 'correctLine';

var viewCorrected = false;

var isTouchDevice = false;

$(document).ready(function(){
	initScale();
	getEventType();
	$(document).find('assessmentItem').each(function (index) {
		//
		if ($(this).find('.startWrap').length > 0) {
			//
			var svgContainer = CESVG($(this).find('.block'), 'svg');			// make svg container
			svgContainer.setAttribute('class', 'svgContainer');					// set class
			var dropAreas = $(this).find('.block').find('.lineDropArea');		// goal areas
			var lineObjs = $(this).find('.dragLineObj');						// start & line object control areas

			lineObjs.each(function (index) {
				//
				this.setAttribute('value', index);
				var answerLine = CESVG(svgContainer, 'path');
				answerLine.setAttribute('class', lineClass);
				answerLine.setAttribute('value', index);

				lineEventController(this, answerLine, dropAreas, svgContainer);
			});

			//drawCorrectAnswer(lineObjs, dropAreas, svgContainer);

			$(this).find('.cbtn.icon-check').click(function (e) {
				//
				if (viewCorrected) {
					// reset
					answerHideSVGContainer(svgContainer);
					
				} else {
					// view correct answer
					drawCorrectAnswer(lineObjs, dropAreas, svgContainer);
				}
				viewCorrected = !viewCorrected;
			});

			$(this).find('.cbtn.line-draw').click(function (e) {
				// reset
				resetSVGContainer(svgContainer);

				viewCorrected = false;
			});
		}
	});
});

function drawCorrectAnswer(startAreas, goalAreas, svgContainer) {
	//
	for (var i=0; i<startAreas.length; i++) {
		var el = startAreas[i];
		var gd = ''+$(el).data('goal');
		var goals = gd.split(' ');

		for (var j=0; j<goals.length; j++) {
			//
			var correctLine = CESVG(svgContainer, 'path');
			correctLine.setAttribute('class', lineClass);
			$(correctLine).addClass(correctLineClass);

			var sl = parseInt(el.style.left) + (el.offsetWidth/2);
			var st = parseInt(el.style.top) + (el.offsetHeight/2);

			var gl = parseInt(goalAreas[parseInt(goals[j])-1].style.left) + goalAreas[parseInt(goals[j])-1].offsetWidth / 2;
			var gt = parseInt(goalAreas[parseInt(goals[j])-1].style.top) + goalAreas[parseInt(goals[j])-1].offsetHeight / 2;

			correctLine.setAttribute('d', 'M '+sl+' '+st+' L '+gl+' '+gt);
		}
	}
}


function answerHideSVGContainer(svgContainer) {
	//
	$(svgContainer).find('.'+correctLineClass).each(function (idx) {
		//
		this.setAttribute('isLine', 'y');
		$(this).remove();
	});
}

function resetSVGContainer(svgContainer) {
	//
	$(svgContainer).find('.'+lineClass).each(function (idx) {
		//
		this.setAttribute('isLine', 'y');
		$(this).remove();
	});
}

var isMultiLine = true;

function lineEventController (lObj, line, validAreas, svgContainer) {
	// line object original position
	var oriL = lObj.style.left;
	var oriT = lObj.style.top;
	// line 의 시작 위치
	var l = parseInt(lObj.style.left) + (lObj.offsetWidth/2);
	var t = parseInt(lObj.style.top) + (lObj.offsetHeight/2);
	// line 이 그려질 위치
	var absL = l;
	var absT = t;
	// draw object 이동할 좌표
	var newX = 0;
	var newY = 0;
  
	var getCoord = function(e) {
		var clinetX, clientY;
		if(isTouchDevice){
				clientX = e.touches[0].clientX;
				clientY = e.touches[0].clientY;
			}else{
				clientX = e.clientX;
				clientY = e.clientY;
			}
			return {'x': clientX, 'y': clientY};
	}
	// 드래그 시작 이벤트, move 이벤트와 포인터가 벗어날 때 이벤트 등록
	var dragStartEvent = function (e) {
		e.preventDefault();
		fixEvent(e);
		var coord = getCoord(e);
		var clientX = coord.x;
		var clientY = coord.y;
		lObj.offX = clientX - lObj.offsetLeft;
		lObj.offY = clientY - lObj.offsetTop;

		l = parseInt(lObj.style.left) + (lObj.offsetWidth/2);
		t = parseInt(lObj.style.top) + (lObj.offsetHeight/2);
		absL = l;
		absT = t;
		if (line.getAttribute('isLine') === 'y') {
			console.log('already draw');

			if (isMultiLine) {
				//
				var answerLine = CESVG(svgContainer, 'path');
				answerLine.setAttribute('class', 'answerLine');
				answerLine.setAttribute('value', lObj.getAttribute('value'));
				line = answerLine;
				absL = l;
				absT = t;
			} else {
				// 선이 무조건 하나만 그려져야 하는 경우
				absL = l;
				absT = t;
			}
		}
		lObj.style.zIndex = 100;
		lObj.addEventListener(getEventType('eventMove'), dragEvent, true);
		lObj.addEventListener(getEventType('eventOut'), dragEndEvent, true);
	}
	// 드래그 이벤트
	var dragEvent = function(e) {
		e.preventDefault();
		var coord = getCoord(e);
		var clientX = coord.x;
		var clientY = coord.y;
		newX = clientX - lObj.offX;
		newY = clientY - lObj.offY;
		lObj.style.left = (newX/zoomRate)+'px';
		lObj.style.top = (newY/zoomRate)+'px';

		// 선의 시작 위치, 그리는 종료 위치 값 지정
		line.setAttribute('d', 'M '+l+' '+t+' L '+(newX+(lObj.offsetWidth/2)*zoomRate)/zoomRate+' '+(newY+(lObj.offsetHeight/2*zoomRate)/zoomRate));
	}
	// 드래그 종료 이벤트, 이동 및 포인터 벗어날 때 이벤트 제거 및 위치 판별 후 최종 선 그리기 작업 함수 실행
	var dragEndEvent = function(e) {
		absL=newX+(lObj.offsetWidth/2);
		absT=newY+(lObj.offsetHeight/2);

		lObj.style.zIndex = 1;
		e.preventDefault();
		lObj.removeEventListener(getEventType('eventMove'), dragEvent, true);
		lObj.removeEventListener(getEventType('eventOut'), dragEndEvent, true);

		validationCheck(e);
	}

	var validationCheck = function(e) {
		console.log(validAreas);

		var validObj = null;
		var connectIdx = -1;

		for (var i=0; i<validAreas.length; i++) {
			if ((absL >= parseInt(validAreas[i].style.left) && absL <= (parseInt(validAreas[i].style.left) + validAreas[i].offsetWidth)) &&
				(absT >= parseInt(validAreas[i].style.top) && absT <= (parseInt(validAreas[i].style.top) + validAreas[i].offsetHeight))) {
				validObj = validAreas[i];
				connectIdx = i;
				break;
			}
		}

		if (validObj !== null) {
			// 이전에 연결된 선이 있으면에 대한 작업 ㄴㄴ 즉, 1:n or 1:1 작업 음슴
			if (line.getAttribute('isLine') === 'y') {
				console.log('already draw');
			}

			line.setAttribute('isLine', 'y');
			line.setAttribute('connectVal', connectIdx);
			lObj.style.left = oriL;
			lObj.style.top = oriT;

			absL = parseInt(validObj.style.left) + validObj.offsetWidth / 2;
			absT = parseInt(validObj.style.top) + validObj.offsetHeight / 2;

			var lastVal = 'M '+l+' '+t+' L '+(absL)+' '+(absT);

			$(svgContainer).find('.'+lineClass).each(function (idx) {
				var lVal = this.getAttribute('value');
				var lD = this.getAttribute('d');

				if (lVal === lObj.getAttribute('value') && lD === lastVal) {
					// 이미 존재하는거 삭제
					$(this).remove();
				}
			});

			line.setAttribute('d', 'M '+l+' '+t+' L '+(absL)+' '+(absT));
		} else {
			console.log('not valid area');
			line.setAttribute('d', 'M 0 0 L 0 0');
			
			lObj.style.left = oriL;
			lObj.style.top = oriT;
			absL = l;
			absT = t;
		}
	}
	
	lObj.addEventListener(getEventType('eventDown'), dragStartEvent, true);
	lObj.addEventListener(getEventType('eventUp'), dragEndEvent,true);
}

function getEventType(eventType) {
	// var isTouchDevice;
	try {  
		document.createEvent("TouchEvent");
		isTouchDevice = true; 
	} catch (e) {
		isTouchDevice = false;
	}

	var ret;

	switch (eventType) {
		case 'eventDown':
			ret = isTouchDevice ? 'touchstart' : 'mousedown';
			break;
		case 'eventMove':
			ret = isTouchDevice ? 'touchmove' : 'mousemove';
			break;
		case 'eventUp':
			ret = isTouchDevice ? 'touchend' : 'mouseup';
			break;
		case 'eventOut':
			ret = isTouchDevice ? 'touchleave' : 'mouseout';
			break;
		default:
			ret = 'err';
			break;
	}
	return ret;
}

// calculate pageX, pageY
function fixEvent(event) {
	if ( !event.target ) {
		event.target = event.srcElement || document;
	}

	if ( event.target.nodeType === 3 ) {
		event.target = event.target.parentNode;
	}

	if ( event.pageX == null && event.clientX != null ) {
		var eventDocument = event.target.ownerDocument || document,
			doc = eventDocument.documentElement,
			body = eventDocument.body;

		event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
		event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
   }
}


var zoomRate;

function initScale() {
	var wrap = document.getElementById('wrap');

	var zoomVertical = (document.body.clientHeight / wrap.clientHeight) * 1.0;
	var zoomHorizontal = (document.body.clientWidth / wrap.clientWidth) * 1.0;

	if (document.body.clientHeight < document.body.clientWidth) {
		zoomRate = 1;
	} else {
		zoomRate = zoomHorizontal;
	}
	//alert(zoomRate);
}
