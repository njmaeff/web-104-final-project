import {Meta} from "@storybook/react"
import {Loader} from "./loader";
import {WithCenter} from "./sb/withCenter";

export const CircleLoader = () => <Loader/>

export default {
    decorators: [WithCenter]
} as Meta
