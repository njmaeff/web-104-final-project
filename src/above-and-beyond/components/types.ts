import React from "react";

export type PageProps<Params = {}> = {
    params?: Params
};
export type Page<Params = {}> = React.FC<PageProps<Params>>;
