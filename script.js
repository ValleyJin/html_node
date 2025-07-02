// DOM이 완전히 로드된 후 실행되는 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
    // HTML 요소 참조 가져오기
    const userForm = document.getElementById('user-form'); // 폼 요소
    const usernameInput = document.getElementById('username'); // 이름 입력 필드
    const ageInput = document.getElementById('age'); // 나이 입력 필드
    const colorSelect = document.getElementById('favorite-color'); // 색상 선택 드롭다운
    const resultDisplay = document.getElementById('result-display'); // 결과 표시 영역
    
    // 폼 제출 이벤트 리스너 등록
    userForm.addEventListener('submit', function(event) {
        // 기본 제출 동작 방지 (페이지 새로고침 방지)
        event.preventDefault();
        
        // 입력값 가져오기
        const username = usernameInput.value.trim(); // 앞뒤 공백 제거
        const age = ageInput.value;
        const favoriteColor = colorSelect.value;
        
        // 입력 유효성 검사
        if (!username) {
            showError('이름을 입력해주세요.');
            return;
        }
        
        if (!age) {
            showError('나이를 입력해주세요.');
            return;
        }
        
        if (!favoriteColor) {
            showError('좋아하는 색상을 선택해주세요.');
            return;
        }
        
        // 유효한 입력이면 결과 표시
        displayResult(username, age, favoriteColor);
        
        // 폼 초기화
        userForm.reset();
    });
    
    // 오류 메시지 표시 함수
    function showError(message) {
        // 알림 창으로 오류 메시지 표시
        alert(message);
    }
    
    // 결과 표시 함수
    function displayResult(name, age, color) {
        // 결과 HTML 생성
        const resultHTML = `
            <h3>사용자 정보</h3>
            <p><strong>이름:</strong> ${name}</p>
            <p><strong>나이:</strong> ${age}세</p>
            <p><strong>좋아하는 색상:</strong> <span class="color-box" style="background-color: ${color}"></span> ${getColorName(color)}</p>
        `;
        
        // 결과 영역에 HTML 삽입
        resultDisplay.innerHTML = resultHTML;
        
        // 결과 영역에 애니메이션 효과 추가
        resultDisplay.classList.add('fade-in');
        
        // 애니메이션 효과 제거 (다음 애니메이션을 위해)
        setTimeout(() => {
            resultDisplay.classList.remove('fade-in');
        }, 500);
        
        // 색상에 따라 결과 영역 테두리 색상 변경
        resultDisplay.style.borderColor = color;
    }
    
    // 색상 코드에 따른 색상 이름 반환 함수
    function getColorName(colorCode) {
        // 색상 코드에 따른 한글 이름 매핑
        const colorNames = {
            'red': '빨강',
            'blue': '파랑',
            'green': '초록',
            'yellow': '노랑'
        };
        
        // 해당 색상 이름 반환 (없으면 색상 코드 그대로 반환)
        return colorNames[colorCode] || colorCode;
    }
    
    // 추가 CSS 스타일 동적 생성
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* 색상 표시 박스 스타일 */
        .color-box {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 5px;
            border: 1px solid #ddd;
            vertical-align: middle;
        }
        
        /* 페이드인 애니메이션 효과 */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .fade-in {
            animation: fadeIn 0.5s;
        }
    `;
    
    // 스타일 요소를 문서 헤드에 추가
    document.head.appendChild(styleElement);
});
