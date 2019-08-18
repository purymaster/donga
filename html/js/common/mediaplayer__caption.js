///// caption 대본
var objMediaPlayer__caption = function (p_parent) {

        ///// variables

        // module
        var _parent = p_parent;
        var _tracker;
        var _core;
        var _ui;

        // object
        var arObjectCaption; // 대본 객체
        // 정보 .en .kr .role .start .end
        // 구성물 .highlight .object .label .icon .marker
        var arObjectRole; // 롤플레이 객체
        // .idx .show .btn .btn.idx

        // state
        var i_state_layout = 0; // 0:없음, 1:레이블, 2:자막
        var b_state_ready = false; // 준비 여부
        var b_state_script = true; // 자막 가리기 여부 (true 가 보임)
        var b_state_translation = false; // 번역 출력 여부
        var b_state_highlight = false; // 하이라이트
        var b_state_subtitle = false; // 자막 보임 여부



        ///// function

        return {
                // 참조
                getVar: function (str) {
                        // 분기
                        switch (str) {
                                case "arObjectCaption": return arObjectCaption;
                                case "b_state_subtitle": return b_state_subtitle;
                        }

                        // 메세지
                        console.log(" # getVar 오류 : 호출한 변수 " + str + " 가 연결되지 않았습니다(타입:" + _parent.getVar("_type") + " DIV:" + _parent.getVar("_div").outerHTML + ").");
                },

                // init
                init_audio: function (p_data, p_container, p_roleplay) {
                        /// 초기화

                        // 준비
                        _tracker = _parent.getVar("_tracker");
                        _core = _parent.getVar("_module").core;
                        _ui = _parent.getVar("_module").ui;
                        var $this = this;

                        // 플래그
                        b_state_ready = true;

                        // 객체 초기화
                        arObjectCaption = new Array(p_data.length);
                        for (var ii = 0 ; ii < arObjectCaption.length ; ii++) {
                                // 초기화
                                arObjectCaption[ii] = {};
                                arObjectCaption[ii].idx = ii;

                                // 준비
                                var original = p_data[ii];

                                // 입력
                                arObjectCaption[ii].en = original.en;
                                arObjectCaption[ii].ko = original.ko;
                                arObjectCaption[ii].role = original.role;
                                arObjectCaption[ii].start = (_parent.getVar("_platform") == "VS") ? parseFloat(this.init_convertDate2Sec(original.start)) : original.start;
                                arObjectCaption[ii].end = (_parent.getVar("_platform") == "VS") ? parseFloat(this.init_convertDate2Sec(original.end)) : original.end;
                                
                                // 오류 체크
                                if (arObjectCaption[ii].start == null || arObjectCaption[ii].end == null) { console.log(" # init_audio 오류 : 대본 정보에 필수값인 start 또는 end 가 없습니다. JSON 파일을 확인해주세요(타입:" + _parent.getVar("_type") + " DIV:" + _parent.getVar("_div").outerHTML + ")."); }
                        }

                        // 레이블
                        if (p_container != null) { this.init_createLabel(p_container); }

                        // 롤플레이 체크
                        if ((p_roleplay == null || p_roleplay == 0) == false) { this.init_roleplay(p_roleplay); }

                        // 갱신
                        this.updateCaptionLabel();
                },
                init_video: function (p_data, p_type, p_container, p_roleplay) {
                        // 준비
                        _tracker = _parent.getVar("_tracker");
                        _core = _parent.getVar("_module").core;
                        _ui = _parent.getVar("_module").ui;
                        var $this = this;

                        // 설정
                        i_state_layout = p_type;

                        // 플래그
                        b_state_ready = true;

                        // 객체 초기화
                        arObjectCaption = new Array(p_data.length);
                        for (var ii = 0 ; ii < arObjectCaption.length ; ii++) {
                                // 초기화
                                arObjectCaption[ii] = {};
                                arObjectCaption[ii].idx = ii;

                                // 준비
                                var original = p_data[ii];

                                // 입력
                                arObjectCaption[ii].en = original.en;
                                arObjectCaption[ii].ko = original.ko;
                                arObjectCaption[ii].role = original.role;
                                arObjectCaption[ii].start = (_parent.getVar("_platform") == "VS") ? parseFloat(this.init_convertDate2Sec(original.start)) : original.start;
                                arObjectCaption[ii].end = (_parent.getVar("_platform") == "VS") ? parseFloat(this.init_convertDate2Sec(original.end)) : original.end;

                                // 오류 체크
                                if (arObjectCaption[ii].start == null || arObjectCaption[ii].end == null) { console.log(" # init_video 오류 : 대본 정보에 필수값인 start 또는 end 가 없습니다. JSON 파일을 확인해주세요(타입:" + _parent.getVar("_type") + " DIV:" + _parent.getVar("_div").outerHTML + ")."); }
                        }

                        // 레이블
                        if (p_container != null && i_state_layout == 1) { this.init_createLabel(p_container); }

                        // 롤플레이 체크
                        if ((p_roleplay == null || p_roleplay == 0) == false) { this.init_roleplay(p_roleplay); }

                        // 갱신
                        this.updateCaptionLabel();
                },
                init_createLabel: function (p_container) {
                        // 플래그
                        i_state_layout = 1;

                        // 생성
                        for (var ii = 0 ; ii < arObjectCaption.length ; ii++) {
                                arObjectCaption[ii].object = _ui.createElement("<div class=\"captionObj\"></div>", p_container, "arObjectCaption[" + ii + "].object(captionObj)");
                                arObjectCaption[ii].label = _ui.createElement("<div class=\"captionTxt\"></div>", arObjectCaption[ii].object, "arObjectCaption[" + ii + "].label(captionTxt)");
                        }
                },
                init_roleplay: function (p_amount) {
                        // 준비
                        var $this = this;
                        arObjectRole = new Array(p_amount);

                        // 객체 생성
                        for (var ii = 0 ; ii < arObjectRole.length ; ii++) {
                                arObjectRole[ii] = {};
                                arObjectRole[ii].idx = ii;
                                arObjectRole[ii].show = true;
                                arObjectRole[ii].btn = _ui.createElement("<div class=\"controlsRollbtn0" + (ii + 1) + "\"></div>", _tracker.controlsModulSet, "arObjectRole[" + arObjectRole[ii].idx + "].btn(controlsRollbtn0" + (ii + 1) + ")", "before");
                                arObjectRole[ii].btn.idx = ii;
                                $(arObjectRole[ii].btn).click(function (event) { $this.toggleRoleplay(event.target.idx); });
                        }

                        // 아이콘 및 마커
                        for (var ii = 0 ; ii < arObjectCaption.length ; ii++) {
                                // 준비
                                var obj = arObjectCaption[ii];

                                // 오류 체크
                                if (arObjectCaption[ii].role == null || arObjectCaption[ii].role == "") { console.log(" # init_roleplay 오류 : 롤플레이가 설정되었으나, 대본 정보에 role 값이 없습니다. JSON 파일을 확인해주세요(타입:" + _parent.getVar("_type") + " DIV:" + _parent.getVar("_div").outerHTML + ")."); }

                                // 마커
                                obj.marker = _ui.createElement("<div class=\"controlsRoll0" + (obj.role) + "\"></div>", _tracker.barTimeBack, "arObjectCaption[" + ii + "].marker(controlsRoll0" + (obj.role) + ")");
                                obj.marker.idx = ii;
                                $(obj.marker).mousedown(function (event) {
                                        $this.castRoleplayMarker(event.target.idx);
                                        return false;
                                });

                                // 아이콘
                                if (i_state_layout == 1) {
                                        obj.icon = _ui.createElement("<div class=\"iconRoll0" + obj.role + "\"></div>", obj.label, "arObjectCaption[" + ii + "].icon(iconRoll0" + obj.role + ")", "before");

                                        // 레이블 보정
                                        $(obj.label).css('padding-left', 30);
                                }
                        }

                        // 갱신
                        this.updateIconMarkerRoleplay();
                },
                init_convertDate2Sec:function (str) {
                        var ar_lv0 = str.split(".");
                        var ar_lv1 = ar_lv0[0].split("_");
                        var hh = parseInt(ar_lv1[0]);
                        var mm = parseInt(ar_lv1[1]);
                        var ss = parseInt(ar_lv1[2]);
                        var ms = parseInt(ar_lv0[1]);

                        var sec = hh * 3600 + mm * 60 + ss;
                        return "" + sec + "." + ms;
                },

                // reset
                reset: function () {
                        // 변수
                        b_state_translation = false;
                        if (arObjectRole != null) {
                                for (var ii = 0 ; ii < arObjectRole.length ; ii++) { arObjectRole[ii].show = true; }
                        }

                        // UI
                        this.updateCaptionLabel();
                        this.updateButtonTranslation();
                        this.updateFocus();
                        if (arObjectRole != null) { this.updateButtonRoleplay(); }
                        if (i_state_layout == 2) { this.updateViewSubtitle(false); }
                },

                // 추적
                traceModule: function () {
                        // 준비
                        var type = _parent.getVar("_type");
                        var file = _parent.getVar("_file");

                        // 정보 만들기
                        var str = "\n ********************* \n";
                        str += " * trace UI Module * \n\n";
                        str += "\ttarget : " + type + "(" + file + ")\n\n";
                        str += "\tb_state_ready : " + b_state_ready + "\n";
                        str += "\tb_state_translation : " + b_state_translation + "\n";
                        str += "\n";
                        for (var ii = 0 ; ii < arObjectCaption.length ; ii++) {
                                str += "\t" + arObjectCaption[ii].idx + " (" + arObjectCaption[ii].start + " ~ " + arObjectCaption[ii].end + ")\n";
                                str += "\t\t" + arObjectCaption[ii].role + " : " + arObjectCaption[ii].en + " / " + arObjectCaption[ii].kr + "\n\n";
                        }
                        str += "\n\n ********************* ";

                        // 출력
                        console.log(str);
                },

                // 레이블 갱신
                updateCaptionLabel: function () {
                        // 조건검사
                        if (b_state_ready == false) { return; }
                        if (i_state_layout != 1) { return; }

                        // 레이블
                        for (var ii = 0 ; ii < arObjectCaption.length ; ii++) {
                                // 준비
                                var obj = arObjectCaption[ii];

                                // 자막가리기
                                if (b_state_script == false) {
                                        obj.label.innerHTML = "";
                                        if (obj.icon != null) $(obj.icon).css("display", "none");
                                        continue;
                                }

                                // 레이블
                                if (b_state_translation == true) { // 번역 기능
                                        obj.label.innerHTML = obj.en + "\n" + obj.ko;
                                        $(obj.label).css('margin-bottom', 10 + 'px');
                                        if (obj.icon != null) {
                                                $(obj.icon).css("display", "inline-block");
                                                $(obj.icon).css('margin-top', 10 + 'px');
                                        }
                                } else {
                                        // 플랫폼 대응
                                        var pl = _parent.getVar("_platform");
                                        var margin_bottom = 0;
                                        var margin_top = 0;
                                        switch (pl) {
                                                case "VS":
                                                        margin_bottom = 10;
                                                        margin_top = -2;
                                                        break;
                                                case "DA":
                                                        margin_bottom = 0;
                                                        margin_top = 2;
                                                        break;
                                        }
                                        
                                        obj.label.innerHTML = obj.en;
                                        $(obj.label).css('margin-bottom', margin_bottom + 'px');
                                        if (obj.icon != null) {
                                                $(obj.icon).css("display", "inline-block");
                                                $(obj.icon).css('margin-top', margin_top + 'px');
                                        }
                                }
                        }
                },

                // 포커스 갱신
                updateFocus: function (time) {
                        // 조건검사
                        if (b_state_ready == false) { return; }

                        // 인덱스 time 이 없이 들어오거나, 0 이거나, 구간에 없으면 -1
                        var idx = (time == null || time == 0) ? -1 : this.updateFocus_getCurrentCaption(time);

                        // 포커스
                        switch (i_state_layout) {
                                case 0: // 하이라이트 전용
                                        for (var ii = 0 ; ii < arObjectCaption.length ; ii++) {
                                                if (ii == idx) {
                                                        if (b_state_highlight == true) { $(arObjectCaption[ii].highlight).css("background-color", COLOR_HIGHLIGHT); }
                                                } else {
                                                        if (b_state_highlight == true) { $(arObjectCaption[ii].highlight).css("background-color", "rgba(0,0,0,0)"); }
                                                }
                                        }
                                        break;
                                case 1: // 대본
                                        for (var ii = 0 ; ii < arObjectCaption.length ; ii++) {
                                                if (ii == idx) {
                                                        $(arObjectCaption[ii].label).css("color", COLOR_TEXT_HIGHLIGHT);
                                                        if (b_state_highlight == true) { $(arObjectCaption[ii].highlight).css("background-color", COLOR_HIGHLIGHT); }
                                                        if ($(_tracker.conLabel) != null) { $(_tracker.conLabel).scrollTop(arObjectCaption[ii].label.offsetTop - 10); }
                                                } else {
                                                        $(arObjectCaption[ii].label).css("color", COLOR_TEXT_NORMAL);
                                                        if (b_state_highlight == true) { $(arObjectCaption[ii].highlight).css("background-color", "rgba(0,0,0,0)"); }
                                                }
                                        }
                                        break;
                                case 2: // 자막
                                        if (idx == -1) { _tracker.laeSubtitle.innerHTML = ""; }
                                        else { _tracker.laeSubtitle.innerHTML = arObjectCaption[idx].en; }
                                        break;
                        }


                        // 롤에 의한 침묵 처리
                        if (arObjectRole != null && b_state_ready == true) {
                                if (idx != -1 && arObjectRole[arObjectCaption[idx].role - 1].show == false) { _core.setMute(true); }
                                else { _core.setMute(false); }
                        }
                },
                updateFocus_getCurrentCaption: function (time) {
                        // 검색
                        for (var ii = 0 ; ii < arObjectCaption.length ; ii++) {
                                if (arObjectCaption[ii].start <= time && time <= arObjectCaption[ii].end) { return ii; }
                        }

                        // 반환
                        return -1;
                },

                // 뷰 갱신
                updateButtonCaption: function (b) {
                        // 버튼
                        if (b == true) {
                                if ($(_tracker.btnCaption).hasClass("caption") == true) { $(_tracker.btnCaption).removeClass("caption"); }
                                if ($(_tracker.btnCaption).hasClass("caption_on") == false) { $(_tracker.btnCaption).addClass("caption_on"); }
                        } else {
                                if ($(_tracker.btnCaption).hasClass("caption_on") == true) { $(_tracker.btnCaption).removeClass("caption_on"); }
                                if ($(_tracker.btnCaption).hasClass("caption") == false) { $(_tracker.btnCaption).addClass("caption"); }
                        }
                },
                updateButtonScript: function () {
                        // 조건검사
                        if (b_state_ready == false) { return; }

                        // 버튼
                        if (b_state_script == true) {
                                if ($(_tracker.btnScript).hasClass("btn_script_on") == true) { $(_tracker.btnScript).removeClass("btn_script_on"); }
                                if ($(_tracker.btnScript).hasClass("btn_script_off") == false) { $(_tracker.btnScript).addClass("btn_script_off"); }
                        } else {
                                if ($(_tracker.btnScript).hasClass("btn_script_off") == true) { $(_tracker.btnScript).removeClass("btn_script_off"); }
                                if ($(_tracker.btnScript).hasClass("btn_script_on") == false) { $(_tracker.btnScript).addClass("btn_script_on"); }
                        }
                },
                updateButtonTranslation: function () {
                        // 조건검사
                        if (b_state_ready == false) { return; }

                        // 버튼
                        if (b_state_translation == true) {
                                if ($(_tracker.btnTranslation).hasClass("btn_lang_on") == true) { $(_tracker.btnTranslation).removeClass("btn_lang_on"); }
                                if ($(_tracker.btnTranslation).hasClass("btn_lang_off") == false) { $(_tracker.btnTranslation).addClass("btn_lang_off"); }
                        } else {
                                if ($(_tracker.btnTranslation).hasClass("btn_lang_off") == true) { $(_tracker.btnTranslation).removeClass("btn_lang_off"); }
                                if ($(_tracker.btnTranslation).hasClass("btn_lang_on") == false) { $(_tracker.btnTranslation).addClass("btn_lang_on"); }
                        }
                },
                updateViewSubtitle: function (b) {
                        // 플래그
                        b_state_subtitle = b;

                        // 자막
                        if (b_state_subtitle == true) { $(_tracker.captionBox).css("display", "block"); }
                        else { $(_tracker.captionBox).css("display", "none"); }

                        // 버튼
                        this.updateButtonCaption(b);

                        // 보정
                        this.reviseViewSubtitle();
                },
                reviseViewSubtitle: function () {
                        // 조건검사
                        if (b_state_subtitle == false) { return; }

                        // 준비
                        var _compo = _parent.getVar("_compo");
                        var inout = (_compo.chkinout == null) ? false : _compo.chkinout.getVar("b_state_inout");
                        var fullscreen = (_compo.fullscreen == null) ? false : _compo.fullscreen.getVar("b_state_fullscreen");

                        // 크기
                        if (fullscreen) {
                                $(_tracker.conLabel).css("height", 60);
                                $(_tracker.laeSubtitle).css("font-size", 26);
                                $(_tracker.laeSubtitle).css("padding-top", 13);
                        } else {
                                // 플랫폼 대응
                                switch (_parent.getVar("_platform")) {
                                        case "VS":
                                                $(_tracker.conLabel).css("height", 35);
                                                $(_tracker.laeSubtitle).css("font-size", 16);
                                                $(_tracker.laeSubtitle).css("padding-top", 0);
                                                break;
                                        case "DA":
                                                $(_tracker.conLabel).css("height", 26);
                                                $(_tracker.laeSubtitle).css("font-size", 15);
                                                $(_tracker.laeSubtitle).css("padding-top", 0);
                                                break;
                                }
                        }

                        // 위치
                        // 플랫폼 대응
                        switch (_parent.getVar("_platform")) {
                                case "VS":
                                        if (inout == true) {
                                                if (fullscreen == true) { $(_tracker.captionBox).css("top", $(_tracker.videoWrap).height() - $(_tracker.captionBox).height() - 100); }
                                                else { $(_tracker.captionBox).css("top", $(_tracker.videoWrap).height() - $(_tracker.captionBox).height() - 75); }
                                        } else {
                                                if (fullscreen == true) { $(_tracker.captionBox).css("top", $(_tracker.videoWrap).height() - $(_tracker.captionBox).height() - 30); }
                                                else { $(_tracker.captionBox).css("top", $(_tracker.videoWrap).height() - $(_tracker.captionBox).height() - 10); }
                                        }
                                        break;
                                case "DA":
                                        if (inout == true) {
                                                if (fullscreen == true) { $(_tracker.captionBox).css("top", $(_tracker.videoWrap).height() - $(_tracker.captionBox).height() - 30); }
                                                else { $(_tracker.captionBox).css("top", $(_tracker.videoWrap).height() - $(_tracker.captionBox).height() - 5); }
                                        } else {
                                                if (fullscreen == true) { $(_tracker.captionBox).css("top", $(_tracker.videoWrap).height() - $(_tracker.captionBox).height() - 30); }
                                                else { $(_tracker.captionBox).css("top", $(_tracker.videoWrap).height() - $(_tracker.captionBox).height() - 5); }
                                        }
                                        break;
                        }
                },

                // 하이라이트 관련
                setHighlight: function (p_mpid, noresponse) {
                        // 플래그
                        b_state_highlight = true;

                        // 준비
                        var $this = this;
                        var target = $(document).find("[data-mpid='" + p_mpid + "']")[0];

                        // 처리
                        for (var ii = 0 ; ii < arObjectCaption.length ; ii++) {
                                // 준비
                                var obj = arObjectCaption[ii];

                                // 기존에 존재 하였다면 이벤트 해제
                                if (obj.highlight != null) { $(obj.highlight).off("click"); }

                                // 수집
                                obj.highlight = $(target).find("[data-sentence='" + (ii + 1) + "']")[0];
                                if (obj.highlight == null || obj.highlight === undefined) {
                                        console.log(" # setHighlight 오류 : 하이라이트 그룹과 연결이 바르지 않습니다. data-highlight 와 매치되는 data-mpid 가 존재하는지 확인해주세요(타입:" + _parent.getVar("_type") + " DIV:" + _parent.getVar("_div").outerHTML + ").");
                                }

                                // 하위
                                var children = $(obj.highlight).children();
                                if (children != null) { for (var jj = 0 ; jj < children.length ; jj++) { children[jj].idx = obj.idx; } }

                                // 초기화
                                obj.highlight.idx = obj.idx;
                                $(obj.highlight).css("cursor", "pointer");

                                // 반응
                                if (noresponse == null || noresponse != 1) {
                                        $(obj.highlight).click(function (event) {
                                                if (b_able_response == true) { $this.playHightlight(event.target); }
                                                b_able_response = true;
                                        });
                                }
                        }
                },
                playHightlight: function (btn) { _core.playSentence(arObjectCaption[btn.idx].start, arObjectCaption[btn.idx].end); },

                // 자막가리기 관련
                toggleScript: function () {
                        // 토글
                        b_state_script = !b_state_script;

                        // 갱신
                        this.updateCaptionLabel();
                        this.updateButtonScript();
                },

                // 번역 관련
                toggleTranslation: function () {
                        // 토글
                        b_state_translation = !b_state_translation;

                        // 갱신
                        this.updateCaptionLabel();
                        this.updateButtonTranslation();
                },

                // 롤플레이 관련
                toggleRoleplay: function (idx) {
                        arObjectRole[idx].show = !arObjectRole[idx].show;
                        this.updateButtonRoleplay();
                },
                setVisibleButtonRoleplay: function (b) {
                        // 조건검사
                        if (arObjectRole == null) { return; }

                        // 처리
                        for (var ii = 0 ; ii < arObjectRole.length ; ii++) {
                                if (b == true) { $(arObjectRole[ii].btn).css("display", "inline-block"); }
                                else { $(arObjectRole[ii].btn).css("display", "none"); }
                        }
                },
                updateButtonRoleplay: function () {
                        // 조건검사
                        if (arObjectRole == null) { return; }

                        // 버튼
                        for (var ii = 0 ; ii < arObjectRole.length ; ii++) {
                                var obj = arObjectRole[ii];
                                if (obj.show == true) {
                                        if ($(obj.btn).hasClass("controlsRollbtn0" + (ii + 1)) == true) { $(obj.btn).removeClass("controlsRollbtn0" + (ii + 1)); }
                                        if ($(obj.btn).hasClass("controlsRollbtn0" + (ii + 1) + "_on") == false) { $(obj.btn).addClass("controlsRollbtn0" + (ii + 1) + "_on"); }
                                } else {
                                        if ($(obj.btn).hasClass("controlsRollbtn0" + (ii + 1) + "_on") == true) { $(obj.btn).removeClass("controlsRollbtn0" + (ii + 1) + "_on"); }
                                        if ($(obj.btn).hasClass("controlsRollbtn0" + (ii + 1)) == false) { $(obj.btn).addClass("controlsRollbtn0" + (ii + 1)); }
                                }
                        }

                        // 아이콘 갱신
                        this.updateIconMarkerRoleplay();
                },
                updateIconMarkerRoleplay: function () {
                        // 조건검사
                        if (arObjectRole == null) { return; }

                        // 처리
                        for (var ii = 0 ; ii < arObjectCaption.length ; ii++) {
                                // 준비
                                var obj = arObjectCaption[ii];
                                var icon = obj.icon;
                                var marker = obj.marker;
                                var duration = _core.getVar("objMedia").duration;

                                // 조건검사
                                if (obj.role > arObjectRole.length) {
                                        console.log(" # updateIconMarkerRoleplay 오류 : 지정된 사람수 " + arObjectRole.length + " 를 넘어서는 role " + obj.role + " 이 호출되었습니다(타입:" + _parent.getVar("_type") + " DIV:" + _parent.getVar("_div").outerHTML + ").");
                                        return;
                                }

                                // 처리
                                if (arObjectRole[obj.role - 1].show == true) {
                                        if ($(icon).hasClass("iconRoll0" + obj.role) == true) { $(icon).removeClass("iconRoll0" + obj.role); }
                                        if ($(icon).hasClass("iconRoll0" + obj.role + "_on") == false) { $(icon).addClass("iconRoll0" + obj.role + "_on"); }
                                        if ((ii != 0 && obj.role == arObjectCaption[ii - 1].role) == false) { // 바로 전과 같은 Role 이면 마커는 무시
                                                switch (_parent.getVar("_platform")) {
                                                        case "VS":
                                                                $(marker).css("left", $(_tracker.barTimeBack).width() * (obj.start / duration) - 15);
                                                                break;
                                                        case "DA":
                                                                $(marker).css("left", $(_tracker.barTimeBack).width() * (obj.start / duration) - 9);
                                                                break;
                                                        case "NY":
                                                                $(marker).css("left", $(_tracker.barTimeBack).width() * (obj.start / duration) - 7);
                                                                break;
                                                }
                                                $(marker).css("display", "inline-block");
                                        } else {
                                                $(marker).css("display", "none");
                                        }
                                } else {
                                        if ($(icon).hasClass("iconRoll0" + obj.role + "_on") == true) { $(icon).removeClass("iconRoll0" + obj.role + "_on"); }
                                        if ($(icon).hasClass("iconRoll0" + obj.role) == false) { $(icon).addClass("iconRoll0" + obj.role); }
                                        $(marker).css("display", "none");
                                }
                        }
                },
                castRoleplayMarker: function (idx) { _parent.getVar("_module").core.moveTo(parseFloat(arObjectCaption[idx].start)); },
        }
}