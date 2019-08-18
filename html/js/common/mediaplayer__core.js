///// core (플레이 관련)
var objMediaPlayer__core = function (p_parent) {

        ///// variables

        // module
        var _parent = p_parent; // 이 모듈을 생성한 클래스
        var _this; // 클래스

        // object
        var objMedia; // 미디어 객체

        // option
        var b_option_event_end = false; // End 이벤트 체크 여부
        var b_option_event_timeupdate = false; // TimeUpdate 이벤트 체크 여부

        // state
        var b_state_sound; // 사운드 출력 여부
        var f_state_volume; // 볼륨
        var f_state_speed; // 재생속도
        var b_state_repeat; // 구간반복
        var f_state_repeat_start;
        var f_state_repeat_end;
        var f_state_sentence_end = -1; // 문장 플레이 종료 시간

        // private
        var b_loaded_media = false; // 미디어 로드 완료 여부





        ///// function

        return {

                ///// initialize

                // 참조
                getVar: function (str) {
                        // 분기
                        switch (str) {
                                case "objMedia": return objMedia;
                                case "b_state_sound": return b_state_sound;
                                case "f_state_volume": return f_state_volume;
                                case "f_state_speed": return f_state_speed;
                                case "f_state_repeat_start": return f_state_repeat_start;
                                case "f_state_repeat_end": return f_state_repeat_end;
                        }

                        // 메세지
                        console.log(" # getModule 오류 : 호출한 모듈 " + str + " 가 연결되지 않았습니다(타입:" + _parent.getVar("_type") + " DIV:" + _parent.getVar("_div").outerHTML + ").");
                },

                // 초기화
                init: function (p_end, p_timeupdate) {
                        // 연결
                        _this = this;

                        // 준비
                        var category = _parent.getVar("_category");
                        var file = _parent.getVar("_file");

                        // 옵션
                        b_option_event_end = p_end;
                        b_option_event_timeupdate = p_timeupdate;

                        // 객체 생성
                        objMedia = this.init_create_media(category, file);
                },
                init_create_media: function (p_category, p_filename) {
                        // 미디어 태그 생성하고 붙이고 로드 이벤트 리스너 붙임 : 모두 로드가 끝나야 유효한 duration 을 받을 수 있고, 정보 정리가 가능함

                        // 태그 생성
                        var obj;
                        switch (p_category) {
                                case "audio":
                                        obj = document.createElement("audio");
                                        obj.src = PATH_AUDIO + p_filename + ".mp3";
                                        break;
                                case "video":
                                        obj = document.createElement("video");
                                        obj.src = PATH_VIDEO + p_filename + ".mp4";
                                        break;
                        }

                        // 하이어라키 정보
                        obj.filename = p_filename;
                        obj.hierarchy_name = "[Media:" + p_category + ":" + p_filename + "]";
                        obj.hierarchy_level = 1;

                        // 붙이기
                        $(_parent.getVar("_div")).append(obj);

                        // 이벤트 리스너
                        obj.addEventListener("loadeddata", this.onLoadedData);
                        if (b_option_event_end == true) { obj.addEventListener("ended", this.onEnded); }
                        if (b_option_event_timeupdate == true) { obj.addEventListener("timeupdate", this.onTimeUpdate) }

                        // 반환
                        return obj;
                },

                // 리셋
                reset: function () {
                        // 초기화
                        f_state_sentence_end = -1;
                        this.setVolume(0.8);
                        this.setSound(true);
                        this.setSpeed(1);
                        this.resetRepeat();
                        this.setMute(false);

                        // 멈춤
                        this.castStop();
                },





                ///// tool

                // 추적
                traceModule: function () {
                        // 준비
                        var type = _parent.getVar("_type");
                        var file = _parent.getVar("_file");

                        // 정보 만들기
                        var str = "\n ********************* \n";
                        str += " * trace Core Module * \n\n";
                        str += "\ttarget : " + type + "(" + file + ")\n";
                        str += "\tsrc : " + objMedia.src + "\n";
                        str += "\ttime(duration) : " + objMedia.currentTime + "(" + objMedia.duration + ")\n";
                        str += "\n";
                        str += "\tobjMedia.paused : " + objMedia.paused + "\n";
                        str += "\tb_option_event_end : " + b_option_event_end + "\n";
                        str += "\tb_option_event_timeupdate : " + b_option_event_timeupdate + "\n";
                        str += "\tb_state_sound : " + b_state_sound + "\n";
                        str += "\tf_state_volume : " + f_state_volume + "\n";
                        str += "\tf_state_speed : " + f_state_speed + "\n";
                        str += "\tb_state_repeat : " + b_state_repeat + "\n";
                        str += "\tf_state_repeat_start : " + f_state_repeat_start + "\n";
                        str += "\tf_state_repeat_end : " + f_state_repeat_end + "\n";
                        str += "\n ********************* ";

                        // 출력
                        console.log(str);
                },





                ///// event

                // 로드 완료 이벤트
                onLoadedData: function () {
                        // 조건검사
                        if (b_loaded_media == true) { return; }

                        // 플래그
                        b_loaded_media = true;

                        // 갱신
                        if (_parent.getVar("_compo").timelabel != null) { _parent.getVar("_compo").timelabel.updateLabelTimeDuration(objMedia.duration); }
                },

                // 재생 종료 이벤트
                onEnded: function () {
                        if (_parent.getVar("_module").ui != null) _parent.getVar("_module").ui.updateButton("btnPlay");
                        if (_parent.onEnded != null) { _parent.onEnded(); }
                },

                // 재생 갱신 이벤트
                onTimeUpdate: function () {
                        // 문장 플레이 체크
                        if (f_state_sentence_end != -1 && objMedia.currentTime >= f_state_sentence_end) {
                                _this.castPause();
                                f_state_sentence_end = -1;
                        }

                        // 구간반복 체크
                        if (b_state_repeat == true) _this.chkRepeat();

                        // 갱신
                        if (_parent.getVar("_module").caption != null) { _parent.getVar("_module").caption.updateFocus(objMedia.currentTime); }
                        if (_parent.getVar("_compo").timebar != null) { _parent.getVar("_compo").timebar.updateBarTime(objMedia.currentTime); }
                        if (_parent.getVar("_compo").timelabel != null) { _parent.getVar("_compo").timelabel.updateLabelTimeCurrent(objMedia.currentTime); }
                        if (_parent.onTimeUpdate != null) { _parent.onTimeUpdate(objMedia.currentTime); }

                        // 강제 갱신
                        setTimeout(function () { _this.forceUpdate(); }, 25);
                },
                forceUpdate: function () { if (objMedia.paused == false) { _this.onTimeUpdate(); } },





                ///// method

                // 재생
                castPlay: function () {
                        // 재생
                        objMedia.play();
                        
                        /*
                        // 에러 체크
                        if (playPromise !== undefined) {
                                playPromise.catch(error => {
                                        console.log(" # castPlay 오류 : 미디어 오브젝트가 의도대로 동작하지 않습니다. data-audio 를 확인해주세요(타입:" + _parent.getVar("_type") + " DIV:" + _parent.getVar("_div").outerHTML + ").");
                                });
                        }*/

                        // 갱신
                        if (_parent.getVar("_module").ui != null) _parent.getVar("_module").ui.updateButton("btnPlay");
                },
                castPause: function () {
                        // 멈춤
                        objMedia.pause();

                        // 갱신
                        if (_parent.getVar("_module").ui != null) _parent.getVar("_module").ui.updateButton("btnPlay");
                },
                castStop: function () {
                        // 문장 플레이 플래그
                        f_state_sentence_end = -1;

                        // 멈춤 & 초기화
                        if (objMedia != null) {
                                if (objMedia.paused == false || objMedia.currentTime != 0) { objMedia.currentTime = 0; }
                                objMedia.pause();
                        }

                        // 갱신
                        if (_parent.getVar("_module").ui != null) _parent.getVar("_module").ui.updateButton("btnPlay");
                },
                moveTo: function (p_time) {
                        // 이동
                        objMedia.currentTime = p_time;

                        // 갱신
                        if (_parent.getVar("_module").caption != null) { _parent.getVar("_module").caption.updateFocus(objMedia.currentTime); }
                },
                playSentence: function (start, end) {
                        // 리셋 올
                        resetAllMediaPlayer();

                        // 이동
                        this.moveTo(start);

                        // 플레이
                        objMedia.play();
                        if (_parent.getVar("_module").ui != null) _parent.getVar("_module").ui.updateButton("btnPlay");

                        // 문장 플레이 플래그
                        f_state_sentence_end = end;
                },

                // 동결 (마우스 드래그 할 때 일시적으로 속도 멈춤) * 문장 플래그 제거 용도로도 사용
                setFreeze: function (b) {
                        if (b) {
                                f_state_sentence_end = -1;
                                objMedia.playbackRate = 0;
                        } else {
                                objMedia.playbackRate = f_state_speed;
                        }
                },

                // 침묵 (롤플레이에 의한 침묵 처리)
                setMute: function (b) { if (objMedia != null) { objMedia.muted = b; } },

                // 사운드
                setSound: function (b) {
                        b_state_sound = b;
                        if (objMedia != null) {
                                if (b) { objMedia.volume = f_state_volume; }
                                else { objMedia.volume = 0; }
                        }
                        if (_parent.getVar("_compo").volume != null) _parent.getVar("_compo").volume.updateBtnSound(b);
                        if (_parent.getVar("_compo").volume != null) _parent.getVar("_compo").volume.updateBarVolume(objMedia.volume);
                },

                // 볼륨
                setVolume: function (f) {
                        if (b_state_sound == false) { return; } // 조건검사
                        f_state_volume = f;
                        if (objMedia != null) { objMedia.volume = f; }
                        if (_parent.getVar("_compo").volume != null) _parent.getVar("_compo").volume.updateBarVolume(objMedia.volume);
                },

                // 재생속도
                setSpeed: function (f) {
                        f_state_speed = f;
                        if (f_state_speed < 0.5) { f_state_speed = 0.5; }
                        if (f_state_speed > 2.0) { f_state_speed = 2.0; }
                        if (objMedia != null) { objMedia.playbackRate = f_state_speed; }
                        if (_parent.getVar("_compo").speed != null) _parent.getVar("_compo").speed.updateLabelSpeed(f_state_speed);
                },

                // 구간반복
                setRepeat: function (point) {
                        // 토글
                        switch (point) {
                                case 0: // 트리거 A
                                        if (f_state_repeat_start == -1) { f_state_repeat_start = objMedia.currentTime; }
                                        else { f_state_repeat_start = -1; }
                                        break;
                                case 1: // 트리거 B
                                        if (f_state_repeat_end == -1) { f_state_repeat_end = objMedia.currentTime; }
                                        else { f_state_repeat_end = -1; }
                                        break;
                        }

                        // 판단
                        if (f_state_repeat_start != -1 && f_state_repeat_end != -1) { // 활성화
                                // 반복구간 보정 : A 가 B 보다 뒤 일 경우 A 와 B 를 교체
                                if (f_state_repeat_start > f_state_repeat_end) {
                                        var temp = f_state_repeat_start;
                                        f_state_repeat_start = f_state_repeat_end;
                                        f_state_repeat_end = temp;
                                }

                                // 플래그
                                b_state_repeat = true;
                        } else { // 비활성화
                                b_state_repeat = false;
                        }

                        // UI 갱신
                        if (_parent.getVar("_compo").repeat != null) _parent.getVar("_compo").repeat.updateRepeat();
                },
                resetRepeat: function () {
                        f_state_repeat_start = -1;
                        f_state_repeat_end = -1;
                        b_state_repeat = false;
                        if (_parent.getVar("_compo").repeat != null) _parent.getVar("_compo").repeat.updateRepeat();
                },
                chkRepeat: function () {
                        if (f_state_repeat_end < objMedia.currentTime) { this.moveTo(f_state_repeat_start + 0.2); }
                        else if (objMedia.currentTime < f_state_repeat_start) { this.moveTo(f_state_repeat_start + 0.2); }
                },
        }
}