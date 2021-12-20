import {MenuTemplate} from "../lib/menuTemplate";
import {ReviewForm} from "./reviewPage";
import {useEmployer} from "../employer/useEmployer";
import {useRole} from "../employer/useRole";
import {useRouter} from "../routes";
import {EmployerCollection} from "../lib/orm/docs";
import {Rate, Review} from "../lib/orm/validate";
import {Loader} from "../lib/loader";

export default () => {
    return <MenuTemplate
        heading={'View Rating'}
        Main={() => {
            const {currentEmployerID} = useEmployer()
            const {currentRoleID} = useRole()

            const {id} = useRouter()["rate/view"].query();
            const {result} = EmployerCollection
                .fromID(currentEmployerID)
                .roles
                .withID(currentRoleID)
                .fromSubCollection<Review>('review')
                .useRead(id)

            return (
                <>
                    {
                        !result ? <Loader/> :
                            <ReviewForm data={result}/>
                    }
                </>
            )
        }}
    />;
};
