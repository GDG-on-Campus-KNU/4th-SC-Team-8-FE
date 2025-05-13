# 4th-SC-Team-8-FE

GDGoC 4기 Solution Challenge 8팀 Front-End

당신은 한글 버전 README를 읽고 있습니다. [
[EN](./README_en.md)
]

## 중요

저희 팀은 YouTube 영상 데이터를 사용하는 것과 관련해 해당 프로젝트가 **잠재적인 저작권 문제**를 일으킬 수 있음을 인지하고 있습니다.

> [!CAUTION]
> 해당 프로젝트는 오직 **교육 및 학습 목적**으로 설계되었으며 상업적인 용도로 사용되지 않을 것입니다. 해당 프로젝트를 사용하는 개발자에게는 모든 관련 저작권법 및 YouTube 서비스 약관을 준수할 책임이 있습니다.

## 실행 방법

먼저 저장소를 로컬 저장소로 복제하세요.

```
git clone git@github.com:GDG-on-Campus-KNU/4th-SC-Team-8-FE.git
cd 4th-SC-Team-8-FE
```

이후 다음 내용으로 .env 파일을 생성하세요.
Youtube Data v3의 유효한 API 키가 필요합니다.

```
VITE_YOUTUBE_DATA_API_V3_KEY = '${YOUR_API_KEY_HERE}'
```

`src/shared/ServerEndpoint및vite.config.ts`를 재구성하여 BE 서버 및 AI 서버 주소를 올바르게 지정하세요. 이 저장소에 업로드된 주소는 테스트 시점에 더 이상 액세스할 수 없을 수 있습니다.

다음으로, 필요한 패키지를 설치하고 실행하세요.

```
npm install
npm run dev
```

## 사용 기술

- React-Vite + Typescript
- MediaPipe

## 프로젝트 상세

- 프로젝트: Signory
- 목적: Learning sign language
