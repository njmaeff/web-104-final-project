import {MenuTemplate} from "../lib/menuTemplate";
import {RateSuccessPage} from "./rateSuccessPage";
import {RateIssuePage} from "./rateIssuePage";
import {useRouter} from "../routes";
import {useEmployer} from "../employer/useEmployer";
import {useRole} from "../employer/useRole";
import {EmployerCollection} from "../lib/orm/docs";
import {Loader} from "../lib/loader";
import {Rate} from "../lib/orm/validate";

export const NewPage = () => {
    return <MenuTemplate
        heading={'View Rating'}
        Main={() => {
            const {currentEmployerID} = useEmployer()
            const {currentRoleID} = useRole()
            const router = useRouter();
            const {id} = router["rate/view"].query();

            if (!id) {
                router.rate.push()
            }

            const {result} = EmployerCollection
                .fromID(currentEmployerID)
                .roles
                .withID(currentRoleID)
                .fromSubCollection<Rate>('rate')
                .useRead(id);

            return (!result ? <Loader/> :
                    result.type === 'issue' ?
                        <RateIssuePage data={result}/> :
                        <RateSuccessPage data={result}/>
            )

        }}
    />;
};

export default NewPage
