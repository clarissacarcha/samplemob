import {useRef, useEffect, useCallback} from 'react';
import {throttle} from 'lodash';

export const useThrottle = (cb, delayDuration) => {
  const options = {leading: true, trailing: false}; // add custom lodash options
  const cbRef = useRef(cb);

  // use mutable ref to make useCallback/throttle not depend on `cb` dep
  useEffect(() => {
    cbRef.current = cb;
  });
  return useCallback(
    throttle((...args) => cbRef.current(...args), delayDuration, options),
    [delayDuration],
  );
};
