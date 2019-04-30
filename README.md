# PRIMAVERA V10 Mobile

This repository contains the code base for the PRIMAVERA V10 Mobile (Android and IOS) applications.

1. Install Ionic CLI:
    ```
    npm install -g ionic
    ```

2. Clone this repository
    ```
    git clone https://github.com/PrimaverabssDeveloper/ERP10Mobile.git
    ```
    
3. Navigate to the ERP10Mobile directory:
    ```
    cd ERP10Mobile
    ```

4. Install the dependencies
    ```
    npm install
    ```

5. Application Client Id.
     
    To create your application client id go to [Nitrogen Developers](https://nitrogen.primaverabss.com/developer/dashboard). OAuth Flow **must** be PKCE (Proof Key for Code Exchange). 
    
    For more information on OAuth flows check [OAuth 2.0 Flows](https://oauth.net/2/).
    

6. Go to `src` directory and create a file with name `authentication-settings.json` and content:

    ``` json
    {
        "clientId":"your-pkce-client-id"
    }   
    ```
    
7. Start the app in the browser (Google Chrome)
    ```
    ionic serve
    ```


There are scripts to deploy to mobile devices but aditional steps maybe necessary, depending on your system configuration. Please check the [Ionic Frameword Documentation](https://ionicframework.com/)

Android mobile device deploy scripts `npm run android-deploy` or `npm run android-debug`.

IOS mobile device deploy scripts `npm run ios-run` or `ios-run-debug`

