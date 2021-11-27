import React, { useState } from "react";
import { DropDown, DropDownElement } from "./control";
import { Link } from "./link";
import { Employer } from "../../orm/docs";
import { usePageCtx } from "../../hooks/usePageCtx";
import { Loader } from "./loader";

export const MenuTemplate: React.FC<{
    currentEmployer: Employer;
    allEmployers: Employer[];
    heading?: string;
    isEdit?: boolean;
    onClickEdit?;
    onClickSave?;
    isValid?: boolean;
    disableNavigation?: boolean;
    editAllParams?: any;
    isLoading?: boolean;
}> = ({
          children,
          currentEmployer,
          heading,
          allEmployers,
          isValid,
          isEdit,
          onClickEdit,
          onClickSave,
          disableNavigation,
          editAllParams = {},
          isLoading,
      }) => {
    const [isSaving, setSaveState] = useState(false);
    const { api } = usePageCtx();

    return (
        <div className={`page`}>
            <header>
                <nav>
                    <div className={"header-control"}>
                        <h2>{heading}</h2>
                        <DropDown
                            current={currentEmployer?.name}
                            headingType={"h3"}
                        >
                            <DropDownElement
                                href={`/`}
                                onClick={() => {
                                    api.newEmployer();
                                }}
                            >
                                Create New
                            </DropDownElement>
                            {allEmployers
                                .filter(
                                    (employer) =>
                                        employer.id !== currentEmployer.id
                                )
                                .map((employer) => (
                                    <DropDownElement
                                        key={employer.id}
                                        href={`/api?employer=${employer.id}`}
                                        onClick={() =>
                                            api.updateEmployer(employer.id)
                                        }
                                    >
                                        {employer.name}
                                    </DropDownElement>
                                ))}
                        </DropDown>
                    </div>
                    <Link href={"/profile"} className={"icon-settings"} />
                </nav>
            </header>
            {isSaving || isLoading ? (
                <main>
                    <Loader />
                </main>
            ) : (
                <main>{children}</main>
            )}
            <footer>
                <nav>
                    <div className={`footer-control-feature`}>
                        <button
                            className={`icon-logo   ${
                                isEdit && isValid
                                    ? "border-highlight__success"
                                    : isEdit && !isValid
                                    ? "border-highlight__primary"
                                    : ""
                            }`}
                            type={"button"}
                            onClick={() => {
                                if (isEdit && isValid) {
                                    setSaveState(true);
                                    Promise.resolve(onClickSave?.())
                                        .then(() => {
                                            setSaveState(false);
                                        })
                                        .catch((e) => {
                                            setSaveState(false);
                                            throw e;
                                        });
                                } else if (!isEdit) {
                                    onClickEdit?.();
                                }
                            }}
                        />
                    </div>
                    <div className={"footer-control"}>
                        <Link
                            href={"/"}
                            className={"icon-home"}
                            disabled={disableNavigation}
                        />
                        <Link
                            href={"/edit"}
                            params={editAllParams}
                            className={"icon-edit"}
                            disabled={disableNavigation}
                        />
                    </div>
                    <div className={"footer-control"}>
                        <Link
                            href={"/review"}
                            className={"icon-review"}
                            disabled={disableNavigation}
                        />
                        <Link
                            href={"/rate/success"}
                            className={"icon-rate"}
                            disabled={disableNavigation}
                        />
                    </div>
                </nav>
            </footer>
        </div>
    );
};
