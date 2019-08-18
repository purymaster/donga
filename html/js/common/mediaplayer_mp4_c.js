///// mp4_a
var objMediaPlayer_mp4_c = function () {

        ///// variables

        // module
        var _platform = "DA"; // �÷���
        var _type = "mp4_c"; // Ÿ��
        var _div; // �̵�� �÷��̾� ������ ȣ���� Div
        var _this; // Ŭ����
        var _category; // audio or video
        var _file; // ���� ����
        var _tracker; // ������
        var _module; // ���
        var _compo; // ����
        var _link; // ����



        ///// custom

        // option
        var b_option_script = true; // �ڸ������� ��ư ���� (�ɼ� üũ ����)
        var i_option_roleplay = 0; // ���÷��� ��� ��

        // state
        var i_state_layout = 0; // ���� ���̾ƿ� (0:�Ⱥ��� 1:�˾� 2:Ȯ��)





        ///// functions
        return {

                ///// sharing code (�׻� ���� �����ϰ� ������ ��)

                // ���޹���
                onJSONLoaded: function () { this.onStart(); },

                // ����
                setVar: function (str, val) {
                        // �б�
                        switch (str) {
                                case "_file": _file = val; return;
                                case "_link": _link = val; return;
                        }

                        // �޼���
                        console.log(" # getVar ���� : ȣ���� ���� " + str + " �� ������� �ʾҽ��ϴ�(Ÿ��:" + _type + " DIV:" + _div.outerHTML + ").");
                },
                getVar: function (str) {
                        // �б�
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

                        // �޼���
                        console.log(" # getVar ���� : ȣ���� ���� " + str + " �� ������� �ʾҽ��ϴ�(Ÿ��:" + _type + " DIV:" + _div.outerHTML + ").");
                },

                // ����
                reset: function () { this.onReset(); },

                // �ʱ�ȭ
                init: function (p_div) {
                        // �غ�
                        var source_type; // audio or video

                        // �⺻
                        _div = p_div;
                        _this = this;
                        _category = ($(_div).data("audio") == null) ? "video" : "audio";
                        _file = ($(_div).data("audio") == null) ? $(_div).data("video") : $(_div).data("audio");
                        _tracker = {};
                        _module = {};
                        _compo = {};
                        _div.mediaplayer = this;

                        // ���ߵ���
                        if ($(_div).data("devtool") == 1) { _module.devtool = objMediaPlayer__devtool(_this); _module.devtool.init(); }

                        // �ھ�
                        _module.core = objMediaPlayer__core(this);
                },





                ///// module

                // onStart
                onStart: function () {
                        /// �ʱ�ȭ

                        // �޼���
                        if (_module.devtool != null) console.log("onStart");

                        // �ھ� �ʱ�ȭ
                        _module.core.init(true, true);

                        // UI ��� �غ�
                        _div.hierarchy_name = "_div";
                        _div.hierarchy_level = 0;
                        _module.ui = objMediaPlayer__ui(this);
                        _module.ui.init();

                        // UI ����
                        this.onStart_createUI();



                        /// ���� ó��

                        // �غ�
                        var data = getPlayListInfo(_file);
                        var video = _module.core.getVar("objMedia");

                        // �ɼ� üũ
                        if (data.caption == null) { console.log(" # ������ ���� : �ʼ� ������ caption �� �������� �ʾҽ��ϴ�(Ÿ��:" + _type + " DIV:" + _div.outerHTML + ")."); }
                        if (data.roleplay != null) { i_option_roleplay = parseInt(data.roleplay); }

                        ///// ���� : �뺻

                        // �ʱ�ȭ
                        _tracker.captionBox = _module.ui.createElement("<div class=\"captionBox\"></div>", _tracker.videoWrap, "captionBox");
                        _tracker.conLabel = _module.ui.createElement("<div class=\"captionbg\"></div>", _tracker.captionBox, "conLabel(captionbg)");
                        _module.caption = objMediaPlayer__caption(_this);

                        // �Է�
                        _module.caption.init_video(data.caption, 1, _tracker.conLabel, i_option_roleplay);

                        // Ǯ��ũ�� �ʱ�ȭ
                        _compo.fullscreen.init(_tracker.videoWrap, _tracker.controlsModulSet, data.width);

                        // �ڸ� ������ ��ư
                        if (b_option_script == true) {
                                _tracker.btnScript = _module.ui.createButton("<div class=\"btn_script_off\"></div>", _tracker.controlsModulSet, "btnScript", "btnScript(btn_script_off)");
                        }

                        // ������
                        if (data.poster != null) { video.poster = data.poster; }

                        // ũ�� ����
                        var ratio = data.width / data.height;
                        var fixed_height = MP4_FIXED_WIDTH / ratio;

                        // ����
                        $(video).width(MP4_FIXED_WIDTH);
                        $(video).height(fixed_height);
                        $(_tracker.videoWrap).css("width", MP4_FIXED_WIDTH);
                        $(_tracker.conLabel).css("height", 440);
                        $(_tracker.btnClose).appendTo(_tracker.conTitle);
                        if (i_option_roleplay == 0) {
                                $(_tracker.controlsTop).css("padding-right", 115);
                        } else {
                                $(_tracker.controlsTop).css("padding-right", 185);
                        }



                        /// ������

                        // �ʱ�ȭ
                        $(_tracker.videoWrap).css("display", "inline-block");

                        // ����
                        this.reset();
                },
                onStart_createUI: function () {
                        ///// ���
                        _tracker.videoFullbg = _module.ui.createElement("<div class=\"videoFullbg\"></div>", $("body"), "videoFullbg");
                        _tracker.popupContent = _module.ui.createElement("<div class=\"popupContent\"></div>", _tracker.videoFullbg, "popupContent");

                        // Ÿ��Ʋ
                        _tracker.conTitle = $(_div).find(".fullVideoPopupBrit")[0];
                        _tracker.conTitle.hierarchy_name = "conTitle(fullVideoPopupBrit)";
                        _tracker.conTitle.hierarchy_level = _tracker.popupContent.hierarchy_level + 1;
                        if (_tracker.conTitle == null) { console.log(" # onStart_createUI ���� : �ʼ��� fullVideoPopupBrit �� ���Ե� ������Ʈ�� �������� �ʽ��ϴ�(Ÿ��:" + _type + " DIV:" + _div.outerHTML + ")."); }
                        $(_tracker.conTitle).appendTo(_tracker.popupContent);

                        // ��
                        _tracker.videoWrap = _module.ui.createElement("<div class=\"videoWrap\"></div>", _tracker.popupContent, "videoWrap");


                        // �� ��ư
                        _tracker.btnShow = _module.ui.createButton("<div></div>", _div, "btnShow", "btnShow(x)");

                        // �̵��
                        var video = _module.core.getVar("objMedia");
                        video.hierarchy_level = _tracker.videoWrap.hierarchy_level + 1;
                        $(video).appendTo(_tracker.videoWrap);

                        // BG
                        _tracker.controlsbg = _module.ui.createElement("<div class=\"controlsbg\"></div>", _tracker.videoWrap, "controlsbg");

                        // ��Ʈ��
                        _tracker.videoControls = _module.ui.createElement("<div class=\"videoControls\"></div>", _tracker.videoWrap, "videoControls");


                        ///// ���
                        _tracker.controlsTop = _module.ui.createElement("<div class=\"controlsTop\"></div>", _tracker.videoControls, "controlsTop");

                        // ���� : �ð�����
                        _compo.timebar = objMediaPlayer__compo_timebar(_this); 
                        _compo.timebar.init(_tracker.controlsTop);



                        ///// ����
                        _tracker.controlsLeft = _module.ui.createElement("<div class=\"controlsLeft\"></div>", _tracker.videoControls, "controlsLeft");

                        // ��� ��ư
                        _tracker.btnPlay = _module.ui.createButton("<div class=\"controlsPlay\"></div>", _tracker.controlsLeft, "btnPlay", "btnPlay(controlsPlay)");

                        // ���� ��ư
                        _tracker.btnStop = _module.ui.createButton("<div class=\"controlsStop\"></div>", _tracker.controlsLeft, "btnStop", "btnStop(controlsStop)");



                        ///// ������
                        _tracker.controlsRight = _module.ui.createElement("<div class=\"controlsRight\"></div>", _tracker.videoControls, "controlsRight");
                        _tracker.controlsModulSet = _module.ui.createElement("<div class=\"controlsModulSet\"></div>", _tracker.controlsRight, "controlsModulSet");

                        

                        ///// �� ��

                        // ���� : Ǯ��ũ��
                        _compo.fullscreen = objMediaPlayer__compo_fullscreen(_this);

                        // �ݱ� ��ư
                        _tracker.btnClose = _module.ui.createButton("<div class=\"mediaCloseBtn\"></div>", _tracker.controlsModulSet, "btnClose", "btnClose(mediaCloseBtn)")
                },

                // onReset
                onReset: function () {
                        // �޼���
                        if (_module.devtool != null) console.log("onReset");

                        // ����
                        _module.core.castStop();

                        // �ʱ�ȭ
                        _module.core.reset();
                        if (_module.caption != null) { _module.caption.reset(); }
                        if (_compo.fullscreen != null) _compo.fullscreen.reset();

                        // ���̾ƿ�
                        this.updateLayout(0);
                },





                ///// event

                // onEnded
                onEnded: function () {
                        // �޼���
                        if (_module.devtool != null) console.log("onEnded");

                        // Stop
                        _module.core.castStop();
                        if ($(_tracker.conLabel) != null) { $(_tracker.conLabel).scrollTop(0); }
                        if (_compo.timebar != null) { _compo.timebar.updateBarTime(0); }
                },

                // onButtonClick
                onButtonClick: function (tag, btn, par) {
                        // �޼���
                        if (_module.devtool != null) {
                                if (par == null) { console.log("onButtonClick : " + tag); }
                                else { console.log("onButtonClick" + tag + ", " + par); }
                        }

                        switch (tag) {
                                case "btnShow":
                                        resetAllMediaPlayer();
                                        this.updateLayout(1);
                                        break;
                                case "btnScript":
                                        _module.caption.toggleScript();
                                        break;
                                case "btnTranslation":
                                        _module.caption.toggleTranslation();
                                        break;
                        }
                },





                ///// tool

                // ����
                traceModule: function () {
                        // ���� �����
                        var str = "\n ********************* \n";
                        str += " * trace MediaPlayer * \n\n";
                        str += "\ttarget : " + _type + "(" + _file + ")\n";
                        str += "\tb_option_script : " + b_option_script + "\n";
                        str += "\ti_option_roleplay : " + i_option_roleplay + "\n";
                        str += "\ti_state_layout : " + i_state_layout + "\n";
                        str += "\n ********************* ";

                        // ���
                        console.log(str);
                },





                ///// method

                // ���̾ƿ� ����
                updateLayout: function (type) {
                        // �޼���
                        if (_module.devtool != null) console.log("updateLayout : " + type);

                        // ó��
                        switch (type) {
                                case 0: // �Ⱥ���
                                        _module.core.castStop();
                                        $(_tracker.videoFullbg).css("display", "none");
                                        if (_module.caption != null) { _module.caption.reset(); }
                                        break;
                                case 1: // Ȱ��ȭ ����
                                        $(_tracker.videoFullbg).css("display", "inline-block");
                                        if (_compo.repeat != null) { _compo.repeat.updateRepeat(); }
                                        if (_module.caption != null) {
                                                _module.caption.updateButtonCaption(false);
                                                _module.caption.updateIconMarkerRoleplay();
                                        }
                                        _module.core.castStop();
                                        _module.core.castPlay();
                                        break;
                        }

                        // ����
                        i_state_layout = type;
                },
        }
}