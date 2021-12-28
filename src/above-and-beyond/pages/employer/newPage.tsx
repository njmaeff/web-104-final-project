import {WithEnvironment} from "../lib/withEnvironment";
import {useRouter} from "../routes";

export default WithEnvironment(() => {

    const router = useRouter()["employer/new"]
    const query = router.query();


});
