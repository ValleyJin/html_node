# HTML, CSS, JavaScript 기초 학습 프로젝트

이 프로젝트는 웹 개발의 3가지 핵심 기술인 HTML, CSS, JavaScript의 기본 개념을 학습하기 위한 간단한 웹 애플리케이션입니다.

## 프로젝트 구조

```
html_basic/
├── index.html    # HTML 구조 정의
├── styles.css    # CSS 스타일 정의
├── script.js     # JavaScript 동작 정의
└── README.md     # 프로젝트 설명
```

## 핵심 기술 설명

### 1. HTML (HyperText Markup Language)
- 웹 페이지의 구조와 콘텐츠를 정의하는 마크업 언어
- 주요 요소:
  - `<!DOCTYPE html>`: HTML5 문서 선언
  - `<html>`: 전체 HTML 문서의 루트 요소
  - `<head>`: 메타데이터, 스타일, 스크립트 참조 등을 포함
  - `<body>`: 사용자에게 보이는 실제 콘텐츠
  - `<header>`, `<main>`, `<footer>`: 시맨틱 구조 요소
  - `<form>`, `<input>`, `<select>`: 사용자 입력 요소

### 2. CSS (Cascading Style Sheets)
- 웹 페이지의 시각적 표현과 레이아웃을 정의하는 스타일 언어
- 주요 개념:
  - 선택자(Selector): 스타일을 적용할 HTML 요소 지정
  - 속성(Property): 색상, 크기, 여백 등의 스타일 특성
  - 값(Value): 속성에 할당되는 구체적인 설정
  - 박스 모델: 콘텐츠, 패딩, 테두리, 마진으로 구성된 레이아웃 모델
  - 반응형 디자인: 다양한 화면 크기에 맞게 조정되는 레이아웃

### 3. JavaScript
- 웹 페이지에 동적 기능을 추가하는 프로그래밍 언어
- 주요 기능:
  - DOM 조작: HTML 요소 선택, 수정, 추가, 삭제
  - 이벤트 처리: 사용자 상호작용(클릭, 입력 등)에 반응
  - 폼 유효성 검사: 사용자 입력 데이터 검증
  - 동적 콘텐츠 생성: 데이터에 기반한 HTML 콘텐츠 생성
  - 애니메이션: 시각적 효과 구현

## 핵심 코드 설명

### HTML 핵심 코드
```html
<!-- 기본 HTML 구조 -->
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>웹 기초 학습</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- 콘텐츠 구조 -->
    <header>...</header>
    <main>
        <section id="user-input-section">...</section>
        <section id="result-section">...</section>
    </main>
    <footer>...</footer>
    <script src="script.js"></script>
</body>
</html>
```

### CSS 핵심 코드
```css
/* 기본 스타일 설정 */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
}

/* 레이아웃 구성 */
main {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
    main {
        flex-direction: column;
    }
    
    section {
        min-width: 100%;
    }
}
```

### JavaScript 핵심 코드
```javascript
// DOM 로드 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 요소 참조 가져오기
    const userForm = document.getElementById('user-form');
    
    // 이벤트 리스너 등록
    userForm.addEventListener('submit', function(event) {
        // 기본 동작 방지
        event.preventDefault();
        
        // 입력값 가져오기 및 처리
        const username = usernameInput.value.trim();
        
        // 유효성 검사 및 결과 표시
        if (조건) {
            showError('메시지');
        } else {
            displayResult(데이터);
        }
    });
});
```

## 실행 방법

1. 프로젝트 폴더의 `index.html` 파일을 웹 브라우저에서 열기
2. 또는 로컬 웹 서버를 사용하여 실행:
   ```
   # Python을 사용한 간단한 웹 서버 실행 예시
   python -m http.server
   ```
   그리고 브라우저에서 `http://localhost:8000` 접속

## 학습 포인트

1. **HTML**: 시맨틱 태그 사용, 폼 구조, 문서 구조화
2. **CSS**: 선택자, 박스 모델, Flexbox 레이아웃, 반응형 디자인
3. **JavaScript**: DOM 조작, 이벤트 처리, 폼 유효성 검사, 동적 콘텐츠 생성

이 프로젝트를 통해 웹 개발의 기초를 이해하고, 세 가지 핵심 기술이 어떻게 상호작용하는지 배울 수 있습니다.
