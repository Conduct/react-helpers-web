import React, { ComponentProps } from "react";
declare type Props = {
    childId: string;
    setMeasuredChildHeightsByKey: (newPartialState: Record<string, number>) => void;
    className?: string;
    initialHeight?: number;
} & ComponentProps<"div">;
declare const TransitionViewChildWrapper: React.FC<Props>;
export default TransitionViewChildWrapper;
