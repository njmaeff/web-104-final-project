import {useEmployer} from "../../home/useEmployer";
import {auth, storage} from "../firebase/connect-api";
import {useRole} from "../../home/useRole";
import path from "path";

export const useRoleFileUpload = (...paths) => {
    const {currentEmployerID} = useEmployer()
    const {currentRoleID} = useRole();
    return storage.ref(
        path.join(auth.currentUser.uid, currentEmployerID, currentRoleID, ...paths)
    )
};

export const useBaseFileUpload = (...paths) => {
    return storage.ref(
        path.join(auth.currentUser.uid, ...paths)
    )
};
