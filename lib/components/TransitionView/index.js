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
/** @jsx jsx */
import { jsx } from "@emotion/core";
// @refresh reset
/*
View that can cross fade between multiple children
- it also supports rearraging children if they move
*/
import React, { useState, useRef, } from "react";
import { useSpring, useTransition, animated } from "react-spring";
import usePrevious from "../../utils/usePrevious";
import { createStyleSheet } from "../../utils/styles";
import useBatchObjectState from "../../utils/useBatchObjectState";
import TransitionViewChildWrapper from "./TransitionViewChildWrapper";
/*
prop ideas
instantCrossFade: enable instant crossfading, but still allow fading out?
*/
// used to get a relative time, since Date.now() returned number is too large for zIndex, and can cause a crash with react-native bridge
var fileOpenedTime = Date.now();
var TransitionViewWithoutMemo = function (_a) {
    var contentChangedKey = _a.contentChangedKey, _b = _a.speed, speed = _b === void 0 ? 1 : _b, _c = _a.renderWhenNoChildren, renderWhenNoChildren = _c === void 0 ? true : _c, _d = _a.overflow, overflow = _d === void 0 ? "hidden" : _d, children = _a.children, cssStyle = _a.cssStyle, childWrapperStyle = _a.childWrapperStyle, childOuterWrapperStyle = _a.childOuterWrapperStyle, _e = _a.hasBackground, hasBackground = _e === void 0 ? false : _e, _f = _a.initialChildHeight, initialChildHeight = _f === void 0 ? 0 : _f, _g = _a.slideExistingItems, slideExistingItems = _g === void 0 ? true : _g, direction = _a.direction, otherProps = __rest(_a, ["contentChangedKey", "speed", "renderWhenNoChildren", "overflow", "children", "cssStyle", "childWrapperStyle", "childOuterWrapperStyle", "hasBackground", "initialChildHeight", "slideExistingItems", "direction"]);
    var _h = useBatchObjectState({}), measuredChildHeightsByKey = _h[0], setMeasuredChildHeightsByKey = _h[1];
    var childrenArray = React.Children.toArray(children);
    // like "this" , stores values in an object so callbacks can use the latest values
    var local = useRef({
        shouldHideOverflow: false,
        prevTotalChildrenHeight: 0,
        totalChildrenHeight: 0,
        childAmount: childrenArray.length,
    }).current;
    local.childAmount = childrenArray.length;
    var _j = useState(childrenArray.length > 0), shouldRender = _j[0], setShouldRender = _j[1];
    if (!renderWhenNoChildren && local.childAmount > 0 && !shouldRender) {
        setShouldRender(true);
    }
    local.totalChildrenHeight = 0;
    var childrenListData = childrenArray
        .filter(function (loopedChild) {
        if (!loopedChild.key || typeof loopedChild.key !== "string") {
            console.warn("no or incorrect key set for child in TransitionView");
            return false;
        }
        return true;
    })
        .map(function (loopedChild, index) {
        var loopedChildId = loopedChild.key;
        var measuredHeight = measuredChildHeightsByKey[loopedChildId] || initialChildHeight;
        local.totalChildrenHeight += measuredHeight;
        return {
            childElement: loopedChild,
            id: loopedChildId,
            y: local.totalChildrenHeight - measuredHeight,
            index: index,
        };
    });
    var prevTotalChildrenHeight = usePrevious(local.totalChildrenHeight);
    local.shouldHideOverflow = overflow === "hidden";
    switch (overflow) {
        case "whenGrowing":
            local.shouldHideOverflow =
                local.totalChildrenHeight < prevTotalChildrenHeight;
            break;
        case "whenShrinking":
            local.shouldHideOverflow =
                local.totalChildrenHeight > prevTotalChildrenHeight;
            break;
    }
    var heightMotionProps = useSpring({
        height: local.totalChildrenHeight,
        config: {
            bounce: 0,
            friction: 25,
            tension: 200 * speed,
        },
    });
    // To help keep the fading out children behind the fading in
    var rerenderTime = Date.now() - fileOpenedTime; // subtracting fileOpenedTime to keep the number small (e.g 12592 vs 163289321592), a high zIndex number can fail on web
    var transitions = useTransition(childrenListData, {
        keys: function (_a) {
            var id = _a.id;
            return id + (slideExistingItems ? "" : contentChangedKey);
        },
        from: function (_a) {
            var y = _a.y;
            return ({
                translateY: y,
                opacity: 0,
                zIndex: rerenderTime,
            });
        },
        enter: function (_a) {
            var y = _a.y;
            return ({
                translateY: y,
                opacity: 1,
                zIndex: rerenderTime,
            });
        },
        leave: function (_a) {
            var y = _a.y;
            return ({
                opacity: 0,
                translateY: y,
                delay: hasBackground ? 250 : 0,
                zIndex: rerenderTime - 100,
            });
        },
        update: function (_a) {
            var y = _a.y;
            return ({
                translateY: y,
                zIndex: rerenderTime,
            });
        },
        onRest: function () {
            if (!renderWhenNoChildren && local.childAmount === 0) {
                setShouldRender(false);
            }
        },
        config: { tension: 170 * speed, friction: 24 + speed * 2 },
    }, [contentChangedKey, measuredChildHeightsByKey])[0];
    if (!renderWhenNoChildren && !shouldRender) {
        return null;
    }
    return (jsx(animated.div, { style: {
            height: heightMotionProps.height.to(function (value) { return value + "px"; }),
            minHeight: heightMotionProps.height.to(function (value) { return value + "px"; }),
        }, css: [
            {
                position: "relative",
                alignSelf: "stretch",
                overflow: local.shouldHideOverflow ? "hidden" : "visible",
            },
            cssStyle,
        ] }, transitions(function (_a, _b) {
        var translateY = _a.translateY, opacity = _a.opacity, zIndex = _a.zIndex;
        var id = _b.id, childElement = _b.childElement;
        return (jsx(animated.div, { style: {
                // alignSelf: "stretch",
                // ...addFlex({ x: "center", y: "center", direction: "down" }),
                transform: translateY.to(function (value) { return "translateY(" + value + "px)"; }),
                // typescript types for react-spring https://github.com/react-spring/react-spring/issues/1102
                opacity: opacity,
                zIndex: zIndex,
            }, css: [styles.childElementHolder, childOuterWrapperStyle] },
            jsx(TransitionViewChildWrapper, { childId: id, css: childWrapperStyle, setMeasuredChildHeightsByKey: setMeasuredChildHeightsByKey }, childElement)));
    })));
};
var styles = createStyleSheet({
    childElementHolder: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
    },
});
var TransitionView = React.memo(TransitionViewWithoutMemo);
export default TransitionView;
