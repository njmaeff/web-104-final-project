import {MenuTemplate} from "../lib/menuTemplate";
import {RateSuccessPage} from "./rateSuccessPage";
import {RateIssuePage} from "./rateIssuePage";
import {Radio} from "antd"
import {useState} from "react";
import {css} from "@emotion/react";

export const NewPage = () => {
    return <MenuTemplate
        heading={'New Rating'}
        Main={() => {

            const [rateType, setRateType] = useState("success")

            return (
                <>
                    <div css={theme => css`
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
                    </div>
                    {rateType === 'issue' ? <RateIssuePage/> :
                        <RateSuccessPage/>}
                </>
            )

        }}
    />;
};

export default NewPage
