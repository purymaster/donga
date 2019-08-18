/*
    file name : DTCaliperSensor.js
    description : Digital Textbook 2017 CaliperSensor object
	create date : 2017-06-22
	creator : saltgamer
*/

'use strict';

var DTCaliperSensor = DTCaliperSensor || {};
DTCaliperSensor = (function () {

	var DTCaliper = {
		caliperSensorStoreUrl: 'https://www.keris.or.kr/sensor',
		sendCaliperEvent: function (params) {
			var resultJSON = {
				'sensor': this.caliperSensorStoreUrl,
				'sendTime': this.toDateTimeString(new Date()),
				'data': {
					'@context': 'http://purl.imsglobal.org/ctx/caliper/v1p1',
					'@type': 'http://purl.imsglobal.org/caliper/v1/AssessmentEvent',
					'actor': {
						'@id': 'https://www.keris.or.kr/user',
						'@type': 'http://purl.imsglobal.org/caliper/v1/lis/Person'
					},
					'action': params.action,
					'responseType': params.responseType,
					'url': document.location.href,
					'eventTime': this.toDateTimeString(new Date()),
					'session': {
						'@id': 'https://www.keris.or.kr/session/' + this.generateUID(),
						'@type': 'Session',
						'startedAtTime': '2017-11-15T10:00:00.000Z'
					},
					'id': 'urn:uuid:' + params.id	
				}
			};

			if (params.action === 'complete') {
				resultJSON.data.generated = {
					'@id': params.id + this.generateUID(),
					'@type': params.responseType,
					'attempt': 'https://example.edu/terms/201601/courses/7/sections/1/assess/1/items/3/users/554433/attempts/1',
					'dateCreated': this.toDateTimeString(new Date()),
					'startedAtTime': this.toDateTimeString(new Date()),
					'endedAtTime': this.toDateTimeString(new Date()),
					'score':params.score,
					'values':params.value
				}
			}

			console.log('--> resultJSON : ', resultJSON);
			// ==== [Native API] =============================================================================
			console.log('%c ▶▷ [Native API] storeCaliperSensorData ', 'color:#ff6600');

			var jsonData = {
				apiName : 'storeCaliperSensorData',
				parameters : {
					caliperSensorData: resultJSON
				},
				callBack : 'storeCaliperSensorDataCallBack'
			};

			window[jsonData.callBack] = function (response) {

				//********************************************
				// URL Decoding
				response = decodeURIComponent(response);
				response =  JSON.parse(response);
				//********************************************

				delete window[jsonData.callBack];
			};

			this.sendMessageToNative(jsonData.apiName, JSON.stringify(jsonData));
           	// ==== [Native API] =============================================================================

		},

		fire: function (params) {
			console.log('--> fire : ', params);
			
			var itemObj = params.itemObject,
				action, score;
			switch (params.correct) {
				case null:
					action = 'passed';
					break;
				case true:
					action = 'complete';
					score = 1;
					break;
				case false:
					action = 'complete';
					score = 0;
					break;
			}

			this.sendCaliperEvent({
				correct: params.correct,
				itemObject: params.itemObject,
				id: itemObj.getAttribute('data-qid'),
				action: action,
				score: score,
				value: params.value,
				responseType: itemObj.getAttribute('data-response-type')
			});

		},
		toDateString: function (oDate) {
			var y = oDate.getFullYear(),
				m = oDate.getMonth() + 1,
				d = oDate.getDate();
			return y + "-" + (m < 10 ? "0" : "") + m + "-" + (d < 10 ? "0" : "") + d;
		},
		toDateTimeString: function (oDate) {
			oDate = oDate instanceof Date ? oDate : this.parseDate(oDate);
			var h = oDate.getHours(),
			 	m = oDate.getMinutes(),
				s = oDate.getSeconds();
			return this.toDateString(oDate) + " " + (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;;
		},
		parseDate:function(dtstr) {
		    var dt = dtstr.split(/[: T-]/).map(parseFloat);
			return new Date(dt[0], dt[1] - 1, dt[2], dt[3] || 0, dt[4] || 0, dt[5] || 0, 0);
		},
		generateUID: function () {
            var d = new Date().getTime();
            if(window.performance && typeof window.performance.now === "function"){
                d += performance.now();; //use high-precision timer if available
            }
            var uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uid;
        },
        sendMessageToNative : function (API_NAME, jsonData) {
			console.log('☆ sendMessageToNative...');

			//***************************************
			// URL Encoding 
			jsonData = encodeURIComponent(jsonData);
			//***************************************

			var API_URL = 'studyProtocol://' + API_NAME + '?data=' + jsonData;
			console.log('%c ▷ API_URL Native ===> ', 'color:#ff6600', API_URL);
			console.log('studyProtocol://' + API_NAME + '?data=' + decodeURIComponent(jsonData));

			window.location.assign(API_URL);
		}


	};

	return DTCaliper;


})();



/* complete
{
    "@context": "http://purl.imsglobal.org/ctx/caliper/v1p1",
    "type": "AssessmentItemEvent",
    "actor": {
        "id": "https://example.edu/users/554433",
        "type": "Person"
    },
    "action": "Completed",
    "responseType": "choice",
    "url": "http://127.0.0.1:9373/data/bisang/eng_m10_01/OEBPS/lesson1_10.xhtml",
    "eventTime": "2017-06-22 17:29:29",
    "session": {
        "id": "https://example.edu/sessions/1f6442a482de72ea6ad134943812bff564a76259",
        "type": "Session",
        "startedAtTime": "2017-11-15T10:00:00.000Z"
    },
    "id": "urn:uuid:32c19dca-3bed-11e7-a3c6-cafe21165e46",
    "generated": {
        "id": "https://example.edu/terms/201601/courses/7/sections/1/assess/1/items/3/users/554433/responses/1",
        "attempt": "https://example.edu/terms/201601/courses/7/sections/1/assess/1/items/3/users/554433/attempts/1",
        "dateCreated": "2017-06-22 17:29:29",
        "startedAtTime": "2017-06-22 17:29:29",
        "endedAtTime": "2017-06-22 17:29:29",
        "score": 1,
        "values": "a"
    }
}
*/

/* passed
{
    "@context": "http://purl.imsglobal.org/ctx/caliper/v1p1",
    "type": "AssessmentItemEvent",
    "actor": {
        "id": "https://example.edu/users/554433",
        "type": "Person"
    },
    "action": "Passed",
    "responseType": "choice",
    "url": "http://127.0.0.1:9373/data/bisang/eng_m10_01/OEBPS/lesson1_10.xhtml",
    "eventTime": "2017-06-22 17:30:21",
    "session": {
        "id": "https://example.edu/sessions/1f6442a482de72ea6ad134943812bff564a76259",
        "type": "Session",
        "startedAtTime": "2017-11-15T10:00:00.000Z"
    },
    "id": "urn:uuid:32c19dca-3bed-11e7-a3c6-cafe21165e46"
}
*/
