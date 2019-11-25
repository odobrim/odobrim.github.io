var _odobrimWidget = (function(window, document) {
    'use strict';

    function frameInsert(frame, target) {
        if (target.parentNode === document.head) {
            if (document.readyState !== 'loading') {
                document.body.appendChild(frame);
            } else {
                document.addEventListener('DOMContentLoaded', function() {
                    document.body.appendChild(frame);
                });
            }
        } else {
            target.parentNode.insertBefore(frame, target);
        }
    }

    function frameReady() {
        widgetIsReady = true;
        readyList.forEach(function(callback) {
            callback();
        });
    }

    function getPartnerLocation() {
        var url;

        try {
            url = window.top.location.href;
        } catch (exp) {
            if (document.domain !== '') {
                var protocol = window.location.protocol;
                url = (protocol === 'data:' ? 'http://' : protocol) + document.domain;
            } else {
                url = window.location.href;
            }
        }

        return url;
    }

    function getWidgetURL(data) {
        var params = new URLSearchParams;

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                params.append(key, data[key]);
            }
        }

        params.append('location', getPartnerLocation());
        params.append('token', token);

        return '//' + data.server + '/widget/' + data.widgetId + '/?' + params;
    }

    function handleMessageEvent(event) {
        var messageData = event.data;

        try {
            messageData = JSON.parse(messageData);
        } catch (exp) {
            messageData = null;
        }

        if (messageData !== null && typeof messageData === 'object' && messageData.token === token) {
            if (actionHandlers.hasOwnProperty(messageData.action)) {
                actionHandlers[messageData.action](messageData.data);
            } else {
                console.log('неверный "action" ' + messageData.action);
                // sendStatistics({type: 'invalidAction', url: getPartnerLocation()});
            }
        }
    }

    function validateRequiredParams(keys, data) {
        keys.forEach(function(key) {
            if (data[key] === null || data[key] === void 0) {
                throw new Error('"' + key + '" is required');
            }
        });
    }


    if (window !== window.top) {
        console.log('наш скрипт вставили внутрь другого айфейма');
        // sendStatistics({type: 'insertError', url: getPartnerLocation()});
        return;
    }


    // обработчики
    var actionHandlers = {
        changeWidgetHeight: function(data) {
            widgetElement.height = data.value;
        },
        scrollToWidget: function(data) {
            var scrollTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
            var top = widgetElement.getBoundingClientRect().top + scrollTop;
            window.scrollTo(0, top + (data.offset || 0));
        },
        scrollToWidgetCenter: function() {
            actionHandlers.scrollToWidget({
                offset: widgetElement.clientHeight / 2 - window.innerHeight / 2
            });
        }
    };

    var readyList = [];

    var token = btoa(Math.random().toString());

    var widget = {
        init: function(data, onReady, target) {
            if (!widgetisInit) {

                if (typeof data === 'string') {
                    try {
                        data = JSON.parse(data);
                    } catch (exp) {
                        data = null;
                    }
                }

                if (data === null || typeof data !== 'object') {
                    throw new Error('Invalid parameter "data". Object type expected');
                }


                validateRequiredParams(['partnerId', 'server', 'type', 'widgetId'], data);


                var frame = document.createElement('iframe');

                frame.frameBorder = 0;
                frame.scrolling = 'no';
                frame.onload = frameReady.bind(null, frame);
                frame.width = '100%';
                frame.height = 0;
                frame.sandbox = 'allow-forms allow-scripts allow-same-origin';
                frame.src = getWidgetURL(data);

                widgetisInit = true;
                widgetElement = frame;

                frameInsert(frame, target || widget._target);

                window.addEventListener('message', handleMessageEvent);

                widget.ready(onReady);
            }
        },
        ready: function(callback) {
            if (typeof callback !== 'function') {
                return;
            }

            if (widgetIsReady) {
                setTimeout(callback, 0);
            } else {
                readyList.push(callback);
            }
        },
        sendAction: function sendAction(action, data) {
            widget.ready(function() {
                var messageData = {
                    action: action,
                    token: token,
                    data: data,
                };
                widgetElement.contentWindow.postMessage(JSON.stringify(messageData), '*');
            });
        }
    };

    var widgetElement = null;
    var widgetisInit = false;
    var widgetIsReady = false;

    return widget;

})(window, document);