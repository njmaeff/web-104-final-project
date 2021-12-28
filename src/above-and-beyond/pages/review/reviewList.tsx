import {SearchInterface} from "../lib/instantSearch";
import {MenuLayout} from "../lib/layout/menuLayout";
import React from "react";
import {Button, List} from "antd";
import {PlusCircleOutlined, StarOutlined} from "@ant-design/icons";
import {useRouter} from "../routes";
import {Timestamp} from "../lib/orm/docs";
import {Highlight} from "react-instantsearch-dom";
import {css} from "@emotion/react";
import {RoleDropDown} from "../lib/control";
import {useRole} from "../home/useRole";
import {AbsoluteButton} from "../lib/button/absoluteFeature";
import {Review} from "../lib/orm/validate";
import {formatCurrency} from "../lib/util/currency";
import {WithEnvironment} from "../lib/withEnvironment";
import {Loader} from "../lib/loader";

export const ReviewListHits: React.FC<{ hits }> = ({hits}) => {
    const routes = useRouter();
    return hits.map((item: Review) => {
        return <List.Item
            key={item.id}
            css={
                css`
                    li, p {
                        margin: 0
                    }
                `
            }
            onClick={() => routes["review/view"].push({
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
            <AbsoluteButton Control={() => <Button
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
            return data.isInProgress ? <Loader/> :
                <RoleDropDown {...data.result}/>
        }}
        Main={ReviewList}
    >
    </MenuLayout>
});
