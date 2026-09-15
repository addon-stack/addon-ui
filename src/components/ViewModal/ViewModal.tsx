import React, {type FC, memo} from "react";

import {useComponentProps} from "../../providers";
import {splitProps} from "../../utils";
import {Modal, type ModalProps, ModalPropsKeys} from "../Modal";
import {View, type ViewProps, ViewPropsKeys} from "../View";

export type ViewModalProps = Omit<ModalProps, "title"> & ViewProps;

const ViewModal: FC<ViewModalProps> = props => {
    const config = useComponentProps("viewModal");
    const {container = config?.container, ...other} = {...config, ...props};

    const modalProps = splitProps<ModalProps>(other, ModalPropsKeys);
    const viewProps = splitProps<ViewProps>(other, ViewPropsKeys);

    return (
        <Modal {...modalProps} container={container}>
            <View {...viewProps} />
        </Modal>
    );
};

export default memo(ViewModal);
