import {WithEnvironment} from "../lib/withEnvironment";
import {useRouter} from "../routes";
import React from "react";
import {MenuLayout} from "../lib/layout/menuLayout";
import {EmployerForm, RoleForm} from "./indexPage";
import {useEmployer} from "./useEmployer";
import {useRole} from "./useRole";
import capitalize from "lodash/capitalize";

export default () => WithEnvironment(() => {

    const router = useRouter()
    const query = router['home/new'].query();
    const {updateEmployer} = useEmployer();
    const {updateRole} = useRole();
    let Component = () => <div/>;
    switch (query.menu) {
        case "employer":
            Component = () => <EmployerForm onSubmit={(values) => {
                updateEmployer(values.id)
                return router.home.push({
                    query: {
                        menu: "employer"
                    }
                })
            }}/>;
            break;
        case "role":
            Component = () => <RoleForm onSubmit={(values) => {
                updateRole(values.id)
                return router.home.push({
                    query: {
                        menu: "role"
                    }
                })
            }}/>;
            break;
    }

    return (
        <MenuLayout
            heading={`New ${capitalize(query.menu)}`}
            Main={Component}
        />
    );


});
