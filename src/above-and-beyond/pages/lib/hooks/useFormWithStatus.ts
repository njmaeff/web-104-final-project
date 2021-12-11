import "react";
import * as formik from "formik";
import {isDateLike} from "../orm/docs";
import {useEffect} from "react";

export enum PageStatus {
    EDIT,
    VIEW,
    NEW,
}

export const useFormWithStatus = <T = any>({
                                               onSubmit,
                                               ...config
                                           }: formik.FormikConfig<T>) => {
    const form = formik.useFormik<T>({
        initialStatus: PageStatus.VIEW,
        onSubmit: async (values, helpers) => {
            if (form.dirty) {
                await onSubmit(values, helpers);
            } else {
                setView();
            }
        },
        ...config,
    });

    useEffect(() => {
        form.validateForm();
    }, [])

    const isReadonly = form.status === PageStatus.VIEW;
    const isNew = form.status === PageStatus.NEW;
    const isEdit = form.status === PageStatus.EDIT || isNew;

    const setEdit = () => form.setStatus(PageStatus.EDIT);
    const setView = () => form.setStatus(PageStatus.VIEW);
    const setNew = () => form.setStatus(PageStatus.NEW);

    const fieldProps: { [P in keyof T]: { value; name } } = {} as any;

    for (const [key, value] of Object.entries(config.initialValues)) {
        const props = form.getFieldProps(key);
        const meta = form.getFieldMeta(key);
        if (isDateLike(value)) {
            props.onChange = (date) => {
                form.setFieldValue(key, date);
            };
        }

        fieldProps[key] = {
            ...props,
            ...meta,
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
    const isEdit = mainForms.some((form) => form.isEdit || form.isNew)
    const isValid = mainForms.every((form) => (form.isEdit ? form.isValid : true))
    const onIsValid = (cb) => {
        useEffect(() => {
            if (isValid) {
                cb()
            }

        }, [isValid]);
    };


    const mainProps = {
        isEdit,
        isValid,
        onIsValid: onIsValid,
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
