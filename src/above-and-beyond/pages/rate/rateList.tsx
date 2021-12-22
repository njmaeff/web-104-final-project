import {MenuTemplate} from "../lib/menuTemplate";
import React from 'react';
import {Rate} from "../lib/orm/validate";
import {SearchInterface} from "../lib/instantSearch";
import {Button, List} from "antd";
import {
    ExclamationCircleOutlined,
    LikeOutlined,
    PlusCircleOutlined
} from "@ant-design/icons";
import {useRouter} from "../routes";
import {Timestamp} from "../lib/orm/docs";
import {Highlight} from "react-instantsearch-dom";
import {css} from "@emotion/react";
import {RoleDropDown} from "../lib/control";
import {useRole} from "../employer/useRole";
import {AbsoluteButton} from "../lib/button/absoluteFeatureButton";
import {formatCurrency} from "../lib/util/currency";

export const RateListHits: React.FC<{ hits }> = ({hits}) => {
    const routes = useRouter();
    return hits.map((item: Rate) => {
        return <List.Item
            key={item.id}
            css={
                theme => css`
                    li {
                        margin: 0;
                    }
                `
            }
            onClick={() => routes["rate/view"].push({
                query: {
                    id: item.id
                }
            })}
        >
            <List.Item.Meta
                avatar={
                    item.type === 'success' ? <LikeOutlined/> :
                        <ExclamationCircleOutlined/>
                }
                title={
                    new Timestamp(item.date, 0).toDate().toLocaleString()
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
        </List.Item>
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
                                 attribute: "type"
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

export default () => {

    return <MenuTemplate
        heading={'Rate'}
        HeaderDropDown={() => <RoleDropDown disableNew/>}
        Main={RateList}
    >
    </MenuTemplate>
};
