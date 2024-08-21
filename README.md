# Whop SaaS Template

A starter for building and monetizing your web app on [Whop](https://whop.com).

This template uses

-   [Whop](https://whop.com) for OAuth and subscriptions
-   [NextJS](https://nextjs.org/) (Kickstarted from [create-t3-app](https://create.t3.gg/))
-   [Prisma](https://www.prisma.io/)
-   [Lucia Auth](https://lucia-auth.com/)
-   [TailwindCSS](https://tailwindcss.com/) (with Shadcn)

## Prerequisites

**_To setup your web app for local development, use `http://localhost:3000` instead of `https://myapp.com` in the instructions below_**

### 1. Add the `Web app` App to Your Hub

1. Navigate to your hub
2. Register your web app by adding the `Web app` app
3. Set the web app URL to be `https://myapp.com/api/whop/claim`. _It is recommended to embed your app inside Whop as auth will not work in an iframe_

You can name it whatever you like!

### 2. Create OAuth Credentials

This application utilizes Whop as the OAuth provider for authentication. Follow these steps to set up your credentials:

1. Navigate to the [OAuth](https://whop.com/dash/settings/developer/oauth) section of the Whop developer dashboard.
2. Create OAuth credentials for your hub.
3. Add the following variables to your `.env` file in the project root:

```sh
WHOP_CLIENT_ID="your_client_id"
WHOP_CLIENT_SECRET="your_client_secret"
```

### 3. Create an API Key

To access Whop's API, you'll need to create an API key:

1. Navigate to the [API Keys](https://whop.com/dash/settings/developer/api-keys) section of the Whop developer dashboard.
2. Generate a new API key.
3. Add the key to your .env file:

```sh
WHOP_API_KEY="your_api_key"
```

### 4. Create a Webhook

To receive updates from Whop, such as when a user's membership becomes valid or invalid, we need to use webhooks.

To create a webhook:

1. Navigate to the [webhooks](https://whop.com/dash/settings/developer/webhooks) section of the Whop developer dashboard.
2. Create a new webhook for `https://myapp.com/api/whop/webhook`. This template only relies on the `membership_went_valid` and `membership_went_invalid` events.
3. Add the secret to your .env file:

```sh
# This is used to validate that the webhook payload came from Whop
WHOP_WEBHOOK_SECRET="your_api_key"
```

### 5. Create a Product and Plan

In order to sell your web app, you need a product to sell on Whop.

1. Go to your hub and create a new product. This will also create a plan to sell the product through.
2. Add the product and plan IDs to your .env file:

```sh
# These are prefixed with NEXT_PUBLIC_* as they are safe to be used in the browser!

# The plan ID is used to create checkout links in the app
NEXT_PUBLIC_PLAN_ID="plan_**********"
NEXT_PUBLIC_PRODUCT_ID="plan_**********"
```

### Extra: Multiple Tiers

**_We use separate Whop products as separate "tiers" in a subscription model._**

The template assumes you have one payment tier for your web app. If you wanted to have more than one tier (e.g., higher tiers have more features), you can add more product IDs as environment variables such as the following:

```sh
NEXT_PUBLIC_HOBBY_PRODUCT_ID="prod_*************"
NEXT_PUBLIC_HOBBY_PLAN_ID="plan_*************"

# (Standard > Hobby)
NEXT_PUBLIC_STANDARD_PRODUCT_ID="prod_*************"
NEXT_PUBLIC_STANDARD_PLAN_ID="plan_*************"

```

**_In the above example, if you have a feature that only "standard" users can use, you would then implement logic to check if their subscribed product matches this ID_**

Subscription tiers should be linked to separate products instead of plans for the following reasons:

-   Having separate products for each tier can allow certain tiers to have access to certain Whop apps (e.g., maybe a user on a more expensive tier is granted a special role in your Discord server)
-   You can have multiple plans for each product/tier.
    -   Maybe you want to give away 5 free memberships for your fastest and most dedicated followers to claim. _You can make a plan for that._

## Development Tips

### Create a Separate Whop for Development

To continue developing your web app on Whop after your product has members, it is recommended to create a separate _development_ whop with the same products and plans. Your web app in your development whop will be able to point to your localhost url `http://localhost:3000`

### Receiving Webhooks

To receive webhooks from Whop during development, it's recommended to use a proxy such as [ngrok](https://ngrok.com/).

After starting your app locally, run the following command. ngrok will give you a url that can be used as a webhook.

```sh
ngrok http 3000
```

## Running the App

```sh
pnpm dev
# or
yarn dev
#or
npm run dev
```
