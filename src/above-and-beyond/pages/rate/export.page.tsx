import {withServerSideProps} from "../lib/util/next";

export {ExportRatePage as default} from "./exportRatePage"
export const getServerSideProps = withServerSideProps(() => import("../lib/util/getRecordFromPath"));


