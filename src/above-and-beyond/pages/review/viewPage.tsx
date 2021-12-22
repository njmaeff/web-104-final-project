import {MenuTemplate} from "../lib/menuTemplate";
import {ReviewForm} from "./reviewPage";
import {useEmployer} from "../employer/useEmployer";
import {useRole} from "../employer/useRole";
import {useRouter} from "../routes";
import {EmployerCollection} from "../lib/orm/docs";
import {Review} from "../lib/orm/validate";
import {Loader} from "../lib/loader";

export default () => {
    return <MenuTemplate
        heading={'View Rating'}
        Main={() => {
            const {currentEmployerID} = useEmployer()
            const {currentRoleID} = useRole()

            const router = useRouter()
            const {id} = router["review/view"].query();
            if (!id) {
                router.review.push()
            }
            
            const {result} = EmployerCollection
                .fromID(currentEmployerID)
                .roles
                .withID(currentRoleID)
                .fromSubCollection<Review>('review')
                .useRead(id)

            return (!result ? <Loader/> :
                    <ReviewForm data={result}/>
            )
        }}
    />;
};
