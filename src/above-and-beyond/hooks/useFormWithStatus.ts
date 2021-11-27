import "react";
import * as formik from "formik";
import { isDateLike } from "../orm/docs";

export enum PageStatus {
    EDIT,
    VIEW,
    NEW,
}

const validate = (values) => {
    // default check for empty values
    let errors = {};
    for (const [key, value] of Object.entries(values)) {
        if (!value) {
            errors[key] = true;
        }
    }

    return errors;
};

export const useFormWithStatus = <T = any>({
    onSubmit,
    ...config
}: formik.FormikConfig<T>) => {
    const form = formik.useFormik<T>({
        initialStatus: PageStatus.VIEW,
        initialErrors: validate(config.initialValues),
        validate,
        onSubmit: async (values, helpers) => {
            if (form.dirty) {
                await onSubmit(values, helpers);
            } else {
                setView();
            }
        },
        ...config,
    });
    const isReadonly = form.status === PageStatus.VIEW;
    const isNew = form.status === PageStatus.NEW;
    const isEdit = form.status === PageStatus.EDIT || isNew;

    const setEdit = () => form.setStatus(PageStatus.EDIT);
    const setView = () => form.setStatus(PageStatus.VIEW);
    const setNew = () => form.setStatus(PageStatus.NEW);

    const fieldProps: { [P in keyof T]: { value; name } } = {} as any;

    for (const [key, value] of Object.entries(config.initialValues)) {
        const props = form.getFieldProps(key);
        if (isDateLike(value)) {
            props.onChange = (date) => {
                form.setFieldValue(key, date);
            };
        }

        fieldProps[key] = {
            ...props,
            error: form.errors[key],
            touched: form.touched[key],
            readonly: isReadonly,
        };
    }

    return [
        form,
        {
            isReadonly,
            isEdit,
            isNew,
            setEdit,
            setView,
            setNew,
            fieldProps,
            mainProps: {
                isEdit,
                isNew,
                isReadonly,
                onClickEdit: setEdit,
                onClickSave: form.handleSubmit,
                isValid: form.isValid,
            },
        },
    ] as const;
};

export const mergeForms = <T extends ReturnType<typeof useFormWithStatus>[]>(
    ...forms: [...T]
) => {
    const mainForms = forms.map(([_, form]) => form.mainProps);
    const mainProps = {
        isEdit: mainForms.some((form) => form.isEdit || form.isNew),
        isValid: mainForms.every((form) => (form.isEdit ? form.isValid : true)),
        onClickEdit: () => mainForms.map((form) => form.onClickEdit()),
        onClickSave: (e) => {
            const run = async () => {
                const result = [];
                for (const form of mainForms) {
                    result.push(await form.onClickSave(e));
                }

                return result;
            };
            return run();
        },
    };
    return [mainProps, ...forms] as const;
};
