import React from "react";
import {Typography} from "antd"

export const TextHeading: typeof Typography.Title = React.forwardRef((props) => {
    return <Typography.Title level={1} {...props}/>
});

export const TextTitle: typeof Typography.Title = React.forwardRef((props) => {
    return <Typography.Title level={2} {...props}/>
});
export const TextSubTitle: typeof Typography.Title = React.forwardRef((props) => {

    return <Typography.Title level={3} {...props}/>
});

export const TextSection: typeof Typography.Title = React.forwardRef((props) => {

    return <Typography.Title level={4} {...props}/>
});

export const TextParagraph: typeof Typography.Paragraph = React.forwardRef((props) => {
    return <Typography.Paragraph {...props}/>
});
