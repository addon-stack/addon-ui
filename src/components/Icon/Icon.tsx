import React, {type ComponentProps, forwardRef, type ForwardRefRenderFunction, memo, useEffect} from "react";

import classnames from "classnames";

import {useComponentProps, useIcons} from "../../providers";

import {getIconDefinition, IconMode} from "./definition";

import styles from "./icon.module.scss";

export interface IconProps extends ComponentProps<"svg"> {
    name: string;
    size?: number;
}

const Icon: ForwardRefRenderFunction<SVGSVGElement, IconProps> = (props, ref) => {
    const {
        name,
        className,
        size = 24,
        width = size,
        height = size,
        viewBox,
        preserveAspectRatio,
        ...other
    } = {...useComponentProps("icon"), ...props};

    const {icons, registerIcon} = useIcons();

    const definition = icons[name] ? getIconDefinition(icons[name]) : undefined;

    useEffect(() => {
        if (definition?.mode === IconMode.Sprite) {
            registerIcon(name);
        }
    }, [name, definition?.mode, registerIcon]);

    if (!definition) {
        console.warn(`Icon "${name}" not found.`);

        return (
            <span
                className={classnames(styles["icon--default"], className)}
                style={{fontSize: `${width}px`, lineHeight: `${width}px`, width, height, ...other.style}}
            >
                ⁇
            </span>
        );
    }

    const resolvedViewBox = viewBox ?? definition.viewBox;

    const Component = definition.mode === IconMode.Inline ? definition.component : undefined;

    return (
        <svg
            ref={ref}
            className={classnames(styles["icon"], className)}
            width={width}
            height={height}
            viewBox={resolvedViewBox}
            preserveAspectRatio={preserveAspectRatio}
            {...other}
        >
            {definition.mode === IconMode.Sprite && <use href={`#${name}`} />}
            {Component && (
                <Component
                    width="100%"
                    height="100%"
                    {...(resolvedViewBox === undefined ? {} : {viewBox: resolvedViewBox})}
                    {...(preserveAspectRatio === undefined ? {} : {preserveAspectRatio})}
                />
            )}
            {definition.mode === IconMode.Asset && (
                <image href={definition.src} width="100%" height="100%" preserveAspectRatio={preserveAspectRatio} />
            )}
        </svg>
    );
};

export default memo(forwardRef(Icon));
