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
import { useMemo, useCallback, useRef, useEffect, } from "react";
import useResizeObserver from "use-resize-observer/polyfilled";
import throttle from "lodash.throttle";
// like useThrottledResizeObserver but doesn't rerender
export default function useElementSizeEffect(_a) {
    var _b, _c;
    var onChange = _a.onChange, ref = _a.ref, delay = _a.delay, wait = _a.wait, initialSize = _a.initialSize;
    var local = useRef({
        updateSizesTimeout: null,
        size: {
            width: (_b = initialSize === null || initialSize === void 0 ? void 0 : initialSize.width) !== null && _b !== void 0 ? _b : 0,
            height: (_c = initialSize === null || initialSize === void 0 ? void 0 : initialSize.height) !== null && _c !== void 0 ? _c : 0,
        },
    }).current;
    var updateSizes = useCallback(function () {
        if (ref === null || ref === void 0 ? void 0 : ref.current) {
            local.size.width = ref.current.offsetWidth;
            local.size.height = ref.current.offsetHeight;
            onChange(__assign({}, local.size));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref]);
    var updateSizesWithDelay = useCallback(function () {
        if (delay) {
            local.updateSizesTimeout = setTimeout(updateSizes, delay);
        }
        else {
            updateSizes();
        }
    }, [delay, local.updateSizesTimeout, updateSizes]);
    useEffect(function () {
        // get the first size after rendering
        updateSizes();
        // clear the delay timeout when unmounting
        return function () {
            if (local.updateSizesTimeout)
                clearTimeout(local.updateSizesTimeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    var onResize = useMemo(function () { return throttle(updateSizesWithDelay, wait, { trailing: true }); }, [updateSizesWithDelay, wait]);
    useResizeObserver({ onResize: onResize, ref: ref });
    return { size: local.size, updateSizes: updateSizes };
}
