import {MenuLayout} from "../lib/layout/menuLayout";
import React from 'react';
import {Rate} from "../lib/orm/validate";
import {SearchInterface} from "../lib/input/instantSearch";
import {Button, List} from "antd";
import {
    ExclamationCircleOutlined,
    LikeOutlined,
    PlusCircleOutlined
} from "@ant-design/icons";
import {useRouter} from "../routes";
import {RoleHook} from "../lib/orm/docs";
import {Highlight} from "react-instantsearch-dom";
import {css} from "@emotion/react";
import {RoleDropDown} from "../lib/input/control";
import {useRole} from "../home/useRole";
import {AbsoluteButton} from "../lib/button/absoluteFeatureButton";
import {formatCurrency} from "../lib/util/currency";
import {WithEnvironment} from "../lib/hooks/withEnvironment";
import {LoaderCircle} from "../lib/feedback/loaderCircle";
import {ExportButton, RemoveButton} from "../lib/button/actionButton";
import {client} from "../lib/hooks/useHttpClient";
import {useRoleFileUpload} from "../lib/storage/file";
import {auth, storage} from "../lib/firebase/connect-api";
import {ExportBody} from "../api/export/types";
import {getTimezone, Timestamp} from "../lib/util/date";

export const RateListHits: React.FC<{ hits }> = ({hits}) => {
    const role = new RoleHook();
    const routes = useRouter();
    const storageRef = useRoleFileUpload('rate')

    return hits.map((item: Rate) => {


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
            onClick={() => {
                routes["rate/view"].push({
                    query: {
                        id: item.id
                    }
                });
            }}

            actions={[

                <ExportButton
                    onCleanup={() => {
                    }}
                    onClick={async () => {
                        const uploadFiles = await storageRef.child(item.id).listAll()
                        const uploads = await Promise.all(uploadFiles.items.map(async (file) => ({
                            name: file.name,
                            url: await file.getDownloadURL()
                        })))

                        const result = await client.post("/api/export", {
                            collection: role.rate.toPath(),
                            id: item.id,
                            uid: auth.currentUser.uid,
                            tz: getTimezone(),
                            uploads,
                            type: 'rate',
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

                <RemoveButton onCleanup={() => routes["rate"].push()}
                              onClick={() => {
                                  return role.rate.deleteDoc(item.id)
                              }}/>
            ]}
        >
            <List.Item.Meta
                avatar={
                    item.type === 'success' ? <LikeOutlined/> :
                        <ExclamationCircleOutlined/>
                }
                title={
                    <p>{new Timestamp(item.date, 0).toDate().toLocaleString()}</p>
                }
                description={
                    <ul>
                        <li css={
                            theme => css`
                                color: ${item.type === 'success' ? theme.colors.success : theme.colors.error}
                            `
                        }>{formatCurrency(item.value)}</li>
                        <li><Highlight css={theme => css`
                            .ais-Highlight-highlighted {
                                background-color: ${theme.colors.grayLight};
                            }
                        `} attribute="result" hit={item}/></li>
                    </ul>
                }
            />
        </List.Item>;
    })
};

export const RateList = () => {

    const {currentRoleID} = useRole();
    const router = useRouter();

    return (
        <>
            <SearchInterface indexName={'rate'} HitsComponent={RateListHits}
                             filters={[`roleID:${currentRoleID}`]}
                             sortByProps={{
                                 items: [
                                     {
                                         value: 'rate/sort/date:desc',
                                         label: 'Date'
                                     },
                                     {
                                         value: 'rate/sort/value:desc',
                                         label: 'Value'
                                     },
                                 ],
                                 defaultRefinement: 'rate/sort/date:desc'
                             }}
                             refinementProps={{
                                 attribute: "type",
                             }}
            />
            <AbsoluteButton Control={() => <Button
                type="primary"
                icon={<PlusCircleOutlined/>}
                onClick={() => router["rate/new"].push()}
            />}/>
        </>
    );
};

export default () => WithEnvironment(() => {

    return <MenuLayout
        heading={'Role - Rate'}
        HeaderDropDown={() => {
            const data = useRole().useCurrent()
            return data.isInProgress ? <LoaderCircle/> :
                <RoleDropDown {...data.result}/>
        }}
        Main={RateList}
    >
    </MenuLayout>
});
