// 시간막대
var objMediaPlayer__compo_timebar = function (p_parent) {

        ///// variables

        // module
        var _parent = p_parent;
        var _tracker;
        var _core;
        var _ui;



        ///// function

        return {

                // init
                init: function (p_container) {
                        // 준비
                        _tracker = _parent.getVar("_tracker");
                        _core = _parent.getVar("_module").core;
                        _ui = _parent.getVar("_module").ui;
                        var $this = this;

                        // UI
                        _tracker.conTimebar = _ui.createElement("<div class=\"container\"></div>", p_container, "conTimebar(container)");
                        _tracker.barTimeBack = _ui.createElement("<div class=\"controlsPlayBar\"></div>", _tracker.conTimebar, "barTimeBack(controlsPlayBar)");
                        _tracker.barTimeLine = _ui.createElement("<div class=\"controlsPlayLine\"></div>", _tracker.barTimeBack, "barTimeLine(controlsPlayLine)");
                        _tracker.barTimeProgress = _ui.createElement("<div class=\"controlsProgress\"></div>", _tracker.barTimeBack, "barTimeProgress(controlsProgress)");
                        switch (_parent.getVar("_platform")) {
                                case "DA" : 
                                        _tracker.maTimeCurrent = _ui.createElement("<div class=\"controlsPlayBarBtn\"></div>", _tracker.barTimeBack, "maTimeCurrent(controlsPlayBarBtn)");
                                        $(_tracker.maTimeCurrent).css("pointer-events", "none");
                                        $(_tracker.maTimeCurrent).css("left", -4);
                                        break;
                                case "NY":
                                        _tracker.maTimeCurrent = _ui.createElement("<div class=\"controlsPlayBarBtn\"></div>", _tracker.barTimeBack, "maTimeCurrent(controlsPlayBarBtn)");
                                        $(_tracker.maTimeCurrent).css("pointer-events", "none");
                                        $(_tracker.maTimeCurrent).css("left", -10);
                                        break;
                        }


                        // 초기화
                        $(_tracker.barTimeBack).css("cursor", "pointer");
                        $(_tracker.barTimeProgress).css("cursor", "pointer");

                        // 이벤트
                        $(_tracker.barTimeBack).mousedown(function (event) { $this.onBarMouseDown(event); });
                },

                // event
                onBarMouseDown: function (event) { this.onBarUpdated(event.offsetX); },
                onBarUpdated: function (xx) {
                        // 준비
                        var duration = _core.getVar("objMedia").duration;
                        var ratio = xx / $(_tracker.barTimeBack).width();
                        if (ratio > 1) { ratio = 1; }
                        if (ratio < 0) { ratio = 0; }

                        // 이동
                        _core.moveTo(duration * ratio);
                },

                // view
                updateBarTime: function (p_time) {
                        $(_tracker.barTimeProgress).css("width", ((p_time / _core.getVar("objMedia").duration) * 100) + "%");
                        switch (_parent.getVar("_platform")) {
                                case "DA":
                                        $(_tracker.maTimeCurrent).css("left", $(_tracker.barTimeBack).width() * (p_time / _core.getVar("objMedia").duration) - 4);
                                        break;
                                case "NY":
                                        $(_tracker.maTimeCurrent).css("left", $(_tracker.barTimeBack).width() * (p_time / _core.getVar("objMedia").duration) - 10);
                                        break;
                        }
                }
        }
}





