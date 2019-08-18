///// MediaPlayer

// constant
var OPTION_EXIST_TIME_LABEL = false; // 컴포 유무
var OPTION_EXIST_VOLUME = false;
var OPTION_EXIST_SPEED = false;
var OPTION_EXIST_REPEAT = false;
var PATH_AUDIO = "media/audio/"; // 오디오 경로. 이와 함께 뒤에 .mp3 는 자동으로 붙음
var PATH_VIDEO = "media/video/"; // 비디오 경로. 이와 함께 뒤에 .mp4 는 자동으로 붙음
var COLOR_TEXT_NORMAL = "#333333"; // 텍스트 색 (대본 레이블)
var COLOR_TEXT_HIGHLIGHT = "#1169a1";
var COLOR_HIGHLIGHT = "#f4ff45"; // 하이라이트 기본 값
var Z_INDEX_POPUP = 1000; // 팝업 z-index
var MP4_FIXED_WIDTH = 698;
var MOUSE_TRACKING = false; // 마우스 트래킹

// variable
var arMediaPlayer = new Array(); // 미플 클래스 배열
var b_able_response = true; // 버튼 반응 가능 여부

// ready
$(document).ready(function () {
        // 미플 클래스 생성
        createMediaPlayerObject("mp3_a"); // 단일, 하이라이트
        createMediaPlayerObject("mp3_b"); // 그룹, 하이라이트
        createMediaPlayerObject("mp3_c"); // 그룹, 팝업
        createMediaPlayerObject("mp3_d"); // 그룹, 보통/빠르게
        // mp3_e 없음
        createMediaPlayerObject("mp4_a"); // 인라인 동영상
        // mp4_b 없음
        createMediaPlayerObject("mp4_c"); // 동영상 팝업

        // 정보 수집
        loadJSON(function () { for (var ii = 0 ; ii < arMediaPlayer.length ; ii++) { arMediaPlayer[ii].onJSONLoaded(); } });

        // 단순 기능 : 클릭 방어
        $(".noSound").each(function (key, value) { $(this).click(function () { b_able_response = false; }); });

        // 개발
        if (MOUSE_TRACKING == true) {
                $(document).click(function (event) { console.log(event.clientX + ", " + event.clientY); });
        }
});
function createMediaPlayerObject(str) {
        $("." + str).each(function (key, value) {
                try {
                        var object;
                        switch (str) {
                                case "mp3_a": object = objMediaPlayer_mp3_a(); object.init(value); break;
                                case "mp3_b": object = objMediaPlayer_mp3_b(); object.init(value); break;
                                case "mp3_c": object = objMediaPlayer_mp3_c(); object.init(value); break;
                                case "mp3_d": object = objMediaPlayer_mp3_d(); object.init(value); break;
                                        // mp3_e 없음
                                case "mp4_a": object = objMediaPlayer_mp4_a(); object.init(value); break;
                                        // mp4_b 없음
                                case "mp4_c": object = objMediaPlayer_mp4_c(); object.init(value); break;
                        }
                } catch (error) {
                        console.log(" # createMediaPlayerObject 오류 : " + str + "\n" + value.outerHTML + "\n에서 \"" + error + "\"오류 가 발생하였습니다.");
                }
                arMediaPlayer.push(object);
        });
}

// devtool
var objMediaPlayer__devtool = function (p_parent) {

        ///// variable

        // link
        var _parent = p_parent; // 부모 모듈



        ///// function
        return {

                // init
                init: function () {
                        // 메세지
                        console.log("devtool ready : " + _parent.getVar("_type") + "(" + _parent.getVar("_file") + ")");

                        // 키 이벤트 연결 ("1" = 49)
                        $(window).keyup(function (event) {
                                // 전달
                                if (_parent.onKeyUp != null) { _parent.onKeyUp(event.keyCode); }
                        });
                },
        }
}

// getMobileOS
function getMobileOS() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // windows phone
        if (/windows phone/i.test(userAgent)) { return "Windows Phone"; }

        // andriod
        if (/android/i.test(userAgent)) { return "Android"; }

        // iOS
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) { return "iOS"; }

        return "unknown";
}





///// Method

// 리셋 올
function resetAllMediaPlayer() { for (var ii = 0 ; ii < arMediaPlayer.length ; ii++) { arMediaPlayer[ii].reset(); } }
function resetAllMediaPlayerExcept(typefile) {
        for (var ii = 0 ; ii < arMediaPlayer.length ; ii++) {
                var compare = arMediaPlayer[ii].getVar("_type") + " " + arMediaPlayer[ii].getVar("_file");
                if (compare != typefile) { arMediaPlayer[ii].reset(); }
        }
}

// 제어 함수
function playMediaPlayer(p_mpid, target) {
        var core = getMediaPlayerById(p_mpid).getVar("_module").core;
        core.castStop();
        core.castPlay();
        if (target != null) getMediaPlayerById(p_mpid).setVar("_link", target);
}
function pauseMediaPlayer(p_mpid) {
        var core = getMediaPlayerById(p_mpid).getVar("_module").core;
        if (core.getVar("objMedia").paused == true) { core.castPlay(); }
        else { core.castPause(); }
}
function stopMediaPlayer(p_mpid) { getMediaPlayerById(p_mpid).getVar("_module").core.castStop(); }

