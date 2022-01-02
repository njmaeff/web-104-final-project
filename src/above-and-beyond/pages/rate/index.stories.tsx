import {Meta} from "@storybook/react";
import {WithFaker} from "../lib/sb/WithFaker";
import {ExportPage} from "./exportPage";
import * as faker from "faker";

export const ExportIssue = () => <ExportPage record={{
    id: faker.datatype.uuid(),
    value: 1000,
    result: faker.lorem.lines(3),
    type: 'issue',
    situation: faker.lorem.lines(3),
    date: faker.date.past(1),
    correction: faker.lorem.lines(3),
}}/>

export default {
    decorators: [WithFaker]
} as Meta