// 시간레이블
var objMediaPlayer__compo_timelabel = function (p_parent) {

        ///// variables

        // module
        var _parent = p_parent;
        var _tracker;
        var _core;
        var _ui;



        ///// function

        return {

                // init
                init: function (p_container) {
                        // 준비
                        _tracker = _parent.getVar("_tracker");
                        _core = _parent.getVar("_module").core;
                        _ui = _parent.getVar("_module").ui;
                        var $this = this;

                        // UI
                        _tracker.conTimeLabel = _ui.createElement("<div class=\"time\"></div>", p_container, "conTimeLabel(time)");
                        _tracker.laeTimeCurrent = _ui.createElement("<span class=\"curtime\">00:00</span>", _tracker.conTimeLabel, "laeTimeCurrent(curtime)");
                        _tracker.laeDivider = _ui.createElement("<span class=\"curtime\"> : </span>", _tracker.conTimeLabel, "laeDivider(curtime)");
                        _tracker.laeTimeDuration = _ui.createElement("<span class=\"durtime\">00:00</span>", _tracker.conTimeLabel, "laeTimeDuration(durtime)");

                        // 초기화
                        _tracker.laeTimeCurrent.textContent = "00:00";
                        _tracker.laeTimeDuration.textContent = "00:00";
                },

                // view
                updateLabelTimeCurrent: function (p_time) { _tracker.laeTimeCurrent.textContent = this.leadingZeros(Math.floor(p_time / 60), 2) + ":" + this.leadingZeros(Math.floor(p_time % 60), 2); },
                updateLabelTimeDuration: function (p_time) { _tracker.laeTimeDuration.textContent = this.leadingZeros(Math.floor(p_time / 60), 2) + ":" + this.leadingZeros(Math.floor(p_time % 60), 2); },

                // 자리수 채우기(숫자, 자리수)
                leadingZeros: function (n, digits) {
                        var zero = '';
                        n = n.toString();

                        if (n.length < digits) {
                                for (var i = 0; i < digits - n.length; i++)
                                        zero += '0';
                        }
                        return zero + n;
                },
        }
}





// 볼륨
var objMediaPlayer__compo_volume = function (p_parent) {

        ///// variables

        // module
        var _parent = p_parent;
        var _tracker;
        var _core;
        var _ui;

        // private
        var b_state_drag = false; // 드래그 여부



        ///// function

        return {

                // init
                init: function (p_container) {
                        // 준비
                        _tracker = _parent.getVar("_tracker");
                        _core = _parent.getVar("_module").core;
                        _ui = _parent.getVar("_module").ui;
                        var $this = this;

                        // 버튼
                        _tracker.btnSound = _ui.createElement("<div class=\"controlsSound\"></div>", p_container, "btnSound(controlsSound)");
                        $(_tracker.btnSound).click(function (event) {
                                // 사운드 토글
                                if (_core.getVar("b_state_sound") == true) { _core.setSound(false); }
                                else { _core.setSound(true); }
                        });

                        // UI
                        _tracker.barVolumeBack = _ui.createElement("<div class=\"SoundPlayBar\"></div>", _tracker.controlsLeft, "barVolumeBack(SoundPlayBar)");
                        _tracker.barVolumeLine = _ui.createElement("<div class=\"SoundPlayLine\"></div>", _tracker.barVolumeBack, "barVolumeLine(SoundPlayLine)");
                        _tracker.barVolumeProgress = _ui.createElement("<div class=\"SoundProgress\"></div>", _tracker.barVolumeBack, "barVolumeProgress(SoundProgress)");

                        // 초기화
                        $(_tracker.barVolumeBack).css("cursor", "pointer");
                        $(_tracker.barVolumeProgress).css("cursor", "pointer");

                        // 이벤트
                        $(_tracker.barVolumeBack).mousedown(function (event) { $this.onBarMouseDown(event); });
                        $(document).mousemove(function (event) { $this.onDocumentMouseMove(event); });
                        $(document).mouseup(function (event) { $this.onDocumentMouseUp(event); });
                },

                // event
                onBarMouseDown: function (event) {
                        // 플래그
                        b_state_drag = true;

                        // 갱신
                        this.onBarUpdated(event.pageX);
                },
                onDocumentMouseMove: function (event) {
                        // 조건검사
                        if (b_state_drag == false) { return; }

                        // 갱신
                        this.onBarUpdated(event.pageX);
                },
                onDocumentMouseUp: function (event) {
                        // 조건검사
                        if (b_state_drag == false) { return; }

                        // 플래그
                        b_state_drag = false;

                        // 갱신
                        this.onBarUpdated(event.pageX);
                },
                onBarUpdated: function (xx) {
                        // 준비
                        var duration = _core.getVar("objMedia").duration;

                        // 계산
                        var position = xx - $(_tracker.barVolumeBack).offset().left;
                        var ratio = position / $(_tracker.barVolumeBack).width();
                        if (ratio > 1) { ratio = 1; }
                        if (ratio < 0) { ratio = 0; }

                        // 이동
                        _core.setVolume(ratio);
                },

                // view
                updateBtnSound: function (b) {
                        var obj = _parent.getVar("_tracker").btnSound;
                        if (b == true) {
                                if ($(obj).hasClass("controlsSound") == true) { $(obj).removeClass("controlsSound"); }
                                if ($(obj).hasClass("controlsSound_on") == false) { $(obj).addClass("controlsSound_on"); }
                        } else {
                                if ($(obj).hasClass("controlsSound_on") == true) { $(obj).removeClass("controlsSound_on"); }
                                if ($(obj).hasClass("controlsSound") == false) { $(obj).addClass("controlsSound"); }
                        }
                },
                updateBarVolume: function (f) { $(_tracker.barVolumeProgress).css("width", (_core.getVar("objMedia").volume * 100) + "%"); }
        }
}





