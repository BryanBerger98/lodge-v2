# Lodge

Lodge is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). It is a NextJS starter boilerplate for web applications.

## Getting Started

First, clone the repository:

```bash
git clone git@github.com:BryanBerger98/lodge-v2.git
```

Install dependencies:

```bash
npm i
```

Configure the environment variables by renaming `.env.example` by `.env.local`:

```env
# Rename .env.local

# MONGODB CONFIG
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_CLUSTER=

# EMAIL SERVER CONFIG
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=

# SECURITY AND AUTH CONFIG
JWT_SECRET=
CSRF_SECRET=
FRONT_URL=
NEXTAUTH_URL=

# AWS S3 BUCKET CONFIG
BUCKET_NAME=
BUCKET_ACCESS_KEY_ID=
BUCKET_SECRET_ACCESS_KEY=
BUCKET_REGION=
BUCKET_POLICY_VERSION=

# SECRECTS USED TO SIGN COOKIES
COOKIE_SECRET_CURRENT=
COOKIE_SECRET_PREVIOUS=

# PUBLIC COOKIE OPTIONS
NEXT_PUBLIC_COOKIE_SECURE=

# PUBLIC APP NAME
NEXT_PUBLIC_APP_NAME=
```

Finaly run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
