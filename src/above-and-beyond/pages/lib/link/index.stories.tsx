import React from "react"
import {ButtonLink} from "./buttonLink";
import {Meta} from "@storybook/react";
import {WithCenter} from "../sb/withCenter";

export const Button = () => <ButtonLink>Link</ButtonLink>
export default {
    decorators: [WithCenter]
} as Meta