// 재생속도
var objMediaPlayer__compo_speed = function (p_parent) {

        ///// variables

        // module
        var _parent = p_parent;
        var _tracker;
        var _core;
        var _ui;



        ///// function

        return {

                // init
                init: function (p_container) {
                        // 준비
                        _tracker = _parent.getVar("_tracker");
                        _core = _parent.getVar("_module").core;
                        _ui = _parent.getVar("_module").ui;
                        var $this = this;

                        // 버튼
                        _tracker.btnSpeedDown = _ui.createElement("<div class=\"controlsSlow\"></div>", p_container, "btnSpeedDown(controlsSlow)");
                        $(_tracker.btnSpeedDown).click(function (event) { _core.setSpeed(_core.getVar("f_state_speed") - 0.1); });
                        _tracker.laeSpeed = _ui.createElement("<div class=\"Speed\">x1.0</div>", p_container, "laeSpeed(Speed)");
                        _tracker.btnSpeedUp = _ui.createElement("<div class=\"controlsFast\"></div>", p_container, "btnSpeedUp(controlsFast)");
                        $(_tracker.btnSpeedUp).click(function (event) { _core.setSpeed(_core.getVar("f_state_speed") + 0.1); });
                },

                // view
                updateLabelSpeed: function (b) {
                        // 준비
                        var speed_current = _core.getVar("f_state_speed");
                        var str_speed = "x";

                        // 값 입력
                        if (speed_current == 1) { str_speed = "x1.0"; }
                        else if (speed_current == 2) { str_speed = "x2.0"; }
                        else {
                                str_speed = "x" + speed_current;
                                str_speed = str_speed.substr(0, 4);
                        }

                        // 갱신
                        _tracker.laeSpeed.textContent = str_speed;
                },
        }
}





