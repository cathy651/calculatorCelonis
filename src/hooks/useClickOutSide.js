import React, { useEffect } from 'react'

const useClickOutSide = (ref, callback) => {
    useEffect(()=>{
        function handler(e) {
            if(!ref.current?.contains(e.target)) {
                callback();
            }
        }
        window.addEventListener('click', handler);
        return () => window.removeEventListener('click', handler);
    },[ref,callback]);
}

export default useClickOutSide