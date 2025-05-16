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

3. Add the following Firebase config to a `.env.local` or directly in your app's config if hardcoded:

   ```env
    apiKey="AIzaSyDqzFlbFFSAP0yUWB9EDjxOF19-INFSsug"
    authDomain="solana-hackathon-cd4dc.firebaseapp.com"
    projectId="solana-hackathon-cd4dc"
    storageBucket="solana-hackathon-cd4dc.firebasestorage.app"
    messagingSenderId="503129489840"
    appId="1:503129489840:web:2354acf407f4c56acf9675"
    measurementId="G-Q5XLZHJVZD"
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 📬 Contact

For any issues or queries, feel free  to contact : ajitesh.jam@gmail.com or raise an issue or contribute to the project! 

