import {Meta} from "@storybook/react"
import {LoaderCircle, LoaderCircleSmallRelative} from "./loaderCircle";
import {WithCenter} from "../sb/withCenter";

export const Circle = () => <LoaderCircle/>
export const CircleRelativeSmall = () => <LoaderCircleSmallRelative/>

export default {
    decorators: [WithCenter]
} as Meta
