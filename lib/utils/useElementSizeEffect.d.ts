import { RefObject } from "react";
declare type Size = {
    width: number;
    height: number;
};
export default function useElementSizeEffect({ onChange, ref, delay, wait, initialSize, }: {
    onChange: (newSize: Size) => void;
    ref: RefObject<HTMLElement> | RefObject<HTMLDivElement>;
    delay?: number;
    wait: number;
    initialSize?: Partial<Size>;
}): {
    size: {
        width: number;
        height: number;
    };
    updateSizes: () => void;
};
export {};
