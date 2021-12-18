import {MenuTemplate} from "../lib/menuTemplate";
import {useRouter} from "../routes";
import {RateSuccessPage} from "./rateSuccessPage";
import {RateIssuePage} from "./rateIssuePage";

export const NewPageForm = () => {

    const router = useRouter();
    const {type} = router["rate/new"].query()
    const isSuccess = type === 'success'
    const isIssue = type === 'issue'

    return (
        isIssue ? <RateIssuePage/> : <RateSuccessPage/>
    )

};

export const NewPage = () => {
    return <MenuTemplate
        heading={'New Rating'}
        Main={NewPageForm}
    />;
};

export default NewPage
