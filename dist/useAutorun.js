import { autorun, } from 'mobx';
import { useEffect } from 'react';
export function useAutorun(effect, deps = [], options = {}) {
    useEffect(() => {
        return autorun(effect, options);
    }, deps);
}
