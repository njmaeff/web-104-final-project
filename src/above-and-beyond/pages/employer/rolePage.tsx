import {MenuLayout} from "../lib/layout/menuLayout";
import {RoleDropDown} from "../lib/control";
import React from "react";
import {useRole} from "./useRole";
import {FormTable} from "../lib/input";

export default () => {

    return (
        <MenuLayout
            heading={"Role"}
            HeaderDropDown={() => {
                const {isLoading} = useRole()
                return !isLoading && <RoleDropDown/>
            }}
            Main={() => {
                const {isLoading} = useRole()

                return !isLoading &&
                    <FormTable>

                    </FormTable>
            }}
        />
    );
};
