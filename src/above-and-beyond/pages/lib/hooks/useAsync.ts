import { useEffect, useState } from "react";
import { PromiseValue } from "type-fest";

export const useAsync = <
    Result = any,
    FN extends (prev: Result) => Promise<Result> = (
        prev: Result
    ) => Promise<Result>
>(
    fn: FN,
    { init = null, deps = undefined } = {} as {
        init?: PromiseValue<ReturnType<FN>>;
        deps?;
    }
) => {
    const [data, update] = useState<PromiseValue<ReturnType<FN>>>(init);
    const [loaded, load] = useState(false);

    useEffect(() => {
        load(false);
        Promise.resolve(fn(data as any)).then((result) => {
            if (result) {
                update(result as any);
            }
            load(true);
        });
    }, deps);

    return [data, { loaded }] as const;
};
