import {withServerSideProps} from "../lib/util/next";

export {ExportReviewPage as default} from "./exportReviewPage"
export const getServerSideProps = withServerSideProps(() => import("../lib/util/getRecordFromPath"));


