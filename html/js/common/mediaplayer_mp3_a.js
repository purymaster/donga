///// mp3_a
var objMediaPlayer_mp3_a = function () {

        ///// variables

        // module
        var _platform = "DA"; // 플랫폼
        var _type = "mp3_a"; // 타입
        var _div; // 미디어 플레이어 생성을 호출한 Div
        var _this; // 클래스
        var _category; // audio or video
        var _file; // 음원 파일
        var _tracker; // 추적자
        var _module; // 모듈
        var _compo; // 컴포
        var _link; // 연결



        ///// custom

        // 설정
        var str_color_highligh; // 하이라이트 색상





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

                        // 하이라이트 색상
                        str_color_highligh = ($(_div).data("color") == null) ? COLOR_HIGHLIGHT : $(_div).data("color");

                        // 커서 포인터로
                        $(_div).css("cursor", "pointer");

                        // 코어 초기화
                        _module.core.init(true, false);

                        // 버튼 연결
                        $(_div).click(function () {      // click 시 data를 parameter로 전달 받음, 대상은 caller (현재로선 mp3_b 밖에 존재하지 않음)
                                if (b_able_response == true) {
                                        resetAllMediaPlayer(); // 리셋 올
                                        _module.core.castPlay(); // 플레이
                                        $(_div).css("background-color", str_color_highligh);
                                }
                                b_able_response = true;
                        });
                },

                // onReset
                onReset: function () {
                        // 메세지
                        if (_module.devtool != null) console.log("onReset");

                        // 멈춤
                        _module.core.castStop();

                        // 하이라이트 색상
                        $(_div).css("background-color", "rgba(0,0,0,0)");
                },





                ///// event

                // onEnded
                onEnded: function () {
                        // 메세지
                        if (_module.devtool != null) console.log("onReset");

                        // 리셋
                        this.onReset();
                },





                ///// method

                // 음원 교체
                changeSource: function (p_mp3) {
                        resetAllMediaPlayer();
                        _file = p_mp3;
                        _module.core.init(true, false);
                }
        }
}