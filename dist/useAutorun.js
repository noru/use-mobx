import { autorun } from 'mobx';
import { useEffect } from 'react';
export function useAutorun(effect, deps = []) {
    useEffect(() => {
        return autorun(effect);
    }, deps);
}