// 구간반복
var objMediaPlayer__compo_repeat = function (p_parent) {

        ///// variables

        // module
        var _parent = p_parent;
        var _tracker;
        var _core;
        var _ui;



        ///// function

        return {

                // init
                init: function (p_container) {
                        // 준비
                        _tracker = _parent.getVar("_tracker");
                        _core = _parent.getVar("_module").core;
                        _ui = _parent.getVar("_module").ui;
                        var $this = this;

                        // 버튼
                        _tracker.btnRepeatS = _ui.createElement("<div class=\"controlsSyncSbtn\"></div>", p_container, "btnRepeatS(controlsSyncSbtn)");
                        $(_tracker.btnRepeatS).click(function (event) { _core.setRepeat(0); });
                        _tracker.btnRepeatE = _ui.createElement("<div class=\"controlsSyncEbtn\"></div>", p_container, "btnRepeatE(controlsSyncEbtn)");
                        $(_tracker.btnRepeatE).click(function (event) { _core.setRepeat(1); });

                        // 마커
                        if (_parent.getVar("_compo").timebar != null) {
                                _tracker.maRepeatS = _ui.createElement("<div class=\"controlsSyncStart\"></div>", _tracker.conTimebar, "maRepeatS(controlsSyncStart)");
                                _tracker.maRepeatE = _ui.createElement("<div class=\"controlsSyncEnd\"></div>", _tracker.conTimebar, "maRepeatE(controlsSyncEnd)");
                        }
                },

                // view
                updateRepeat: function () {
                        // 준비
                        var duration = _core.getVar("objMedia").duration;
                        var f_start = _core.getVar("f_state_repeat_start");
                        var f_end = _core.getVar("f_state_repeat_end");
                        var btn_start = _tracker.btnRepeatS;
                        var btn_end = _tracker.btnRepeatE;
                        var ma_start;
                        var ma_end;
                        var exist_timebar = (_parent.getVar("_compo").timebar != null) ? true : false;

                        // 판단

                        if (exist_timebar == true) { ma_start = _tracker.maRepeatS; ma_end = _tracker.maRepeatE; }

                        // 트리거 A
                        if (f_start != -1) {
                                if ($(btn_start).hasClass("controlsSyncSbtn") == true) { $(btn_start).removeClass("controlsSyncSbtn"); }
                                if ($(btn_start).hasClass("controlsSyncSbtn_on") == false) { $(btn_start).addClass("controlsSyncSbtn_on"); }
                                if (exist_timebar == true) {
                                        $(ma_start).css("left", ($(_tracker.barTimeBack).width() * (f_start / duration)) - 5);
                                        $(ma_start).css("display", "inline-block");
                                }
                        } else {
                                if ($(btn_start).hasClass("controlsSyncSbtn_on") == true) { $(btn_start).removeClass("controlsSyncSbtn_on"); }
                                if ($(btn_start).hasClass("controlsSyncSbtn") == false) { $(btn_start).addClass("controlsSyncSbtn"); }
                                if (exist_timebar == true) { $(ma_start).css("display", "none"); }
                        }

                        // 트리거 B
                        if (f_end != -1) {
                                if ($(btn_end).hasClass("controlsSyncEbtn") == true) { $(btn_end).removeClass("controlsSyncEbtn"); }
                                if ($(btn_end).hasClass("controlsSyncEbtn_on") == false) { $(btn_end).addClass("controlsSyncEbtn_on"); }
                                if (exist_timebar == true) {
                                        $(ma_end).css("left", ($(_tracker.barTimeBack).width() * (f_end / duration)) - 5);
                                        $(ma_end).css("display", "inline-block");
                                }
                        } else {
                                if ($(btn_end).hasClass("controlsSyncEbtn_on") == true) { $(btn_end).removeClass("controlsSyncEbtn_on"); }
                                if ($(btn_end).hasClass("controlsSyncEbtn") == false) { $(btn_end).addClass("controlsSyncEbtn"); }
                                if (exist_timebar == true) { $(ma_end).css("display", "none"); }
                        }
                },
        }
}





// 체크인아웃
var objMediaPlayer__compo_chkinout = function (p_parent) {

        ///// variables

        // module
        var _parent = p_parent;
        var _tracker;
        var _core;
        var _ui;

        // state
        var b_state_chk = false; // 체크 여부
        var b_state_inout = false; // 인 여부

        // object
        var objTarget; // 현재 대상



        ///// function

        return {
                // 참조
                getVar: function (str) {
                        // 분기
                        switch (str) {
                                case "b_state_inout": return b_state_inout;
                        }

                        // 메세지
                        console.log(" # getVar 오류 : 호출한 변수 " + str + " 가 연결되지 않았습니다(타입:" + _parent.getVar("_type") + " DIV:" + _parent.getVar("_div").outerHTML + ").");
                },

                // init
                init: function (p_container) {
                        // 준비
                        _tracker = _parent.getVar("_tracker");
                        _core = _parent.getVar("_module").core;
                        _ui = _parent.getVar("_module").ui;
                        var $this = this;

                        // 초기화
                        this.setChkArea(p_container);

                        // 단말기 특성
                        var os = getMobileOS();
                        if (os == "Android" || os == "iOS") { b_state_inout = true; }
                        if (os == "iOS") { $(document).bind("mousedown touchstart", function (event) { $this.onDocumentMouseMove(event); }); }

                        // 이벤트
                        $(document).mousemove(function (event) { $this.onDocumentMouseMove(event); });
                },

                // event
                onDocumentMouseMove: function (event) {
                        // 조건검사
                        if (b_state_chk == false) { return; }

                        if (event.target.in == true) {
                                if (b_state_inout == false) {
                                        b_state_inout = true;
                                        if (_parent.onInOut != null) { _parent.onInOut(true); }
                                }
                                b_state_inout = true;
                        } else {
                                if (b_state_inout == true) {
                                        b_state_inout = false;
                                        if (_parent.onInOut != null) { _parent.onInOut(false); }
                                }
                                b_state_inout = false;
                        }
                },

                // 체크 영역 설정
                setChkArea: function (p_con) {
                        if (objTarget != null) { this.setChkArea_clearSetting(objTarget); }
                        objTarget = p_con;
                        this.setChkArea_applySetting(objTarget);
                },
                setChkArea_clearSetting: function (ele) {
                        ele.in = false;
                        for (var ii = 0 ; ii < $(ele).contents().length ; ii++) {
                                this.setChkArea_clearSetting($(ele).contents().eq(ii)[0]);
                        }
                },
                setChkArea_applySetting: function (ele) {
                        ele.in = true;
                        for (var ii = 0 ; ii < $(ele).contents().length ; ii++) {
                                this.setChkArea_applySetting($(ele).contents().eq(ii)[0]);
                        }
                },

                // 체크 여부 설정
                setChkAble: function (b) { b_state_chk = b; },
        }
}

