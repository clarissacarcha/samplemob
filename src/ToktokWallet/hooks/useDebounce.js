import React , {useRef,useEffect} from "react";

export const useIsMounted = ()=> {
    const isMountedRef = useRef(true);
    useEffect(() => {
      return () => {
        isMountedRef.current = false;
      };
    }, []);
    return () => isMountedRef.current;
}

export const useDebounce = (cb,delay)=> {
      const options = {
        leading: false,
        trailing: true,
      };
      const inputsRef = useRef(cb);
      const isMounted = useIsMounted();

      useEffect(() => {
        inputsRef.current = {cb, delay};
      });

      return useCallback(
        debounce(
          (...args) => {
            // Don't execute callback, if (1) component in the meanwhile
            // has been unmounted or (2) delay has changed
            if (inputsRef.current.delay === delay && isMounted()) inputsRef.current.cb(...args);
          },
          delay,
          options,
        ),
        [delay, debounce],
      );
}