import React, {memo, ReactNode, forwardRef, ForwardRefRenderFunction} from "react";
import classnames from "classnames";
import {AvatarFallbackProps, AvatarImageProps, Fallback, Image, Root} from "@radix-ui/react-avatar";

import {useComponentProps} from "../../providers";

import {AvatarRadius, AvatarSize} from "./types";

import styles from "./avatar.module.scss?isolation";

export interface AvatarProps extends AvatarImageProps, Pick<AvatarFallbackProps, "delayMs"> {
    imageClassName?: string;
    size?: AvatarSize;
    radius?: AvatarRadius;
    fallback?: ReactNode;
    fallbackClassName?: string;
    cursorPointer?: boolean;
}

const Avatar: ForwardRefRenderFunction<HTMLSpanElement, AvatarProps> = (props, ref) => {
    const {
        size,
        radius,
        fallback,
        fallbackClassName,
        delayMs = 600,
        cursorPointer,
        imageClassName,
        className,
        ...other
    } = {...useComponentProps("avatar"), ...props};

    return (
        <Root
            ref={ref}
            className={classnames(
                styles["avatar"],
                {
                    [styles[`avatar--${size}-size`]]: size,
                    [styles[`avatar--${radius}-radius`]]: radius,
                    [styles[`avatar--cursor-pointer`]]: cursorPointer,
                },
                className
            )}
        >
            <Image className={classnames(styles["avatar-image"], imageClassName)} {...other} />
            {fallback && (
                <Fallback className={classnames(styles["avatar-fallback"], fallbackClassName)} delayMs={delayMs}>
                    {fallback}
                </Fallback>
            )}
        </Root>
    );
};

export default memo(forwardRef(Avatar));
