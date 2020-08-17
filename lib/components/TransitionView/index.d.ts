/** @jsx jsx */
import { CSSObject } from "@emotion/core";
import React, { ReactElement, ComponentProps } from "react";
declare type FadableChild = ReactElement | false | null | undefined;
declare type OverflowMode = "hidden" | "visible" | "whenShrinking" | "whenGrowing";
declare type Props = {
    contentChangedKey: string | boolean;
    speed?: number;
    cssStyle?: CSSObject;
    childWrapperStyle?: CSSObject;
    childOuterWrapperStyle?: CSSObject;
    renderWhenNoChildren?: boolean;
    overflow?: OverflowMode;
    direction?: "vertical" | "horizontal";
    children: FadableChild[] | FadableChild;
    initialChildHeight?: number;
    hasBackground?: boolean;
    slideExistingItems?: boolean;
} & ComponentProps<"div">;
declare const TransitionView: React.FC<Props>;
export default TransitionView;
