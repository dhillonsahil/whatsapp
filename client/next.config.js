/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env:{
    NEXT_PUBLIC_ZEGO_APP_ID:894662259,
    NEXT_PUBLIC_ZEGO_SERVER_ID:"62dc765abcdf7a0af1e0cb6192b49210"
  },
  images:{
    domains:["localhost"]
  }
};

module.exports = nextConfig;
