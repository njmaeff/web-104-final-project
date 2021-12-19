import {MenuTemplate} from "../lib/menuTemplate";
import {RateSuccessPage} from "./rateSuccessPage";
import {RateIssuePage} from "./rateIssuePage";
import {useRouter} from "../routes";
import {useEmployer} from "../employer/useEmployer";
import {useRole} from "../employer/useRole";
import {EmployerCollection} from "../lib/orm/docs";
import {Loader} from "../lib/loader";
import {Rate} from "../lib/orm/validate";

export const PageForm = () => {

    const {currentEmployerID} = useEmployer()
    const {currentRoleID} = useRole()

    const {id} = useRouter()["rate/view"].query();
    const {result} = EmployerCollection
        .fromID(currentEmployerID)
        .roles
        .withID(currentRoleID)
        .fromSubCollection<Rate>('rate')
        .useRead(id)

    return (
        <>
            {
                !result ? <Loader/> :
                    result.type === 'issue' ?
                        <RateIssuePage data={result}/> :
                        <RateSuccessPage data={result}/>
            }
        </>
    )

};

export const NewPage = () => {
    return <MenuTemplate
        heading={'View Rating'}
        Main={PageForm}
    />;
};

export default NewPage
