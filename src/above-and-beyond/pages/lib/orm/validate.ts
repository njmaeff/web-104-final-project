import * as yup from "yup"
import {AnySchema} from "yup/lib/schema";
import Reference from "yup/lib/Reference";
import Lazy from "yup/lib/Lazy";
import type firebase from "firebase/compat";
import {ensureDate} from "./docs";

export type ConvertToObjectShape<T> = {
    [P in keyof T]: AnySchema | Reference | Lazy<any, any>
}
export const makeSchema = <T = {}>(shape: ConvertToObjectShape<T>, defaults?: T) => {
    return yup.object().shape<ConvertToObjectShape<T>>(shape).default(defaults ?? {})
};

export type DateLike = firebase.firestore.Timestamp | Date;

export interface Doc {
    id?: string;
}

export type User = Pick<firebase.auth.UserCredential["user"],
    "displayName" | "email">;

export interface Employer extends Doc {
    name: string;
    location?: string;
}

export interface Role extends Doc {
    name: string;
    startDate: DateLike;
    salary: number;
    salaryTarget: number;
    responsibilities: string;
    skillTarget: string;
}

export interface RateIssue extends Doc {
    type: "issue";
    date: DateLike;
    situation: string;
    value: number;
    result: string;
    correction: string;
}

export interface RateSuccess extends Doc {
    type: "success";
    date: DateLike;
    situation: string;
    value: number;
    result: string;
}

export interface Review extends Doc {
    date: DateLike;
    manager: string;
    outcome: string;
    adjustedSalary: number;
}

export type Rate = RateIssue | RateSuccess;

export type Uploads = {
    uploads?: any[]
}

const dateValidator = yup.mixed().transform((current) => ensureDate(current)).required()

export const userSchema = makeSchema<User>({
    email: yup.string().email(),
    displayName: yup.string().required(),
})
export const employerSchema = makeSchema<Employer>({
    name: yup.string().required(),
    location: yup.string().required(),
}, {
    name: "",
    location: ""
})

export const roleSchema = makeSchema<Role>({
    name: yup.string().required(),
    responsibilities: yup.string().required(),
    salary: yup.number().required(),
    salaryTarget: yup.number().required(),
    skillTarget: yup.string().required(),
    startDate: dateValidator
}, {
    name: "",
    salary: 0,
    salaryTarget: 0,
    skillTarget: "",
    responsibilities: "",
    startDate: new Date()
})

export const reviewSchema = makeSchema<Review>({
    date: dateValidator,
    adjustedSalary: yup.number().required(),
    manager: yup.string().required(),
    outcome: yup.string().required(),
}, {
    date: new Date(),
    adjustedSalary: 0,
    manager: "",
    outcome: ""
})

export const rateSuccessSchema = makeSchema<Omit<RateSuccess, "type"> & Uploads>({
    date: dateValidator,
    result: yup.string().required(),
    situation: yup.string().required(),
    value: yup.number().required(),
    uploads: yup.array().optional(),
}, {
    date: new Date(),
    result: "",
    value: 0,
    situation: "",
    uploads: []
})
export const rateIssueSchema = makeSchema<Omit<RateIssue, "type"> & Uploads>({
    date: dateValidator,
    result: yup.string().required(),
    situation: yup.string().required(),
    correction: yup.string().required(),
    value: yup.number().required(),
}, {
    date: new Date(),
    result: "",
    value: 0,
    correction: "",
    situation: ""
})
