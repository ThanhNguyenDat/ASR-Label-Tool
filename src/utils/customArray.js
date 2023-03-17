export var iterifyArr = function (arr) {
    var current = 0;
    arr.current = (function () { return this[current] })
    arr.next = (function () { return (++current >= this.length) ? false : this[current]; });
    arr.prev = (function () { return (--current < 0) ? false : this[current]; });
    return arr;
};

// iterifyArr(formatAnnotaion)
// let data = formatAnnotaion.prev()
// console.log("custom: ", data);
// data = formatAnnotaion.next()
// console.log("custom: ", data);
// data = formatAnnotaion.next();
// console.log("custom: ", data);
// data = formatAnnotaion.current()
// console.log("custom: ", data);
// data = formatAnnotaion.next();
// console.log("custom: ", data);
// data = formatAnnotaion.next();
// console.log("custom: ", data);
// data = formatAnnotaion.prev()
// console.log("custom: ", data);

