"use strict";
exports.__esModule = true;
exports.useObservable = void 0;
var react_1 = require("react");
function useObservable() {
    var _a = (0, react_1.useState)(0), count = _a[0], setCount = _a[1];
    var increment = (0, react_1.useCallback)(function () { return setCount(function (x) { return x + 1; }); }, []);
    return { count: count, increment: increment };
}
exports.useObservable = useObservable;
