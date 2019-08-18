///// mp3_b
var objMediaPlayer_mp3_b = function () {

        ///// variables

        // module
        var _platform = "DA"; // 플랫폼
        var _type = "mp3_b"; // 타입
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
        var s_option_highlight = ""; // 하이라이트 대상
        var s_option_noresponse = 0; // 반응 무시

        // state
        var b_state_play = false; // 현재 전체 듣기 상태





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

                        // 쇼 버튼
                        _tracker.btnShow = _module.ui.createButton("<div></div>", _div, "btnShow", "btnShow(x)");

                        // 정보
                        var data = getPlayListInfo(_file);
                        if (data == null) { console.log(" # 설정값 오류 : 대본 정보가 설정되지 않았습니다. JSON 파일을 확인해 주세요(타입:" + _type + " DIV:" + _div.outerHTML + ")."); }

                        // 하이라이트 전용 대본
                        _module.caption = objMediaPlayer__caption(_this);
                        _module.caption.init_audio(data);

                        // 하이라이트
                        _module.caption.setHighlight(s_option_highlight, s_option_noresponse);

                        // 준비 끝
                        this.reset();
                },
                onStart_chkOption: function () {
                        // highlight : 하이라이트 그룹(필수)
                        if ($(_div).data("highlight") == null) { console.log(" # 설정값 오류 : 필수 설정값 data-highlight 가 설정되지 않았습니다(타입:" + _type + " DIV:" + _div.outerHTML + ")."); }
                        else { s_option_highlight = $(_div).data("highlight"); }

                        // noresponse : 반응 무시
                        if ($(_div).data("noresponse") != null) { if ($(_div).data("noresponse") == "1") { s_option_noresponse = 1; } }
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

                        // 버튼
                        b_state_play = false;
                        if ($(_div).hasClass("on") == true) { $(_div).removeClass("on"); }

                        // 링크
                        if (_link != null) {
                                $(_link).parent().find(".audio-layer").hide();
                                $(_link).removeClass("active");
                        }
                },





                ///// event

                // onEnded
                onEnded: function () {
                        // 개발
                        if (_module.devtool != null) console.log("onEnded");

                        // 이벤트
                        if (_link != null) {
                                $(_link).parent().find(".audio-layer .btn-audio-pause").hide();
                                $(_link).parent().find(".audio-layer .btn-audio-play").show();
                        }
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
                                        var is_play = (b_state_play == true) ? true : false;

                                        // 리셋 올
                                        resetAllMediaPlayer();

                                        // 토글 처리
                                        if (is_play == false) { // 플레이
                                                b_state_play = true;
                                                if ($(_div).hasClass("on") == false) { $(_div).addClass("on"); }
                                                _module.core.castPlay();
                                        } else {
                                                b_state_play = false;
                                                if ($(_div).hasClass("on") == true) { $(_div).removeClass("on"); }
                                                _module.core.castStop();
                                        }
                                        break;
                        }
                },





                ///// tool

                // 추적
                traceModule: function () {
                        // 정보 만들기
                        var str = "\n ********************* \n";
                        str += " * trace MediaPlayer * \n\n";
                        str += "\ttarget : " + _type + "(" + _file + ")\n";
                        str += "\tb_state_play : " + b_state_play + "\n";
                        str += "\ts_option_highlight : " + s_option_highlight + "\n";
                        str += "\ts_option_noresponse : " + s_option_noresponse + "\n";
                        str += "\n ********************* ";

                        // 출력
                        console.log(str);
                },





                ///// method
                
                // 하이라이트 그룹 변경
                changeHighlightGroup: function (p_group) { _module.caption.setHighlight(p_group); },
        }
}