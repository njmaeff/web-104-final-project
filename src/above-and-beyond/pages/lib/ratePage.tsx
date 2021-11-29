import React from "react";
import {
    FieldDateTimePickerRow,
    FieldInputRow,
    FieldTable,
    TextInput,
} from "./input";
import {MenuTemplate} from "./page";
import {PageProps} from "./types";
import {PageStatus, useFormWithStatus} from "./hooks/useFormWithStatus";
import {EmployerCollection} from "./orm/docs";
import {usePageCtx} from "./hooks/usePageCtx";
import {
    RateIssue,
    rateIssueSchema,
    RateSuccess,
    rateSuccessSchema
} from "./orm/validate";
import {Highlight} from "./styles/mixins";
import Link from "next/link";
import styled from "@emotion/styled";

export const RateSuccessPage: React.FC = () => {
    const {currentEmployerID, currentEmployer, allEmployers} = usePageCtx();
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
        validationSchema: rateSuccessSchema,
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
                <FieldDateTimePickerRow label={"Date"} {...fieldProps.date} />
                <FieldInputRow
                    label={"Estimated Value"}
                    {...fieldProps.value}
                />
            </FieldTable>
            <TextInput label={"Situation"} {...fieldProps.situation} />
            <TextInput label={"Result"} {...fieldProps.result} />
        </RateYourselfTemplate>
    );
};
export const RateIssuePage: React.FC<PageProps> = () => {
    const {currentEmployerID, currentEmployer, allEmployers} = usePageCtx();

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
        validationSchema: rateIssueSchema,
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
                <FieldDateTimePickerRow label={"Date"} {...fieldProps.date} />
                <FieldInputRow
                    label={"Estimated Value"}
                    {...fieldProps.value}
                />
            </FieldTable>
            <TextInput label={"Situation"} {...fieldProps.situation} />
            <TextInput label={"Result"} {...fieldProps.result} />
            <TextInput label={"Correction"} {...fieldProps.correction} />
        </RateYourselfTemplate>
    );
};

export const RatePage = styled.div`
    nav {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: center;
        margin: 0 auto;

        a {
            font-size: 3rem;
        }
    }
`
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
            <RatePage>
                {children}
                <nav>
                    <Link
                        href={"/rate-success"}
                    ><a css={theme => success && Highlight(theme.colors.primary)}
                        className={'icon-award'}/></Link>
                    <Link
                        href={"/rate-issue"}
                    ><a css={theme => issue && Highlight(theme.colors.primary)}
                        className={'icon-issue'}/></Link>
                </nav>
            </RatePage>
        </MenuTemplate>
    );
};
