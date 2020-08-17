// @refresh reset
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
/*
View that can cross fade between multiple children
- it also supports rearraging children if they move
*/
import React, { useRef } from "react";
import useElementSizeEffect from "../../utils/useElementSizeEffect";
/*
prop ideas
instantCrossFade: enable instant crossfading, but still allow fading out?
*/
var TransitionViewChildWrapper = function (_a) {
    var childId = _a.childId, _b = _a.initialHeight, initialHeight = _b === void 0 ? 0 : _b, children = _a.children, style = _a.style, setMeasuredChildHeightsByKey = _a.setMeasuredChildHeightsByKey, otherProps = __rest(_a, ["childId", "initialHeight", "children", "style", "setMeasuredChildHeightsByKey"]);
    var contentHolderRef = useRef(null);
    useElementSizeEffect({
        wait: 100,
        ref: contentHolderRef,
        initialSize: { height: initialHeight },
        onChange: function (newSize) {
            var _a;
            setMeasuredChildHeightsByKey((_a = {}, _a[childId] = newSize.height, _a));
        },
    });
    return (React.createElement("div", __assign({ style: style, ref: contentHolderRef }, otherProps), children));
};
export default TransitionViewChildWrapper;
