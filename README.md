# Pinguins | SaaS Demo

Pingquins is the easiest way to monitor your SaaS application. Get instant Discord notifications for sales, new users, and any custom events you want to track.

**Live** : [https://pinguins.ucokman.web.id](https://pinguins.ucokman.web.id)

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL
- Ngrok account
- Stripe account
- Clerk account
- Discord account

### 1. Clone & Install

```bash
git clone <repo-url>
cd pinguins
pnpm install
```

### 2. Setup Tunneling for Webhooks

Ngrok allows you to expose your local server to the internet for webhook testing.

1. **Login to ngrok**  
   Visit [https://dashboard.ngrok.com/login](https://dashboard.ngrok.com/login)

2. **Install ngrok**  
   Follow the instructions under **Getting Started → Setup & Installation**

3. **Configure and run ngrok**

   ```bash
   ngrok config add-authtoken <your-auth-token>
   ngrok http --url=<YOUR_FORWARDING_URL> <your-app-running-port>

   # Keep this terminal window open - you'll need the forwarding URL for webhook configuration
   ```

### 3. Setup Clerk Authentication

1. **Login to Clerk**  
   Visit [https://dashboard.clerk.com/sign-in](https://dashboard.clerk.com/sign-in)

2. **Create a new application**  
   Navigate to **Application → Dashboard** and create a new application

3. **Configure sign-in options**  
   Enable **Email** and **Google** as sign-in methods

4. **Get your API keys**  
   Go to **Configure → Developers → API Keys** and copy:
   - `CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

---

### 4. Setup Discord Bot & OAuth

1. **Create Discord Server**

   1. Login to [Discord](https://discord.com/login)
   2. Create a new private server for testing

2. **Setup Discord Application**

   1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
   2. Click **New Application**

3. **Configure Bot Settings**

   1. Navigate to **Settings → Bot**
   2. Click **Reset Token** to get your `DISCORD_BOT_TOKEN`

4. **Configure OAuth2**

   1. Go to **Settings → OAuth2**
   2. Copy your `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_SECRET`
   3. Under **Redirects**, add:
      ```
      <YOUR_NGROK_FORWARDING_URL>/api/callback/discord
      ```

5. **Generate Bot Invite URL**

   1. Go to **OAuth2 URL Generator**
   2. Under **Scopes**, check `bot`
   3. Under **Bot Permissions**, check:
      - Send Messages
      - Read Message History
   4. Copy the **Generated URL** and paste it in your browser
   5. Authorize the bot to join your private server

### 5. Get Discord Guild ID

1. Enable **Developer Mode** in Discord  
   Go to **App Settings → Advanced** and toggle on Developer Mode

2. Get your server ID
   - Right-click on your private server icon in the left sidebar
   - Click **Copy Server ID** to get your `DISCORD_GUILD_ID`

### 6. Setup Stripe Payments

1. **Login to Stripe**  
   Visit [https://dashboard.stripe.com/login](https://dashboard.stripe.com/login)

2. **Create a product**

   - Go to **Product Catalog**
   - Create a new product with **One-off payment**
   - Copy the `STRIPE_PRODUCT_ID` from the Details section

3. **Get your API key**

   - Open the **Workbench Panel** at the bottom of the page
   - Under **Overview**, copy your `STRIPE_SECRET_KEY`

4. **Setup webhooks**
   - Navigate to **Webhooks**
   - Click **Add destination**
   - Select all **checkout events**
   - Set destination to: `<YOUR_FORWARDING_URL>/api/webhook/stripe`
   - Get your <WEBHOOK_SECRET>

### 7. Configure Environment Variables

```bash
cp .env.example .env
# fill in all the credentials you collected
```

### 8. Setup Database

```bash
pnpm prisma migrate dev
```

### 9. Run Development Server

Start the application:

```bash
pnpm run dev
```

**Your app is now running!** 🎊  
Visit [http://localhost:3000](http://localhost:3000) to see it in action.
