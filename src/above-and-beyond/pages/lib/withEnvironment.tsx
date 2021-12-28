import {RoleProvider} from "../home/useRole";
import {EmployerProvider} from "../home/useEmployer";
import React from "react";

export const WithEnvironment = (Component) => <EmployerProvider>
    <RoleProvider>
        <Component/>
    </RoleProvider>
</EmployerProvider>
