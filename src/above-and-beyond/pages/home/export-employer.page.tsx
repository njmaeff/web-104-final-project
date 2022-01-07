import {withServerSideProps} from "../lib/util/next";

export {ExportEmployerPage as default} from "./exportEmployerPage"
export const getServerSideProps = withServerSideProps(() => import("../lib/util/getRecordFromPath"));


