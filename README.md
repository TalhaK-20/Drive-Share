# Drive-Share

## Overview

**Drive-Share** is a Full Stack cloud-based file uploading web application leveraging the Google Drive API. This project enables users to securely upload files to a shared Google Drive folder, making them accessible to both the user and the admin.

## Features

- Secure file upload to Google Drive
- File sharing between users and admin
- User-friendly interface
- Efficient file management

## Project Structure

- **Frontend:** Built with HTML, CSS, and EJS for templating
- **Backend:** Node JS with Express JS
- **Database:** MongoDB for storing file metadata

## Getting Started

#### Pre-requisites

- Node JS and npm installed
- MongoDB instance (local or Atlas)
- Google Cloud project with Google Drive API enabled

#### Installation

1. Clone the repository

    ```bash
    git clone https://github.com/TalhaK-20/Drive-Share.git
    ```

2. Install dependencies

    ```bash
    npm install
    ```

3. Set up your Google Cloud credentials
    - Create a Google Cloud project and enable the Google Drive API
    - Generate a service account key and download the JSON credentials file
    - Save the credentials file in your project directory (`credentials.json`)

4. Configure your environment variables

    ```bash
    PORT = 3000
    MONGODB_URI = your_mongodb_uri
    GOOGLE_DRIVE_FOLDER_ID = your_google_drive_folder_id
    ```

#### Usage

1. Start the application

    ```bash
    npm start
    ```

2. Open your browser and navigate to `http://localhost:3000`

## Google Drive API Integration

#### Setting Up Google Drive API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Enable the Google Drive API for your project.
4. Create a service account :
    - Go to the "IAM & Admin" section
    - Create a new service account
    - Generate a new key (JSON format) and download it
    - Save the JSON credentials file in your project directory

5. Share the Google Drive folder with your service account email.

#### Important Points

- **Service Account:** Ensure the service account has the necessary permissions to upload files to the Google Drive folder.
- **Folder ID:** The `GOOGLE_DRIVE_FOLDER_ID` environment variable must be set to the ID of the shared folder in Google Drive.
- **Security:** Keep your credentials file (`credentials.json`) secure and never expose it publicly.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.
