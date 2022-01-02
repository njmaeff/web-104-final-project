import {MenuLayout} from "../lib/layout/menuLayout";
import {ReviewForm} from "./reviewPage";
import {useEmployer} from "../home/useEmployer";
import {useRole} from "../home/useRole";
import {useRouter} from "../routes";
import {EmployerCollection} from "../lib/orm/docs";
import {Review} from "../lib/orm/validate";
import {LoaderCircle} from "../lib/loaderCircle";
import {useRoleFileUpload} from "../lib/storage/file";
import {useAsync} from "../lib/hooks/useAsync";
import {FileType} from "../lib/upload";
import {WithEnvironment} from "../lib/withEnvironment";

export default () => WithEnvironment(() => {
    return <MenuLayout
        heading={'Review'}
        Main={() => {
            const {currentEmployerID} = useEmployer()
            const {currentRoleID} = useRole()

            const router = useRouter()
            const {id} = router["review/view"].query();
            if (!id) {
                router.review.push()
            }

            const storageRef = useRoleFileUpload('review', id)

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
                        .fromSubCollection<Review>('review')
                        .read(id)

                    return {
                        ...record,
                        uploads: items
                    }
                }, []
            );


            return (!result ? <LoaderCircle/> :
                    <ReviewForm data={result}/>
            )
        }}
    />;
});
