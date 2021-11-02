"use strict";
exports.__esModule = true;
var native_1 = require("@testing-library/react-hooks/native");
var useObservable_1 = require("../src/useObservable");
test('should increment counter', function () {
    var result = (0, native_1.renderHook)(function () { return (0, useObservable_1.useObservable)(); }).result;
    (0, native_1.act)(function () {
        result.current.increment();
    });
    expect(result.current.count).toBe(1);
});
