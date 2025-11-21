import React, {
    ComponentProps,
    CSSProperties,
    forwardRef,
    ForwardRefRenderFunction,
    PropsWithChildren,
    useCallback,
    useMemo,
    useState,
} from "react";

import {ViewportContext, ViewportMode, ViewportSizes} from "./context";

import classnames from "classnames";

import styles from "./viewport.module.scss";

export type ViewportProps = ComponentProps<"div"> & {
    mode?: ViewportMode;
    transition?: boolean;
};

const Provider: ForwardRefRenderFunction<HTMLDivElement, PropsWithChildren<ViewportProps>> = (
    {
        children,
        className,
        style,
        mode: viewportMode = ViewportMode.Adaptive,
        transition: viewportTransition = true,
        ...props
    },
    ref
) => {
    const [transition, withTransition] = useState(viewportTransition);
    const [mode, setModeState] = useState<ViewportMode>(viewportMode);
    const [sizes, setSizesState] = useState<ViewportSizes | null>(null);

    const setSizes = useCallback((sizes: ViewportSizes) => {
        setSizesState(prev => ({...prev, ...sizes}));
    }, []);

    const setMode = useCallback((mode: ViewportMode) => setModeState(mode), []);

    const resetSizes = useCallback(() => setSizesState(null), []);

    const contextValue = useMemo(
        () => ({
            mode,
            setSizes,
            setMode,
            resetSizes,
            withTransition,
        }),
        [mode, setSizes, setMode, resetSizes]
    );

    const computedStyles: CSSProperties = useMemo(() => {
        if (!sizes) return {...style};

        const {width, height} = sizes;

        let baseStyles: CSSProperties = {};

        if (mode === ViewportMode.Fixed) {
            baseStyles = {
                width,
                minWidth: width,
                maxWidth: width,

                height,
                minHeight: height,
                maxHeight: height,
            };
        }

        if (mode === ViewportMode.Adaptive) {
            baseStyles = {
                minWidth: sizes.width,
                minHeight: sizes.height,
            };
        }

        return {...style, ...baseStyles};
    }, [style, sizes, mode]);

    return (
        <ViewportContext.Provider value={contextValue}>
            <div
                ref={ref}
                style={computedStyles}
                className={classnames(
                    styles["viewport"],
                    {
                        [styles["viewport--transition"]]: transition,
                        [styles["viewport--expanded"]]: mode === ViewportMode.Expanded,
                        [styles["viewport--fixed"]]: mode === ViewportMode.Fixed,
                    },
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </ViewportContext.Provider>
    );
};

Provider.displayName = "ViewportProvider";

export default forwardRef(Provider);
