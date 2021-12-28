import "react";
import * as formik from "formik";
import {isDateLike} from "../orm/docs";
import {useEffect} from "react";

export enum PageStatus {
    EDIT,
    VIEW,
    SUBMITTED,
}

export const useFormWithStatus = <T = any>({
                                               onSubmit,
                                               initialValues,
                                               validationSchema,
                                               ...config
                                           }: formik.FormikConfig<T>) => {

    const makeValues = (values): typeof initialValues => {
        return values ? validationSchema.cast(values) : {
            ...validationSchema
                .default()
        }
    };
    const values = makeValues(initialValues)

    const form = formik.useFormik<T>({
        initialStatus: PageStatus.VIEW,
        onSubmit: async (values, helpers) => {
            if (form.dirty) {
                await onSubmit(values, helpers);
            } else {
                helpers.setStatus(PageStatus.VIEW);
            }
        },
        initialValues: values,
        validationSchema,
        ...config,
    });

    const reset = form.resetForm
    form.resetForm = ({values, ...props}) => {
        reset({values: makeValues(values), ...props})
    }

    const isSubmitted = form.status === PageStatus.SUBMITTED;
    const isReadonly = form.status === PageStatus.VIEW || isSubmitted;
    const isEdit = form.status === PageStatus.EDIT;

    const useSubmitSuccess = (fn: (values: T) => any | Promise<any>) => {
        useEffect(() => {
            if (isSubmitted) {
                fn(form.values);
            }
        }, [isSubmitted]);
    };

    const setEdit = () => form.setStatus(PageStatus.EDIT);
    const setView = () => form.setStatus(PageStatus.VIEW);
    const setSubmitted = () => form.setStatus(PageStatus.SUBMITTED);

    const fieldProps: { [P in keyof T]: { value; name } } = {} as any;

    for (const [key, value] of Object.entries(values)) {
        const props = form.getFieldProps(key);
        const meta = form.getFieldMeta(key);
        if (isDateLike(value) || Array.isArray(value)) {
            props.onChange = (value) => {
                form.setFieldValue(key, value);
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
            isSubmitting: form.isSubmitting,
            isSubmitted,
            setEdit,
            setView,
            setSubmitted,
            fieldProps,
            onClickEdit: setEdit,
            onClickSave: form.submitForm,
            useSubmitSuccess,
            isValid: form.isValid,
        },
    ] as const;
};

export const mergeForms = <T extends ReturnType<typeof useFormWithStatus>[]>(
    ...forms: [...T]
) => {
    const mainFormControls = forms.map(([_, form]) => form)

    const isEdit = mainFormControls.some((form) => form.isEdit)
    const isValid = mainFormControls.every((form) => (form.isEdit ? form.isValid : true))

    const setEdit = () => mainFormControls.forEach(form => form.setEdit());
    const setView = () => mainFormControls.forEach(form => form.setView());

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
        setEdit,
        setView,
        onIsValid: onIsValid,
        onClickEdit: () => mainFormControls.map((form) => form.onClickEdit()),
        onClickSave: (e) => {
            const run = async () => {
                const result = [];
                for (const form of mainFormControls) {
                    result.push(await form.onClickSave(e));
                }

                return result;
            };
            return run();
        },
    };

    return [mainProps, ...forms] as const;
};
