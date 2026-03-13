import React, {FC, memo} from "react";

import {PopoverProps, Root} from "@radix-ui/react-popover";

import {useComponentProps} from "../../providers";

export {type PopoverProps};

const Popover: FC<PopoverProps> = props => {
    const mergedProps = {...useComponentProps("popover"), ...props};

    return <Root {...mergedProps} />;
};

export default memo(Popover);
