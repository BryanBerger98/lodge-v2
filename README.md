# Equus

## Getting Started

First, clone the repository:

```bash
git clone git@github.com:Groupe-Carolus/Equus.git
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
