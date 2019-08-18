///// variable
var mpCurrentFullscreen; // 풀스크린 상태가 된 objMedia 의 인덱스



///// function

// 전달
function mpSetSource(idx, src) { mpDictionaryContainer[idx].object.objSetSource(src); }
function mpMainPlay(idx) { mpDictionaryContainer[idx].object.objPlayMain(); }
function mpControlSpeed(idx, modify) { mpDictionaryContainer[idx].object.objControlSpeed(modify); }
function mpPlayMovie(idx) { mpDictionaryContainer[idx].object.objPlayMovie(); }
function mpStopMovie(idx) { mpDictionaryContainer[idx].object.objStopMovie(); }
function mpMoveTo(idx, time) { mpDictionaryContainer[idx].object.objMoveTo(time); }
function mpOnTimebarInput(idx, percenidxe) { mpDictionaryContainer[idx].object.objOnTimebarInput(percenidxe); }
function mpOnTimebarChange(idx, percenidxe) { mpDictionaryContainer[idx].object.objOnTimebarChange(percenidxe); }
function mpSetRS(idx, point) { mpDictionaryContainer[idx].object.objSetRS(point); }
function mpToggleFullscreen(idx) { mpDictionaryContainer[idx].object.objToggleFullscreen(); }
function mpToggleSubtitle(idx) { mpDictionaryContainer[idx].object.objToggleSubtitle(); }
function mpToggleVol(idx) { mpDictionaryContainer[idx].object.objToggleVol(); }
function mpToggleRole(idx, no) { mpDictionaryContainer[idx].object.objToggleRole(no); }
function mpToggleTranslation(idx) { mpDictionaryContainer[idx].object.objToggleTranslation(); }
function mpCastRoleButton(idx, ii, jj) { mpDictionaryContainer[idx].object.objCastRoleButton(ii, jj); }
function mpOpenExtendAudio(idx) { mpDictionaryContainer[idx].object.objOpenExtendAudio(false); }
function mpCheckExtend() {
        for (var key in mpDictionaryContainer) {
                mpDictionaryContainer[key].object.objCheckExtend();
        }
}

// 도구
function getOffset( el ) {
        var _x = 0;
        var _y = 0;
        while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return { top: _y, left: _x };
    }
function mpUpdateLayout(idx) { mpDictionaryContainer[idx].object.objUpdateLayout(); }

// 숏컷
function mpOpenPopupVideo(idx) {
        mpDictionaryContainer[idx].object.objSetVisible(true);
        mpDictionaryContainer[idx].object.objUpdateLayout();
        mpDictionaryContainer[idx].object.objStopMovie();
        mpDictionaryContainer[idx].object.objPlayMovie();
}
function mpClosePopupVideo(idx) {
        mpDictionaryContainer[idx].object.objStopMovie();
        mpDictionaryContainer[idx].object.objSetVisible(false);
}





