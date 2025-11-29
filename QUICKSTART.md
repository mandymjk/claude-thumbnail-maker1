# 🚀 빠른 시작 가이드

GitHub에 올리고 배포하는 가장 빠른 방법입니다.

## 준비물
- GitHub 계정
- Git 설치 (또는 GitHub Desktop)

## 3단계로 완료!

### 1️⃣ GitHub 레포 생성
https://github.com/new 에서 새 레포 만들기
- 이름: `thumbnail-maker`
- Public 선택
- Create repository 클릭

### 2️⃣ 파일 업로드
다운로드 받은 `thumbnail-maker-github` 폴더에서:

```bash
cd thumbnail-maker-github
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/thumbnail-maker.git
git push -u origin main
```

### 3️⃣ GitHub Pages 활성화
레포 Settings > Pages에서:
- Source: **GitHub Actions** 선택
- 완료!

2-3분 후 `https://your-username.github.io/thumbnail-maker/` 에서 확인 가능합니다.

---

## 더 자세한 내용은?
- [DEPLOYMENT.md](./DEPLOYMENT.md) 참고

## 문제가 있나요?
- Actions 탭에서 배포 상태 확인
- 로컬에서 `npm install && npm run build` 테스트

끝! 🎉
