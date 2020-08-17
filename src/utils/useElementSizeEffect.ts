import {
  useState,
  useMemo,
  useCallback,
  RefObject,
  useRef,
  useEffect,
} from "react";
import useResizeObserver from "use-resize-observer/polyfilled";
import throttle from "lodash.throttle";

type Size = {
  width: number;
  height: number;
};

// like useThrottledResizeObserver but doesn't rerender

export default function useElementSizeEffect({
  onChange,
  ref,
  delay,
  wait,
  initialSize,
}: {
  onChange: (newSize: Size) => void;
  ref: RefObject<HTMLElement> | RefObject<HTMLDivElement>;
  delay?: number;
  wait: number;
  initialSize?: Partial<Size>;
}) {
  const { current: local } = useRef({
    updateSizesTimeout: null as null | ReturnType<typeof setTimeout>,
    size: {
      width: initialSize?.width ?? 0,
      height: initialSize?.height ?? 0,
    },
  });

  const updateSizes = useCallback(() => {
    if (ref?.current) {
      local.size.width = ref.current.offsetWidth;
      local.size.height = ref.current.offsetHeight;
      onChange({ ...local.size });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  const updateSizesWithDelay = useCallback(() => {
    if (delay) {
      local.updateSizesTimeout = setTimeout(updateSizes, delay);
    } else {
      updateSizes();
    }
  }, [delay, local.updateSizesTimeout, updateSizes]);

  useEffect(() => {
    // get the first size after rendering
    updateSizes();
    // clear the delay timeout when unmounting
    return () => {
      if (local.updateSizesTimeout) clearTimeout(local.updateSizesTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onResize = useMemo(
    () => throttle(updateSizesWithDelay, wait, { trailing: true }),
    [updateSizesWithDelay, wait]
  );

  useResizeObserver({ onResize, ref });
  return { size: local.size, updateSizes };
}
