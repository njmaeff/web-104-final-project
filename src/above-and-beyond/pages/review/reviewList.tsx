import {SearchInterface} from "../lib/instantSearch";
import {MenuTemplate} from "../lib/menuTemplate";
import React from "react";
import {Button, List} from "antd";
import {PlusCircleOutlined, StarOutlined} from "@ant-design/icons";
import {useRouter} from "../routes";
import {Timestamp} from "../lib/orm/docs";
import {Highlight} from "react-instantsearch-dom";
import {css} from "@emotion/react";
import {RoleDropDown} from "../lib/control";
import {useRole} from "../employer/useRole";
import {AbsoluteButton} from "../lib/button/absoluteFeatureButton";

export const ReviewListHits: React.FC<{ hits }> = ({hits}) => {
    const routes = useRouter();
    return hits.map((item) => {
        return <List.Item
            key={item.id}
            onClick={() => routes.review.push({
                query: {
                    id: item.id
                }
            })}
        >
            <List.Item.Meta
                avatar={
                    <StarOutlined/>
                }
                title={
                    new Timestamp(item.date, 0).toDate().toLocaleString()
                }
                description={
                    <Highlight css={theme => css`
                        .ais-Highlight-highlighted {
                            background-color: ${theme.colors.grayLight};
                        }
                    `} attribute="outcome" hit={item}/>
                }
            />
        </List.Item>

    })
};


export const ReviewList = () => {
    const {currentRoleID} = useRole();

    return (
        <>
            <SearchInterface indexName={'review'} HitsComponent={ReviewListHits}
                             filters={[`roleID:${currentRoleID}`]}
            />
            <AbsoluteButton>
                <Button
                    type="primary"
                    icon={<PlusCircleOutlined/>}
                    // loading={loadings[2]}
                    // onClick={() => this.enterLoading(2)}
                />
            </AbsoluteButton>
        </>
    );
};

export default () => {

    return <MenuTemplate
        heading={'Review'}
        HeaderDropDown={() => <RoleDropDown disableNew/>}
        Main={ReviewList}
    >
    </MenuTemplate>
};
