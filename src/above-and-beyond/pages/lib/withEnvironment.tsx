import {RoleProvider} from "../employer/useRole";
import {EmployerProvider} from "../employer/useEmployer";
import React from "react";

export const WithEnvironment = (Component) => <EmployerProvider>
    <RoleProvider>
        <Component/>
    </RoleProvider>
</EmployerProvider>
