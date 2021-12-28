import {MenuLayout} from "../lib/layout/menuLayout";
import {ReviewForm} from "./reviewPage";
import {WithEnvironment} from "../lib/withEnvironment";

export default () => WithEnvironment(() => {
    return <MenuLayout
        heading={'New Review'}
        Main={() => <ReviewForm/>}
    />;
});
