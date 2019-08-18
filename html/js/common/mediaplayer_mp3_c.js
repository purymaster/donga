///// mp3_c
var objMediaPlayer_mp3_c = function () {

        ///// variables

        // module
        var _platform = "DA"; // 플랫폼
        var _type = "mp3_c"; // 타입
        var _div; // 미디어 플레이어 생성을 호출한 Div
        var _this; // 클래스
        var _category; // audio or video
        var _file; // 음원 파일
        var _tracker; // 추적자
        var _module; // 모듈
        var _compo; // 컴포
        var _link; // 연결



        ///// custom

        // set
        var i_set_popup_x; // 팝업 x 위치
        var i_set_popup_y;

        // option
        var b_option_caption = false; // 대본 여부
        var i_option_pair = 0; // 보통빠르게 여부 0:없음, 1:보통, 2:빠르게
        var s_option_pair = ""; // 짝을 이루는 미디어플레이어의 mpid

        // state
        var i_state_layout = 0; // 현재 레이아웃 (0:안보임 1:팝업 2:확장)





        ///// functions
        return {

                ///// sharing code (항상 복붙 가능하게 유지할 것)

                // 전달받음
                onJSONLoaded: function () { this.onStart(); },

                // 참조
                setVar: function (str, val) {
                        // 분기
                        switch (str) {
                                case "_file": _file = val; return;
                                case "_link": _link = val; return;
                        }

                        // 메세지
                        console.log(" # getVar 오류 : 호출한 변수 " + str + " 가 연결되지 않았습니다(타입:" + _type + " DIV:" + _div.outerHTML + ").");
                },
                getVar: function (str) {
                        // 분기
                        switch (str) {
                                case "_div": return _div;
                                case "_this": return _this;
                                case "_category": return _category;
                                case "_type": return _type;
                                case "_file": return _file;
                                case "_tracker": return _tracker;
                                case "_module": return _module;
                                case "_compo": return _compo;
                                case "_platform": return _platform;
                        }

                        // 메세지
                        console.log(" # getVar 오류 : 호출한 변수 " + str + " 가 연결되지 않았습니다(타입:" + _type + " DIV:" + _div.outerHTML + ").");
                },

                // 리셋
                reset: function () { this.onReset(); },

                // 초기화
                init: function (p_div) {
                        // 준비
                        var source_type; // audio or video

                        // 기본
                        _div = p_div;
                        _this = this;
                        _category = ($(_div).data("audio") == null) ? "video" : "audio";
                        _file = ($(_div).data("audio") == null) ? $(_div).data("video") : $(_div).data("audio");
                        _tracker = {};
                        _module = {};
                        _compo = {};
                        _div.mediaplayer = this;

                        // 개발도구
                        if ($(_div).data("devtool") == 1) { _module.devtool = objMediaPlayer__devtool(_this); _module.devtool.init(); }

                        // 코어
                        _module.core = objMediaPlayer__core(this);
                },





                ///// module

                // onStart
                onStart: function () {
                        // 메세지
                        if (_module.devtool != null) console.log("onStart");

                        // 설정
                        this.onStart_chkOption();

                        // 코어 초기화
                        _module.core.init(true, true);

                        // UI 모듈 준비
                        _div.hierarchy_name = "_div";
                        _div.hierarchy_level = 0;
                        _module.ui = objMediaPlayer__ui(this);
                        _module.ui.init();

                        // UI 생성
                        this.onStart_createUI();

                        // 보정
                        if (b_option_caption == true) {
                                if (i_option_pair == 0) { $(_tracker.controlsTop).css("padding-right", 55); }
                                else { $(_tracker.controlsTop).css("padding-right", 145); }
                        } else {
                                if (i_option_pair == 0) { $(_tracker.controlsTop).css("padding-right", 25); }
                                else { $(_tracker.controlsTop).css("padding-right", 115); }
                        }

                        // 리셋
                        this.reset();
                },
                onStart_chkOption: function () {
                        // position : 팝업 위치(필수)
                        if ($(_div).data("position") == null) { 
                                console.log(" # 설정값 오류 : 필수 설정값 data-highlight 가 설정되지 않았습니다(타입:" + _type + " DIV:" + _div.outerHTML + ").");
                        } else {
                                var ar = $(_div).data("position").split(" ");
                                i_set_popup_x = ar[0];
                                i_set_popup_y = ar[1];
                        }

                        // caption : 대본 기능
                        if ($(_div).data("caption") != null && $(_div).data("caption") == "1") { b_option_caption = true; }

                        // normal2fast : 보통 상태
                        if ($(_div).data("normal2fast") != null) {
                                i_option_pair = 1;
                                s_option_pair = $(_div).data("normal2fast");
                        }

                        // fast2normal : 빠르게 상태
                        if ($(_div).data("fast2normal") != null) {
                                i_option_pair = 2;
                                s_option_pair = $(_div).data("fast2normal");
                        }
                },
                onStart_createUI: function () {
                        ///// 토대

                        // 쇼 버튼
                        if (i_option_pair != 2) { _tracker.btnShow = _module.ui.createButton("<div></div>", _div, "btnShow", "btnShow(x)"); }

                        // Body
                        _tracker.body = $("body");
                        _tracker.body.hierarchy_name = "body";
                        _tracker.body.hierarchy_level = 0;

                        // 팝업
                        _tracker.popupAudio = _module.ui.createElement("<div class=\"popupAudio\"></div>", $("body"), "popupAudio");
                        $(_tracker.popupAudio).css("z-index", Z_INDEX_POPUP);
                        $(_tracker.popupAudio).css("display", "none");
                        _tracker.audioWrap = _module.ui.createElement("<div class=\"audioWrap\"></div>", _tracker.popupAudio, "audioWrap");
                        _tracker.audioControls = _module.ui.createElement("<div class=\"audioControls\"></div>", _tracker.audioWrap, "audioControls");

                        // 확장
                        _tracker.windowAudio = _module.ui.createElement("<div class=\"audioScriptWin\"></div>", _tracker.body, "windowAudio(audioScriptWin)");


                        ///// 상단
                        _tracker.controlsTop = _module.ui.createElement("<div class=\"controlsTop\"></div>", _tracker.audioControls, "controlsTop");

                        // 컴포 : 시간막대
                        _compo.timebar = objMediaPlayer__compo_timebar(_this);
                        _compo.timebar.init(_tracker.controlsTop);



                        ///// 왼쪽
                        _tracker.controlsLeft = _module.ui.createElement("<div class=\"controlsLeft\"></div>", _tracker.audioControls, "controlsLeft");

                        // 재생 버튼
                        _tracker.btnPlay = _module.ui.createButton("<div class=\"controlsPlay\"></div>", _tracker.controlsLeft, "btnPlay", "btnPlay(controlsPlay)");

                        // 멈춤 버튼
                        _tracker.btnStop = _module.ui.createButton("<div class=\"controlsStop\"></div>", _tracker.controlsLeft, "btnStop", "btnStop(controlsStop)");



                        ///// 오른쪽
                        _tracker.controlsRight = _module.ui.createElement("<div class=\"controlsRight\"></div>", _tracker.audioControls, "controlsRight");
                        _tracker.controlsModulSet = _module.ui.createElement("<div class=\"controlsModulSet\"></div>", _tracker.controlsRight, "controlsModulSet");
                        
                        // 보통 빠르게
                        if (i_option_pair == 1) {
                                _tracker.btnToNormal = _module.ui.createButton("<div class=\"btnToNormal_on\"></div>", _tracker.controlsModulSet, "btnToNormal", "btnToNormal(btnToNormal_on)");
                                _tracker.btnToFast = _module.ui.createButton("<div class=\"btnToFast\"></div>", _tracker.controlsModulSet, "btnToFast", "btnToFast(btnToFast)");
                        } else if (i_option_pair == 2) {
                                _tracker.btnToNormal = _module.ui.createButton("<div class=\"btnToNormal\"></div>", _tracker.controlsModulSet, "btnToNormal", "btnToNormal(btnToNormal)");
                                _tracker.btnToFast = _module.ui.createButton("<div class=\"btnToFast_on\"></div>", _tracker.controlsModulSet, "btnToFast", "btnToFast(btnToFast_on)");
                        }
                        



                        ///// 컴포 : 대본
                        if (b_option_caption == true) { // 대본 기능 여부
                                // 정보
                                var data = getPlayListInfo(_file);
                                if (data == null) { console.log(" # 설정값 오류 : 대본 정보가 설정되지 않았습니다. JSON 파일을 확인해 주세요(타입:" + _type + " DIV:" + _div.outerHTML + ")."); }

                                // 초기화
                                _tracker.captionBox = _module.ui.createElement("<div class=\"captionBox\"></div>", _tracker.popupAudio, "captionBox");
                                _tracker.conLabel = _module.ui.createElement("<div class=\"captionbg\"></div>", _tracker.captionBox, "conLabel(captionbg)");
                                _module.caption = objMediaPlayer__caption(_this);
                                _module.caption.init_audio(data, _tracker.conLabel, 0);

                                // 대본 버튼
                                _tracker.btnCaption = _module.ui.createButton("<div class=\"caption\"></div>", _tracker.controlsModulSet, "btnCaption", "btnCaption(caption)");
                        }



                        ///// 그 외

                        // 닫기 버튼
                        _tracker.btnClose = _module.ui.createButton("<div class=\"mediaCloseBtn\"></div>", _tracker.controlsRight, "btnClose", "btnClose(mediaCloseBtn)")
                },

                // onReady
                onReady: function () { this.reset(); },

                // onReset
                onReset: function () {
                        // 메세지
                        if (_module.devtool != null) console.log("onReset");

                        // 멈춤
                        _module.core.castStop();

                        // 초기화
                        _module.core.reset();
                        if (_module.caption != null) _module.caption.reset();

                        // 레이아웃
                        this.updateLayout(0);
                },





                ///// event

                // onEnded
                onEnded: function () { // 개발
                        if (_module.devtool != null) console.log("onEnded");

                        // 이벤트
                        if (_link != null) {
                                $(_link).parent().find(".audio-layer .btn-audio-pause").hide();
                                $(_link).parent().find(".audio-layer .btn-audio-play").show();
                        }

                        // Stop
                        _module.core.castStop();
                        if ($(_tracker.conLabel) != null) { $(_tracker.conLabel).scrollTop(0); }
                },

                // onButtonClick
                onButtonClick: function (tag, btn, par) {
                        // 메세지
                        if (_module.devtool != null) {
                                if (par == null) { console.log("onButtonClick : " + tag); }
                                else { console.log("onButtonClick" + tag + ", " + par); }
                        }

                        switch (tag) {
                                case "btnShow":
                                        // 토글 때문에 상태 저장
                                        var is_show = (i_state_layout == 0) ? false : true;

                                        // 리셋 올
                                        resetAllMediaPlayer();

                                        // 토글 처리
                                        if (is_show == false) { _this.updateLayout(2); }
                                        break;
                                case "btnToNormal": if (i_option_pair == 2) { change_MP3_C_NF($(_div).data("mpid"), s_option_pair, i_state_layout); } break
                                case "btnToFast": if (i_option_pair == 1) { change_MP3_C_NF($(_div).data("mpid"), s_option_pair, i_state_layout); } break
                                case "btnCaption":
                                        // 분기
                                        switch (i_state_layout) {
                                                case 1: this.updateLayout(2); break;
                                                case 2: this.updateLayout(1); break;
                                        }
                                        break;
                                case "btnPlay":
                                        break;
                        }
                },

                // onChanged
                onChanged: function (p_state, p_layout) {
                        // _div 버튼 유지
                        if (i_option_pair == 1 && p_state == "from") {
                                i_state_layout = 1;
                                if ($(_div).hasClass("on") == false) { $(_div).addClass("on"); }
                        }

                        // open
                        if (p_state == "to") { this.updateLayout(p_layout); }
                },





                ///// tool

                // 추적
                traceModule: function () {
                        // 정보 만들기
                        var str = "\n ********************* \n";
                        str += " * trace MediaPlayer * \n\n";
                        str += "\ttarget : " + _type + "(" + _file + ")\n";
                        str += "\ti_set_popup : " + i_set_popup_x + ", " + i_set_popup_y + "\n";
                        str += "\tb_option_caption : " + b_option_caption + "\n";
                        str += "\ti_state_layout : " + i_state_layout + "\n";
                        str += "\n ********************* ";

                        // 출력
                        console.log(str);
                },





                ///// method

                // 레이아웃 변경
                updateLayout: function (type) {
                        // 메세지
                        if (_module.devtool != null) console.log("updateLayout : " + type);

                        // 처리
                        switch (type) {
                                case 0: // 안보임
                                        if ($(_div).hasClass("on") == true) { $(_div).removeClass("on"); }
                                        $(_tracker.popupAudio).css("display", "none");
                                        $(_tracker.windowAudio).css("display", "none");
                                        break;
                                case 1: // 팝업
                                        if ($(_div).hasClass("on") == false) { $(_div).addClass("on"); }
                                        $(_tracker.popupAudio).appendTo(_tracker.body);
                                        $(_tracker.popupAudio).css("left", i_set_popup_x + "px");
                                        $(_tracker.popupAudio).css("top", i_set_popup_y + "px");
                                        $(_tracker.popupAudio).css("display", "inline-block");
                                        $(_tracker.captionBox).css("display", "none");
                                        $(_tracker.windowAudio).css("display", "none");
                                        $(_tracker.btnTranslation).css("display", "none");
                                        if (_compo.repeat != null) { _compo.repeat.updateRepeat(); }
                                        if (_module.caption != null) {
                                                _module.caption.updateButtonCaption(false);
                                                _module.caption.setVisibleButtonRoleplay(false);
                                                _module.caption.updateIconMarkerRoleplay();
                                        }
                                        break;
                                case 2: // 확장
                                        if ($(_div).hasClass("on") == false) { $(_div).addClass("on"); }
                                        $(_tracker.popupAudio).appendTo(_tracker.windowAudio);
                                        $(_tracker.popupAudio).css("left", i_set_popup_x + "px");
                                        $(_tracker.popupAudio).css("top", i_set_popup_y + "px");
                                        $(_tracker.popupAudio).css("display", "inline-block");
                                        $(_tracker.captionBox).css("display", "inline-block");
                                        $(_tracker.windowAudio).css("display", "inline-block");
                                        $(_tracker.btnTranslation).css("display", "inline-block");
                                        if (_compo.repeat != null) { _compo.repeat.updateRepeat(); }
                                        if (_module.caption != null) {
                                                _module.caption.updateButtonCaption(true);
                                                _module.caption.setVisibleButtonRoleplay(true);
                                                _module.caption.updateIconMarkerRoleplay();
                                        }
                                        break;
                        }

                        // 상태
                        i_state_layout = type;
                },
        }
}

// 전용 함수 : 보통빠르게 버튼 전달
function change_MP3_C_NF(p_from, p_to, p_layout) {
        resetAllMediaPlayer();
        getMediaPlayerById(p_from).onChanged("from", p_layout);
        getMediaPlayerById(p_to).onChanged("to", p_layout);
}