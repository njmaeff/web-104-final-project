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

export const RateListHits: React.FC<{ hits }> = ({hits}) => {
    const routes = useRouter();
    return hits.map((item) => {
        return <List.Item
            key={item.id}
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
                    <Highlight css={theme => css`
                        .ais-Highlight-highlighted {
                            background-color: ${theme.colors.grayLight};
                        }
                    `} attribute="result" hit={item}/>
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
            />
            <AbsoluteButton>
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined/>}
                    // loading={loadings[2]}
                    onClick={() => router["rate/new"].push()}
                />
            </AbsoluteButton>
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
