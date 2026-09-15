import {type RefObject, useEffect, useRef} from "react";

import Odometer from "odometer";

export interface OdometerOptions {
    auto?: boolean;
    format?: string;
    duration?: number;
}

export default function useOdometer(ref: RefObject<HTMLElement | null>, value: number, options: OdometerOptions = {}) {
    const od = useRef<Odometer | null>(null);

    useEffect(() => {
        if (ref.current === null) {
            return;
        }

        od.current = new Odometer({...options, el: ref.current, value});
    }, [ref, options, value]);

    useEffect(() => {
        od.current?.update(value);
    }, [value]);

    return od.current;
}
