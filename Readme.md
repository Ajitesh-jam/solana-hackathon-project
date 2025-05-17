# 🪙 CGS Token Deployment and Frontend Setup

Welcome to the CGS Token project! This repository contains both the token deployment code and the frontend to interact with it. Follow the steps below to get everything up and running.

---

## 📁 Directory Structure

```
.
├── token         # Smart contract and token deployment scripts
└── frontend      # React-based frontend to interact with the token
```

---

## 🚀 How to Run This Project

### 1. Deploy the CGS Token

#### Step-by-Step Instructions:

1. Open your terminal and navigate to the `token` directory:

   ```bash
   cd token
   ```

2. Follow the instructions and run the code snippets in order as listed in the documentation. The files/scripts are numbered for your convenience — execute them sequentially.

3. Before running the scripts, create a `.env` file in the `token` directory with the following contents:

   ```env
   PVT_KEY_ownerAddress="[
     187, 21,......162
   ]"

   MINT_ADDRESS="7nMwDDpFEc7PcAnnAmw8njf7o3dWNKvp8FHBabMW455q"
   ```

---

### 2. Run the Frontend

After deploying the token, set up the frontend to interact with it.

1. Navigate to the `frontend` directory:

   ```bash
   cd ../frontend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Add the following Firebase config to a `.env` or directly in your app's config if hardcoded:

   ```env
    apiKey="AIzaSyDqzFlbFFSAP0yUWB9EDjxOF19-INFSsug"
    authDomain="solana-hackathon-cd4dc.firebaseapp.com"
    projectId="solana-hackathon-cd4dc"
    storageBucket="solana-hackathon-cd4dc.firebasestorage.app"
    messagingSenderId="503129489840"
    appId="1:503129489840:web:2354acf407f4c56acf9675"
    measurementId="G-Q5XLZHJVZD"
   ```
   
   and add above env variables to this file as well
   
   ```env
   PVT_KEY_ownerAddress="[
     187, 21,......162
   ]"

   MINT_ADDRESS="7nMwDDpFEc7PcAnnAmw8njf7o3dWNKvp8FHBabMW455q"
   ```

   any updates from our side : https://drive.google.com/drive/folders/1Oc-ts8BRbI8J71s5rrmxU8v9UwfeXId2?usp=sharing 


5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

7. Downnload the game from Download link and then you can create any rooms (public or private) and share room code with anyone in the *same Network* and play different modes of game.If you win the win api will validate if you have staked coins then it will fetch you the rewards.

---

## 📬 Contact

For any issues or queries, feel free  to contact : ajitesh.jam@gmail.com orc raise an issue or contribute to the project! 


Flow of Coins
![Screenshot 2025-05-17 at 12 11 09 PM](https://github.com/user-attachments/assets/2f72b31c-367a-4e2c-b5c3-f70eb633ab91)

Architecture Diagram
![Screenshot 2025-05-17 at 12 11 53 PM](https://github.com/user-attachments/assets/de02f31f-b2fb-40b5-b61c-ea8e3d5e8c67)

Functions
![WhatsApp Image 2025-05-17 at 12 13 28](https://github.com/user-attachments/assets/4cecbe61-6c73-461a-bb5d-680b720acf69)



