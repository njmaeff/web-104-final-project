import React from "react"
import {WithoutSSRAppLayout} from "./lib/layout/appLayout";

export default WithoutSSRAppLayout(() => import("./loginPage"))