// data-mpid 로 MediaPlayer 얻기
function getMediaPlayerById(p_mpid) {
        // 검색
        for (var ii = 0 ; ii < arMediaPlayer.length ; ii++) {
                if ($(arMediaPlayer[ii].getVar("_div")).data("mpid") == p_mpid) { return arMediaPlayer[ii]; }
        }

        // 메세지
        console.log(" # getMediaPlayerById 오류 : 호출한 mpid " + p_mpid + " 로 지정된 미디어플레이어가 없습니다.");
}

// 하이라이트 그룹 변경 (미디어플레이어 mpid, 변경할 그룹 mpid)
function changeHighlightGroup(p_mpid, p_group) {
        // 리셋 올
        resetAllMediaPlayer();

        // 검색
        var mediaplayer = getMediaPlayerById(p_mpid);

        // 함수 전달
        if (mediaplayer.changeHighlightGroup == null) { console.log(" # changeHighlightGroup 오류 : 하이라이트 그룹 변경 기능이 준비되지 않은 미디어플레이어 " + p_mpid + " 를 대상으로 하였습니다."); }
        else { mediaplayer.changeHighlightGroup(p_group); }
}

// id 로 찾아 DIV 가시여부 제어
function hideDivByID(p_id) { $("#" + p_id).css("display", "none"); }
function showDivByID(p_id) { $("#" + p_id).css("display", "inline-block"); }

// 음원-텍스트 설정
function setOptional(p_target, p_idx) {
        // 대상 그룹
        var target = $(document).find("[data-opid='" + p_target + "']")[0];
        if (target == null) { console.log(" # setOptional 오류 : data-opid " + p_target + " 을 찾지 못하였습니다."); }

        // 데이터
        var data = getPlayListInfo(p_target);

        // 텍스트
        if (data.text != null) {
                // 준비
                var ar_text = data.text[p_idx - 1];

                // 검색 & 적용
                for (var ii = 0 ; ii < ar_text.length ; ii++) {
                        // 대상 엘리먼트
                        var ele = $(target).find("[data-optext='" + (ii + 1) + "']")[0];
                        if (ele == null) { console.log(" # setOptional 오류 : data-optext " + (ii + 1) + " 을 찾지 못하였습니다."); return; }

                        // 적용
                        ele.textContent = ar_text[ii];
                }
        }

        // 음원
        if (data.mp3 != null) {
                // 준비
                var ar_mp3 = data.mp3[p_idx - 1];

                // 검색 & 적용
                for (var ii = 0 ; ii < ar_mp3.length ; ii++) {
                        // 대상 엘리먼트
                        var ele = $(target).find("[data-opmp3='" + (ii + 1) + "']")[0];
                        if (ele == null) { console.log(" # setOptional 오류 : data-opmp3 " + (ii + 1) + " 을 찾지 못하였습니다."); return; }

                        // 대상 미디어플레이어
                        var mp = ele.mediaplayer;
                        if (mp == null) { console.log(" # setOptional 오류 : data-opmp3 " + (ii + 1) + " 에는 미디어플레이어가 존재하지 않습니다."); return; }
                        if (mp.getVar("_type") != "mp3_a") { console.log(" # setOptional 오류 : data-opmp3 " + (ii + 1) + " 의 미디어플레이어는 mp3_a 타입이 아닙니다."); return; }

                        // 음원 교체
                        mp.changeSource(ar_mp3[ii]);
                }
        }
}





///// JSON

// variable
var playListInfo = null;

// function
function readJSONFile(filename, callback, errCallback) {
        $.ajax({
                url: filename,
                dataType: "json",
                type: "get",
                success: function (data) {
                        callback(data);
                },
                error: function (e) {
                        errCallback();
                }
        });
}
function loadJSON(endCallback) {
        var handler = null;
        var isLoadedPlayList = false

        var filename = location.href;
        filename = filename.substring(filename.lastIndexOf('/') + 1, filename.indexOf('.xhtml'));

        if (filename.indexOf('.json') < 0) {
                filename += '.json';
        }
        if (filename.indexOf('./json/') < 0) {
                filename = './json/' + filename;
        }

        readJSONFile(filename, function (data) {
                playListInfo = data;
                isLoadedPlayList = true;
        }, function () {
                isLoadedPlayList = true;
                //clearInterval(handler);
                //endCallback();
        });

        handler = setInterval(function () {
                if (isLoadedPlayList) {
                        clearInterval(handler);
                        endCallback();
                }
        }, 50);
}

// method
function getPlayListInfo(id) {
        if (playListInfo === null) {
        } else {
                return playListInfo[id];
        }
}
function JSONtoString(object) {
        var results = [];
        for (var property in object) {
                var value = object[property];
                if (value)
                        results.push(property.toString() + ': ' + value);
        }

        return '{' + results.join(', ') + '}';
}