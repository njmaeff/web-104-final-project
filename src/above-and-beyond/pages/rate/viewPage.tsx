import {MenuLayout} from "../lib/layout/menuLayout";
import {RateSuccessPage} from "./rateSuccessPage";
import {RateIssuePage} from "./rateIssuePage";
import {useRouter} from "../routes";
import {useEmployer} from "../home/useEmployer";
import {useRole} from "../home/useRole";
import {EmployerCollection} from "../lib/orm/docs";
import {Loader} from "../lib/loader";
import {Rate} from "../lib/orm/validate";
import {useAsync} from "../lib/hooks/useAsync";
import {FileType} from "../lib/upload";
import {useFileUpload} from "../lib/storage/file";
import capitalize from "lodash/capitalize";
import {css} from "@emotion/react";
import {SectionSize} from "../lib/styles/size";

export const NewPage = () => {
    return <MenuLayout
        heading={'Rating'}
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
                    <>
                        <h2 css={
                            theme => css`
                                ${SectionSize};
                                margin-top: 0;
                                color: ${theme.colors.gray};
                            `
                        }>{capitalize(result.type)}</h2>
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

export default NewPage
