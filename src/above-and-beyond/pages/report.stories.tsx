import {Meta} from "@storybook/react";
import {WithFaker} from "./lib/sb/WithFaker";
import {ExportRatePage} from "./rate/exportRatePage";
import * as faker from "faker";
import {ExportReviewPage} from "./review/exportReviewPage";

export const ExportIssue = () => <ExportRatePage record={{
    id: faker.datatype.uuid(),
    value: 1000,
    result: faker.lorem.lines(3),
    type: 'issue',
    situation: faker.lorem.lines(3),
    date: faker.date.past(1),
    correction: faker.lorem.lines(3),
}}/>

export const ExportReview = () => <ExportReviewPage record={{
    id: faker.datatype.uuid(),
    adjustedSalary: 1000,
    outcome: faker.lorem.lines(3),
    date: faker.date.past(1),
    manager: `${faker.name.firstName()} ${faker.name.lastName()}`,
}}/>

export default {
    parameters: {
        viewport: {
            defaultViewport: "ipad",
        },
    },
    decorators: [WithFaker]
} as Meta
