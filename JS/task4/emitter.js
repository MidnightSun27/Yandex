/**
 * Возвращает новый emitter
 * @returns {{through: through, several: several, emit: emit, off: off, on: (function(String, Object, Function): this)}}
 */
function getEmitter() {
    let events = {};
    return {
        on: function (event, context, handler) {
            if (!{}.hasOwnProperty.call(events, event)) {
                events[event] = [];
            }
            events[event].push({context, handler});
            return this;
        },

        off: function (event, context) {
            Object.keys(events).forEach(unsubscribed => {
                if (unsubscribed === event || unsubscribed.startsWith(`${event}.`)) {
                    events[unsubscribed] = events[unsubscribed].filter(student => student.context !== context);
                }
            });
            return this;
        },

        getEvents: function (event) {
            const reducer = (accumulator, currentEvent) => {
                if (accumulator.length === 0)
                    return [currentEvent];
                accumulator.unshift(`${accumulator[0]}.${currentEvent}`);
                return accumulator;
            };
            return event.split('.').reduce(reducer, []);
        },

        emit: function (event) {
            let allEvents = this.getEvents(event);
            allEvents.forEach(thisEmit => {
                if({}.hasOwnProperty.call(events, thisEmit)){
                    events[thisEmit].forEach(student => student.handler.call(student.context));
                }
            });
            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            let time = 0;
            let changed = times <= 0 ? handler : function () {
                if (time < times){
                    handler.call(context);
                    time++;
                }
            };
            this.on(event, context, changed);
            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            let time = 0;
            let changed = frequency <= 0 ? handler : function () {
                if (time % frequency === 0){
                    handler.call(context);
                }
                time++;
            };
            this.on(event, context, changed);
            return this;
        }
    };
}

module.exports = {
    getEmitter
};