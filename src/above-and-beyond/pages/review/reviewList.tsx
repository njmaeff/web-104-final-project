import {SearchInterface} from "../lib/input/instantSearch";
import {MenuLayout} from "../lib/layout/menuLayout";
import React from "react";
import {Button, List} from "antd";
import {PlusCircleOutlined, StarOutlined} from "@ant-design/icons";
import {useRouter} from "../routes";
import {Highlight} from "react-instantsearch-dom";
import {css} from "@emotion/react";
import {RoleDropDown} from "../lib/input/control";
import {useRole} from "../home/useRole";
import {AbsoluteButton} from "../lib/button/absoluteFeatureButton";
import {Review} from "../lib/orm/validate";
import {formatCurrency} from "../lib/util/currency";
import {WithEnvironment} from "../lib/hooks/withEnvironment";
import {LoaderCircleSmallRelative} from "../lib/feedback/loaderCircle";
import {getTimezone, Timestamp} from "../lib/util/date";
import {ExportButtonSmall, RemoveButtonSmall} from "../lib/button/actionButton";
import {client} from "../lib/hooks/useHttpClient";
import {auth, storage} from "../lib/firebase/connect-api";
import {ExportBody} from "../api/export/types";
import {RoleHook} from "../lib/orm/docs";
import {useRoleFileUpload} from "../lib/storage/file";

export const ReviewListHits: React.FC<{ hits }> = ({hits}) => {
    const routes = useRouter();
    const role = new RoleHook();
    const storageRef = useRoleFileUpload('review')

    return hits.map((item: Review) => {
        return <List.Item
            key={item.id}
            css={
                css`
                    li, p {
                        margin: 0;
                        background-color: transparent;
                    }

                    .ant-list-item-action {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        align-self: flex-start;

                        li {
                            padding: 0;
                        }
                    }
                `
            }
            onClick={() => routes["review/view"].push({
                query: {
                    id: item.id
                }
            })}

            actions={[

                <ExportButtonSmall
                    onCleanup={() => {
                    }}
                    onClick={async () => {
                        const uploadFiles = await storageRef.child(item.id).listAll()
                        const uploads = await Promise.all(uploadFiles.items.map(async (file) => ({
                            name: file.name,
                            url: await file.getDownloadURL()
                        })))

                        const result = await client.post("/api/export", {
                            collection: role.review.toPath(),
                            id: item.id,
                            uid: auth.currentUser.uid,
                            tz: getTimezone(),
                            uploads,
                            type: 'review',
                        } as ExportBody)

                        const url = await storage.ref(result.data.url).getDownloadURL()

                        const downloadElement = document.createElement('a')
                        Object.assign(downloadElement, {
                            download: 'report.zip',
                            href: url,
                            target: '_blank',
                        } as HTMLAnchorElement)
                        downloadElement.click()
                        downloadElement.remove()

                    }}/>,

                <RemoveButtonSmall onCleanup={() => routes["review"].push()}
                                   onClick={() => {
                                       return role.review.deleteDoc(item.id)
                                   }}/>
            ]}

        >
            <List.Item.Meta
                avatar={
                    <StarOutlined/>
                }
                title={
                    <p>{new Timestamp(item.date, 0).toDate().toLocaleString()}</p>
                }
                description={
                    <ul>
                        <li>{item.manager}</li>
                        <li css={theme => css`
                            color: ${item.adjustedSalary >= 0 ? theme.colors.success : theme.colors.error}
                        `}>{formatCurrency(item.adjustedSalary)}</li>
                        <li><Highlight css={theme => css`
                            .ais-Highlight-highlighted {
                                background-color: ${theme.colors.grayLight};
                            }

                            word-break: break-all;

                        `} attribute="outcome" hit={item}/></li>
                    </ul>
                }
            />
        </List.Item>

    })
};


export const ReviewList = () => {
    const router = useRouter();
    const {currentRoleID} = useRole();

    return (
        <>
            <SearchInterface indexName={'review'} HitsComponent={ReviewListHits}
                             filters={[`roleID:${currentRoleID}`]}
                             sortByProps={{
                                 items: [
                                     {
                                         value: 'review/sort/date:desc',
                                         label: 'Date'
                                     },
                                     {
                                         value: 'review/sort/adjustedSalary:desc',
                                         label: 'Adjusted Salary'
                                     },
                                 ],
                                 defaultRefinement: 'review/sort/date:desc'
                             }}
            />
            <AbsoluteButton Component={() => <Button
                type="primary"
                icon={<PlusCircleOutlined/>}
                onClick={() => router["review/new"].push()}
            />}/>

        </>
    );
};

export default () => WithEnvironment(() => {

    return <MenuLayout
        heading={'Role - Review'}
        HeaderDropDown={() => {
            const data = useRole().useCurrent()
            return data.isInProgress ? <LoaderCircleSmallRelative/> :
                <RoleDropDown {...data.result}/>
        }}
        Main={ReviewList}
    >
    </MenuLayout>
});
