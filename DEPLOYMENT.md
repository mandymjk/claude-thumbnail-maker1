# GitHub 업로드 및 배포 가이드

## 📦 1단계: GitHub 레포지토리 생성

1. https://github.com/new 접속
2. Repository name: `thumbnail-maker` 입력
3. **Public** 선택
4. **Create repository** 클릭

## 💻 2단계: 로컬에서 Git 초기화 및 푸시

### 방법 A: 커맨드라인 사용

```bash
# thumbnail-maker-github 폴더로 이동
cd thumbnail-maker-github

# Git 초기화
git init

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: React thumbnail maker with FLO design"

# 원격 저장소 연결 (your-username을 본인 GitHub 사용자명으로 변경)
git remote add origin https://github.com/your-username/thumbnail-maker.git

# 푸시
git branch -M main
git push -u origin main
```

### 방법 B: GitHub Desktop 사용

1. GitHub Desktop 열기
2. File > Add Local Repository
3. `thumbnail-maker-github` 폴더 선택
4. "Create a repository" 클릭하면 자동으로 Git 초기화
5. Publish repository 클릭

### 방법 C: GitHub 웹에서 직접 업로드

1. 생성한 레포지토리로 이동
2. "uploading an existing file" 링크 클릭
3. `thumbnail-maker-github` 폴더 내 모든 파일/폴더 드래그
4. Commit changes

## 🚀 3단계: GitHub Pages 설정

### 자동 배포 (GitHub Actions 사용) - 권장

1. 레포지토리 **Settings** 탭 클릭
2. 왼쪽 메뉴에서 **Pages** 클릭
3. **Source** 섹션에서:
   - **GitHub Actions** 선택
4. 이제 `main` 브랜치에 푸시할 때마다 자동으로 배포됩니다

배포 상태 확인:
- **Actions** 탭에서 워크플로우 실행 상태 확인
- 성공하면 녹색 체크 표시
- 약 2-3분 소요

배포 URL: `https://your-username.github.io/thumbnail-maker/`

## ✅ 4단계: 확인

1. Actions 탭에서 배포 완료 확인 (녹색 체크)
2. `https://your-username.github.io/thumbnail-maker/` 접속
3. 정상 작동 확인

## 🔄 이후 업데이트 방법

코드 수정 후:

```bash
git add .
git commit -m "Update: 변경 내용 설명"
git push
```

푸시하면 자동으로 재배포됩니다!

## 🐛 문제 해결

### 페이지가 안 보이는 경우

1. **Actions 탭 확인**
   - 워크플로우가 성공했는지 확인
   - 실패했다면 로그 확인

2. **Settings > Pages 확인**
   - Source가 "GitHub Actions"인지 확인

3. **브라우저 캐시 삭제**
   - Ctrl + Shift + R (하드 리프레시)

4. **시간 대기**
   - 첫 배포는 최대 10분 소요 가능

### 빌드 실패하는 경우

```bash
# 로컬에서 빌드 테스트
npm install
npm run build

# 성공하면 다시 푸시
git add .
git commit -m "Fix build"
git push
```

## 📝 추가 팁

### 커스텀 도메인 설정

Settings > Pages > Custom domain에서 설정 가능

### HTTPS 강제

Settings > Pages > "Enforce HTTPS" 체크

### 브랜치 보호

Settings > Branches > Add rule로 main 브랜치 보호 설정 가능

---

완료! 🎉
