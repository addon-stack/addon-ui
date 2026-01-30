import React, {FC, memo} from "react";

import {useLocale} from "adnbn/locale/react";

import {Root, SelectProps} from "@radix-ui/react-select";

import {useComponentProps} from "../../providers";

export {type SelectProps};

const Select: FC<SelectProps> = props => {
    const {...other} = {...useComponentProps("select"), ...props};

    const {dir} = useLocale();

    return <Root dir={dir} {...other} />;
};

export default memo(Select);
