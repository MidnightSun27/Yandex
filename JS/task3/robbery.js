
'use strict';
const isExtraTaskSolved = true;

const MINUTES_IN_HOUR = 60;
const weekDay = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

function parse(time) {
    const regExpWithShortZone = /^(\d\d):(\d\d)\+(\d)$/;
    const regExpWithLongZone = /^(\d\d):(\d\d)\+(\d\d)$/;
    let parsed = regExpWithShortZone.exec(time);
    if (parsed === null) {
        parsed = regExpWithLongZone.exec(time);
    }
    return parsed;
}

function getHours(parsedDate) {
    return parseInt(parsedDate[1]);
}

function getMinutes(parsedDate) {
    return parseInt(parsedDate[2]);
}

function getTimeZone(parsedDate) {
    return parseInt(parsedDate[3]);
}

function convertToMinutes(hours, minutes) {
    return hours * MINUTES_IN_HOUR + minutes;
}

function calculateDifference(current, target) {
    return (target - current) * 60;
}

function toTime(number) {
    const formatted = number.toString();
    return formatted.length === 1 ? `0${formatted}` : formatted;
}

function formatTime(parsedDate, targetTimeZone) {
    return (
        convertToMinutes(getHours(parsedDate), getMinutes(parsedDate)) +
        calculateDifference(getTimeZone(parsedDate), targetTimeZone)
    );
}

function formatSchedule(schedule, bankTimeZone) {
    const formattedSchedule = {};
    Object.keys(schedule).forEach(person => {
        formattedSchedule[person] = schedule[person].map(busyHours => {
            const [dayFrom, timeFrom] = busyHours.from.split(' ');
            const [dayTo, timeTo] = busyHours.to.split(' ');

            return {
                from: { day: dayFrom, time: formatTime(parse(timeFrom), bankTimeZone) },
                to: { day: dayTo, time: formatTime(parse(timeTo), bankTimeZone) }
            };
        });
    });

    return formattedSchedule;
}

function formatBankSchedule(workingHours) {
    const parsedFrom = parse(workingHours.from);
    const parsedTo = parse(workingHours.to);
    return {
        from: formatTime(parsedFrom, getTimeZone(parsedFrom)),
        to: formatTime(parsedTo, getTimeZone(parsedTo))
    };
}

function getUnsuitableRanges(formattedSchedule, formattedBankSchedule) {
    const dayRanges = {};
    for (const day of weekDay) {
        dayRanges[day] = [];
    }
    Object.keys(formattedSchedule).forEach(person => {
        formattedSchedule[person].forEach(({ from, to }) => {
            if (from.day === to.day) {
                dayRanges[from.day].push({ from: from.time, to: to.time });
            } else {
                dayRanges[from.day].push({ from: from.time, to: formattedBankSchedule.to });
                dayRanges[to.day].push({ from: formattedBankSchedule.from, to: to.time });
            }
        });
    });
    const result = {};
    for (let i = 0; i < 3; ++i) {
        result[weekDay[i]] = dayRanges[weekDay[i]];
    }
    return result;
}

function findOutIfFree(robberyRange, busyRange) {
    return (
        (robberyRange.from < busyRange.from && robberyRange.to <= busyRange.from) ||
        (robberyRange.from >= busyRange.to && robberyRange.to > busyRange.to)
    );
}

function findOutIfFit(unsuitableRanges, robberyRange) {
    let isFree = true;
    for (const person of unsuitableRanges) {
        if (!findOutIfFree(robberyRange, person)) {
            isFree = false;
            break;
        }
    }
    return isFree;
}

function findRangesForRobbery(ranges, formattedBankTable, duration) {
    const robberyRanges = {};
    for (let i = 0; i < 3; ++i) {
        robberyRanges[weekDay[i]] = [];
    }
    for (let i = formattedBankTable.from; i <= formattedBankTable.to - duration; ++i) {
        const robberyRange = { from: i, to: i + duration };
        Object.keys(ranges).forEach(day => {
            if (ranges[day].length) {
                if (findOutIfFit(ranges[day], robberyRange)) {
                    robberyRanges[day].push(robberyRange);
                }
            } else {
                robberyRanges[day].push(robberyRange);
            }
        });
    }
    return robberyRanges;
}

function getNearestRange(robberyRanges) {
    for (const day of Object.keys(robberyRanges)) {
        if (robberyRanges[day].length) {
            return { day: day, range: robberyRanges[day][0] };
        }
    }
    return null;
}

function getNextRange(current, robberyRanges) {
    const days = Object.keys(robberyRanges);
    const currentStart = current.range.from + 30;
    for (const day of days) {
        const filtered = robberyRanges[day].filter(range => range.from >= currentStart);
        if (filtered.length && day === current.day) {
            return { day: current.day, range: filtered[0] };
        } else if (days.indexOf(day) > days.indexOf(current.day) && robberyRanges[day].length) {
            return { day: day, range: robberyRanges[day][0] };
        }
    }
    return current;
}

function getAppropriateMoment(schedule, duration, workingHours) {
    let bankTimeZone = getTimeZone(parse(workingHours.from));
    let formattedSchedule = formatSchedule(schedule, bankTimeZone);
    let formattedBankSchedule = formatBankSchedule(workingHours);
    let unsuitable = getUnsuitableRanges(formattedSchedule, formattedBankSchedule);
    let suitable = findRangesForRobbery(unsuitable, formattedBankSchedule, duration);
    let nearestRange = getNearestRange(suitable);

    return {
        exists() {
            for (const day of Object.keys(suitable)) {
                if (suitable[day].length) {
                    return true;
                }
            }
            return false;
        },
        format(template) {
            if (nearestRange !== null) {
                return template
                    .replace('%HH', toTime(parseInt(nearestRange.range.from / 60)))
                    .replace('%MM', toTime(parseInt(nearestRange.range.from % 60)))
                    .replace('%DD', nearestRange.day);
            } else {
                return '';
            }
        },
        tryLater() {
            if (!this.exists()) {
                return false;
            }
            let nextRange = getNextRange(nearestRange, suitable);
            if (nextRange.day === nearestRange.day && nextRange.range.from === nearestRange.range.from) {
                return false;
            }
            nearestRange = nextRange;
            return true;
        }
    };
}

module.exports = {
    getAppropriateMoment,
    isExtraTaskSolved
};

