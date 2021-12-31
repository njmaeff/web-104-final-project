import {test} from "./util"

test('test', async ({page, waitForText}) => {
  // Go to http://localhost:3000/
  await page.goto('http://localhost:3000/');

  // Click [placeholder="Track Device"]
  await page.click('[placeholder="Track Device"]');

  // Fill [placeholder="Track Device"]
  await page.fill('[placeholder="Track Device"]', 'H1');

  // Click text=Submit
  await page.click('text=Submit');

  await waitForText('.ant-table-row > td:nth-of-type(2)', function (txt) {
    return !!txt
  });

});
