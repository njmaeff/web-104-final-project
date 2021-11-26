import "https://www.gstatic.com/firebasejs/9.4.0/firebase-app-compat.js";
import "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth-compat.js";
import "https://www.gstatic.com/firebasejs/ui/6.0.0/firebase-ui-auth.js";

var firebase = window.firebase;

const connectAuth = ({
  apiKey = "AIzaSyC90XiTl038eyaRwSOmTlM5746yJv39tDQ",
  projectId = "web-104-final-project",
  authDomain = "web-104-final-project.firebaseapp.com",
  emulatorHost = "",
} = {}) => {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey,
      authDomain,
      projectId,
    });
  }

  const auth = firebase.auth();
  if (!!emulatorHost) {
    auth.useEmulator(`http://${emulatorHost}`);
  }
  return auth;
};

var firebaseui = window.firebaseui;

const auth = connectAuth({
  apiKey: "AIzaSyC90XiTl038eyaRwSOmTlM5746yJv39tDQ",
  projectId: "web-104-final-project",
  authDomain: "web-104-final-project.firebaseapp.com",
  emulatorHost: "",
});

const ui = new firebaseui.auth.AuthUI(auth);
let isNewUser;
const loadAuthUI = ({ signInSuccessUrl, firstTimeSignInUrl } = {}) => {
  auth.onAuthStateChanged(
    (user) => {
      if (user) {
        setTimeout(() => {
          if (isNewUser) {
            window.location.href = firstTimeSignInUrl;
          } else {
            window.location.href = signInSuccessUrl;
          }
        }, 0);
      }
    },
    (error) => {
      console.error(error);
    }
  );

  if (!ui.isPendingRedirect()) {
    ui.start("#firebaseui-auth-container", {
      callbacks: {
        signInSuccessWithAuthResult(authResult) {
          if (firstTimeSignInUrl && authResult.additionalUserInfo.isNewUser) {
            isNewUser = true;
          }

          return false;
        },
      },

      signInOptions: [
        // Leave the lines as is for the providers you want to offer
        // your users.
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      ],
      signInFlow: "popup",
    });
  }
};

const init = () => {
  loadAuthUI({
    signInSuccessUrl: "/app.html",
    firstTimeSignInUrl: "/getting-started.html",
  });
};
window.addEventListener("load", () => {
  init();
});

export { init };
