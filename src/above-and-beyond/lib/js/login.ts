import { useAuthUI } from "../hooks/useFirebaseUI";

export const init = () => {
    useAuthUI({
        signInSuccessUrl: "app.html",
        firstTimeSignInUrl: "getting-started.html",
    });
};
window.addEventListener("load", () => {
    init();
});
