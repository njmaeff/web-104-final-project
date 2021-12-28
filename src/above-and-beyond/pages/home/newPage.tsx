import {WithEnvironment} from "../lib/withEnvironment";
import {useRouter} from "../routes";
import React from "react";
import {MenuLayout} from "../lib/layout/menuLayout";
import {EmployerForm, RoleForm} from "./indexPage";
import {useEmployer} from "./useEmployer";
import {useRole} from "./useRole";

export default WithEnvironment(() => {

    const router = useRouter()
    const query = router['home/new'].query();
    const {updateEmployer} = useEmployer();
    const {updateRole} = useRole();

    let Component;
    switch (query.menu) {
        case "employer":
            Component = () => <EmployerForm onSubmit={(values) => {
                updateEmployer(values.id)
                router.home.push({
                    query: {
                        menu: "employer"
                    }
                })
            }}/>;
            break;
        case "role":
            Component = () => <RoleForm onSubmit={(values) => {
                updateRole(values.id)
                router.home.push({
                    query: {
                        menu: "role"
                    }
                })
            }}/>;
            break;
    }

    return (
        <MenuLayout
            heading={query.menu}
            Main={Component}
        />
    );


});
