import type {
    AvatarProps,
    ButtonProps,
    CheckboxProps,
    DialogProps,
    DrawerProps,
    FooterProps,
    HeaderProps,
    HighlightProps,
    IconButtonProps,
    IconProps,
    ListItemProps,
    ListProps,
    ModalProps,
    OdometerProps,
    PopoverAnchorProps,
    PopoverCloseProps,
    PopoverContentProps,
    PopoverProps,
    PopoverTriggerProps,
    ScrollAreaProps,
    SelectContentProps,
    SelectIconProps,
    SelectItemProps,
    SelectProps,
    SelectTriggerProps,
    SelectValueProps,
    SwitchProps,
    TabsContentProps,
    TabsListProps,
    TabsProps,
    TabsTriggerProps,
    TagProps,
    TextAreaProps,
    TextFieldProps,
    ToastProps,
    ToggleGroupItemProps,
    ToggleGroupProps,
    TooltipProps,
    TruncateListProps,
    TruncateProps,
    ViewDrawerProps,
    ViewModalProps,
    ViewProps,
} from "../components";

export interface ComponentsProps {
    avatar?: Pick<AvatarProps, "size" | "radius" | "cursorPointer" | "delayMs">;
    button?: Pick<ButtonProps, "variant" | "color" | "size" | "radius">;
    checkbox?: Pick<CheckboxProps, "variant" | "size" | "radius" | "checkedIcon" | "indeterminateIcon">;
    dialog?: DialogProps;
    drawer?: DrawerProps;
    footer?: FooterProps;
    header?: Pick<HeaderProps, "alignCenter" | "before" | "after">;
    highlight?: Omit<HighlightProps, "textToHighlight">;
    icon?: Omit<IconProps, "name">;
    iconButton?: Pick<IconButtonProps, "variant" | "size" | "radius">;
    list?: ListProps;
    listItem?: ListItemProps;
    modal?: ModalProps;
    odometer?: Pick<OdometerProps, "auto" | "format" | "duration">;
    popover?: PopoverProps;
    popoverClose?: PopoverCloseProps;
    popoverAnchor?: PopoverAnchorProps;
    popoverTrigger?: PopoverTriggerProps;
    popoverContent?: PopoverContentProps;
    scrollArea?: ScrollAreaProps;
    select?: SelectProps;
    selectItem?: SelectItemProps;
    selectIcon?: SelectIconProps;
    selectValue?: SelectValueProps;
    selectContent?: SelectContentProps;
    selectTrigger?: SelectTriggerProps;
    switch?: SwitchProps;
    tabs?: TabsProps;
    tabsContent?: TabsContentProps;
    tabsList?: TabsListProps;
    tabsTrigger?: TabsTriggerProps;
    tag?: Pick<TagProps, "variant" | "size" | "color" | "radius" | "clickable">;
    textArea?: TextAreaProps;
    textField?: TextFieldProps;
    toast?: Pick<
        ToastProps,
        | "side"
        | "duration"
        | "swipeDirection"
        | "swipeThreshold"
        | "closeProps"
        | "closeIcon"
        | "fullWidth"
        | "sticky"
        | "radius"
        | "color"
    >;
    toggleGroup?: Omit<ToggleGroupProps, "type" | "value" | "defaultValue" | "onValueChange">;
    toggleGroupItem?: Omit<ToggleGroupItemProps, "value">;
    tooltip?: Omit<TooltipProps, "content">;
    truncate?: TruncateProps;
    truncateList?: TruncateListProps;
    view?: ViewProps;
    viewDrawer?: ViewDrawerProps;
    viewModal?: ViewModalProps;
}
