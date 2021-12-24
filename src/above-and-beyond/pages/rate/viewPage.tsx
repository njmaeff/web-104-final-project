import {MenuTemplate} from "../lib/menuTemplate";
import {RateSuccessPage} from "./rateSuccessPage";
import {RateIssuePage} from "./rateIssuePage";
import {useRouter} from "../routes";
import {useEmployer} from "../employer/useEmployer";
import {useRole} from "../employer/useRole";
import {EmployerCollection} from "../lib/orm/docs";
import {Loader} from "../lib/loader";
import {Rate} from "../lib/orm/validate";
import {useAsync} from "../lib/hooks/useAsync";
import {FileType} from "../lib/upload";
import {useFileUpload} from "../lib/storage/file";

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

            const storageRef = useFileUpload('rate', id)

            const {result} = useAsync(async () => {
                    const files = await storageRef.listAll();
                    const items = []
                    for (const file of files.items) {
                        const meta = await file.getMetadata()
                        items.push({
                            url: await file.getDownloadURL(),
                            name: file.name,
                            status: 'done',
                            uid: file.fullPath,
                            size: meta.size,
                            type: meta.contentType
                        } as FileType)
                    }

                    const record = await EmployerCollection
                        .fromID(currentEmployerID)
                        .roles
                        .withID(currentRoleID)
                        .fromSubCollection<Rate>('rate')
                        .read(id)

                    return {
                        ...record,
                        uploads: items
                    }
                }, []
            );

            return (!result ? <Loader/> :
                    result.type === 'issue' ?
                        <RateIssuePage data={result}/> :
                        <RateSuccessPage data={result}/>
            )

        }}
    />;
};

export default NewPage
