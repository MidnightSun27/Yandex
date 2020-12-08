'use strict';

function getCircles(friends) {
    let circles = [];
    let currentCircle = [];
    let friendsDictionary = {};
    friends.forEach(function (friend) {
        if (friend.best) {
            currentCircle.push(friend);
        } else {
            friendsDictionary[friend.name] = friend;
        }
    });

    function getNext() {
        return currentCircle.reduce(function (circle, friend) {
            friend.friends.forEach(function (f) {
                if (f in friendsDictionary) {
                    circle.push(friendsDictionary[f]);
                    delete friendsDictionary[f];
                }
            });
            return circle;
        }, []);
    }

    while (currentCircle.length !== 0) {
        circles.push(currentCircle.sort(function (x, y) {
            if (x.name > y.name) {
                return 1;
            } else {
                return -1;
            }
        }));
        currentCircle = getNext();
    }
    return circles;
}

function FilterForIterator(friends, filter) {
    this.friends = friends;
    this.filter = filter;
    this.next = function () {
        let friend = this.friends.shift();
        while (friend !== undefined && !this.filter.test(friend)) {
            friend = this.friends.shift();
        }

        return friend ? friend : null;
    };
    this.done = function () {
        let friend = this.next();
        if (friend) {
            this.friends.unshift(friend);
        }

        return friend === null;
    };
}

function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }
    this.filter = filter;
    this.circles = getCircles(friends);
    this.index = 0;
    let firstCircle;
    if (this.circles.length) {
        firstCircle = this.circles[this.index++];
    } else {
        firstCircle = [];
    }
    this.currentIterator = new FilterForIterator(firstCircle, filter);

    this.next = function () {
        if (this.done()) {
            return null;
        }

        if (this.currentIterator.done()) {
            this.currentIterator = new FilterForIterator(
                this.circles[this.index++], this.filter
            );
        }

        return this.currentIterator.next();
    };

    this.done = function () {
        return this.currentIterator.done() && this.index === this.circles.length;
    };
}


function LimitedIterator(friends, filter, maxLevel) {
    if (maxLevel > 0 && maxLevel) {
        Iterator.call(this, friends, filter);
    } else {
        Iterator.call(this, [], filter);
    }
    this.circles = this.circles.slice(0, maxLevel);
}

Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);


function Filter() {
    this.test = function () {
        return true;
    };
}


function MaleFilter() {
    this.test = function (bro) {
        return bro.gender === 'male';
    };
}

Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

function FemaleFilter() {
    this.test = function (sis) {
        return sis.gender === 'female';
    };
}

Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);


exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;