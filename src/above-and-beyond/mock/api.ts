import { rest, setupWorker } from "msw";

// http://localhost:8080/google.firestore.v1.Firestore/Listen/channel?database=projects/web-104/databases/(default)&VER=8&SID=ZaYlRxZOXzYcl4l95f0V2A==&RID=67502&AID=5&zx=3jmlbzdsps0c&t=1
export const createRestMock = () => {
    return setupWorker(
        rest.get(
            `http://localhost:8080/google.firestore.v1.Firestore/*`,
            (req, res, context) => {
                console.log(req);
                console.log(res);
                console.log(context);
            }
        ),
        rest.post(
            `http://localhost:8080/google.firestore.v1.Firestore/*`,
            (req, res, context) => {
                console.log(req);
                console.log(res);
                console.log(context);
            }
        )
    );
};
