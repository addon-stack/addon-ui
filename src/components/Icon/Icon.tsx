import React, {type ComponentProps, forwardRef, type ForwardRefRenderFunction, memo, useEffect} from "react";

import classnames from "classnames";

import {useComponentProps, useIcons} from "../../providers";

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
        ...other
    } = {...useComponentProps("icon"), ...props};

    const {icons, registerIcon} = useIcons();

    useEffect(() => icons[name] && registerIcon(name), [name, icons, registerIcon]);

    if (!icons[name]) {
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

    return (
        <svg ref={ref} className={classnames(styles["icon"], className)} width={width} height={height} {...other}>
            <use href={`#${name}`} />
        </svg>
    );
};

export default memo(forwardRef(Icon));