///// class
var mpObject = function () {
        ///// variable

        // obj
        var dataObject; // 데이터 오브젝트
        var objectidx; // 오브젝트 인덱스

        // flag
        var bReady = false; // 메인 플레이 버튼 눌렀는지 여부
        var bRepeatSection = false; // 구간반복 플래그
        var bFullScreen = false; // 풀스크린 플래그
        var bVolOn = true; // 볼륨 on/off 플래그
        var bShowSubtitle = false; // 자막 가시여부 플래그
        var bShowTranslation = false; // 번역 가시여부 플래그
        var bShowControls = false; // 컨트롤 가시여부 플래그
        var bTimeDrag = false; // 시간바 드래그 플래그
        var bVolDrag = false; // 볼륨바 드래그 플래그
        var bExtended = false; // 확장 여부 플래그

        // state
        var pointRSA = -1; // 구간 반복 포인트 A
        var pointRSB = -1; // 구간 반복 포인트 B
        var percentageRSA = -1; // 구간 반복 %
        var percentageRSB = -1; // 구간 반복 %
        var timeCurrent = 0; // 멀티소스 관련 값
        var pxControlsTop = -1; // 컨트롤의 Top 값
        var pxControlsHeight = -1; // 컨트롤의 Height 값
        var volPrev = 0; // 음소거 전 볼륨 기억

        // link
        var objContainer; // 컨트롤 컨테이너
        var objMedia; // 미디어 객체
        var objVisible; // 가시여부 조절용 객체
        var objButtonMainplay; // 메인 플레이 버튼
        var objConBG; // 컨트롤 객체 BG
        var objControls; // 컨트롤 객체
        var objControlTop; // 컨트롤 탑
        var objControlRight; // 컨트롤 우측
        var objBarTime; // 시간바
        var objProgTime; // 시간진행바
        var objBlockTime; // 시간진행블럭
        var objButtonPlay; // 플레이 버튼
        var objButtonVol; // 볼륨 버튼
        var objBarVol; // 볼륨바
        var objProgVol; // 볼륨진행바
        var objBlockVol; // 볼륨진행블럭
        var objLabelSpeed; // 속도 표시 레이블
        var objLabelTime; // 시간 표시 레이블
        var objLabelDuration; // 재생시간 레이블
        var objRSButtonA; // 구간반복 버튼 A
        var objRSButtonB; // 구간반복 버튼 A
        var objRSBlockA; // 구간반복 블럭 A
        var objRSBlockB; // 구간반복 블럭 B
        var objContainerSubtitle; // 자막 상자
        var objLabelSubtitle; // 자막 레이블
        var objButtonSubtitle; // 자막 버튼
        var objButtonTranslation; // 영문보기<->번역보기 버튼
        var objConCaption; // 대본 컨테이너
        var objBgCaption; // 대본 BG (레이블이 여기에 묶임)
        var arLabelCaption; // 대본 레이블 배열
        var objButtonFullscreen; // 전체화면 버튼
        var arFlagRole; // 롤 플래그 배열
        var arButtonRole; // 롤 버튼 배열
        var arBlockRole; // 롤 블럭 배열 (2차원)
        var arArrayRole; // 롤 데이터 배열
        var objControlBar; // 컨트롤 바
        var objExtendLayout; // 레이어오디오 확장 DIV

        return {
                ///// start

                // 시작
                objInit: function (obj, index) {
                        // 데이터 오브젝트 연결
                        dataObject = obj;
                        objectidx = index;

                        // 뷰 생성
                        this.setLayout();

                        // 이벤트리스너 연결
                        this.objSetEL();

                        // 변수
                        bTimeDrag = false;
                        bVolDrag = false;
                },
                setLayout: function () {
                        // 분기
                        switch (dataObject.layout) {
                                case "inline_video": this.objSetLayoutInlineVideo(); break;
                                case "alone_content": this.objSetLayoutAloneContent(); break;
                                case "popup_content": this.objSetLayoutPopupContent(); break;
                                case "layer_audio": this.objSetLayoutLayerAudio(); break;
                                case "mini_audio": this.objSetLayoutMiniAudio(); break;
                                case "popup_audio": this.objSetLayoutPopupAudio(); break;
                        }
                },
                objSetEL: function () {
                        // 재생 관련
                        objMedia.addEventListener("play", this.objOnPlay);
                        objMedia.addEventListener("pause", this.objOnPause);
                        objMedia.addEventListener("timeupdate", this.objOnTimeUpdate);
                        objMedia.addEventListener("loadeddata", this.objOnLoadedData)
                        objMedia.addEventListener("ended", this.objOnEnded)

                        // 마우스 관련
                        if (objBarTime != null) objBarTime.addEventListener("mousedown", this.onTimebarMouseDown);
                        if (objBarVol != null) objBarVol.addEventListener("mousedown", this.onVolbarMouseDown);
                        document.addEventListener("mousemove", this.onDocumentMouseMove);
                        document.addEventListener("mouseup", this.onDocumentMouseUp);

                        // 풀스크린 관련
                        document.addEventListener("fullscreenchange", this.objOnFullscreenchange);
                        document.addEventListener("webkitfullscreenchange", this.objOnWebkitfullscreenchange);
                        document.addEventListener("mozfullscreenchange", this.objOnMozfullscreenchange);
                        document.addEventListener("MSFullscreenChange", this.objOnMSFullscreenChange);
                },
                objOnLoadedData: function () {
                        // 재생시간 레이블
                        if (objLabelDuration != null) {
                                var duration = objMedia.duration;
                                var min = Math.floor(duration / 60);
                                var sec = Math.floor(duration % 60);

                                // 레이블
                                objLabelDuration.textContent = dataObject.object.objToolsLeadingZeros(min, 2) + ":" + dataObject.object.objToolsLeadingZeros(sec, 2);
                        }
                },
                objOnFullscreenchange: function () {
                        if (document.fullscreen == true) {
                                mpDictionaryContainer[mpCurrentFullscreen].object.objOnFullScreen();
                        } else {
                                mpDictionaryContainer[mpCurrentFullscreen].object.objOnNormalScreen();
                        }
                },
                objOnWebkitfullscreenchange: function () {
                        if (document.webkitIsFullScreen == true) {
                                mpDictionaryContainer[mpCurrentFullscreen].object.objOnFullScreen();
                        } else {
                                mpDictionaryContainer[mpCurrentFullscreen].object.objOnNormalScreen();
                        }
                },
                objOnMozfullscreenchange: function () {
                        if (document.mozIsFullScreen == true) {
                                mpDictionaryContainer[mpCurrentFullscreen].object.objOnFullScreen();
                        } else {
                                mpDictionaryContainer[mpCurrentFullscreen].object.objOnNormalScreen();
                        }
                },
                objOnMSFullscreenChange: function () {
                        if (document.msFullscreenElement != null) {
                                mpDictionaryContainer[mpCurrentFullscreen].object.objOnFullScreen();
                        } else {
                                mpDictionaryContainer[mpCurrentFullscreen].object.objOnNormalScreen();
                        }
                },

                // 레이아웃
                objSetLayoutInlineVideo: function () {
                        // 기본 연결
                        objContainer = document.getElementById(dataObject.container);
                        $(objContainer).append("<video poster=\"" + dataObject.poster + "\" width=\"" + dataObject.width + "\" height=\"" + dataObject.height + "\" webkit-playsinline=\"\" playsinline=\"\" data-dtext_index=\"dtext_cls_video\"><source src =\"" + dataObject.source + "\" type=\"video/mp4\"></source></video>");
                        $(objContainer).css('display', 'block');
                        objMedia = $(objContainer).find("video")[0];
                        $(objContainer).parent().width(dataObject.width);
                        $(objContainer).parent().height(dataObject.height);
                        $(objContainer).height(dataObject.height);
                        $(objMedia).width(dataObject.width);
                        $(objMedia).height(dataObject.height);
                        objButtonMainplay = $(objContainer).append(this.objToolsCreateButton("controlsStart", "", "mpMainPlay(" + objectidx + ")"));
                        objButtonMainplay = $(objButtonMainplay).find("button")[0];
                        $(objButtonMainplay).width(dataObject.width);
                        $(objButtonMainplay).height(dataObject.height);
                        
                        // 자막
                        objContainerSubtitle = objContainer.appendChild(this.objToolsCreateDiv("captionBox", ""));
                        objContainerSubtitle.style["display"] = "none";
                        var captionbg = objContainerSubtitle.appendChild(this.objToolsCreateDiv("captionbg", ""));
                        objLabelSubtitle = objContainerSubtitle.appendChild(this.objToolsCreateDiv("captionTxt", "자막 - 동영상 플레이어 작업 중에 있습니다."));
                        objConBG = objContainer.appendChild(this.objToolsCreateDiv("controlsbg", ""));

                        // 비디오 컨트롤러
                        objControls = objContainer.appendChild(this.objToolsCreateDiv("videoControls", ""));

                        // 상단
                        this.objSetLayout_Top();

                        // 좌단
                        this.objSetLayout_Left();

                        // 우단
                        objControlRight = objControls.appendChild(this.objToolsCreateDiv("controlsRight", ""));
                        var controlsModul = objControlRight.appendChild(this.objToolsCreateDiv("controlsModulSet", ""));
                        var controlsSlow = $(controlsModul).append(this.objToolsCreateButton("controlsSlow", "배속 0.1감소", "mpControlSpeed(" + objectidx + ", -0.1)"));
                        objLabelSpeed = controlsModul.appendChild(this.objToolsCreateDiv("Speed", "x1.0"));
                        var controlsFast = $(controlsModul).append(this.objToolsCreateButton("controlsFast", "배속 0.1증가", "mpControlSpeed(" + objectidx + ", 0.1)"));
                        var controlsSyncSbtn = $(controlsModul).append(this.objToolsCreateButton("controlsSyncSbtn", "구간반복시작", "mpSetRS(" + objectidx + ", 0)"));
                        var controlsSyncEbtn = $(controlsModul).append(this.objToolsCreateButton("controlsSyncEbtn", "구간반복종료", "mpSetRS(" + objectidx + ", 1)"));
                        objRSButtonA = $(controlsSyncSbtn).find(".controlsSyncSbtn");
                        objRSButtonB = $(controlsSyncEbtn).find(".controlsSyncEbtn");
                        var caption = $(objControlRight).append(this.objToolsCreateButton("caption", "자막", "mpToggleSubtitle(" + objectidx + ")"));
                        objButtonSubtitle = $(caption).find(".caption");
                        var fullscreen = $(objControlRight).append(this.objToolsCreateButton("fullsize", "전체화면", "mpToggleFullscreen(" + objectidx + ")"));
                        objButtonFullscreen = $(fullscreen).find(".fullsize");

                        // 초기화
                        this.objShowControls(false);

                        // 레이아웃 갱신
                        this.objUpdateLayout();
                },
                objSetLayoutAloneContent: function () {
                        // 기본 연결
                        objContainer = document.getElementById(dataObject.container);
                        objVisible = document.getElementById(dataObject.visibleobj);
                        $(objContainer).append("<video poster=\"" + dataObject.poster + "\" width=\"" + dataObject.width + "\" height=\"" + dataObject.height + "\" webkit-playsinline=\"\" playsinline=\"\" data-dtext_index=\"dtext_cls_video\"><source src =\"" + dataObject.source + "\" type=\"video/mp4\"></source></video>");
                        objMedia = $(objContainer).find("video")[0];
                        $(objContainer).parent().width(dataObject.width);
                        $(objContainer).parent().height(dataObject.height);
                        $(objMedia).width(dataObject.width);
                        $(objMedia).height(dataObject.height);

                        // BG
                        objConBG = objContainer.appendChild(this.objToolsCreateDiv("controlsbg", ""));
                        $(objConBG).width($(objContainer).parent().width() - 10);

                        // 비디오 컨트롤러
                        objControls = objContainer.appendChild(this.objToolsCreateDiv("videoControls", ""));
                        $(objControls).width($(objContainer).parent().width() - 10);

                        // 상단
                        this.objSetLayout_Top();

                        // 좌단
                        this.objSetLayout_Left();

                        // 우단
                        objControlRight = objControls.appendChild(this.objToolsCreateDiv("controlsRight", ""));
                        var controlsModul = objControlRight.appendChild(this.objToolsCreateDiv("controlsModulSet", ""));
                        if (dataObject.roleplay != null) {
                                arFlagRole = new Array(dataObject.roleplay.length);
                                arButtonRole = new Array(dataObject.roleplay.length);
                                arBlockRole = new Array(dataObject.roleplay.length);
                                for (var ii = 0 ; ii < dataObject.roleplay.length ; ii++) {
                                        arFlagRole[ii] = false;
                                        var controlsRollbtn = $(objControlRight).append(this.objToolsCreateButton("controlsRollbtn0" + (ii + 1), "롤" + (ii + 1), "mpToggleRole(" + objectidx + ", " + ii + ")"));
                                        arButtonRole[ii] = $(controlsRollbtn).find(".controlsRollbtn0" + (ii + 1));
                                        arBlockRole[ii] = new Array(dataObject.roleplay[ii].length);
                                        for (var jj = 0 ; jj < dataObject.roleplay[ii].length ; jj++) {

                                        }
                                }
                        }
                        var controlsSlow = $(controlsModul).append(this.objToolsCreateButton("controlsSlow", "배속 0.1감소", "mpControlSpeed(" + objectidx + ", -0.1)"));
                        objLabelSpeed = controlsModul.appendChild(this.objToolsCreateDiv("Speed", "x1.0"));
                        var controlsFast = $(controlsModul).append(this.objToolsCreateButton("controlsFast", "배속 0.1증가", "mpControlSpeed(" + objectidx + ", 0.1)"));
                        var controlsSyncSbtn = $(controlsModul).append(this.objToolsCreateButton("controlsSyncSbtn", "구간반복시작", "mpSetRS(" + objectidx + ", 0)"));
                        var controlsSyncEbtn = $(controlsModul).append(this.objToolsCreateButton("controlsSyncEbtn", "구간반복종료", "mpSetRS(" + objectidx + ", 1)"));
                        objRSButtonA = $(controlsSyncSbtn).find(".controlsSyncSbtn");
                        objRSButtonB = $(controlsSyncEbtn).find(".controlsSyncEbtn");
                        var videobtnClose = $(objControlRight).append(this.objToolsCreateButton("videobtnClose", "", "mpClosePopupVideo(" + objectidx + ")"));

                        // 초기화
                        this.objShowControls(true);
                },
                objSetLayoutPopupContent: function () {
                        // 기본 연결
                        objContainer = document.getElementById(dataObject.container);
                        objVisible = document.getElementById(dataObject.visibleobj);
                        $(objContainer).append("<video poster=\"" + dataObject.poster + "\" width=\"" + dataObject.width + "\" height=\"" + dataObject.height + "\" webkit-playsinline=\"\" playsinline=\"\" data-dtext_index=\"dtext_cls_video\"><source src =\"" + dataObject.source + "\" type=\"video/mp4\"></source></video>");
                        objMedia = $(objContainer).find("video")[0];
                        $(objContainer).parent().width(dataObject.width);
                        $(objMedia).width(dataObject.width);
                        $(objMedia).height(dataObject.height);

                        // BG
                        objConBG = objContainer.appendChild(this.objToolsCreateDiv("controlsbg", ""));
                        $(objConBG).width($(objContainer).parent().width() - 10);

                        // 비디오 컨트롤러
                        objControls = objContainer.appendChild(this.objToolsCreateDiv("videoControls", ""));
                        $(objControls).width($(objContainer).parent().width() - 10);

                        // 상단
                        this.objSetLayout_Top();

                        // 좌단
                        this.objSetLayout_Left();

                        // 우단
                        objControlRight = objControls.appendChild(this.objToolsCreateDiv("controlsRight", ""));

                        // 롤
                        this.objSetLayout_Role();

                        // 우단계속
                        if ((dataObject.translation == null || dataObject.translation != "yes") == false) {
                                var btn_lang_on = $(objControlRight).append(this.objToolsCreateButton("btn_lang_on", "", "mpToggleTranslation(" + objectidx + ")"));
                                objButtonTranslation = $(btn_lang_on).find(".btn_lang_on");
                        }
                        var controlsModul = objControlRight.appendChild(this.objToolsCreateDiv("controlsModulSet", ""));
                        var controlsSlow = $(controlsModul).append(this.objToolsCreateButton("controlsSlow", "배속 0.1감소", "mpControlSpeed(" + objectidx + ", -0.1)"));
                        objLabelSpeed = controlsModul.appendChild(this.objToolsCreateDiv("Speed", "x1.0"));
                        var controlsFast = $(controlsModul).append(this.objToolsCreateButton("controlsFast", "배속 0.1증가", "mpControlSpeed(" + objectidx + ", 0.1)"));
                        var controlsSyncSbtn = $(controlsModul).append(this.objToolsCreateButton("controlsSyncSbtn", "구간반복시작", "mpSetRS(" + objectidx + ", 0)"));
                        var controlsSyncEbtn = $(controlsModul).append(this.objToolsCreateButton("controlsSyncEbtn", "구간반복종료", "mpSetRS(" + objectidx + ", 1)"));
                        objRSButtonA = $(controlsSyncSbtn).find(".controlsSyncSbtn");
                        objRSButtonB = $(controlsSyncEbtn).find(".controlsSyncEbtn");
                        var videobtnClose = $(objControlRight).append(this.objToolsCreateButton("videobtnClose", "", "mpClosePopupVideo(" + objectidx + ")"));

                        // 대본
                        objConCaption = objContainer.appendChild(this.objToolsCreateDiv("captionBox", ""));
                        objBgCaption = objConCaption.appendChild(this.objToolsCreateDiv("captionbg", ""));
                        if (dataObject.caption != null) {
                                arLabelCaption = new Array(dataObject.caption.length);
                                for (var ii = 0 ; ii < arLabelCaption.length ; ii++) {
                                        arLabelCaption[ii] = objBgCaption.appendChild(this.objToolsCreateDiv("captionObj", ""));
                                        if ((dataObject.roleplay == null || dataObject.roleplay == 0) == false) {
                                                arLabelCaption[ii].icon = arLabelCaption[ii].appendChild(this.objToolsCreateDiv("iconRoll0" + dataObject.caption[ii].role, ""));
                                        }
                                        arLabelCaption[ii].label = arLabelCaption[ii].appendChild(this.objToolsCreateDiv("captionTxt", dataObject.caption[ii].en));
                                        if ((dataObject.roleplay == null || dataObject.roleplay == 0) == false) {
                                                $(arLabelCaption[ii].label).css('padding-left', 50);
                                        }
                                }
                        }
                        this.objUpdateCaptionLabel();

                        // 초기화
                        this.objShowControls(true);
                },
                objSetLayoutLayerAudio: function () {
                        // 기본 연결
                        objContainer = document.getElementById(dataObject.container);
                        objVisible = document.getElementById(dataObject.visibleobj);
                        $(objContainer).append("<audio><source src =\"" + dataObject.source + "\" type=\"audio/mp3\"></source></audio>");
                        objMedia = $(objContainer).find("audio")[0];
                        objExtendLayout = $(objVisible).parent().append("<div class=\"audioScriptWin\"></div>");
                        objExtendLayout = $(objExtendLayout).find(".audioScriptWin")[0];
                        $(objExtendLayout).append("<div class=\"popupAudio\"></div>");
                        objExtendLayout.style.display = "none";
                        

                        // 오디오 컨트롤러
                        objControls = objContainer.appendChild(this.objToolsCreateDiv("audioControls", ""));

                        // 상단
                        this.objSetLayout_Top();

                        // 좌단
                        this.objSetLayout_Left();

                        // 우단
                        objControlRight = objControls.appendChild(this.objToolsCreateDiv("controlsRight", ""));
                        if ((dataObject.translation == null || dataObject.translation != "yes") == false) {
                                var btn_lang_on = $(objControlRight).append(this.objToolsCreateButton("btn_lang_on", "", "mpToggleTranslation(" + objectidx + ")"));
                                objButtonTranslation = $(btn_lang_on).find(".btn_lang_on")[0];
                                objButtonTranslation.style.display = "none";
                        }
                        var controlsModul = objControlRight.appendChild(this.objToolsCreateDiv("controlsModulSet", ""));
                        var controlsSlow = $(controlsModul).append(this.objToolsCreateButton("controlsSlow", "배속 0.1감소", "mpControlSpeed(" + objectidx + ", -0.1)"));
                        objLabelSpeed = controlsModul.appendChild(this.objToolsCreateDiv("Speed", "x1.0"));
                        var controlsFast = $(controlsModul).append(this.objToolsCreateButton("controlsFast", "배속 0.1증가", "mpControlSpeed(" + objectidx + ", 0.1)"));
                        var controlsSyncSbtn = $(controlsModul).append(this.objToolsCreateButton("controlsSyncSbtn", "구간반복시작", "mpSetRS(" + objectidx + ", 0)"));
                        var controlsSyncEbtn = $(controlsModul).append(this.objToolsCreateButton("controlsSyncEbtn", "구간반복종료", "mpSetRS(" + objectidx + ", 1)"));
                        objRSButtonA = $(controlsSyncSbtn).find(".controlsSyncSbtn");
                        objRSButtonB = $(controlsSyncEbtn).find(".controlsSyncEbtn");
                        if (dataObject.caption != null) {
                                var caption = $(objControlRight).append(this.objToolsCreateButton("caption", "자막", "mpOpenExtendAudio(" + objectidx + ")"));
                                objButtonSubtitle = $(caption).find(".caption");
                        }
                        var audiobtnClose = $(objControlRight).append(this.objToolsCreateButton("audiobtnClose", "", "mpClosePopupVideo(" + objectidx + ")"));

                        // 대본
                        objConCaption = objContainer.appendChild(this.objToolsCreateDiv("captionBox", ""));
                        objBgCaption = objConCaption.appendChild(this.objToolsCreateDiv("captionbg", ""));
                        if (dataObject.caption != null) {
                                arLabelCaption = new Array(dataObject.caption.length);
                                for (var ii = 0 ; ii < arLabelCaption.length ; ii++) {
                                        arLabelCaption[ii] = objBgCaption.appendChild(this.objToolsCreateDiv("captionObj", ""));
                                        if ((dataObject.roleplay == null || dataObject.roleplay == 0) == false) {
                                                arLabelCaption[ii].icon = arLabelCaption[ii].appendChild(this.objToolsCreateDiv("iconRoll0" + dataObject.caption[ii].role, ""));
                                        }
                                        arLabelCaption[ii].label = arLabelCaption[ii].appendChild(this.objToolsCreateDiv("captionTxt", dataObject.caption[ii].en));
                                        if ((dataObject.roleplay == null || dataObject.roleplay == 0) == false) {
                                                $(arLabelCaption[ii].label).css('padding-left', 50);
                                        }
                                }
                        }
                        this.objUpdateCaptionLabel();
                        objConCaption.style.display = "none";
                },
                objSetLayoutMiniAudio: function () {
                        // 기본 연결
                        objContainer = document.getElementById(dataObject.container);
                        objVisible = document.getElementById(dataObject.visibleobj);
                        $(objContainer).append("<audio><source src =\"" + dataObject.source + "\" type=\"audio/mp3\"></source></audio>");
                        objMedia = $(objContainer).find("audio")[0];

                        // 오디오 컨트롤러
                        objControls = objContainer.appendChild(this.objToolsCreateDiv("audioControls", ""));

                        // 좌단
                        this.objSetLayout_Left();
                },
                objSetLayoutPopupAudio: function () {
                        // 기본 연결
                        objContainer = document.getElementById(dataObject.container);
                        objVisible = document.getElementById(dataObject.visibleobj);
                        $(objContainer).append("<audio><source src =\"" + dataObject.source + "\" type=\"audio/mp3\"></source></audio>");
                        objMedia = $(objContainer).find("audio")[0];

                        // 오디오 컨트롤러
                        objControls = objContainer.appendChild(this.objToolsCreateDiv("audioControls", ""));

                        // 상단
                        this.objSetLayout_Top();

                        // 좌단
                        this.objSetLayout_Left();

                        // 우단
                        objControlRight = objControls.appendChild(this.objToolsCreateDiv("controlsRight", ""));
                        var controlsSyncSbtn = $(objControlRight).append(this.objToolsCreateButton("controlsSyncSbtn", "구간반복시작", "mpSetRS(" + objectidx + ", 0)"));
                        var controlsSyncEbtn = $(objControlRight).append(this.objToolsCreateButton("controlsSyncEbtn", "구간반복종료", "mpSetRS(" + objectidx + ", 1)"));

                        // 대본
                        var captionBox = objContainer.appendChild(this.objToolsCreateDiv("captionBox", ""));
                        var captionbg = captionBox.appendChild(this.objToolsCreateDiv("captionbg", ""));
                        if (dataObject.caption != null) {
                                arLabelCaption = new Array(dataObject.caption.length);
                                for (var ii = 0 ; ii < arLabelCaption.length ; ii++) {
                                        arLabelCaption[ii].label = captionbg.appendChild(this.objToolsCreateDiv("captionTxt", dataObject.caption[ii].kr));
                                }
                        }
                },
                objSetLayout_Top: function () {
                        // 컨테이너
                        objControlTop = objControls.appendChild(this.objToolsCreateDiv("controlsTop", ""));

                        // 시간
                        objControlBar = objControlTop.appendChild(this.objToolsCreateDiv("objControlBar", ""));
                        objBarTime = objControlBar.appendChild(this.objToolsCreateDiv("controlsPlayBar", ""));
                        objBarTime.appendChild(this.objToolsCreateDiv("controlsPlayLine", ""));
                        objProgTime = objBarTime.appendChild(this.objToolsCreateDiv("controlsProgress", ""));
                        objBlockTime = objBarTime.appendChild(this.objToolsCreateDiv("controlsPlayBarBtn", ""));

                        // 구간 반복
                        objRSBlockA = objControlBar.appendChild(this.objToolsCreateDiv("controlsSyncStart", "구간반복시작"));
                        objRSBlockA.style["visibility"] = "hidden";
                        objRSBlockB = objControlBar.appendChild(this.objToolsCreateDiv("controlsSyncEnd", "구간반복종료"));
                        objRSBlockB.style["visibility"] = "hidden";

                        // RP
                        var controlsRoll = objControlBar.appendChild(this.objToolsCreateDiv("controlsRoll", "롤1"));
                        controlsRoll.style["visibility"] = "hidden";

                        // 시간 레이블
                        var time = objControls.appendChild(this.objToolsCreateDiv("time", ""));
                        objLabelTime = time.appendChild(this.objToolsCreateSpan("curtime", "00:00"));
                        var divider = time.appendChild(this.objToolsCreateSpan("curtime", " : "));
                        objLabelDuration = time.appendChild(this.objToolsCreateSpan("durtime", "00:00"));
                },
                objSetLayout_Left: function () {
                        // 컨테이너
                        var controlsLeft = objControls.appendChild(this.objToolsCreateDiv("controlsLeft", ""));

                        // 재생
                        objButtonPlay = $(controlsLeft).append(this.objToolsCreateButton("controlsPlay", "재생/일시정지", "mpPlayMovie(" + objectidx + ")"));
                        objButtonPlay = $(objButtonPlay).find("button")[0];

                        // 멈춤
                        var controlsStop = $(controlsLeft).append(this.objToolsCreateButton("controlsStop", "정지 버튼", "mpStopMovie(" + objectidx + ")"));
                        
                        // 볼륨
                        var controlsSound = $(controlsLeft).append(this.objToolsCreateButton("controlsSound", "음성", "mpToggleVol(" + objectidx + ")"));
                        objButtonVol = (controlsSound).find(".controlsSound");
                        objBarVol = controlsLeft.appendChild(this.objToolsCreateDiv("SoundPlayBar", ""));
                        objBarVol.appendChild(this.objToolsCreateDiv("SoundPlayLine", ""));
                        objProgVol = objBarVol.appendChild(this.objToolsCreateDiv("SoundProgress", ""));
                        objBlockVol = objBarVol.appendChild(this.objToolsCreateDiv("SoundPlayBarBtn", ""));
                        objProgVol.style["width"] = "100%";
                        objBlockVol.style["left"] = "100%";
                },
                objSetLayout_Role: function () {
                        arFlagRole = new Array(dataObject.roleplay); // 플래그 배열
                        arButtonRole = new Array(dataObject.roleplay); // 롤 버튼 배열
                        arBlockRole = new Array(dataObject.roleplay); // 롤 블럭 배열 (2차원 배열)
                        arArrayRole = new Array(dataObject.roleplay); // 롤 데이터 배열
                        for (var ii = 0 ; ii < dataObject.roleplay ; ii++) {
                                arFlagRole[ii] = true;
                                var controlsRollbtn = $(objControlRight).append(this.objToolsCreateButton("controlsRollbtn0" + (ii + 1), "롤" + (ii + 1), "mpToggleRole(" + objectidx + ", " + ii + ")"));
                                arButtonRole[ii] = $(controlsRollbtn).find(".controlsRollbtn0" + (ii + 1));
                                arArrayRole[ii] = this.objToolsGetRole(ii);
                                arBlockRole[ii] = new Array(arArrayRole[ii].length);
                                for (var jj = 0 ; jj < arArrayRole[ii].length ; jj++) {
                                        var temp = $(objBarTime).append(this.objToolsCreateButton("controlsRoll0" + (ii + 1), "롤블럭", "mpCastRoleButton(" + objectidx + ", " + ii + ", " + jj + ")", "btn" + ii + "_" + jj));
                                        arBlockRole[ii][jj] = temp.find("#btn" + ii + "_" + jj);
                                }
                                this.objUpdateRole(ii);
                        }
                },
                objUpdateLayout: function () {
                        // inline_video
                        if (dataObject.layout == "inline_video") {
                                $(objControls).width($(objMedia).width() - 40);
                                $(objConBG).width($(objMedia).width() - 40);
                                $(objContainerSubtitle).width($(objMedia).width());
                                $(objControls).css('left', 20);
                                $(objConBG).css('left', 20);
                                if (bShowControls == true) {
                                        $(objContainerSubtitle).css('top', $(objContainer).height() - $(objContainerSubtitle).height() - 80);
                                } else {
                                        $(objContainerSubtitle).css('top', $(objContainer).height() - $(objContainerSubtitle).height() - 10);
                                }
                        }

                        // alone_content
                        if (dataObject.layout == "alone_content") {
                                var parent_width = $(objContainer).parent().parent().width();
                                var parent_height = $(objContainer).parent().parent().height();
                                var child_width = dataObject.width;
                                var child_height = dataObject.height + $(objControls).height();
                                $(objContainer).parent().css({ top: (parent_height - child_height) / 2, left: (parent_width - child_width) / 2 });
                                $(objControls).parent().parent().height(child_height);
                        }

                        // popup_content
                        if (dataObject.layout == "popup_content") {
                                var parent_width = $(objContainer).parent().parent().width();
                                var parent_height = $(objContainer).parent().height();
                                var child_width = dataObject.width;
                                var child_height = dataObject.height + $(objControls).height();
                                $(objContainer).parent().css({ left: (parent_width - child_width) / 2 });
                                $(objControls).css({ top: dataObject.height });
                                $(objBgCaption).height(parent_height - child_height - 60);
                        }

                        // 버튼
                        if (dataObject.subtitle != null) {
                                if (bShowSubtitle == true) {
                                        $(objButtonSubtitle).removeClass("caption");
                                        $(objButtonSubtitle).addClass("caption_on");
                                } else {
                                        $(objButtonSubtitle).removeClass("caption_on");
                                        $(objButtonSubtitle).addClass("caption");
                                }
                        }
                        if (bFullScreen == true) {
                                $(objButtonFullscreen).removeClass("fullsize");
                                $(objButtonFullscreen).addClass("fullsize_on");
                        } else {
                                $(objButtonFullscreen).removeClass("fullsize_on");
                                $(objButtonFullscreen).addClass("fullsize");
                        }
                        if (bVolOn == true) {
                                $(objButtonVol).removeClass("controlsSound");
                                $(objButtonVol).addClass("controlsSound_on");
                        } else {
                                $(objButtonVol).removeClass("controlsSound_on");
                                $(objButtonVol).addClass("controlsSound");
                        }

                        // 구간반복 블럭
                        if ($(objRSBlockA).css("visibility") == "visible") {
                                $(objRSBlockA).css("left", ($(objBarTime).width() * (percentageRSA * 0.01)) - 5);
                        }
                        if ($(objRSBlockB).css("visibility") == "visible") {
                                $(objRSBlockB).css("left", ($(objBarTime).width() * (percentageRSB * 0.01)) - 5);
                        }

                        // 롤
                        if (arArrayRole != null) {
                                for (var ii = 0 ; ii < dataObject.roleplay ; ii++) {
                                        for (var jj = 0 ; jj < arArrayRole[ii].length ; jj++) {
                                                var btn = arBlockRole[ii][jj];
                                                var data = arArrayRole[ii][jj];
                                                var maxduration = objMedia.duration;
                                                var percentage = 100 * (data.start / maxduration);
                                                $(btn).css("left", ($(objBarTime).width() * (percentage * 0.01)) - 20);
                                        }
                                }
                        }
                },

                // 전역 이벤트
                objOnPlay: function (event) {
                        // 버튼 갱신
                        dataObject.object.objUpdatePlayButton();

                        // 플레이
                        customOnPlay(objectidx);
                },
                objOnPause: function (event) {
                        // 버튼 갱신
                        dataObject.object.objUpdatePlayButton();

                        // 멈출 때 호출
                        customOnPause(objectidx);
                },
                objOnEnded: function (event) {
                        // 버튼 갱신
                        mpStopMovie(objectidx);

                        // 멈출때 호출
                        customOnEnd(objectidx);
                },
                objOnTimeUpdate: function (event) {
                        // 준비
                        var ct = objMedia.currentTime;
                        var dur = objMedia.duration;

                        // 시간레이블
                        if (objLabelTime != null) {
                                var min = Math.floor(ct / 60);
                                var sec = Math.floor(ct % 60);
                                objLabelTime.textContent = dataObject.object.objToolsLeadingZeros(min, 2) + ":" + dataObject.object.objToolsLeadingZeros(sec, 2);
                        }

                        // 시간바
                        var percentage = (100 / dur) * ct;

                        // 바 갱신
                        if (objBarTime != null) {
                                objProgTime.style["width"] = percentage + "%";
                                objBlockTime.style["left"] = percentage + "%";
                        }
                        
                        // 커스텀
                        customOnTimeUpdate(objectidx, percentage);

                        // 구간반복 체크
                        if (bRepeatSection == true) {
                                if (pointRSB < ct) { // 넘어갔으면
                                        dataObject.object.objMoveTo(pointRSA); // 이동
                                        if (objMedia.paused) objMedia.play(); // 멈췄으면 플레이
                                } else if (ct < pointRSA) {
                                        dataObject.object.objMoveTo(pointRSA); // 이동
                                }
                        }

                        // 자막
                        dataObject.object.objProcSubtitle(ct);

                        // 대본
                        dataObject.object.objProcCaption(ct);
                },

                // 마우스 이벤트
                onTimebarMouseDown: function (event) {
                        // 플래그
                        bTimeDrag = true;

                        // 갱신
                        dataObject.object.objUpdateTimebar(event.pageX);
                },
                onVolbarMouseDown: function (event) {
                        // 플래그
                        bVolDrag = true;

                        // 갱신
                        dataObject.object.objUpdateVolbar(event.pagex);
                },
                onDocumentMouseUp: function (event) {
                        // 시간바 드래그
                        if (bTimeDrag == true) {
                                bTimeDrag = false;
                                dataObject.object.objUpdateTimebar(event.pageX);
                        }

                        // 볼륨바 드래그
                        if (bVolDrag == true) {
                                bVolDrag = false;
                                dataObject.object.objUpdateVolbar(event.pageX);
                        }
                },
                onDocumentMouseMove: function (event) {
                        // 시간바 드래그
                        if (bTimeDrag == true) { dataObject.object.objUpdateTimebar(event.pageX); }

                        // 볼륨바 드래그
                        if (bVolDrag == true) { dataObject.object.objUpdateVolbar(event.pageX); }
                        
                        // 체크
                        if (dataObject.layout == "inline_video" && bReady == true) {
                                // 전체화면 아닐 때
                                if (bFullScreen == false) {
                                        if (event.clientX >= $(objContainer).offset().left && event.clientX <= $(objContainer).offset().left + dataObject.width && event.clientY >= $(objContainer).offset().top && event.clientY <= $(objContainer).offset().top + dataObject.height) {
                                                if (bShowControls == false) { dataObject.object.objShowControls(true); }
                                        } else {
                                                if (bShowControls == true) { dataObject.object.objShowControls(false); }
                                        }
                                } else {
                                        if (event.clientX >= $(objContainer).offset().left && event.clientX <= $(objContainer).offset().left + $(objContainer).width() && $(objContainer).height() - $(objControls).height() - 20 <= event.clientY && event.clientY <= $(objContainer).offset().top + $(objContainer).height()) {
                                                if (bShowControls == false) { dataObject.object.objShowControls(true); }
                                        } else {
                                                if (bShowControls == true) { dataObject.object.objShowControls(false); }
                                        }
                                }
                        }
                },

                // 도구 함수 : 자리수 채우기(숫자, 자리수)
                objToolsLeadingZeros: function (n, digits) {
                        var zero = '';
                        n = n.toString();

                        if (n.length < digits) {
                                for (var i = 0; i < digits - n.length; i++)
                                        zero += '0';
                        }
                        return zero + n;
                },

                // 도구 Ios Mobile 판별
                objIsAppleMobile:function () {
                        if (navigator && navigator.userAgent && navigator.userAgent != null) {
                                var strUserAgent = navigator.userAgent.toLowerCase();
                                var arrMatches = strUserAgent.match(/(iphone|ipod|ipad)/);
                                if (arrMatches != null) {
                                        return true;
                                }
                        }

                        return false;
                },

                // 도구 caption 검색해서 각 정보 얻어오기
                objToolsGetRole:function(idx) {
                        // 조건검사
                        if (dataObject.roleplay == null) return;

                        // 준비
                        var rtn = [];

                        // 반복
                        for (var ii = 0 ; ii < dataObject.caption.length ; ii++) {
                                var obj = dataObject.caption[ii];
                                if (obj.role == idx + 1) {
                                        rtn.push(obj); // 해당 캡션 오브젝트를 배열로 준비
                                }
                        }

                        // 반환
                        return rtn;
                },

                // document element 생성
                objToolsCreateDiv: function (cl, tc) {
                        var rtn = document.createElement('div');
                        rtn.className = cl;
                        rtn.textContent = tc;
                        return rtn;
                },
                objToolsCreateSpan: function (cl, tc) {
                        var rtn = document.createElement('span');
                        rtn.className = cl;
                        rtn.textContent = tc;
                        return rtn;
                },
                objToolsCreateButton: function (cl, tc, click) {
                        return "<button class=\"" + cl + "\" onclick=\"" + click + "\">" + tc + "</button>";
                },
                objToolsCreateButton: function (cl, tc, click, id) {
                        return "<button id=\"" + id + "\" class=\"" + cl + "\" onclick=\"" + click + "\">" + tc + "</button>";
                },






                ///// function

                // 소스 지정
                objSetSource: function (src) {
                        objMedia.setAttribute("src", src);
                },

                // 메인 재생
                objPlayMain: function () {
                        bReady = true;
                        this.objPlayMovie();
                        objButtonMainplay.style["visibility"] = "hidden";
                        this.objShowControls(true);
                },

                // 재생속도 변경
                objControlSpeed: function (modify) {
                        // 갱신
                        objMedia.playbackRate += modify;
                        if (objMedia.playbackRate < 0.1) {
                                objMedia.playbackRate = 0.1;
                        }

                        // 레이블 갱신
                        if (objLabelSpeed != null) {
                                var str_speed = "X";
                                if (objMedia.playbackRate == 1) {
                                        str_speed = "X1.0";
                                } else {
                                        str_speed = "X" + objMedia.playbackRate;
                                        str_speed = str_speed.substr(0, 4);
                                }
                                objLabelSpeed.textContent = str_speed;
                        }
                },

                // 재생, 멈춤
                objPlayMovie: function () {
                        // 동작
                        if (objMedia.paused) {
                                objMedia.play();
                        } else {
                                objMedia.pause();
                        }
                },
                objStopMovie: function () {
                        // 재생 중이면 멈춤
                        if (objMedia.paused == false) {
                                this.objPlayMovie();
                        }

                        // 재생시간 초기화
                        objMedia.currentTime = 0;
                },
                objMoveTo: function (time) { objMedia.currentTime = time; },

                // 볼륨 관련
                objToggleVol: function() {
                        // 동작
                        if (bVolOn == true) {
                                volPrev = objMedia.volume;
                                objMedia.volume = 0;
                                bVolOn = false;
                        } else {
                                objMedia.volume = volPrev;
                                console.log("볼륨:" + volPrev);
                                bVolOn = true;
                        }

                        // 이동
                        objProgVol.style["width"] = (objMedia.volume * 100) + "%";

                        // 레이아웃 갱신
                        this.objUpdateLayout();
                },
                objUpdateVolbar: function (xx) {
                        // 계산
                        var position = xx - $(objBarVol).offset().left;
                        var percentage = 100 * position / $(objBarVol).width();
                        if (percentage > 100) { percentage = 100; }
                        if (percentage < 0) { percentage = 0; }

                        // 동작
                        objMedia.volume = percentage * 0.01;

                        // 이동
                        objProgVol.style["width"] = percentage + "%";
                },

                // 진행바 관련
                objUpdateTimebar: function (xx) {
                        // 계산
                        var maxduration = objMedia.duration;
                        var position = xx - $(objBarTime).offset().left;
                        var percentage = 100 * position / $(objBarTime).width();
                        if (percentage > 100) { percentage = 100; }
                        if (percentage < 0) { percentage = 0; }

                        // 이동
                        this.objMoveTo(maxduration * percentage / 100);
                },

                // 구간반복
                objSetRS: function (point) {
                        // 준비
                        var maxduration = objMedia.duration;

                        // 분기
                        switch (point) {
                                case 0: // 트리거 A
                                        if (pointRSA == -1) {
                                                pointRSA = objMedia.currentTime; // 시간기록
                                                percentageRSA = (pointRSA / maxduration) * 100;
                                        } else {
                                                pointRSA = -1; // 시간기록 취소
                                        }
                                        break;
                                case 1: // 트리거 B
                                        if (pointRSB == -1) {
                                                pointRSB = objMedia.currentTime; // 시간기록
                                                percentageRSB = (pointRSB / maxduration) * 100;
                                        } else {
                                                pointRSB = -1; // 시간기록 취소
                                        }
                                        break;
                        }

                        // 활성화 판단
                        if (pointRSA != -1 && pointRSB != -1) {
                                // 반복구간 보정 : A 가 B 보다 뒤 일 경우 A 와 B 를 교체
                                if (pointRSA > pointRSB) {
                                        var teobj = pointRSA;
                                        pointRSA = pointRSB;
                                        pointRSB = teobj;
                                        var tepx = percentageRSA;
                                        percentageRSA = percentageRSB;
                                        percentageRSB = tepx;
                                }

                                // 플래그
                                bRepeatSection = true;
                        } else {
                                bRepeatSection = false;
                        }

                        // 블럭 및 버튼 갱신
                        if (pointRSA != -1) {
                                objRSBlockA.style["visibility"] = "visible";
                                $(objRSBlockA).css("left", ($(objBarTime).width() * (percentageRSA * 0.01)) - 5);
                                $(objRSButtonA).removeClass("controlsSyncSbtn");
                                $(objRSButtonA).addClass("controlsSyncSbtn_on");
                        } else {
                                objRSBlockA.style["visibility"] = "hidden";
                                $(objRSButtonA).removeClass("controlsSyncSbtn_on");
                                $(objRSButtonA).addClass("controlsSyncSbtn");
                        }
                        if (pointRSB != -1) {
                                objRSBlockB.style["visibility"] = "visible";
                                $(objRSBlockB).css("left", ($(objBarTime).width() * (percentageRSB * 0.01)) - 5);
                                $(objRSButtonB).removeClass("controlsSyncEbtn");
                                $(objRSButtonB).addClass("controlsSyncEbtn_on");
                        } else {
                                objRSBlockB.style["visibility"] = "hidden";
                                $(objRSButtonB).removeClass("controlsSyncEbtn_on");
                                $(objRSButtonB).addClass("controlsSyncEbtn");
                        }

                        // 커스텀
                        customSetRS(objectidx, maxduration, percentageRSA, percentageRSB);
                },

                // 전체화면
                objToggleFullscreen: function () {
                        // 분기
                        if (bFullScreen == false) { this.objCastFullScreen(); }
                        else { this.objCastNormalScreen(); }
                },
                objCastFullScreen: function () {
                        // 실행
                        if (this.objIsAppleMobile() == true) {
                                if (objMedia.webkitEnterFullScreen) {
                                        objMedia.webkitEnterFullScreen();
                                        return;
                                }
                        } else {
                                if (objContainer.requestFullscreen) {
                                        objContainer.requestFullscreen();
                                        //objMedia.requestFullscreen();
                                } else if (objContainer.mozRequestFullScreen) {
                                        objContainer.mozRequestFullScreen();
                                        //objMedia.mozRequestFullScreen();
                                } else if (objContainer.webkitRequestFullscreen) {
                                        objContainer.webkitRequestFullscreen();
                                        //objMedia.webkitRequestFullscreen();
                                } else if (objContainer.msRequestFullscreen) {
                                        objContainer.msRequestFullscreen();
                                        //objMedia.msRequestFullscreen();
                                }
                        }
                       
                        // 사이즈 조정
                        $(objContainer).css({ 'width': '100%' });
                        $(objContainer).css({ 'height': '100%' });
                        $(objMedia).css({ 'width': '100%' });
                        $(objMedia).css({ 'height': '100%' });

                        // 전역 변수
                        mpCurrentFullscreen = objectidx;

                        // 커스텀
                        customCastFullScreen(objectidx);

                        // 플래그
                        bFullScreen = true;
                        bShowControls = false;

                        // 컨테이너 숨김
                        this.objShowControls(false);

                        // 크롬 objContainer height 갱신 문제로 지연시간 설정 (불안하니 3개)
                        setTimeout("mpUpdateLayout(" + objectidx + ")", 100);
                        setTimeout("mpUpdateLayout(" + objectidx + ")", 200);
                        setTimeout("mpUpdateLayout(" + objectidx + ")", 300);
                },
                objOnFullScreen: function () {},
                objCastNormalScreen: function () {
                        // 실행
                        if (document.exitFullscreen) {
                                document.exitFullscreen();
                                //objMedia.exitFullscreen();
                        } else if (document.mozCancelFullScreen) {
                                document.mozCancelFullScreen();
                                //objMedia.mozCancelFullScreen();
                        } else if (document.webkitExitFullscreen) {
                                document.webkitExitFullscreen();
                                //objMedia.webkitExitFullscreen();
                        } else if (document.msExitFullscreen) {
                                document.msExitFullscreen();
                                //objMedia.msExitFullscreen();
                        }

                        // 커스텀
                        customCastNormalScreen(objectidx);
                },
                objOnNormalScreen: function () {
                        // 플래그
                        bFullScreen = false;
                        bShowControls = true;
                        
                        // 컨테이너 보임
                        this.objShowControls(true);
                },

                // 자막(한 줄 씩 보이는 형식)
                objProcSubtitle: function (ct) {
                        // 조건검사
                        if (objLabelSubtitle == null) return;
                        if (dataObject.subtitle == null) return;

                        // 대본 배열 검색
                        var idx = this.objCheckSubtitle(ct); // -1 은 현재 구간에 대본 없음

                        // 처리
                        if (idx == -1) { objLabelSubtitle.textContent = ""; }
                        else { objLabelSubtitle.textContent = dataObject.subtitle[idx].en; }
                },
                objCheckSubtitle: function (ct) {
                        // 검색
                        for (var ii = 0 ; ii < dataObject.subtitle.length ; ii++) {
                                if (dataObject.subtitle[ii].start <= ct && ct <= dataObject.subtitle[ii].end) {
                                        return ii;
                                }
                        }

                        // 반환
                        return -1;
                },
                objToggleSubtitle: function () {
                        // 조건검사
                        if (objContainerSubtitle == null) return;

                        // 가시여부
                        if (objContainerSubtitle.style["display"] == "block") {
                                objContainerSubtitle.style["display"] = "none";
                                bShowSubtitle = false;
                        } else {
                                objContainerSubtitle.style["display"] = "block";
                                bShowSubtitle = true;
                        }

                        // 레이아웃 갱신
                        this.objUpdateLayout();
                },

                // 대본(여러줄 중 하나가 강조되는 형식)
                objProcCaption: function (ct) {
                        // 조건검사
                        if (dataObject.caption == null) return;

                        // 대본 배열 검색
                        var idx = this.objCheckCaption(ct); // -1 은 현재 구간에 대본 없음

                        // 롤에 의한 뮤트 처리
                        if ((dataObject.roleplay == null || dataObject.roleplay == 0) == false) {
                                if (idx == -1) {
                                        objMedia.muted = false;
                                } else {
                                        if (arFlagRole[dataObject.caption[idx].role - 1] == true) {
                                                objMedia.muted = false;
                                        } else {
                                                objMedia.muted = true;
                                        }
                                }
                        }

                        // 처리
                        for (var ii = 0 ; ii < arLabelCaption.length ; ii++) {
                                if (ii == idx) {
                                        arLabelCaption[ii].label.style.color = "#faffaa";
                                } else {
                                        arLabelCaption[ii].label.style.color = "#eaeaea";
                                }
                        }
                },
                objCheckCaption: function (ct) {
                        // 검색
                        for (var ii = 0 ; ii < dataObject.caption.length ; ii++) {
                                if (dataObject.caption[ii].start <= ct && ct <= dataObject.caption[ii].end) {
                                        return ii;
                                }
                        }

                        // 반환
                        return -1;
                },
                objToggleTranslation: function() {
                        if (bShowTranslation == false) {
                                // 버튼 갱신
                                if (objButtonTranslation != null) {
                                        $(objButtonTranslation).removeClass("btn_lang_on");
                                        $(objButtonTranslation).addClass("btn_lang_off");
                                }

                                // 플래그
                                bShowTranslation = true;

                                // 레이블 갱신
                                this.objUpdateCaptionLabel();
                        } else {
                                // 버튼 갱신
                                if (objButtonTranslation != null) {
                                        $(objButtonTranslation).removeClass("btn_lang_off");
                                        $(objButtonTranslation).addClass("btn_lang_on");
                                }

                                // 플래그
                                bShowTranslation = false;

                                // 레이블 갱신
                                this.objUpdateCaptionLabel();
                        }
                },
                objUpdateCaptionLabel:function() {
                        // 조건검사 (아 진짜 스크립트...)
                        if (arLabelCaption == null) return;

                        // 변수
                        var margin_bottom_enkr = 0;
                        var margin_bottom_en = 0;
                        switch (dataObject.layout) {
                                case "popup_content" : 
                                        margin_bottom_enkr = 36;
                                        margin_bottom_en = 6;
                                        break;
                                case "layer_audio":
                                        margin_bottom_enkr = 4;
                                        margin_bottom_en = 0;
                                        break;
                        }

                        // 번역 관련
                        for (var ii = 0 ; ii < arLabelCaption.length ; ii++) {
                                if (bShowTranslation == true) {
                                        arLabelCaption[ii].label.textContent = dataObject.caption[ii].en + "\n" + dataObject.caption[ii].kr;

                                        var ar = arLabelCaption[ii].label.textContent.split("\n");
                                        var revise = (ar.length - 2) * 25;

                                        $(arLabelCaption[ii].icon).css('margin-top', 5 + 'px');
                                        $(arLabelCaption[ii].label).css('margin-bottom', (margin_bottom_enkr + revise) + 'px');
                                } else {
                                        arLabelCaption[ii].label.textContent = dataObject.caption[ii].en;

                                        var ar = arLabelCaption[ii].label.textContent.split("\n");
                                        var revise = (ar.length - 1) * 25;

                                        $(arLabelCaption[ii].icon).css('margin-top', -10 + 'px');
                                        $(arLabelCaption[ii].label).css('margin-bottom', (margin_bottom_en + revise) + 'px');
                                }
                        }

                        // 롤 관련
                        if ((dataObject.roleplay == null || dataObject.roleplay == 0) == false) {
                                for (var ii = 0 ; ii < arLabelCaption.length ; ii++) {
                                        if (arFlagRole[dataObject.caption[ii].role - 1] === false) {
                                                $(arLabelCaption[ii].icon).removeClass("iconRoll0" + dataObject.caption[ii].role + "_on");
                                                $(arLabelCaption[ii].icon).addClass("iconRoll0" + dataObject.caption[ii].role);
                                                //arLabelCaption[ii].style["display"] = "none";
                                        } else {
                                                $(arLabelCaption[ii].icon).removeClass("iconRoll0" + dataObject.caption[ii].role);
                                                $(arLabelCaption[ii].icon).addClass("iconRoll0" + dataObject.caption[ii].role + "_on");
                                                //arLabelCaption[ii].style["display"] = "block";
                                        }
                                }
                        }
                },

                // 가시여부
                objToggleVisible: function () {
                        if (bExtended == true) {
                                this.objOpenExtendAudio(true);
                                objVisible.style["display"] = "none";
                                this.objStopMovie();
                        } else if (objVisible.style["display"] === "none") {
                                objVisible.style["display"] = "inline-block";
                                this.objUpdateLayout();
                                this.objStopMovie();
                                this.objPlayMovie();
                        } else {
                                objVisible.style["display"] = "none";
                                this.objStopMovie();
                        }
                },
                objSetVisible: function (b) {
                        if (b == true) {
                                objVisible.style["display"] = "block";
                        } else {
                                if (bExtended == true) {
                                        this.objOpenExtendAudio(true);
                                        this.objStopMovie();
                                }
                                objVisible.style["display"] = "none";
                        }
                },
                objShowControls: function (show) {
                        if (show == true) {
                                if (objConBG != null) $(objConBG).css("display", "inline-block");
                                $(objControls).css("display", "inline-block");
                                bShowControls = true;
                        } else {
                                if (objConBG != null) $(objConBG).css("display", "none");
                                $(objControls).css("display", "none");
                                bShowControls = false;
                        }

                        // 레이아웃 갱신
                        this.objUpdateLayout();
                },

                // 버튼 갱신
                objUpdatePlayButton: function () {
                        // 조건검사
                        if (objButtonPlay == null) return;

                        // 동작
                        if (objMedia.paused) {
                                $(objButtonPlay).removeClass("controlsPause");
                                $(objButtonPlay).addClass("controlsPlay");
                        } else {
                                $(objButtonPlay).removeClass("controlsPlay");
                                $(objButtonPlay).addClass("controlsPause");
                        }
                },

                // 롤플레이
                objToggleRole: function (no) {
                        if (arFlagRole[no] == false) {
                                arFlagRole[no] = true;
                        } else {
                                arFlagRole[no] = false;
                        }
                        this.objUpdateRole(no);
                },
                objUpdateRole: function(no) {
                        if (arFlagRole[no] == false) {
                                $(arButtonRole[no]).removeClass("controlsRollbtn0" + (no + 1) + "_on");
                                $(arButtonRole[no]).addClass("controlsRollbtn0" + (no + 1));
                                for (var ii = 0 ; ii < arBlockRole[no].length ; ii++) {
                                        $(arBlockRole[no][ii]).css('visibility', 'hidden');
                                }
                        } else {
                                $(arButtonRole[no]).removeClass("controlsRollbtn0" + (no + 1));
                                $(arButtonRole[no]).addClass("controlsRollbtn0" + (no + 1) + "_on");
                                for (var ii = 0 ; ii < arBlockRole[no].length ; ii++) {
                                        $(arBlockRole[no][ii]).css('visibility', 'visible');
                                }
                        }

                        this.objUpdateCaptionLabel();
                },
                objCastRoleButton: function (ii, jj) {
                        bTimeDrag = false;
                        var data = arArrayRole[ii][jj];
                        this.objMoveTo(data.start);
                },

                // 확장
                objOpenExtendAudio: function (force) {
                        if (bExtended == false) { // 확장 열기
                                // 다른 확장 팝업 체크
                                mpCheckExtend();

                                // 가져다 붙이고, 숨기고, 보이게 하고
                                $(objContainer).appendTo($(objExtendLayout));
                                objVisible.style.display = "none";
                                objExtendLayout.style.display = "block";
                                objConCaption.style.display = "block";

                                // 버튼 갱신
                                $(objButtonSubtitle).removeClass("caption");
                                $(objButtonSubtitle).addClass("caption_on");
                                if (objButtonTranslation != null) {
                                        objButtonTranslation.style.display = "block";
                                }

                                // 플래그
                                bExtended = true;

                                // 왜 멈추지?
                                if (objMedia.paused) {
                                        objMedia.play();
                                }

                                // 레이아웃 갱신
                                this.objUpdateLayout();
                        } else { // 확장 닫기
                                // 가져다 붙이고, 숨기고, 보이게 하고
                                $(objContainer).appendTo($(objVisible));
                                objVisible.style.display = "block";
                                objExtendLayout.style.display = "none";
                                objConCaption.style.display = "none";

                                // 버튼 갱신
                                $(objButtonSubtitle).removeClass("caption_on");
                                $(objButtonSubtitle).addClass("caption");
                                if (objButtonTranslation != null) {
                                        objButtonTranslation.style.display = "none";
                                }

                                // 플래그
                                bExtended = false;

                                // 왜 멈추지?
                                if (force == false && objMedia.paused) {
                                        objMedia.play();
                                }

                                // 레이아웃 갱신
                                this.objUpdateLayout();
                        }
                },
                objCheckExtend: function () {
                        // 확장 체크. 다른 레이어 오디오를 확장할 때 기존에 확장되어 있던 오디오는 닫기
                        if (bExtended == true) {
                                this.objStopMovie();
                                this.objSetVisible(false);
                        }
                }
        }
}