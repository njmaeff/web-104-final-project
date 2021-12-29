import {useEffect, useState} from "react";


export enum AsyncStates {
    Init,
    Loading,
    Success,
    Error,
}


export interface AsyncHelpers {
    isInit: boolean;
    isLoading: boolean;
    isInProgress: boolean;
    isSuccess: boolean;
    isError: boolean;
}

export type AsyncState<Result = any, Error = any> = {
    result: Result,
    error?: Error,
    status: AsyncStates,
    onSuccess?: (cb: (result: Result) => void) => void
};

export class AsyncHook<Result = any, Error = any> {

    refresh = () => {
        this.action()
    };

    constructor(
        fn: () => Promise<Result>,
        params?: any[],
        {initialState = null} = {}) {

        const [state, updateState] = useState<AsyncState<Result, Error>>({
            result: initialState,
            status: AsyncStates.Init
        });

        const action = () => fn()
            .then((result) => updateState(state => ({
                ...state,
                result,
                status: AsyncStates.Success
            })))
            .catch((error) => updateState(state => ({
                ...state,
                error,
                status: AsyncStates.Error
            })))


        useEffect(() => {
            updateState(state => ({...state, status: AsyncStates.Loading}))
            action()
        }, params)

        this.action = action
        this.error = state.error
        this.result = state.result
        this.status = state.status

    }

    get isInit() {
        return this.status === AsyncStates.Init
    }

    get isLoading() {
        return this.status === AsyncStates.Loading
    }

    get isInProgress() {
        return this.isInit || this.isLoading;
    }

    get isSuccess() {
        return this.status === AsyncStates.Success
    }

    get isError() {
        return this.status === AsyncStates.Error
    }

    result: Result
    error?: Error
    status: AsyncStates
    private readonly action: () => Promise<void>


}

export type UseAsyncReturn<Result = any, Error = any> =
    AsyncState<Result, Error>
    & AsyncHelpers

export const useAsync = <Result = any, Error = any>(
    fn: () => Promise<Result>,
    params?: any[],
    {initialState = null} = {}): UseAsyncReturn<Result, Error> => {

    const [state, updateState] = useState<AsyncState<Result, Error>>({
        result: initialState,
        status: AsyncStates.Init
    });

    const action = () => fn()
        .then((result) => updateState(state => ({
            ...state,
            result,
            status: AsyncStates.Success
        })))
        .catch((error) => updateState(state => ({
            ...state,
            error,
            status: AsyncStates.Error
        })))

    useEffect(() => {
        action()
        updateState(state => ({...state, status: AsyncStates.Loading}))
    }, params)

    const isInit = state.status === AsyncStates.Init
    const isLoading = state.status === AsyncStates.Loading
    const isInProgress = isInit || isLoading;
    const isSuccess = state.status === AsyncStates.Success
    const isError = state.status === AsyncStates.Error

    const onSuccess = (cb: (result: Result) => void) => {
        useEffect(() => {
            if (isSuccess) {
                cb(state.result);
            }
        }, [isSuccess])
    };


    return {
        ...state,
        isInit,
        isLoading,
        isSuccess,
        isError,
        isInProgress,
        onSuccess,
    }
};

