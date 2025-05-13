# 4th-SC-Team-8-FE

GDGoC 4th Solution Challenge Team 8 Front-End

You are currently reading english README [
[KO](./README.md)
]

## Acknowledgement

We acknowledge the **potential copyright issues** associated with using YouTube video data.

> [!CAUTION]
> This project is designed solely for **educational and learning purposes** and will not be used for commercial application. Users are responsible for ensuring their use of this project complies with all applicable copyright laws and YouTube's terms of service.

## How to run

First, clone this repository into local storage.

```
git clone git@github.com:GDG-on-Campus-KNU/4th-SC-Team-8-FE.git
cd 4th-SC-Team-8-FE
```

Then create .env file with following contents.
You will need valid api key from Youtube Data v3

```
VITE_YOUTUBE_DATA_API_V3_KEY = '${YOUR_API_KEY_HERE}'
```

Reconfigure `src/shared/ServerEndpoint` and `vite.config.ts` to correctly address the BE server and AI server. Endpoint that is uploaded onto this repository is possibly deprecated and no longer accessable at the point of your testing.

Now install required packages and run

```
npm install
npm run dev
```

## Used Technologies

- React-Vite + Typescript
- MediaPipe

## About project

- Project: Signory
- Purpose: Learning sign language
