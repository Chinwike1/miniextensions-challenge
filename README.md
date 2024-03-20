# Mini Extensions Coding Challenge

Name: Chinwike Anthony Maduabuchi
Contact: [chinwike.space](https://chinwike.space)

## Challenge Requirements

-   Integrate phone number authentication.
-   Implement a flow where:
    -   If a user first logs in with their **Phone Number**, they must authenticate with an **Email Provider** next to access the home page content.
    -   If a user first logs in with an **Email Provider**, they must authenticate with their **Phone Number** next to access the home page content.
-   Ensure that linking a new email or phone number doesn't create a seperate user object in Firebase.

## Usage, Requirements & Settings

This project uses yarn as the package manager. To ensure the project runs correctly, follow the following steps:

1. Install the [Firebase CLI](https://firebase.google.com/docs/cli) & download [JDK](https://www.oracle.com/java/technologies/downloads/#java21) on your machine.
2. Create a [new Firebase project](https:console.firebase.google.com).
3. In the Authentication tab, enable the following providers: **Email/Password**, **Phone**, **Google**.
4. Clone this project and run the following command:

```bash
yarn install
# then
yarn dev
```

5. Rename the `./env.local.example` file to `.env.local` and replace the variables with credentials from your Firebase project.
6. Do a codebase search for `FILL_ME_IN` and replace it with the value of your `NEXT_PUBLIC_FB_APP_NAME` env — don't use `process.env` here.

**Note**: To be able to link an email address & password to a user account, you'd need to turn off the Email enumeration protection feature under **User Actions** in your [Firebase Auth Settings](https://console.firebase.google.com/project/_/authentication/settings). See [solution](https://cloud.google.com/identity-platform/docs/admin/email-enumeration-protection#firebase-console_1) and [GitHub issue](https://github.com/firebase/firebase-js-sdk/issues/7675).
