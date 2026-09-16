import React from "react";

import {Tag, TagColor} from "addon-ui";

export default function LazyTag({className}: {className: string}) {
    return <Tag data-testid="lazy-tag" color={TagColor.Primary} className={className}>Loaded later</Tag>;
}
