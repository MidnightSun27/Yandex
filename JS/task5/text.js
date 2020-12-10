'use strict';

function sortByName(f1, f2) {
    return f1.name.localeCompare(f2.name);
}

function getFriendshipLevels(friends, filter) {
    const friendsMap = new Map();
    friends.forEach(friend => friendsMap.set(friend.name, friend));
    const levels = [];
    let currentLevelFriends = friends.filter(friend => friend.best).sort(sortByName);
    const checkedFriends = new Set(currentLevelFriends);
    while (currentLevelFriends.length > 0) {
        const filteredFriends = currentLevelFriends
            .filter(filter.filter);
        currentLevelFriends.forEach(friend => checkedFriends.add(friend));
        levels.push(filteredFriends);
        const nextLevel = [];
        currentLevelFriends.forEach(currentLevelFriend => {
            currentLevelFriend.friends.forEach(
                nextLevelFriendName => {
                    const nextLevelFriend = friendsMap.get(nextLevelFriendName);
                    if (!checkedFriends.has(nextLevelFriend)) {
                        nextLevel.push(nextLevelFriend);
                        checkedFriends.add(nextLevelFriend);
                    }
                }
            );
        });
        currentLevelFriends = nextLevel.sort(sortByName);
    }

    return levels;
}

/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    if (!(filter instanceof Filter)) {
        throw new TypeError();
    }

    this.friendshipLevels = getFriendshipLevels(friends, filter);
    this.friendsQueue = this.friendshipLevels.flat();

    this.currentInvited = 0;
    this.done = function () {
        return this.currentInvited >= this.friendsQueue.length;
    };

    this.next = function () {
        return !this.done() ? this.friendsQueue[this.currentInvited++] : null;
    };
}

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    Iterator.call(this, friends, filter);
    this.friendshipLevels = this.friendshipLevels.slice(0, Math.max(0, maxLevel));
    this.friendsQueue = this.friendshipLevels.flat();
}
Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    this.filter = () => true;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
    this.filter = friend => friend.gender === 'male';
}
Object.setPrototypeOf(MaleFilter.prototype, Filter.prototype);

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    this.filter = friend => friend.gender === 'female';
}
Object.setPrototypeOf(FemaleFilter.prototype, Filter.prototype);

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
