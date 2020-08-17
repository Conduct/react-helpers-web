import { RefObject } from "react";
declare type Size = {
    width: number;
    height: number;
};
export default function useElementSize({ ref, delay, wait, initialSize, }: {
    ref: RefObject<HTMLElement> | RefObject<HTMLDivElement>;
    delay?: number;
    wait: number;
    initialSize?: Partial<Size>;
}): {
    updateSizes: () => void;
    width: number;
    height: number;
};
export {};
