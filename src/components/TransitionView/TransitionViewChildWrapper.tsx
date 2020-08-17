// @refresh reset

/*
View that can cross fade between multiple children
- it also supports rearraging children if they move
*/

import React, { ReactElement, useState, useRef, ComponentProps } from "react";

import useElementSizeEffect from "../../utils/useElementSizeEffect";

type Props = {
  childId: string;
  setMeasuredChildHeightsByKey: (
    newPartialState: Record<string, number>
  ) => void;
  // style?: ComponentProps<"div">["style"];
  className?: string;
  initialHeight?: number;
} & ComponentProps<"div">;

/*
prop ideas
instantCrossFade: enable instant crossfading, but still allow fading out?
*/

const TransitionViewChildWrapper: React.FC<Props> = ({
  childId,
  initialHeight = 0,
  children,
  style,
  setMeasuredChildHeightsByKey,
  ...otherProps
}) => {
  const contentHolderRef = useRef<HTMLDivElement>(null);

  useElementSizeEffect({
    wait: 100,
    ref: contentHolderRef,
    initialSize: { height: initialHeight },
    onChange(newSize) {
      setMeasuredChildHeightsByKey({ [childId]: newSize.height });
    },
  });

  return (
    <div style={style} ref={contentHolderRef} {...otherProps}>
      {children}
    </div>
  );
};

export default TransitionViewChildWrapper;
