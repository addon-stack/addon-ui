import React, {FC, memo} from "react";

import {splitProps} from "../../utils";
import {useComponentProps} from "../../providers";

import {Drawer, DrawerProps, DrawerPropsKeys} from "../Drawer";
import {View, ViewProps, ViewPropsKeys} from "../View";

export type ViewDrawerProps = Omit<DrawerProps, "title"> & ViewProps;

const ViewDrawer: FC<ViewDrawerProps> = props => {
    const config = useComponentProps("viewDrawer");
    const {container = config?.container, ...other} = {...config, ...props};

    const drawerProps = splitProps<DrawerProps>(other, DrawerPropsKeys);
    const viewProps = splitProps<ViewProps>(other, ViewPropsKeys);

    return (
        <Drawer {...drawerProps} container={container}>
            <View {...viewProps} />
        </Drawer>
    );
};

export default memo(ViewDrawer);
