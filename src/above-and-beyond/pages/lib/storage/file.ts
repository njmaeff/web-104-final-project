import {useEmployer} from "../../employer/useEmployer";
import {auth, storage} from "../firebase/connect-api";
import {useRole} from "../../employer/useRole";
import path from "path";

export const useFileUpload = (...paths) => {
    const {currentEmployerID} = useEmployer()
    const {currentRoleID} = useRole();
    return storage.ref(
        path.join(auth.currentUser.uid, currentEmployerID, currentRoleID, ...paths)
    )
};

