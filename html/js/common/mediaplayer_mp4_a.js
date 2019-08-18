///// mp4_a
var objMediaPlayer_mp4_a = function () {

        ///// variables

        // module
        var _platform = "DA"; // 플랫폼
        var _type = "mp4_a"; // 타입
        var _div; // 미디어 플레이어 생성을 호출한 Div
        var _this; // 클래스
        var _category; // audio or video
        var _file; // 음원 파일
        var _tracker; // 추적자
        var _module; // 모듈
        var _compo; // 컴포
        var _link; // 연결



        ///// custom

        // option
        var b_option_caption = false; // 대본 여부
        var i_option_roleplay = 0; // 롤플레이 사람 수
        var s_option_fullpop = ""; // 풀팝업의 mpid

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
                        /// 초기화

                        // 메세지
                        if (_module.devtool != null) console.log("onStart");

                        // 코어 초기화
                        _module.core.init(true, true);

                        // UI 모듈 준비
                        _div.hierarchy_name = "_div";
                        _div.hierarchy_level = 0;
                        _module.ui = objMediaPlayer__ui(this);
                        _module.ui.init();

                        // UI 생성
                        this.onStart_createUI();



                        /// 정보 처리

                        // 준비
                        var data = getPlayListInfo(_file);
                        var video = _module.core.getVar("objMedia");

                        // 옵션 체크
                        if (data.caption != null) { b_option_caption = true; }
                        if (data.roleplay != null) { i_option_roleplay = parseInt(data.roleplay); }
                        if (data.fullpop != null) { s_option_fullpop = data.fullpop; }

                        ///// 컴포 : 대본
                        if (b_option_caption == true) { // 대본 기능 여부
                                // 초기화
                                _tracker.captionBox = _module.ui.createElement("<div class=\"captionBox\"></div>", _tracker.videoWrap, "captionBox");
                                _tracker.conLabel = _module.ui.createElement("<div class=\"captionbg\"></div>", _tracker.captionBox, "conLabel(captionbg)");
                                _tracker.laeSubtitle = _module.ui.createElement("<div class=\"captionTxt\"></div>", _tracker.captionBox, "laeSubtitle(captionTxt)");
                                _module.caption = objMediaPlayer__caption(_this);

                                // 대본 버튼
                                _tracker.btnCaption = _module.ui.createButton("<div class=\"caption\"></div>", _tracker.controlsModulSet, "btnCaption", "btnCaption(caption)");

                                // 입력
                                _module.caption.init_video(data.caption, 2, _tracker.laeSubtitle, i_option_roleplay);
                        }

                        // 풀스크린 초기화
                        _compo.fullscreen.init(_tracker.videoWrap, _tracker.controlsModulSet, data.width);

                        // 포스터
                        if (data.poster != null) { video.poster = data.poster; }

                        // UI 보정
                        $(video).width(data.width);
                        $(video).height(data.height);
                        $(_tracker.controlsbg).css("width", $(_tracker.videoWrap).width() - 2);
                        $(_tracker.videoControls).css("width", $(_tracker.videoWrap).width() - 2);
                        $(_tracker.btnCurtain).css("width", data.width);
                        $(_tracker.btnCurtain).css("height", data.height);
                        if (_tracker.btnCaption != null) $(_tracker.btnCaption).before(_tracker.btnFullscreen);



                        /// 마무리

                        // 초기화
                        $(_tracker.videoWrap).css("display", "inline-block");

                        // 리셋
                        this.reset();
                },
                onStart_createUI: function () {
                        ///// 토대

                        // 뤱
                        _tracker.videoWrap = _module.ui.createElement("<div class=\"videoWrap\"></div>", _div, "videoWrap");
                        $(_tracker.videoWrap).css("display", "none");

                        // 미디어
                        var video = _module.core.getVar("objMedia");
                        video.hierarchy_level = _tracker.videoWrap.hierarchy_level + 1;
                        $(video).appendTo(_tracker.videoWrap);

                        // BG
                        _tracker.controlsbg = _module.ui.createElement("<div class=\"controlsbg\"></div>", _tracker.videoWrap, "controlsbg");

                        // 컨트롤
                        _tracker.videoControls = _module.ui.createElement("<div class=\"videoControls\"></div>", _tracker.videoWrap, "videoControls");


                        ///// 상단
                        _tracker.controlsTop = _module.ui.createElement("<div class=\"controlsTop\"></div>", _tracker.videoControls, "controlsTop");

                        // 컴포 : 시간막대
                        _compo.timebar = objMediaPlayer__compo_timebar(_this);
                        _compo.timebar.init(_tracker.controlsTop);



                        ///// 왼쪽
                        _tracker.controlsLeft = _module.ui.createElement("<div class=\"controlsLeft\"></div>", _tracker.videoControls, "controlsLeft");

                        // 재생 버튼
                        _tracker.btnPlay = _module.ui.createButton("<div class=\"controlsPlay\"></div>", _tracker.controlsLeft, "btnPlay", "btnPlay(controlsPlay)");

                        // 멈춤 버튼
                        _tracker.btnStop = _module.ui.createButton("<div class=\"controlsStop\"></div>", _tracker.controlsLeft, "btnStop", "btnStop(controlsStop)");



                        ///// 오른쪽
                        _tracker.controlsRight = _module.ui.createElement("<div class=\"controlsRight\"></div>", _tracker.videoControls, "controlsRight");
                        _tracker.controlsModulSet = _module.ui.createElement("<div class=\"controlsModulSet\"></div>", _tracker.controlsRight, "controlsModulSet");



                        ///// 그 외

                        // 컴포 : 풀스크린
                        _compo.fullscreen = objMediaPlayer__compo_fullscreen(_this);

                        // 풀팝
                        _tracker.btnFullPop = _module.ui.createButton("<div class=\"btnChangeType\"></div>", _tracker.controlsRight, "btnFullPop", "btnFullPop(btnChangeType)");
                        
                        // 장막 버튼
                        _tracker.btnCurtain = _module.ui.createButton("<div class=\"controlsStart\"></div>", _tracker.videoWrap, "btnCurtain", "btnCurtain(controlsStart)");
                },

                // onReset
                onReset: function () {
                        // 메세지
                        if (_module.devtool != null) console.log("onReset");

                        // 멈춤
                        _module.core.castStop();

                        // 초기화
                        _module.core.reset();
                        if (_module.caption != null) _module.caption.reset();
                        if (_compo.fullscreen != null) _compo.fullscreen.reset();

                        // 레이아웃
                        this.updateLayout(0);
                },





                ///// event

                // onEnded
                onEnded: function () {
                        // 메세지
                        if (_module.devtool != null) console.log("onEnded");

                        // Stop
                        _module.core.castStop();
                        if ($(_tracker.conLabel) != null) { $(_tracker.conLabel).scrollTop(0); }
                        if (_compo.timebar != null) { _compo.timebar.updateBarTime(0); }

                        // 레이아웃 변경
                        this.updateLayout(0);
                },

                // onButtonClick
                onButtonClick: function (tag, btn, par) {
                        // 메세지
                        if (_module.devtool != null) {
                                if (par == null) { console.log("onButtonClick : " + tag); }
                                else { console.log("onButtonClick" + tag + ", " + par); }
                        }

                        switch (tag) {
                                case "btnCurtain":
                                        resetAllMediaPlayerExcept(_type + " " + _file);
                                        this.updateLayout(1);
                                        _module.core.castPlay();
                                        break;
                                case "btnCaption":
                                        if (_module.caption.getVar("b_state_subtitle") == true) { _module.caption.updateViewSubtitle(false); }
                                        else { _module.caption.updateViewSubtitle(true); }
                                        break;
                                case "btnFullPop":
                                        resetAllMediaPlayer();
                                        castFullpop(s_option_fullpop);
                                        break;
                                case "btnPlay":
                                        if (i_state_layout == 0) {
                                                resetAllMediaPlayerExcept(_type + " " + _file);
                                                this.updateLayout(1);
                                                _module.core.castPlay();
                                        }
                                        break;
                        }
                },

                // onFullscreen
                onFullscreen: function (b) {
                        // UI 보정
                        if (b == true) {
                                $(_tracker.controlsbg).css("width", $(_tracker.videoWrap).width() - 40);
                                $(_tracker.videoControls).css("width", $(_tracker.videoWrap).width() - 40);
                        } else {
                                $(_tracker.controlsbg).css("width", $(_tracker.videoWrap).width() - 2);
                                $(_tracker.videoControls).css("width", $(_tracker.videoWrap).width() - 2);
                        }

                        // UI 갱신
                        if (_compo.repeat != null) { _compo.repeat.updateRepeat(); }
                        if (_module.caption != null) {
                                _module.caption.updateButtonCaption(false);
                                _module.caption.updateIconMarkerRoleplay();
                                window.setTimeout(this.reviseViewSubtitle, 100);
                                window.setTimeout(this.reviseViewSubtitle, 300);
                                window.setTimeout(this.reviseViewSubtitle, 500);
                                window.setTimeout(this.reviseViewSubtitle, 1000);
                        }
                },
                reviseViewSubtitle: function() { _module.caption.reviseViewSubtitle(); },





                ///// tool

                // 추적
                traceModule: function () {
                        // 정보 만들기
                        var str = "\n ********************* \n";
                        str += " * trace MediaPlayer * \n\n";
                        str += "\ttarget : " + _type + "(" + _file + ")\n";
                        str += "\tb_option_caption : " + b_option_caption + "\n";
                        str += "\ti_option_roleplay : " + i_option_roleplay + "\n";
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
                                case 0: // 장막
                                        $(_tracker.btnCurtain).css("display", "inline-block");
                                        if (_compo.fullscreen != null) { _compo.fullscreen.castToNormalscreen(); }
                                        if (_module.caption != null) { _module.caption.reset(); }
                                        if (i_state_layout != 0) { _module.core.getVar("objMedia").src = _module.core.getVar("objMedia").src; }
                                        break;
                                case 1: // 활성화 상태
                                        _module.core.castStop();
                                        $(_tracker.btnCurtain).css("display", "none");
                                        if (_compo.repeat != null) { _compo.repeat.updateRepeat(); }
                                        if (_module.caption != null) {
                                                _module.caption.updateButtonCaption(false);
                                                _module.caption.updateIconMarkerRoleplay();
                                        }
                                        break;
                        }

                        // 상태
                        i_state_layout = type;
                },
        }
}

// 전용 함수 : 풀팝
function castFullpop(p_mpid) { getMediaPlayerById(p_mpid).updateLayout(1); }