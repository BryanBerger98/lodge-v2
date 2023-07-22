#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == "main" || "$VERCEL_GIT_COMMIT_REF" == "develop" ]] ; then
  if npx turbo-ignore 2> /dev/null; then
    # Don't build
    echo "🛑 - Build cancelled"
    exit 0;
  else
    # Proceed with the build
    echo "✅ - Build can proceed"
    exit 1;
  fi
else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
fi