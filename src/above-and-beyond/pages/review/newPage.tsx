import {MenuTemplate} from "../lib/menuTemplate";
import {ReviewForm} from "./reviewPage";

export default () => {
    return <MenuTemplate
        heading={'New Review'}
        Main={() => <ReviewForm/>}
    />;
};
