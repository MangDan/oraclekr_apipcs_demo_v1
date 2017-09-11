/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery'],
        function (oj, ko, $) {

            function DashboardViewModel() {
                var self = this;
                // Below are a subset of the ViewModel methods invoked by the ojModule binding
                // Please reference the ojModule jsDoc for additionaly available methods.

                /**
                 * Optional ViewModel method invoked when this ViewModel is about to be
                 * used for the View transition.  The application can put data fetch logic
                 * here that can return a Promise which will delay the handleAttached function
                 * call below until the Promise is resolved.
                 * @param {Object} info - An object with the following key-value pairs:
                 * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
                 * @param {Function} info.valueAccessor - The binding's value accessor.
                 * @return {Promise|undefined} - If the callback returns a Promise, the next phase (attaching DOM) will be delayed until
                 * the promise is resolved
                 */
                self.handleActivated = function (info) {
                    // Implement if needed
                };

                /**
                 * Optional ViewModel method invoked after the View is inserted into the
                 * document DOM.  The application can put logic that requires the DOM being
                 * attached here.
                 * @param {Object} info - An object with the following key-value pairs:
                 * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
                 * @param {Function} info.valueAccessor - The binding's value accessor.
                 * @param {boolean} info.fromCache - A boolean indicating whether the module was retrieved from cache.
                 */
                self.handleAttached = function (info) {
                    // Implement if needed
                };


                /**
                 * Optional ViewModel method invoked after the bindings are applied on this View.
                 * If the current View is retrieved from cache, the bindings will not be re-applied
                 * and this callback will not be invoked.
                 * @param {Object} info - An object with the following key-value pairs:
                 * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
                 * @param {Function} info.valueAccessor - The binding's value accessor.
                 */
                self.handleBindingsApplied = function (info) {
                    // Implement if needed
                };

                /*
                 * Optional ViewModel method invoked after the View is removed from the
                 * document DOM.
                 * @param {Object} info - An object with the following key-value pairs:
                 * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
                 * @param {Function} info.valueAccessor - The binding's value accessor.
                 * @param {Array} info.cachedNodes - An Array containing cached nodes for the View if the cache is enabled.
                 */
                self.handleDetached = function (info) {
                    // Implement if needed
                };

                $(document).ready(function() {
                    self.updateLineChart();
                    self.updateBarChart();
                    self.updatePieChart();
                    self.updateBarHorizontalChart();
                });
                // Cutom Code...
                var lineRefreshTimerVar;
                var barRefreshTimerVar;
                var pieRefreshTimerVar;
                var barHoRefreshTimerVar;
                var busAPIResponseTimeThresholdTimeVar;

                //#FAD55C - 노랑
                //#267DB3 - 파랑
                //#68C182 - 녹색

                //#ED6647 - 빨강
                //#8561C8 - 보라

                self.seoulBusAPIBaseUrl = ko.observable("http://sunnywsa.kr.oracle.com:8001/SeoulBus/1/getBusRouteList?strSrch=");
                self.apiPlatformBaseUrl = ko.observable("http://sunnywsa.kr.oracle.com:8001");
                self.seoulBusAPIParam1 = ko.observable(1660);
                self.seoulBusAPIResponseState = ko.observable();
                self.seoulBusAPIResponseColor = ko.observable("green");
                self.return_cnt = ko.observable("-");
                self.response_time = ko.observable("-");
                self.busAPIBtnDisable = ko.observable(false);
                self.refresh_icon_1_display = ko.observable("none");
                self.callLimitUnitOfTime = ko.observableArray(["Minute"]);
                self.callLimitCnt_1 = ko.observable("5");
                self.blackListIp = ko.observable("10.179.88.202");
                self.unitOfTime = ko.observable("Minute");
                self.thresholdValue = ko.observable("5");
                self.delayInterval = ko.observable("10");
                self.btnSetting1Disable = ko.observable(false);
                self.btnSetting2Disable = ko.observable(false);
                self.btnSetting3Disable = ko.observable(false);
                self.refresh_icon_setting1_display = ko.observable("none");
                self.refresh_icon_setting2_display = ko.observable("none");
                self.refresh_icon_setting3_display = ko.observable("none");
                self.setting1_state = ko.observable();
                self.setting2_state = ko.observable();
                self.setting3_state = ko.observable();
                self.lineRefreshChecked = ko.observableArray(["lineRefreshBtn"]);
                self.lineRefreshTime = ko.observable(30);
                self.lineRefreshTimer = ko.computed(function() {
                    if(self.lineRefreshChecked().length > 0) {
                        lineRefreshTimerVar = setInterval(function() {
                            var sec = self.lineRefreshTime();
                            if (sec === 0) {
                                self.lineRefreshTime(30);
                                //self.updateLineChart();
                            } else {
                                self.lineRefreshTime(--sec);
                            }
                        }, 1000);
                    } else {
                        clearInterval(lineRefreshTimerVar);
                    }
                }, self);

                self.lineRefreshTime.subscribe(
                    function(newValue) {
                       if(newValue === 0)
                           self.updateLineChart();
                    }
                );

                self.barRefreshChecked = ko.observableArray(["barRefreshBtn"]);
                self.barRefreshTime = ko.observable(15);
                self.barRefreshTimer = ko.computed(function() {
                    if(self.barRefreshChecked().length > 0) {
                        barRefreshTimerVar = setInterval(function() {
                            var sec = self.barRefreshTime();
                            if (sec === 0) {
                                self.barRefreshTime(15);
                                //self.updateLineChart();
                            } else {
                                self.barRefreshTime(--sec);
                            }
                        }, 1000);
                    } else {
                        clearInterval(barRefreshTimerVar);
                    }
                }, self);

                self.barRefreshTime.subscribe(
                    function(newValue) {
                       if(newValue === 0)
                           self.updateBarChart();
                    }
                );

                self.pieRefreshChecked = ko.observableArray(["pieRefreshBtn"]);
                self.pieRefreshTime = ko.observable(15);
                self.pieRefreshTimer = ko.computed(function() {
                    if(self.pieRefreshChecked().length > 0) {
                        pieRefreshTimerVar = setInterval(function() {
                            var sec = self.pieRefreshTime();
                            if (sec === 0) {
                                self.pieRefreshTime(15);
                                //self.updateLineChart();
                            } else {
                                self.pieRefreshTime(--sec);
                            }
                        }, 1000);
                    } else {
                        clearInterval(pieRefreshTimerVar);
                    }
                }, self);

                self.pieRefreshTime.subscribe(
                    function(newValue) {
                       if(newValue === 0)
                           self.updatePieChart();
                    }
                );
                
                self.barHoRefreshChecked = ko.observableArray([]);
                self.barHoRefreshTime = ko.observable(15);
                self.barHoRefreshTimer = ko.computed(function() {
                    if(self.barHoRefreshChecked().length > 0) {
                        barHoRefreshTimerVar = setInterval(function() {
                            var sec = self.barHoRefreshTime();
                            if (sec === 0) {
                                self.barHoRefreshTime(15);
                                //self.updateLineChart();
                            } else {
                                self.barHoRefreshTime(--sec);
                            }
                        }, 1000);
                    } else {
                        clearInterval(barHoRefreshTimerVar);
                    }
                }, self);

                self.barHoRefreshTime.subscribe(
                    function(newValue) {
                       if(newValue === 0)
                           self.updateBarHorizontalChart();
                    }
                );
        
                self.busResponseArrayData = ko.observableArray([]);
                self.dataSource = new oj.ArrayTableDataSource(self.busResponseArrayData, {idAttribute: "name"});

                self.clickCallSeoulBusAPI = function (data, event) {
                    // 버스 API 호출
                    console.log(self.seoulBusAPIBaseUrl());
                    console.log(self.seoulBusAPIParam1());

                    if(self.seoulBusAPIParam1() === "" || self.seoulBusAPIParam1() === undefined) {
                        self.seoulBusAPIResponseColor("red");
                        self.seoulBusAPIResponseState("버스 번호를 입력하여 주십시요.");
                        return;
                    }

                    var startTime = (new Date()).getTime(),endTime;
                    $.ajax({
                        type: "GET",
                        contentType: "text/plain",
                        url: self.seoulBusAPIBaseUrl() + self.seoulBusAPIParam1(),
                        success: function(data) {
                            //console.log(data);
                            //console.log($(data).find('headerMsg').text());

                            endTime = (new Date()).getTime();

                            self.busResponseArrayData().length = 0;
                            //self.dataSource.reset([])
                            
                            $(data).find('itemList').each(function() {
                                self.busResponseArrayData().push({
                                    "name" : $(this).find('busRouteNm').text(),
                                    "start_station" : $(this).find('stStationNm').text(),
                                    "end_station" : $(this).find('edStationNm').text(),
                                    "start_time" : $(this).find('firstBusTm').text().substring(0,4)+"-"+$(this).find('firstBusTm').text().substring(4,6)+"-"+$(this).find('firstBusTm').text().substring(6,8)+" "+$(this).find('firstBusTm').text().substring(8,10)+":"+$(this).find('firstBusTm').text().substring(10,12),
                                    "end_time" : $(this).find('lastBusTm').text().substring(0,4)+"-"+$(this).find('lastBusTm').text().substring(4,6)+"-"+$(this).find('lastBusTm').text().substring(6,8)+" "+$(this).find('lastBusTm').text().substring(8,10)+":"+$(this).find('lastBusTm').text().substring(10,12)
                                });
                            });

                            self.dataSource.reset(self.busResponseArrayData, {idAttribute: "name"});

                            self.busAPIBtnDisable(true);
                            self.return_cnt(self.dataSource.totalSize());
                            self.response_time(endTime - startTime);

                            self.seoulBusAPIResponseColor("green");
                            self.seoulBusAPIResponseState($(data).find('headerMsg').text());
                        },
                        beforeSend: function() {
                            self.busAPIBtnDisable(true);
                            self.refresh_icon_1_display('');
                            self.seoulBusAPIResponseState('');

                            busAPIResponseTimeThresholdTimeVar = setInterval(function() {
                                self.seoulBusAPIResponseColor("red");
                                self.seoulBusAPIResponseState('응답시간이 5초이상 지연되고 있습니다.');
                            }, 5000);

                        },
                        complete: function() {
                            clearInterval(busAPIResponseTimeThresholdTimeVar);

                            self.busAPIBtnDisable(false);
                            self.refresh_icon_1_display('none');
                        },
                        error: function(xhr, status, errorMsg) {
                            self.busResponseArrayData().length = 0;
                            self.dataSource.reset(self.busResponseArrayData, {idAttribute: "name"});

                            self.refresh_icon_1_display('');
                            self.seoulBusAPIResponseState('');
                            self.seoulBusAPIResponseColor("red");

                            if(xhr.responseText == undefined) {
                                self.seoulBusAPIResponseState("호출 오류가 발생하였습니다.");
                            } else if(xhr.responseText.startsWith('API Rate Limit')) {
                                self.seoulBusAPIResponseState("API 사용 제한을 초과하여 사용이 제한되고 있습니다.");
                            } else if(xhr.responseText.startsWith('IP filter')) {
                                self.seoulBusAPIResponseState("귀하의 IP Address는 사용이 제한되고 있습니다.");
                            } else {
                                console.log(errorMsg);
                            }

                            endTime = (new Date()).getTime();
                            self.response_time(endTime - startTime);
                        }
                    });

                    return true;
                }

                // Settings
                self.getAPIPlatformSettingJson = function(type) {
                    //type1: o:apiRateLimiting
                    //type2: o:IPFilterValidation
                    //type3: o:ApiThrottlingDelay

                    var apiPlatformSettingJson = $.getJSON({'url': "apiPlatformSettingJson.json", 'async': false});
                    var apiPlatformSettingJsonObj = JSON.parse(apiPlatformSettingJson.responseText);

                    if(type === 'o:apiRateLimiting') {
                        $.grep(apiPlatformSettingJsonObj.implementation.policies, function(node, index) {
                            if (node.type === 'o:apiRateLimiting') {
                                node.draft = false;

                                node.config.conditions[0].rateLimit = self.callLimitCnt_1();
                                node.config.conditions[0].interval = self.callLimitUnitOfTime()[0];

                                //console.log(self.callLimitUnitOfTime());

                                apiPlatformSettingJsonObj.implementation.policies[index] = node;
                            } else if (node.type === 'o:IPFilterValidation'){
                                node.draft = true;
                                apiPlatformSettingJsonObj.implementation.policies[index] = node;
                            } else if (node.type === 'o:ApiThrottlingDelay'){
                                node.draft = true;
                                apiPlatformSettingJsonObj.implementation.policies[index] = node;
                            }
                        });
                    } else if (type === 'o:IPFilterValidation') {
                        $.grep(apiPlatformSettingJsonObj.implementation.policies, function(node, index) {
                            if (node.type === 'o:IPFilterValidation') {
                                node.draft = false;
                                node.config.conditions[0].ipAddressValue = self.blackListIp();
                                node.config.conditions[0].operator = "=";
                                node.config.conditions[0].ipAddressType = "IPv4"

                                apiPlatformSettingJsonObj.implementation.policies[index] = node;
                            } else if (node.type === 'o:apiRateLimiting'){
                                node.draft = true;
                                apiPlatformSettingJsonObj.implementation.policies[index] = node;
                            } else if (node.type === 'o:ApiThrottlingDelay'){
                                node.draft = true;
                                apiPlatformSettingJsonObj.implementation.policies[index] = node;
                            }
                        });
                    } else if (type === 'o:ApiThrottlingDelay') {
                        console.log()
                        $.grep(apiPlatformSettingJsonObj.implementation.policies, function(node, index) {
                            if (node.type === 'o:ApiThrottlingDelay') {
                                node.draft = false;
                                node.config.conditions[0].unitOfInterval = "Second";
                                node.config.conditions[0].unitOfTime = self.unitOfTime();
                                node.config.conditions[0].thresholdValue = self.thresholdValue();
                                node.config.conditions[0].operator = ">";
                                node.config.conditions[0].delayInterval = self.delayInterval();

                                apiPlatformSettingJsonObj.implementation.policies[index] = node;
                            } else if (node.type === 'o:apiRateLimiting'){
                                node.draft = true;
                                apiPlatformSettingJsonObj.implementation.policies[index] = node;
                            } else if (node.type === 'o:IPFilterValidation'){
                                node.draft = true;
                                apiPlatformSettingJsonObj.implementation.policies[index] = node;
                            }
                        });
                    }

                    return apiPlatformSettingJsonObj;
                };


                self.clickSetting_1 = function (data, event) {
                    var data = self.getAPIPlatformSettingJson('o:apiRateLimiting');

                    //console.log(data);
                    $.ajax({
                        url: self.apiPlatformBaseUrl() + "/management/apis/100",
                        type: "PUT",
                        contentType: "application/json",
                        //url: url,
                        data: JSON.stringify(data),
                        success: function(data) {
                            console.log(data);
                            self.setting1_state("성공");
                        },
                        beforeSend: function() {
                            self.btnSetting1Disable(true);
                            self.refresh_icon_setting1_display('');
                            self.setting1_state("");
                        },
                        complete: function() {
                            self.apiDeploy();
                            self.btnSetting1Disable(false);
                            self.refresh_icon_setting1_display('none');
                        },
                        error: function(xhr, status, errorMsg) {
                            self.btnSetting1Disable(false);
                            self.refresh_icon_setting1_display('none');
                            self.setting1_state("실패");
                        }
                    });

                    return true;
                };

                self.clickSetting_2 = function (data, event) {
                    var data = self.getAPIPlatformSettingJson('o:IPFilterValidation');

                    //console.log(data);
                    $.ajax({
                        url: self.apiPlatformBaseUrl() + "/management/apis/100",
                        type: "PUT",
                        contentType: "application/json",
                        //url: url,
                        data: JSON.stringify(data),
                        success: function(data) {
                            console.log(data);
                            self.setting2_state("성공");
                        },
                        beforeSend: function() {
                            self.btnSetting2Disable(true);
                            self.refresh_icon_setting2_display('');
                            self.setting2_state("");
                        },
                        complete: function() {
                            self.apiDeploy();
                            self.btnSetting2Disable(false);
                            self.refresh_icon_setting2_display('none');
                        },
                        error: function(xhr, status, errorMsg) {
                            self.btnSetting2Disable(false);
                            self.refresh_icon_setting2_display('none');
                            self.setting2_state("실패");
                        }
                    });

                    return true;
                };

                self.clickSetting_3 = function (data, event) {
                    var data = self.getAPIPlatformSettingJson('o:ApiThrottlingDelay');

                    //console.log(data);
                    $.ajax({
                        url: self.apiPlatformBaseUrl() + "/management/apis/100",
                        type: "PUT",
                        contentType: "application/json",
                        //url: url,
                        data: JSON.stringify(data),
                        success: function(data) {
                            console.log(data);
                            self.setting3_state("성공");
                        },
                        beforeSend: function() {
                            self.btnSetting3Disable(true);
                            self.refresh_icon_setting3_display('');
                            self.setting3_state("");
                        },
                        complete: function() {
                            self.apiDeploy();
                            self.btnSetting3Disable(false);
                            self.refresh_icon_setting3_display('none');
                        },
                        error: function(xhr, status, errorMsg) {
                            self.btnSetting3Disable(false);
                            self.refresh_icon_setting3_display('none');
                            self.setting3_state("실패");
                        }
                    });

                    return true;
                };

                self.apiDeploy = function() {
                    $.ajax({
                        url: self.apiPlatformBaseUrl() + "/management/apis/100/deployments",
                        type: "POST",
                        contentType: "application/json",
                        async: false,
                        //url: url,
                        data: JSON.stringify({"gatewayId":"100","action":"DEPLOY","description":"","runtimeState":"ACTIVE"}),
                        success: function(data) {
                            console.log(data);
                        },
                        beforeSend: function() {
                            self.btnSetting3Disable(true);
                            self.refresh_icon_setting3_display('');
                        },
                        complete: function() {
                            self.btnSetting3Disable(false);
                            self.refresh_icon_setting3_display('none');
                        },
                        error: function(xhr, status, errorMsg) {
                            self.btnSetting3Disable(false);
                            self.refresh_icon_setting3_display('none');
                        }
                    });

                    return true;
                };

                // Line Chart..
                self.lineChartGroups = [];
                self.lineChartSeries = [{name: "전체 평균 시간", items:[], lineType: "none"},{name: "버스 평균 시간", items:[], lineType: "none"}];

                self.lineChartSeriesValue = ko.observableArray(self.lineChartSeries);
                self.lineChartGroupsValue = ko.observableArray(self.lineChartGroups.reverse());
                self.lineChartOrientationValue = ko.observable('vertical');

                self.updateLineButtonClick = function(data, event) {
                    for (var s = 0; s < series.length; s++) {
                        for (var g = 0; g < series[s].items.length; g++) {
                            if (Math.random() < 0.3)
                                series[s].items[g] = getValue();
                        }
                    }
                    self.lineChartSeriesValue(series);
                    return true;
                };

                self.return2Digit = function(val) {
                    return (val < 10 ? "0"+val : val);
                };

                self.lineChartGetValue = function(interval) {
                    var curDate = new Date();

                    var timeEnd = curDate.getFullYear()+"-"+self.return2Digit(curDate.getMonth()+1) + "-"+self.return2Digit(curDate.getDate())+"T"+self.return2Digit(curDate.getHours())+":"+self.return2Digit(curDate.getMinutes())+":00";

                    curDate.setMinutes(curDate.getMinutes()-(interval-1));
                    var timeStart = curDate.getFullYear()+"-"+self.return2Digit(curDate.getMonth()+1) + "-"+self.return2Digit(curDate.getDate())+"T"+self.return2Digit(curDate.getHours())+":"+self.return2Digit(curDate.getMinutes())+":00";

                    //console.log("timeStart~timeEnd : " + timeStart + "~" + timeEnd);

                    var allApiUrl = self.apiPlatformBaseUrl() + "/analytics/timeSeries/responseTimes/services?gatewayIds=100&apiIds=100,101,102&timeSetting=custom&timeStart="+timeStart+"&timeEnd="+timeEnd+"&timeOffsetId=%2B09:00";
                    var busApiUrl = self.apiPlatformBaseUrl() + "/analytics/timeSeries/responseTimes/services?gatewayIds=100&apiIds=100&timeSetting=custom&timeStart="+timeStart+"&timeEnd="+timeEnd+"&timeOffsetId=%2B09:00";

                    //초기화
                    self.lineChartGroups.length = 0;
                    self.lineChartSeries[0].items.length = 0;
                    self.lineChartSeries[1].items.length = 0;

                    var toDateTimeStart = new Date(timeStart);
                    for(var i=0; i<interval; i++) {
                        self.lineChartGroups.push(self.return2Digit(toDateTimeStart.getHours()) + ":" + self.return2Digit(toDateTimeStart.getMinutes()));
                        toDateTimeStart.setMinutes(toDateTimeStart.getMinutes()+1);
                    }

                    // 10개씩 단위로 시간 세팅
                    //if(self.lineChartGroups.length > 9)
                    //    self.lineChartGroups.shift();

                    //self.lineChartGroups.push(timeEnd.substring(11).replace(":00", ""));

                    $.ajax({
                        url: allApiUrl,
                        type: "GET",
                        contentType: "application/json",
                        async: false,
                        success: function(data) {
                            //console.log(data);
                            //if(self.lineChartSeries[0].items.length > 9)
                            //    self.lineChartSeries[0].items.shift();
                            var start_ts;
                            var measure = 0;
                            self.lineChartGroups.find(function(group) {
                                data.items.find(function(item) {
                                    start_ts = item.start_ts.replace(":00+09:00","").substring(11);
                                    //console.log(start_ts + "=" + group);
                                    if(start_ts === group) {
                                        //console.log("push");
                                        measure = item.measure;
                                        self.lineChartSeries[0].items.push(measure);
                                    }
                                });

                                if(data.items.length === 0 || measure === 0)
                                    self.lineChartSeries[0].items.push(0);

                                measure = 0;
                            });
                        },
                        beforeSend: function() {
                        },
                        complete: function() {
                        },
                        error: function(xhr, status, errorMsg) {
                        }
                    });

                    $.ajax({
                        url: busApiUrl,
                        type: "GET",
                        contentType: "application/json",
                        async: false,
                        success: function(data) {
                            //console.log(data);
                            //if(self.lineChartSeries[0].items.length > 9)
                            //    self.lineChartSeries[0].items.shift();
                            var start_ts;
                            var measure = 0;
                            self.lineChartGroups.find(function(group) {
                                data.items.find(function(item) {
                                    start_ts = item.start_ts.replace(":00+09:00","").substring(11);
                                    //console.log(start_ts + "=" + group);
                                    if(start_ts === group) {
                                        //console.log("push");
                                        measure = item.measure;
                                        self.lineChartSeries[1].items.push(measure);
                                    }
                                });

                                if(data.items.length === 0 || measure === 0)
                                    self.lineChartSeries[1].items.push(0);

                                measure = 0;
                            });
                        },
                        beforeSend: function() {
                        },
                        complete: function() {
                        },
                        error: function(xhr, status, errorMsg) {
                        }
                    });
                };

                self.updateLineChart = function(data, event) {
                    self.lineChartGetValue(20);  // 10분 간격의 데이터를 가져온다

                    self.lineChartSeriesValue(self.lineChartSeries);
                    self.lineChartGroupsValue(self.lineChartGroups);
                    return true;
                };

                // Bar Chart
                //var barGroups = [];
                self.barSeries = [
                                    {name: "", items: []}
                                 ];
                self.barGroups = [];

                //for (var i=1; i <= 3; i++) {
                //    barGroups.push((curDate.getMonth()+1 < 10 ? "0"+(curDate.getMonth()+1) : curDate.getMonth()+1) + "-" + (curDate.getDate() < 10 ? "0"+curDate.getDate() : curDate.getDate()));
                //    curDate.setDate(curDate.getDate()-1);
                //}

                self.barSeriesValue = ko.observableArray(self.barSeries);
                self.barGroupsValue = ko.observableArray(self.barGroups.reverse());

                self.barChartGetValue = function() {
                    var curDate = new Date();

                    var apiUrl = self.apiPlatformBaseUrl() + "/analytics/timeSeries/requests/all?apiIds=100&timeSetting=last15minutes&timeUnit=MINUTE&timeGroupSize=1&timeOffsetId=%2B09:00";

                    self.barGroups.length = 0;
                    self.barSeries[0].items.length = 0;

                    $.ajax({
                        url: apiUrl,
                        type: "GET",
                        contentType: "application/json",
                        async: false,
                        success: function(data) {
                            //console.log(data);
                            if(data.items.length > 0) {
                                for(var i=0; i<data.items.length; i++) {
                                    self.barGroups.push(data.items[i].start_ts.replace("+09:00", "").substring(11).replace(":00", ""));
                                    self.barSeries[0].items.push(data.items[i].measure);
                                }
                            } else {
                                for (var i=0; i < 5; i++) {
                                    self.barGroups.push((curDate.getHours() < 10 ? "0"+curDate.getHours() : curDate.getHours()) + "-" + (curDate.getMinutes() < 10 ? "0"+curDate.getMinutes() : curDate.getMinutes()));
                                    curDate.setMinutes(curDate.getMinutes()-1);

                                    self.barSeries[0].items.push(0);
                                }
                            }
                        },
                        beforeSend: function() {
                        },
                        complete: function() {
                        },
                        error: function(xhr, status, errorMsg) {
                        }
                    });


                };

                self.updateBarChart = function(data, event) {
                    self.barChartGetValue();
                    self.barGroupsValue(self.barGroups);
                    self.barSeriesValue(self.barSeries);
                    return true;
                };

                // Pie Chart

                // BUS API Analytics
                //self.busapi_call_state_data_1 = [
                //    {name: "써니", items: [10], pieSliceExplode: 0},
                //    {name: "삼성전자", items: [self.getPieChartValue()], pieSliceExplode: 0},
                //    {name: "LG전자", items: [self.getPieChartValue()], pieSliceExplode: 0},
                //    {name: "GM대우", items: [self.getPieChartValue()], pieSliceExplode: 0}
                //];

                self.pieSeries = [];
                self.pieSeriesValue = ko.observableArray(self.pieSeries);

                self.getPieChartValue = function(interval) {
                    //return 10 + Math.round(Math.random()*50);
                    var curDate = new Date();

                    var timeStart = curDate.getFullYear()+"-"+self.return2Digit(curDate.getMonth()+1) + "-"+self.return2Digit(curDate.getDate())+"T00:00:00";
                    curDate.setDate(curDate.getDate()+interval);
                    var timeEnd = curDate.getFullYear()+"-"+self.return2Digit(curDate.getMonth()+1) + "-"+self.return2Digit(curDate.getDate())+"T00:00:00";

                    var apiUrl = self.apiPlatformBaseUrl() + "/analytics/totals/requests?gatewayIds=100&apiIds=100&timeSetting=custom&timeStart="+timeStart+"&timeEnd="+timeEnd+"&timeOffsetId=%2B09:00";

                    self.pieSeries.length = 0;

                    $.ajax({
                        url: apiUrl,
                        type: "GET",
                        contentType: "application/json",
                        async: false,
                        success: function(data) {
                            //console.log(data);
                            if(data.items.length > 0) {
                                self.pieSeries.push({name: "써니 Corp", items: [data.items[0].measure], pieSliceExplode: 0, color: "#FAD55C"});
                                self.pieSeries.push({name: "A사", items: [20], pieSliceExplode: 0, color: "#267DB3"});
                                self.pieSeries.push({name: "B사", items: [25], pieSliceExplode: 0, color: "#68C182"});
                                self.pieSeries.push({name: "C사", items: [30], pieSliceExplode: 0, color: "#ED6647"});
                            } else {
                                self.pieSeries.push({name: "써니", items: [0], pieSliceExplode: 0, color: "#FAD55C"});
                                self.pieSeries.push({name: "삼성전자", items: [20], pieSliceExplode: 0, color: "#267DB3"});
                                self.pieSeries.push({name: "LG전자", items: [25], pieSliceExplode: 0, color: "#68C182"});
                                self.pieSeries.push({name: "GM대우", items: [30], pieSliceExplode: 0, color: "#ED6647"});
                            }
                        },
                        beforeSend: function() {
                        },
                        complete: function() {
                        },
                        error: function(xhr, status, errorMsg) {
                        }
                    });
                };

                // Pie Chart Update...
                self.updatePieChart = function(data, event) {
                    self.getPieChartValue(1); // 1day
                    //console.log(self.pieSeries);
                    self.pieSeriesValue(self.pieSeries);
                    return true;
                };

                // Bar-Horizontal Chart
                /* chart data */
                self.barHorizontalSeries = [{name: "", items: []}];
                self.barHorizontalGroups = [];
                
                self.barHorizontalSeriesValue = ko.observableArray(self.barHorizontalSeries);
                self.barHorizontalGroupsValue = ko.observableArray(self.barHorizontalGroups);

                self.getBarHorizontalChartValue = function() {
                    //return 10 + Math.round(Math.random()*50);
                    var apiUrl = self.apiPlatformBaseUrl() + "/analytics/categorical/policies/types/rejections/all?gatewayIds=100&apiIds=100&timeSetting=last24hours&timeOffsetId=%2B09:00"
                    var policy_type = "";
                    
                    self.barHorizontalSeries[0].items.length = 0;
                    self.barHorizontalGroups.length = 0;
                    
                    $.ajax({
                        url: apiUrl,
                        type: "GET",
                        contentType: "application/json",
                        async: false,
                        success: function(data) {
                            for(var i in data.items) {
                                //API 호출 제한 : o:apiRateLimiting
                                //블랙 리스트 제한 : o:IPFilterValidation
                                //API 호출 속도 제어 : o:ApiThrottlingDelay
                                if(data.items[i].policy_type === "o:apiRateLimiting")
                                    policy_type = "API 호출 제한";
                                else if(data.items[i].policy_type === "o:IPFilterValidation")
                                    policy_type = "블랙 리스트 제한";
                                else if(data.items[i].policy_type === "o:ApiThrottlingDelay")
                                    policy_type = "API 호출 속도 제어";
                                else policy_type = data.items[i].policy_type;
                                
                                self.barHorizontalSeries[0].items.push({y:data.items[i].measure, color: "#ED6647"});
                                self.barHorizontalGroups.push(policy_type);
                            }
                        },
                        beforeSend: function() {
                        },
                        complete: function() {
                        },
                        error: function(xhr, status, errorMsg) {
                        }
                    });
                };

                // Bar Horizontal Chart Update...
                self.updateBarHorizontalChart = function(data, event) {
                    self.getBarHorizontalChartValue();
                    self.barHorizontalSeriesValue(self.barHorizontalSeries);
                    self.barHorizontalGroupsValue(self.barHorizontalGroups);
                    return true;
                };
            }

            /*
             * Returns a constructor for the ViewModel so that the ViewModel is constrcuted
             * each time the view is displayed.  Return an instance of the ViewModel if
             * only one instance of the ViewModel is needed.
             */
            return new DashboardViewModel();
        }
);
