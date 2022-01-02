import {MenuLayout} from "../lib/layout/menuLayout";
import {RateSuccessPage} from "./rateSuccessPage";
import {RateIssuePage} from "./rateIssuePage";
import {useRouter} from "../routes";
import {useEmployer} from "../home/useEmployer";
import {useRole} from "../home/useRole";
import {EmployerCollection} from "../lib/orm/docs";
import {LoaderCircle} from "../lib/loaderCircle";
import {Rate} from "../lib/orm/validate";
import {useAsync} from "../lib/hooks/useAsync";
import {FileType} from "../lib/upload";
import {useRoleFileUpload} from "../lib/storage/file";
import {WithEnvironment} from "../lib/withEnvironment";

export const ViewPage = () => {
    const {currentEmployerID} = useEmployer()
    const {currentRoleID} = useRole()
    const router = useRouter();
    const {id} = router["rate/view"].query();

    if (!id) {
        router.rate.push()
    }

    const storageRef = useRoleFileUpload('rate', id)

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

    return <MenuLayout
        heading={`Rating ${(result?.type === 'issue' ? ' - Issue' : result?.type === 'success' ? ' - Success' : '')}`}
        Main={() => {
            return (!result ? <LoaderCircle/> :
                    <>
                        {
                            result.type === 'issue' ?
                                <RateIssuePage data={result}/> :
                                <RateSuccessPage data={result}/>
                        }
                    </>
            )

        }}
    />;
};

export default () => WithEnvironment(ViewPage)
