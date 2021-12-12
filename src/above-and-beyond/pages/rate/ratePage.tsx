import React from "react";
import {Highlight} from "../lib/styles/mixins";
import Link from "next/link";
import styled from "@emotion/styled";
import {MenuTemplate} from "../lib/menuTemplate";
import {routes} from "../routes";

export const RatePage = styled.div`
    nav {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: center;
        margin: 0 auto;

        a {
            font-size: 3rem;
        }
    }
`
export const RateYourselfTemplate: React.FC<{
    heading: string
    type: 'issue' | 'success'
}> = ({
          heading,
          type,
          children

      }) => {
    return (
        <MenuTemplate
            heading={heading}
        >
            <RatePage>
                {children}
                <nav>
                    <Link
                        href={routes["rate/success"]()}
                    ><a css={theme => type === 'success' && Highlight(theme.colors.primary)}
                        className={'icon-award'}/></Link>
                    <Link
                        href={routes["rate/issue"]()}
                    ><a css={theme => type === 'issue' && Highlight(theme.colors.primary)}
                        className={'icon-issue'}/></Link>
                </nav>
            </RatePage>
        </MenuTemplate>
    );
};
