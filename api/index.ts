{
  "version": 2,
  "functions": {
    "api/index.ts": {
      "runtime": "@vercel/node@1.14.0"
    }
  },
  "routes": [
    {
      "src": "/(.*)",
      "dest": "api/index.ts"
    }
  ]
}
