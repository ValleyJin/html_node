/**
 * API 통신을 담당하는 JavaScript 파일
 * Node.js 서버와 통신하여 사용자 데이터를 저장하고 불러오는 기능을 제공합니다.
 */

// API 기본 URL 설정
const API_BASE_URL = 'http://localhost:3000/api';

// DOM이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소 참조 가져오기
    const saveBtn = document.getElementById('save-btn');
    const loadBtn = document.getElementById('load-btn');
    const savedDataSection = document.getElementById('saved-data-section');
    const savedUsersList = document.getElementById('saved-users-list');
    
    // 현재 표시된 사용자 데이터
    let currentUserData = null;
    
    // 저장 버튼 클릭 이벤트 리스너
    saveBtn.addEventListener('click', function() {
        // 현재 표시된 사용자 데이터가 있는지 확인
        if (!currentUserData) {
            alert('저장할 사용자 데이터가 없습니다. 먼저 사용자 정보를 입력하고 제출해주세요.');
            return;
        }
        
        // 서버에 사용자 데이터 저장 요청
        saveUserData(currentUserData)
            .then(response => {
                alert('사용자 데이터가 성공적으로 저장되었습니다.');
                // 저장된 데이터 목록 새로고침
                loadUserData();
            })
            .catch(error => {
                alert('데이터 저장 중 오류가 발생했습니다: ' + error.message);
            });
    });
    
    // 불러오기 버튼 클릭 이벤트 리스너
    loadBtn.addEventListener('click', function() {
        // 저장된 데이터 섹션 표시 전환
        if (savedDataSection.style.display === 'none') {
            savedDataSection.style.display = 'block';
            loadUserData(); // 사용자 데이터 불러오기
        } else {
            savedDataSection.style.display = 'none';
        }
    });
    
    // 서버에 사용자 데이터 저장 함수
    async function saveUserData(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '서버 오류');
            }
            
            return await response.json();
        } catch (error) {
            console.error('사용자 데이터 저장 오류:', error);
            throw error;
        }
    }
    
    // 서버에서 사용자 데이터 불러오기 함수
    async function loadUserData() {
        try {
            const response = await fetch(`${API_BASE_URL}/users`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '서버 오류');
            }
            
            const users = await response.json();
            displaySavedUsers(users);
        } catch (error) {
            console.error('사용자 데이터 불러오기 오류:', error);
            alert('데이터를 불러오는 중 오류가 발생했습니다: ' + error.message);
        }
    }
    
    // 저장된 사용자 목록 표시 함수
    function displaySavedUsers(users) {
        // 목록 초기화
        savedUsersList.innerHTML = '';
        
        if (users.length === 0) {
            savedUsersList.innerHTML = '<li>저장된 사용자가 없습니다.</li>';
            return;
        }
        
        // 각 사용자 데이터에 대한 목록 항목 생성
        users.forEach(user => {
            const li = document.createElement('li');
            
            // 사용자 정보 표시
            const userInfo = document.createElement('div');
            userInfo.innerHTML = `
                <strong>${user.username}</strong> (${user.age}세) - 
                <span class="color-box" style="background-color: ${user.favoriteColor}"></span>
                ${getColorName(user.favoriteColor)}
            `;
            
            // 삭제 버튼 생성
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '삭제';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', function() {
                deleteUser(user.id);
            });
            
            // 항목에 사용자 정보와 삭제 버튼 추가
            li.appendChild(userInfo);
            li.appendChild(deleteBtn);
            
            // 목록에 항목 추가
            savedUsersList.appendChild(li);
        });
    }
    
    // 사용자 데이터 삭제 함수
    async function deleteUser(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '서버 오류');
            }
            
            alert('사용자 데이터가 삭제되었습니다.');
            loadUserData(); // 목록 새로고침
        } catch (error) {
            console.error('사용자 데이터 삭제 오류:', error);
            alert('데이터를 삭제하는 중 오류가 발생했습니다: ' + error.message);
        }
    }
    
    // 색상 코드에 따른 색상 이름 반환 함수
    function getColorName(colorCode) {
        const colorNames = {
            'red': '빨강',
            'blue': '파랑',
            'green': '초록',
            'yellow': '노랑'
        };
        
        return colorNames[colorCode] || colorCode;
    }
    
    // 기존 script.js의 displayResult 함수를 확장하기 위한 이벤트 리스너 등록
    document.addEventListener('userDataDisplayed', function(event) {
        // 이벤트에서 사용자 데이터 가져오기
        currentUserData = event.detail;
    });
});
