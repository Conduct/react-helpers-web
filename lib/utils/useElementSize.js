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
import { useState, useMemo, useCallback, useRef, useEffect, } from "react";
import useResizeObserver from "use-resize-observer/polyfilled";
import throttle from "lodash.throttle";
export default function useElementSize(_a) {
    var _b, _c;
    var ref = _a.ref, delay = _a.delay, wait = _a.wait, initialSize = _a.initialSize;
    var local = useRef({
        updateSizesTimeout: null,
    }).current;
    var _d = useState({
        width: (_b = initialSize === null || initialSize === void 0 ? void 0 : initialSize.width) !== null && _b !== void 0 ? _b : 0,
        height: (_c = initialSize === null || initialSize === void 0 ? void 0 : initialSize.height) !== null && _c !== void 0 ? _c : 0,
    }), size = _d[0], setSize = _d[1];
    var updateSizes = useCallback(function () {
        if (ref === null || ref === void 0 ? void 0 : ref.current) {
            setSize({
                width: ref.current.offsetWidth,
                height: ref.current.offsetHeight,
            });
        }
    }, [ref]);
    var updateSizesWithDelay = useCallback(function () {
        if (delay) {
            local.updateSizesTimeout = setTimeout(updateSizes, delay);
        }
        else {
            updateSizes();
        }
    }, [delay, local.updateSizesTimeout, updateSizes]);
    // clear the delay timeout when unmounting
    useEffect(function () {
        return function () {
            if (local.updateSizesTimeout)
                clearTimeout(local.updateSizesTimeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    var onResize = useMemo(function () { return throttle(updateSizesWithDelay, wait); }, [
        updateSizesWithDelay,
        wait,
    ]);
    var response = useResizeObserver({ onResize: onResize, ref: ref });
    return __assign(__assign({}, size), { updateSizes: updateSizes });
}
