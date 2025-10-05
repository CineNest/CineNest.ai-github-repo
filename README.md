#CineNest.ai

**Elevator pitch:** CineNest.ai is an ai integrated film production system which aims to Transform film making into a fully automated , transparent  and efficient  Environment

## Team
 **Adhil Rifayin k s** — Team Lead — 007rifayinadhil@gmail.comm
- **Deethu p** — Frontend — deethup911@gmail.com
- **Abhinav p** — Backend — abhinavvkd10@gmail.com
- **Muhammed Fahad E V** — AI Automation Specialist — fahadman40@gmail.com
*   **Gemini (AI Coding Partner)** - AI Assistant (Google)

## How to Run Locally

Follow these steps to get the development environment running:

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run the Development Server**:
    The application runs on Next.js with Turbopack for fast development.
    ```bash
    npm run dev
    ```

3.  **Start the Genkit AI Flows**:
    In a separate terminal, run the Genkit development server to enable AI features.
    ```bash
    npm run genkit:watch
    ```

4.  **Open the App**:
    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## How to Run Tests

The project is set up for testing, but no tests have been written yet. To run tests in the future, you would use:

```bash
npm test
```

## Deployment Instructions

This application is configured for deployment on **Firebase App Hosting**.

1.  **Prerequisites**:
    *   Ensure you have the Firebase CLI installed (`npm install -g firebase-tools`).
    *   Log in to Firebase: `firebase login`.
    *   Associate your local project with your Firebase project: `firebase use <your-firebase-project-id>`.

2.  **Deploy**:
    Run the following command to build and deploy the application:
    ```bash
    firebase apphosting:backends:deploy
    ```
    The deployment configuration is managed by the `apphosting.yaml` file in the root directory.

    firebase url  - https://9000-firebase-studio-1759482926083.cluster-zumahodzirciuujpqvsniawo3o.cloudworkstations.dev

The live demo URL will be provided by Firebase after a successful deployment.

alternatively we can deploy and host from verscel from 
http://cine-nest-ai-github-repo.vercel.app



## Environment Variables

This project uses an `.env` file for environment variables. While Firebase App Hosting injects service configurations automatically, you may need to add API keys for external services here during local development.

*   `GEMINI_API_KEY`: Your API key for the Google AI (Gemini) models.
which we shouldnt be showing in a public  repo 

## Known Limitations and TODOs

*   **AI Retraining**: The feature to "train the AI" with manually edited schedule data is not yet implemented. Currently, the saved data is stored for future use but does not automatically feed back into the model.
*   **DocuSign Integration**: The legal compliance flow has a placeholder for DocuSign integration but does not yet make live API calls.
*   **Email Sending**: The investor communication feature for sending weekly reports is a UI/UX concept; the backend for sending emails is not implemented.
*   **Backend Database**: The application currently uses Firebase client-side features. For more complex state management across users, a more robust backend service with server-side logic might be required.

## License & Attributions

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

This project was bootstrapped and developed with the assistance of Firebase Studio's AI coding partner.
