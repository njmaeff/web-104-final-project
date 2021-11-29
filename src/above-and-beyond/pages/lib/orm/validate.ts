import * as yup from "yup"
import {AnySchema} from "yup/lib/schema";
import Reference from "yup/lib/Reference";
import Lazy from "yup/lib/Lazy";
import type firebase from "firebase/compat";

export type ConvertToObjectShape<T> = {
    [P in keyof T]: AnySchema | Reference | Lazy<any, any>
}
export const makeSchema = <T = {}>(shape: ConvertToObjectShape<T>) => {
    return yup.object().shape<ConvertToObjectShape<T>>(shape)
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
    salary: string;
    salaryTarget: string;
    responsibilities: string;
    skillTarget: string;
}

export interface RateIssue extends Doc {
    type: "issue";
    date: DateLike;
    situation: string;
    value: string;
    result: string;
    correction: string;
}

export interface RateSuccess extends Doc {
    type: "success";
    date: DateLike;
    situation: string;
    value: string;
    result: string;
}

export interface Review extends Doc {
    date: DateLike;
    manager: string;
    outcome: string;
    adjustedSalary: string;
}

export type Rate = RateIssue | RateSuccess;

export const userSchema = makeSchema<User>({
    email: yup.string().email(),
    displayName: yup.string().required(),
})
export const employerSchema = makeSchema<Employer>({
    name: yup.string().required(),
    location: yup.string().required(),
})

export const roleSchema = makeSchema<Role>({
    name: yup.string().required(),
    responsibilities: yup.string().required(),
    salary: yup.number().required(),
    salaryTarget: yup.number().required(),
    skillTarget: yup.string().required(),
    startDate: yup.date().required()
})

export const reviewSchema = makeSchema<Review>({
    date: yup.date().required(),
    adjustedSalary: yup.number().required(),
    manager: yup.string().required(),
    outcome: yup.string().required(),
})

export const rateSuccessSchema = makeSchema<Omit<RateSuccess, "type">>({
    date: yup.date().required(),
    result: yup.string().required(),
    situation: yup.string().required(),
    value: yup.number().required(),
})
export const rateIssueSchema = makeSchema<Omit<RateIssue, "type">>({
    date: yup.date().required(),
    result: yup.string().required(),
    situation: yup.string().required(),
    correction: yup.string().required(),
    value: yup.number().required(),
})

export const validateDate = (date: DateLike) => {
    if (!yup.date().required().validateSync(date)) {
        return "Required";
    }
};
