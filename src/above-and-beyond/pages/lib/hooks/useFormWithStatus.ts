import "react";
import * as formik from "formik";
import {isDateLike} from "../orm/docs";
import {useEffect} from "react";

export enum PageStatus {
    EDIT,
    VIEW,
    NEW,
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

    const isReadonly = form.status === PageStatus.VIEW;
    const isNew = form.status === PageStatus.NEW;
    const isEdit = form.status === PageStatus.EDIT || isNew;
    const isSubmitted = form.status === PageStatus.SUBMITTED;

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
    const setNew = () => form.setStatus(PageStatus.NEW);

    const fieldProps: { [P in keyof T]: { value; name } } = {} as any;

    for (const [key, value] of Object.entries(values)) {
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
            isSubmitting: form.isSubmitting,
            isSubmitted,
            setEdit,
            setView,
            setNew,
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

    const isEdit = mainFormControls.some((form) => form.isEdit || form.isNew)
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
