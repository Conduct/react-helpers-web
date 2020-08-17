import { CSSProperties } from "react";
import * as CSS from "csstype";
import { CSSObject } from "@emotion/core";
export declare type CSSPropertiesWithMultiValues = {
    [K in keyof CSSProperties]: CSSProperties[K] | Array<Extract<CSSProperties[K], string>>;
};
declare type CSSPSuedosWithWebkitScrollbar = CSS.Pseudos & "::-webkit-scrollbar" & "::-webkit-scrollbar-thumb";
export declare type CSSPseudosForCSSObject = {
    [K in CSSPSuedosWithWebkitScrollbar]?: CSSObject;
};
declare type StyleObject = CSSProperties | CSSPseudosForCSSObject;
declare type NamedStyles<T> = {
    [P in keyof T]: StyleObject;
};
declare type NamedStylesForCssProp<T> = {
    [P in keyof T]: CSSObject;
};
export declare function createStyleSheet<T_StyleName extends NamedStyles<T_StyleName>>(styles: NamedStyles<T_StyleName>): NamedStylesForCssProp<T_StyleName>;
export declare type PositionStyle = "relative" | "absolute";
declare type AddFlexOptions = {
    x: "left" | "center" | "right" | "stretch" | "space-between";
    y: "top" | "center" | "bottom" | "stretch" | "space-between";
    direction?: "right" | "down";
};
export declare function addFlex({ x, y, direction }: AddFlexOptions): {
    readonly display: "flex";
    readonly flexDirection: "column" | "row";
    readonly alignItems: "stretch" | "center" | "flex-end" | "flex-start";
    readonly justifyContent: "space-between" | "center" | "flex-end" | "flex-start";
};
declare type UseAbsoluteOptions = {
    left?: number | string;
    top?: number | string;
    bottom?: number | string;
    right?: number | string;
};
export declare function addAbsolute({ left, top, bottom, right, }?: UseAbsoluteOptions): {
    readonly left: string | number | undefined;
    readonly top: string | number | undefined;
    readonly bottom: string | number | undefined;
    readonly right: string | number | undefined;
    readonly position: "absolute";
};
export {};
