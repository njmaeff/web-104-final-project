import {MenuLayout} from "../lib/layout/menuLayout";
import {ReviewForm} from "./reviewPage";

export default () => {
    return <MenuLayout
        heading={'New Review'}
        Main={() => <ReviewForm/>}
    />;
};
