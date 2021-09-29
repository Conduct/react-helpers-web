/** @jsx jsx */
import { jsx, CSSObject } from "@emotion/core";
// @refresh reset
/*
View that can cross fade between multiple children
- it also supports rearraging children if they move
*/

import React, {
  ReactElement,
  useState,
  useRef,
  ComponentProps,
  CSSProperties,
} from "react";

import { useSpring, useTransition, animated } from "react-spring";
import usePrevious from "../../utils/usePrevious";
import { createStyleSheet } from "../../utils/styles";
import useBatchObjectState from "../../utils/useBatchObjectState";
import TransitionViewChildWrapper from "./TransitionViewChildWrapper";

type FadableChild = ReactElement | false | null | undefined;

type OverflowMode = "hidden" | "visible" | "whenShrinking" | "whenGrowing";

type Props = {
  contentChangedKey: string | boolean; // lets the component know the content has changed
  speed?: number; // multiplies the default speed (1.0 is default)
  cssStyle?: CSSObject;
  childWrapperStyle?: CSSObject; // for the view wrapping each child (to measure height)
  childOuterWrapperStyle?: CSSObject; // for the view wrapping each child wrapper (to set y position)
  renderWhenNoChildren?: boolean;
  overflow?: OverflowMode;
  direction?: "vertical" | "horizontal";
  children: FadableChild[] | FadableChild;
  initialChildHeight?: number;
  // whether the faded content has a background, enabling this stops a flash of 0.5 opacity when fading between two items
  hasBackground?: boolean;
  // So children with same keys slide to new positions instead of fading out and in
  slideExistingItems?: boolean;
} & ComponentProps<"div">;

/*
prop ideas
instantCrossFade: enable instant crossfading, but still allow fading out?
*/

// used to get a relative time, since Date.now() returned number is too large for zIndex, and can cause a crash with react-native bridge
const fileOpenedTime = Date.now();

const TransitionViewWithoutMemo: React.FC<Props> = ({
  contentChangedKey,
  speed = 1,
  renderWhenNoChildren = true,
  overflow = "hidden",
  children,
  cssStyle,
  childWrapperStyle,
  childOuterWrapperStyle,
  hasBackground = false,
  initialChildHeight = 0,
  slideExistingItems = true,

  direction,

  ...otherProps
}) => {
  const [
    measuredChildHeightsByKey,
    setMeasuredChildHeightsByKey,
  ] = useBatchObjectState({} as Record<string, number>);

  const childrenArray = React.Children.toArray(children) as ReactElement[];
  // like "this" , stores values in an object so callbacks can use the latest values
  const { current: local } = useRef({
    shouldHideOverflow: false,
    prevTotalChildrenHeight: 0,
    totalChildrenHeight: 0,
    childAmount: childrenArray.length,
  });

  local.childAmount = childrenArray.length;

  const [shouldRender, setShouldRender] = useState(childrenArray.length > 0);

  if (!renderWhenNoChildren && local.childAmount > 0 && !shouldRender) {
    setShouldRender(true);
  }

  local.totalChildrenHeight = 0;
  const childrenListData = childrenArray
    .filter((loopedChild) => {
      if (!loopedChild.key || typeof loopedChild.key !== "string") {
        console.warn("no or incorrect key set for child in TransitionView");
        return false;
      }

      return true;
    })
    .map((loopedChild, index) => {
      const loopedChildId = loopedChild.key as string;
      const measuredHeight =
        measuredChildHeightsByKey[loopedChildId] || initialChildHeight;

      local.totalChildrenHeight += measuredHeight;
      return {
        childElement: loopedChild,
        id: loopedChildId,
        y: local.totalChildrenHeight - measuredHeight,
        index,
      };
    });
  const prevTotalChildrenHeight = usePrevious(local.totalChildrenHeight);

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

  const heightMotionProps = useSpring({
    height: local.totalChildrenHeight,
    config: {
      bounce: 0,
      friction: 25,
      tension: 200 * speed,
    },
  });

  // To help keep the fading out children behind the fading in
  const rerenderTime = Date.now() - fileOpenedTime; // subtracting fileOpenedTime to keep the number small (e.g 12592 vs 163289321592), a high zIndex number can fail on web

  const [transitions] = useTransition<
    typeof childrenListData[number],
    {
      opacity: number;
      translateY: number;
      delay: number;
      zIndex: number;
    }
  >(
    childrenListData,
    {
      keys: ({ id }) => id + (slideExistingItems ? "" : contentChangedKey),
      from: ({ y }) => ({
        translateY: y,
        opacity: 0,
        zIndex: rerenderTime,
      }),
      enter: ({ y }) => ({
        translateY: y,
        opacity: 1,
        zIndex: rerenderTime,
      }),
      leave: ({ y }) => ({
        opacity: 0,
        translateY: y,
        delay: hasBackground ? 250 : 0,
        zIndex: rerenderTime - 100,
      }),
      update: ({ y }) => ({
        translateY: y,
        zIndex: rerenderTime,
      }),
      onRest() {
        if (!renderWhenNoChildren && local.childAmount === 0) {
          setShouldRender(false);
        }
      },
      config: { tension: 170 * speed, friction: 24 + speed * 2 },
    },
    [contentChangedKey, measuredChildHeightsByKey]
  );

  if (!renderWhenNoChildren && !shouldRender) {
    return null;
  }

  return (
    <animated.div
      style={
        {
          height: heightMotionProps.height.to((value) => `${value}px`),
          minHeight: heightMotionProps.height.to((value) => `${value}px`),
        } as any
      }
      css={[
        {
          position: "relative",
          alignSelf: "stretch" as any,
          overflow: local.shouldHideOverflow ? "hidden" : ("visible" as any),
        },
        cssStyle,
      ]}
      // {...(otherProps as any)}
    >
      {transitions(({ translateY, opacity, zIndex }, { id, childElement }) => {
        return (
          <animated.div
            style={{
              // alignSelf: "stretch",
              // ...addFlex({ x: "center", y: "center", direction: "down" }),
              transform: translateY.to((value) => `translateY(${value}px)`),
              // typescript types for react-spring https://github.com/react-spring/react-spring/issues/1102
              opacity: opacity as any,
              zIndex: zIndex as any,
            }}
            css={[styles.childElementHolder, childOuterWrapperStyle]}
          >
            <TransitionViewChildWrapper
              childId={id}
              css={childWrapperStyle}
              setMeasuredChildHeightsByKey={setMeasuredChildHeightsByKey}
            >
              {childElement}
            </TransitionViewChildWrapper>
          </animated.div>
        );
      })}
    </animated.div>
  );
};

const styles = createStyleSheet({
  childElementHolder: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
  },
});

const TransitionView: React.FC<Props> = React.memo(TransitionViewWithoutMemo);

export default TransitionView;
