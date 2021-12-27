import {MenuLayout} from "../lib/layout/menuLayout";
import {RateSuccessPage} from "./rateSuccessPage";
import {RateIssuePage} from "./rateIssuePage";
import {Radio, RadioGroupProps} from "antd"
import React, {useState} from "react";
import {css} from "@emotion/react";

export const RadioGroup: React.FC<RadioGroupProps & { heading: string }> = ({
                                                                                heading,
                                                                                ...radioGroupProps
                                                                            }) => {

    return <div css={theme => css`
        margin-bottom: 1rem;

        .ant-radio-button-wrapper {
            width: 5rem;
            text-align: center;
            background-color: ${theme.colors.light};
            border: 2px solid ${theme.colors.grayLight};
        }

        h2 {
            color: ${theme.colors.gray};
            font-size: 1rem;
            margin: 0 0 1rem;
        }
    `}>
        <h2>Type</h2>
        <Radio.Group
            optionType="button"
            {...radioGroupProps}
        />
    </div>
};

export const NewPage = () => {
    return <MenuLayout
        heading={'New Rating'}
        Main={() => {

            const [rateType, setRateType] = useState("success")

            return (
                <>
                    <RadioGroup
                        heading={'Type'}
                        options={[
                            {label: 'Success', value: 'success'},
                            {label: 'Issue', value: 'issue'},
                        ]}
                        onChange={(e) => {
                            setRateType(e.target.value)
                        }}
                        value={rateType}
                        optionType="button"
                    />
                    {rateType === 'issue' ? <RateIssuePage/> :
                        <RateSuccessPage/>}
                </>
            )

        }}
    />;
};

export default NewPage