// 절대 좌표 반환
function getAbsPos(target) {
        var obj = $(target);
        var pos = new Object();
        pos.top = 0;
        pos.left = 0;

        // find parent
        var t_parent = obj.parent();
        // target object의 offset 값 적용
        pos.top = obj.offset().top;
        pos.left = obj.offset().left;
        if (obj.css('position') === 'absolute') {
                // target object의 position이 absolute인 경우에는 이미 절대값
        } else {
                while (1) {
                        if (t_parent.length > 0) {              // 부모가 있는 경우

                                // 조건검사
                                if (t_parent[0].nodeName === "#document") { break; }

                                // parent의 offset 값 추가
                                pos.top += t_parent.offset().top;
                                pos.left += t_parent.offset().left;
                                if (t_parent.css('position') === 'absolute') {  // 부모의 position이 absolute라면 절대값 확인 완료
                                        break;
                                } else {                                        // 아닌 경우에는 부모의 부모를 다시 찾음
                                        t_parent = t_parent.parent();
                                }
                        } else {                                // 부모가 없다면 break;
                                break;
                        }
                }
        }
        return pos;
}





// 풀스크린
var objMediaPlayer__compo_fullscreen = function (p_parent) {

        ///// variables

        // module
        var _parent = p_parent;
        var _tracker;
        var _core;
        var _ui;
        var _this;

        // link
        var _container; // 전체화면 동작할 컨테이너
        var _media; // core 의 objMedia

        // set
        var i_set_width; // 비디오 width

        // state
        var b_state_fullscreen = false;



        ///// function

        return {
                // 참조
                getVar: function (str) {
                        // 분기
                        switch (str) {
                                case "b_state_fullscreen": return b_state_fullscreen;
                        }

                        // 메세지
                        console.log(" # getVar 오류 : 호출한 변수 " + str + " 가 연결되지 않았습니다(타입:" + _parent.getVar("_type") + " DIV:" + _parent.getVar("_div").outerHTML + ").");
                },

                // init
                init: function (p_container, p_btncontainer, p_width) {
                        // 준비
                        _tracker = _parent.getVar("_tracker");
                        _core = _parent.getVar("_module").core;
                        _ui = _parent.getVar("_module").ui;
                        _this = this;
                        var $this = this;

                        // 연결
                        _container = p_container;
                        _media = _core.getVar("objMedia");

                        // 설정
                        i_set_width = p_width;

                        // 버튼
                        _tracker.btnFullscreen = _ui.createElement("<div class=\"fullsize\"></div>", p_btncontainer, "btnFullscreen(fullsize)");
                        $(_tracker.btnFullscreen).click(function () {
                                // 플래그
                                if (b_state_fullscreen == true) {
                                        $this.castToNormalscreen();
                                } else {
                                        _media.controls = true;
                                        $this.castToFullscreen();
                                }


                                // view
                                $this.updateButtonFullscreen();
                        })

                        // 이벤트 리스너
                        _media.addEventListener("webkitbeginfullscreen", $this.onFullscreen);
                        _media.addEventListener("webkitendfullscreen", $this.onNormalscreen);
                        document.addEventListener("fullscreenchange", $this.onFullscreenchange);
                        document.addEventListener("webkitfullscreenchange", $this.onWebkitfullscreenchange);
                        document.addEventListener("mozfullscreenchange", $this.onMozfullscreenchange);
                        document.addEventListener("MSFullscreenChange", $this.onMSFullscreenChange);
                },
                onFullscreenchange: function () {
                        if (document.fullscreen == true) { _this.onFullscreen(); }
                        else { _this.onNormalscreen(); }
                },
                onWebkitfullscreenchange: function () {
                        if (document.webkitIsFullScreen == true) { _this.onFullscreen(); }
                        else { _this.onNormalscreen(); }
                },
                onMozfullscreenchange: function () {
                        if (document.mozIsFullScreen == true) { _this.onFullscreen(); }
                        else { _this.onNormalscreen(); }
                },
                onMSFullscreenChange: function () {
                        if (document.msFullscreenElement != null) { _this.onFullscreen(); }
                        else { _this.onNormalscreen(); }
                },

                // reset
                reset: function () { this.castToNormalscreen(); },

                // view
                updateButtonFullscreen: function () {
                        if (b_state_fullscreen == true) {
                                if ($(_tracker.btnFullscreen).hasClass("fullsize") == true) { $(_tracker.btnFullscreen).removeClass("fullsize"); }
                                if ($(_tracker.btnFullscreen).hasClass("fullsize_on") == false) { $(_tracker.btnFullscreen).addClass("fullsize_on"); }
                        } else {
                                if ($(_tracker.btnFullscreen).hasClass("fullsize_on") == true) { $(_tracker.btnFullscreen).removeClass("fullsize_on"); }
                                if ($(_tracker.btnFullscreen).hasClass("fullsize") == false) { $(_tracker.btnFullscreen).addClass("fullsize"); }
                        }
                },

                // method
                castToFullscreen: function () {
                        if (this.isAppleMobile() == true) {
                                if (_media.webkitEnterFullScreen) {
                                        _media.webkitEnterFullScreen();
                                        return;
                                }
                        } else {
                                if (_media.requestFullscreen) { _media.requestFullscreen(); }
                                else if (_media.mozRequestFullScreen) { _media.mozRequestFullScreen(); }
                                else if (_media.webkitRequestFullscreen) { _media.webkitRequestFullscreen(); }
                                else if (_media.msRequestFullscreen) { _media.msRequestFullscreen(); }
                        }
                },
                castToNormalscreen: function () {
                        if (document.exitFullscreen) { document.exitFullscreen(); }
                        else if (document.mozCancelFullScreen) { document.mozCancelFullScreen(); }
                        else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
                        else if (document.msExitFullscreen) { document.msExitFullscreen(); }
                },

                // event
                onFullscreen: function () {
                        // 플래그
                        b_state_fullscreen = true;

                        // 네이티브 컨트롤
                        _media.controls = true;

                        /*
                        // 사이즈 조정
                        $(_container).css("width", $(window)[0].screen.width + "px");
                        $(_container).css("height", "100%");
                        $(_media).css("width", "100%");
                        $(_media).css("height", "100%");
                        */

                        // UI 갱신
                        this.updateButtonFullscreen();

                        // 전달
                        if (_parent.onFullscreen != null) { _parent.onFullscreen(true); }
                },
                onNormalscreen: function () {
                        // 플래그
                        b_state_fullscreen = false;

                        // 네이티브 컨트롤
                        _media.controls = false;

                        /*
                        // 사이즈 조정
                        $(_container).css("width", i_set_width + "px");
                        $(_container).css("height", "100%");
                        $(_media).css("width", "100%");
                        $(_media).css("height", "100%");
                        */

                        // UI 갱신
                        this.updateButtonFullscreen();

                        // 전달
                        if (_parent.onFullscreen != null) { _parent.onFullscreen(false); }
                },

                // 애플 모바일 판단
                isAppleMobile: function () {
                        if (navigator && navigator.userAgent && navigator.userAgent != null) {
                                var strUserAgent = navigator.userAgent.toLowerCase();
                                var arrMatches = strUserAgent.match(/(iphone|ipod|ipad)/);
                                if (arrMatches != null) {
                                        return true;
                                }
                        }

                        return false;
                },
        }
}