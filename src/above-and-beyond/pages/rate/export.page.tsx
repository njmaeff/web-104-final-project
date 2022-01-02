import {withServerSideProps} from "../lib/util/next";

export {ExportPage as default} from "./exportPage"
export const getServerSideProps = withServerSideProps(() => import("./getRecordFromPath"));


