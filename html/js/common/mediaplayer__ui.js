///// ui (UI 관련)
var objMediaPlayer__ui = function (p_parent) {

        ///// variables

        // module
        var _parent = p_parent; // 이 모듈을 생성한 클래스
        var _this; // 클래스
        var _core;





        ///// function

        return {

                ///// initialize

                // 참조
                getVar: function (str) {
                        // 분기
                        switch (str) {

                        }

                        // 메세지
                        console.log(" # getModule 오류 : 호출한 모듈 " + str + " 가 연결되지 않았습니다(타입:" + _parent.getVar("_type") + " DIV:" + _parent.getVar("_div").outerHTML + ").");
                },

                // 옵션 설정 - init 전에 호출해야 함
                setOption: function (str, bool) {
                        switch (str) {

                        }

                        // 메세지
                        console.log(" # setOption 오류 : 호출한 옵션 " + str + " 가 연결되지 않았습니다(타입:" + _parent.getVar("_type") + " DIV:" + _parent.getVar("_div").outerHTML + ").");
                },

                // 초기화
                init: function () {
                        // 연결
                        _this = this;
                        _core = _parent.getVar("_module").core;
                },





                ///// tool

                // 추적
                traceModule: function (ele) {
                        // 준비
                        var type = _parent.getVar("_type");
                        var file = _parent.getVar("_file");
                        var tar = (ele == null) ? _parent.getVar("_div") : ele;

                        // 정보 만들기
                        var str = "\n ********************* \n";
                        str += " * trace UI Module * \n\n";
                        str += "\ttarget : " + type + "(" + file + ")\n";
                        str += "\thierarchy : " + tar.hierarchy_name + "\n\n";
                        str += this.traceModule_getHierarchyInfo(tar);
                        str += "\n\n ********************* ";

                        // 출력
                        console.log(str);
                },
                traceModule_getHierarchyInfo: function (ele) {
                        // 조건검사
                        if (ele.hierarchy_level == null) return "";

                        // 하위 타고 내려감
                        var rtn = "";
                        rtn += this.traceModule_getHierarchyString(ele);
                        for (var ii = 0 ; ii < $(ele).contents().length ; ii++) {
                                rtn += this.traceModule_getHierarchyInfo($(ele).contents().eq(ii)[0]);
                        }

                        return rtn;
                },
                traceModule_getHierarchyString: function (ele) { return this.traceModule_createTab(ele.hierarchy_level) + "" + ele.hierarchy_name + "\n"; },
                traceModule_createTab: function (amount) {
                        // 탭 넣기
                        var rtn = "\t";
                        for (var ii = 0 ; ii < amount ; ii++) {
                                rtn += "\t";
                        }
                        return rtn;
                },





                ///// method

                // 엘레먼트 생성
                createElement: function (p_str, p_tar, p_name, p_option) {
                        // 생성
                        var obj = $(p_str)[0];

                        // 추적용 정보 준비
                        obj.hierarchy_name = p_name;
                        if (p_tar.hierarchy_level == null) { p_tar.hierarchy_level = 0; }

                        // 붙이기
                        var pos = (p_option == null) ? "under" : p_option;
                        switch (pos) {
                                case "under": // 아래
                                        $(p_tar).append(obj);
                                        obj.hierarchy_level = p_tar.hierarchy_level + 1;
                                        break;
                                case "after":// 뒤
                                        $(p_tar).after(obj);
                                        obj.hierarchy_level = p_tar.hierarchy_level;
                                        break;
                                case "before": // 앞
                                        $(p_tar).before(obj);
                                        obj.hierarchy_level = p_tar.hierarchy_level;
                                        break;
                        }

                        // 반환
                        return obj;
                },

                // 버튼 생성
                createButton: function (p_str, p_tar, p_tag, p_name, p_option) {
                        // 투명버튼 보정
                        if (p_tag == "btnShow" && $(_parent.getVar("_div")).find("[data-button]")[0] != null) {
                                var btn = $(_parent.getVar("_div")).find("[data-button]")[0];
                                $(btn).click(function (event) { _parent.onButtonClick("btnShow", btn); });
                                return;
                        }

                        // 준비
                        var $this = this;
                        var pos = (p_option == null) ? "under" : p_option;

                        // 생성
                        var obj = this.createElement(p_str, p_tar, p_name, p_option);

                        // 분기
                        switch (p_tag) {
                                case "btnNoUI":
                                        $(obj).css("cursor", "pointer"); // 모양
                                        $(obj).css("position", "absolute");
                                        $(obj).css("width", $(p_tar).width());
                                        $(obj).css("height", $(p_tar).height());
                                        $(obj).click(function (event) { _parent.onButtonClick(p_tag, event.target); });
                                        return obj;
                                case "btnShow":
                                        $(obj).css("cursor", "pointer"); // 모양
                                        $(obj).css("position", "absolute");
                                        $(obj).css("width", $(p_tar).width());
                                        $(obj).css("height", $(p_tar).height());
                                        $(obj).click(function (event) { _parent.onButtonClick(p_tag, event.target); });
                                        return obj;
                                case "btnPlay":
                                        $(obj).click(function (event) {
                                                // 재생, 일시정지
                                                if (_core.getVar("objMedia").paused == false) { _core.castPause(); }
                                                else { _core.castPlay(); }

                                                // 뷰 갱신
                                                $this.updateButton("btnPlay");

                                                // 전달
                                                if (_parent.getVar("_platform") == "DA") { _parent.onButtonClick(p_tag, event.target); }
                                        });
                                        return obj;
                                case "btnStop":
                                        $(obj).click(function (event) { _core.castStop(); });
                                        return obj;
                                case "btnClose":
                                        $(obj).click(function (event) { resetAllMediaPlayer(); });
                                        return obj;
                                default:
                                        $(obj).click(function (event) { _parent.onButtonClick(p_tag, event.target); });
                                        return obj;
                        }
                },

                // 버튼 뷰 갱신
                updateButton: function (btn) {
                        switch (btn) {
                                case "btnPlay":
                                        var obj = _parent.getVar("_tracker").btnPlay;
                                        if (_core.getVar("objMedia").paused == false) {
                                                if ($(obj).hasClass("controlsPlay") == true) { $(obj).removeClass("controlsPlay"); }
                                                if ($(obj).hasClass("controlsPause") == false) { $(obj).addClass("controlsPause"); }
                                        } else {
                                                if ($(obj).hasClass("controlsPause") == true) { $(obj).removeClass("controlsPause"); }
                                                if ($(obj).hasClass("controlsPlay") == false) { $(obj).addClass("controlsPlay"); }
                                        }
                                        break;
                        }
                },
        }
}