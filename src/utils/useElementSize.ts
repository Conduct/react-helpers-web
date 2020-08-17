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

export default function useElementSize({
  ref,
  delay,
  wait,
  initialSize,
}: {
  ref: RefObject<HTMLElement> | RefObject<HTMLDivElement>;
  delay?: number;
  wait: number;
  initialSize?: Partial<Size>;
}) {
  const { current: local } = useRef({
    updateSizesTimeout: null as null | ReturnType<typeof setTimeout>,
  });

  const [size, setSize] = useState({
    width: initialSize?.width ?? 0,
    height: initialSize?.height ?? 0,
  });

  const updateSizes = useCallback(() => {
    if (ref?.current) {
      setSize({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      });
    }
  }, [ref]);

  const updateSizesWithDelay = useCallback(() => {
    if (delay) {
      local.updateSizesTimeout = setTimeout(updateSizes, delay);
    } else {
      updateSizes();
    }
  }, [delay, local.updateSizesTimeout, updateSizes]);

  // clear the delay timeout when unmounting
  useEffect(() => {
    return () => {
      if (local.updateSizesTimeout) clearTimeout(local.updateSizesTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onResize = useMemo(() => throttle(updateSizesWithDelay, wait), [
    updateSizesWithDelay,
    wait,
  ]);

  const response = useResizeObserver({ onResize, ref });
  return { ...size, updateSizes };
}
