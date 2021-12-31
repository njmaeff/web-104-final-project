import { Page, test as base } from "@playwright/test";
import {SmartHandle} from "playwright-core/types/structs";

export const waitForText =
    (page: Page) =>
        async (selector: string, predicate: WaitForTextPredicate) => {
            if (typeof predicate === "function") {
                await page.waitForFunction(
                    ([selector, predicate]) => {
                        const element = document.querySelector(selector);
                        return new Function("arg", predicate)(
                            element?.textContent.replace(/[\r\n]+/g, "").trim()
                        );
                    },
                    [selector, `return (${predicate.toString()})(arg)`]
                );
            } else if (predicate instanceof RegExp) {
                await page.waitForFunction(
                    ([selector, predicate]) => {
                        const element = document.querySelector(selector);
                        return new RegExp(predicate).test(
                            element?.textContent.replace(/[\r\n]+/g, "").trim()
                        );
                    },
                    [selector, predicate.toString()]
                );
            } else if (typeof predicate === "string") {
                await page.waitForFunction(
                    ([selector, predicate]) => {
                        const element = document.querySelector(selector);
                        return (
                            element?.textContent.replace(/[\r\n]+/g, "").trim() ===
                            predicate.trim()
                        );
                    },
                    [selector, predicate]
                );
            } else {
                throw new Error("Unknown predicate type");
            }
        };

export type WaitForTextPredicate = RegExp | string | ((arg: string) => boolean);

export type TestFixture = {
    waitForText: (
        selector: string,
        predicate: WaitForTextPredicate
    ) => Promise<SmartHandle<any>>;
};

export const test = base.extend<TestFixture>({
    waitForText: async ({ page }, use) => {
        await use(waitForText(page));
    },
    page: async ({ page }, use) => {
        await use(page);
    },
});
