import React from "react";
import {
    FieldDateTimePickerRow,
    FieldInputRow,
    FieldTable,
    TextInput,
} from "./input";
import { MenuTemplate } from "./page";
import { PageProps } from "./types";
import { PageStatus, useFormWithStatus } from "../../hooks/useFormWithStatus";
import { EmployerCollection, RateIssue, RateSuccess } from "../../orm/docs";
import { Link } from "./link";
import { usePageCtx } from "../../hooks/usePageCtx";

export const RateSuccessPage: React.FC = () => {
    const { currentEmployerID, currentEmployer, allEmployers } = usePageCtx();
    const [formik, {
        fieldProps,
        mainProps
    }] = useFormWithStatus<Partial<RateSuccess>>({
        initialValues: {
            date: new Date(),
            value: "",
            situation: "",
            result: "",
        },
        initialStatus: PageStatus.EDIT,
        onSubmit: async (values) => {
            await EmployerCollection.fromID(currentEmployerID)
                .roles.withID(currentEmployerID)
                .fromSubCollection("rate")
                .write({
                    ...values,
                    type: "success",
                });
            formik.resetForm({
                values: formik.initialValues,
            });
        },
    });
    return (
        <RateYourselfTemplate
            success={true}
            currentEmployer={currentEmployer}
            allEmployers={allEmployers}
            menuProps={mainProps}
            heading={"Rate - Success"}
        >
            <FieldTable>
                <FieldDateTimePickerRow heading={"Date"} {...fieldProps.date} />
                <FieldInputRow
                    heading={"Estimated Value"}
                    {...fieldProps.value}
                />
            </FieldTable>
            <TextInput heading={"Situation"} {...fieldProps.situation} />
            <TextInput heading={"Result"} {...fieldProps.result} />
        </RateYourselfTemplate>
    );
};
export const RateIssuePage: React.FC<PageProps> = () => {
    const { currentEmployerID, currentEmployer, allEmployers } = usePageCtx();

    const [formik, {
        fieldProps,
        mainProps
    }] = useFormWithStatus<Partial<RateIssue>>({
        initialValues: {
            date: new Date(),
            value: "",
            situation: "",
            result: "",
            correction: "",
        },
        initialStatus: PageStatus.EDIT,
        onSubmit: async (values) => {
            await EmployerCollection.fromID(currentEmployerID)
                .roles.withID(currentEmployerID)
                .fromSubCollection("rate")
                .write({
                    ...values,
                    type: "issue",
                });
            formik.resetForm({
                values: formik.initialValues,
            });
        },
    });

    return (
        <RateYourselfTemplate
            currentEmployer={currentEmployer}
            allEmployers={allEmployers}
            issue={true}
            menuProps={mainProps}
            heading={"Rate - Issue"}
        >
            <FieldTable>
                <FieldDateTimePickerRow heading={"Date"} {...fieldProps.date} />
                <FieldInputRow
                    heading={"Estimated Value"}
                    {...fieldProps.value}
                />
            </FieldTable>
            <TextInput heading={"Situation"} {...fieldProps.situation} />
            <TextInput heading={"Result"} {...fieldProps.result} />
            <TextInput heading={"Correction"} {...fieldProps.correction} />
        </RateYourselfTemplate>
    );
};
export const RateYourselfTemplate: React.FC<{
    success?: boolean;
    issue?: boolean;
    menuProps;
    heading: string;
    currentEmployer;
    allEmployers;
}> = ({
          currentEmployer,
          allEmployers,
          children,
          issue,
          success,
          menuProps,
          heading,
      }) => {
    return (
        <MenuTemplate
            currentEmployer={currentEmployer}
            heading={heading}
            allEmployers={allEmployers}
            {...menuProps}
        >
            <div className={"page-rate-control"}>
                {children}
                <nav>
                    <Link
                        href={"/rate/success"}
                        className={`icon-award ${
                            success ? "icon-highlight__primary" : ""
                        }`}
                    />
                    <Link
                        href={"/rate/issue"}
                        className={`icon-issue ${
                            issue ? "icon-highlight__primary" : ""
                        }`}
                    />
                </nav>
            </div>
        </MenuTemplate>
    );
};
