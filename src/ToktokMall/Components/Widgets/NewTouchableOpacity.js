import { throttle } from 'lodash';
import React, { useCallback, useEffect, useRef } from 'react'
import { View, TouchableOpacity } from 'react-native';

export const NewTouchableOpacity = ({onPress = null, disabled, style, key, children}) => {
    const useThrottle = (cb, delay) => {
        const options = {leading: true, trailing: false}; // add custom lodash options
        const cbRef = useRef(cb);
        // use mutable ref to make useCallback/throttle not depend on `cb` dep
        useEffect(() => {
            cbRef.current = cb;
        });
        return useCallback(
            throttle((...args) => cbRef.current(...args), delay, options),
            [delay],
        );
    };

    return (
        <TouchableOpacity
            onPress={useThrottle(onPress, 2000)}
            disabled={disabled}
            style={style}
            key={key}
        >
            {children}
        </TouchableOpacity>
    )
}

// export default NewTouchableOpacity
