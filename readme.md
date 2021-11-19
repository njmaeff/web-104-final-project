# Web 104 Final Project - Above and Beyond

Above and Beyond is a mobile app designed to help employees track progress, set financial targets, and track achievements. The employee may use this information during performance reviews to help negotiate and achieve their goals.

## Design

The mobile app will use the [react](https://reactjs.org/) framework for the user interface and Cloud Firestore for data storage. The app will be secured using Firebase Auth and the [firebaseui](https://firebase.google.com/docs/auth/web/firebaseui) library.

The user interface will use a minimal color scheme highlighting essential components.

Cloud Firestore uses collections and security rules to enforce permissions. Every document is related to an employer, so we will make sub-collections under the employer. 

```text
/user/{UserID}/employers/{employerDocs}/roles/
/user/{UserID}/employers/{employerDocs}/ratings/
/user/{UserID}/employers/{employerDocs}/targets/
/user/{UserID}/employers/{employerDocs}/reviews/
```



## Links
- [Project Tracker and User Stories](https://njmaeff.youtrack.cloud/agiles/121-2/current)
- [UI Mockup](https://www.figma.com/file/dTfdcFFkn5JPQyF5I9B9Zq/app?node-id=0%3A1)
- [Flow Chart and Mind Map](https://whimsical.com/web104-final-project-NvwcmCe7f2ehRX1tiD452o)