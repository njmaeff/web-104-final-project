import {withServerSideProps} from "../lib/util/next";

export {ExportRolePage as default} from "./exportRolePage"
export const getServerSideProps = withServerSideProps(() => import("../lib/util/getRecordFromPath"));


