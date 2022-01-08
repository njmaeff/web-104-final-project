import {Meta} from "@storybook/react";
import {WithFaker} from "./lib/sb/withFaker";
import {ExportRatePage} from "./rate/exportRatePage";
import * as faker from "faker";
import {ExportReviewPage} from "./review/exportReviewPage";
import {ExportEmployerPage} from "./home/exportEmployerPage";
import {ExportRolePage} from "./home/exportRolePage";

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

export const ExportEmployer = () => <ExportEmployerPage record={{
    name: faker.company.companyName(),
    location: faker.address.streetAddress(true)
}}/>

export const ExportRole = () => <ExportRolePage record={{
    name: faker.name.jobTitle(),
    salary: 10000,
    salaryTarget: 15000,
    skillTarget: faker.lorem.lines(5),
    startDate: faker.date.past(1),
    responsibilities: [
        faker.lorem.lines(3),
        faker.lorem.lines(2),
    ].join("\n\n"),
}}/>

export default {
    parameters: {
        viewport: {
            defaultViewport: "ipad",
        },
    },
    decorators: [WithFaker]
} as Meta
