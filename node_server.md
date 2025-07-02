# Node.js 서버 기능 설명

이 문서는 HTML, CSS, JavaScript 기초 학습 프로젝트에 추가된 Node.js 서버 기능에 대해 설명합니다. 사용자가 '제출' 버튼이나 '불러오기' 버튼을 누르는 순간부터 서버에 데이터가 저장되고 화면에 표시되는 과정을 코드와 함께 설명합니다.

## 프로젝트 구조 업데이트

```
html_basic/
├── index.html     # HTML 구조 정의
├── styles.css     # CSS 스타일 정의
├── script.js      # 기본 JavaScript 동작 정의
├── api.js         # API 통신 관련 JavaScript
├── server.js      # Node.js 서버 코드
├── package.json   # 프로젝트 의존성 정의
├── data/          # 데이터 저장 디렉토리
│   └── users.json # 사용자 데이터 저장 파일
└── README.md      # 프로젝트 설명
```

## 데이터 흐름 개요

1. 사용자가 폼에 데이터 입력 후 '제출' 버튼 클릭
2. `script.js`에서 입력 데이터 처리 및 화면에 표시
3. 사용자가 '서버에 저장' 버튼 클릭
4. `api.js`에서 데이터를 서버로 전송
5. `server.js`에서 데이터 검증 후 파일에 저장
6. 사용자가 '저장된 데이터 불러오기' 버튼 클릭
7. `api.js`에서 서버에 데이터 요청
8. `server.js`에서 파일에서 데이터 읽어서 응답
9. `api.js`에서 받은 데이터를 화면에 표시

## 상세 코드 설명

### 1. 사용자 데이터 제출 과정

#### 1.1 폼 제출 처리 (`script.js`)

```javascript
// 폼 제출 이벤트 리스너 등록
userForm.addEventListener('submit', function(event) {
    // 기본 제출 동작 방지 (페이지 새로고침 방지)
    event.preventDefault();
    
    // 입력값 가져오기
    const username = usernameInput.value.trim();
    const age = ageInput.value;
    const favoriteColor = colorSelect.value;
    
    // 입력 유효성 검사
    if (!username || !age || !favoriteColor) {
        showError('모든 필드를 입력해주세요.');
        return;
    }
    
    // 유효한 입력이면 결과 표시
    displayResult(username, age, favoriteColor);
});
```

#### 1.2 결과 표시 및 사용자 데이터 이벤트 발생 (`script.js`)

```javascript
// 결과 표시 함수
function displayResult(name, age, color) {
    // 결과 HTML 생성 및 표시
    const resultHTML = `
        <h3>사용자 정보</h3>
        <p><strong>이름:</strong> ${name}</p>
        <p><strong>나이:</strong> ${age}세</p>
        <p><strong>좋아하는 색상:</strong> <span class="color-box" style="background-color: ${color}"></span> ${getColorName(color)}</p>
    `;
    resultDisplay.innerHTML = resultHTML;
    
    // 사용자 데이터 객체 생성
    const userData = {
        username: name,
        age: parseInt(age),
        favoriteColor: color
    };
    
    // 사용자 데이터 표시 이벤트 발생 (api.js에서 사용하기 위해)
    const userDataEvent = new CustomEvent('userDataDisplayed', {
        detail: userData
    });
    document.dispatchEvent(userDataEvent);
}
```

### 2. 서버에 데이터 저장 과정

#### 2.1 저장 버튼 클릭 처리 (`api.js`)

```javascript
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

// script.js에서 발생한 사용자 데이터 이벤트 수신
document.addEventListener('userDataDisplayed', function(event) {
    // 이벤트에서 사용자 데이터 가져오기
    currentUserData = event.detail;
});
```

#### 2.2 서버에 데이터 전송 함수 (`api.js`)

```javascript
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
```

#### 2.3 서버에서 데이터 저장 처리 (`server.js`)

```javascript
// 사용자 데이터 저장 API
app.post('/api/users', (req, res) => {
    try {
        // 요청 본문에서 사용자 데이터 가져오기
        const newUser = req.body;
        
        // 필수 필드 검증
        if (!newUser.username || !newUser.age || !newUser.favoriteColor) {
            return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
        }
        
        // 파일에서 기존 데이터 읽기
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        const users = JSON.parse(data);
        
        // 새 사용자에게 고유 ID 부여
        newUser.id = Date.now().toString();
        newUser.createdAt = new Date().toISOString();
        
        // 새 사용자 추가
        users.push(newUser);
        
        // 파일에 업데이트된 데이터 저장
        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
        
        res.status(201).json(newUser);
    } catch (error) {
        console.error('사용자 데이터 저장 오류:', error);
        res.status(500).json({ error: '데이터를 저장하는 중 오류가 발생했습니다.' });
    }
});
```

### 3. 저장된 데이터 불러오기 과정

#### 3.1 불러오기 버튼 클릭 처리 (`api.js`)

```javascript
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
```

#### 3.2 서버에서 데이터 요청 함수 (`api.js`)

```javascript
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
```

#### 3.3 서버에서 데이터 제공 처리 (`server.js`)

```javascript
// 사용자 데이터 가져오기 API
app.get('/api/users', (req, res) => {
    try {
        // 파일에서 사용자 데이터 읽기
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        const users = JSON.parse(data);
        res.json(users);
    } catch (error) {
        console.error('사용자 데이터 읽기 오류:', error);
        res.status(500).json({ error: '데이터를 불러오는 중 오류가 발생했습니다.' });
    }
});
```

#### 3.4 불러온 데이터 화면에 표시 (`api.js`)

```javascript
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
```

### 4. 사용자 데이터 삭제 과정

#### 4.1 삭제 버튼 클릭 처리 및 서버 요청 (`api.js`)

```javascript
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
```

#### 4.2 서버에서 데이터 삭제 처리 (`server.js`)

```javascript
// 특정 사용자 데이터 삭제 API
app.delete('/api/users/:id', (req, res) => {
    try {
        const userId = req.params.id;
        
        // 파일에서 기존 데이터 읽기
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        let users = JSON.parse(data);
        
        // 해당 ID의 사용자 찾기
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex === -1) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }
        
        // 사용자 제거
        users.splice(userIndex, 1);
        
        // 파일에 업데이트된 데이터 저장
        fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
        
        res.json({ message: '사용자가 삭제되었습니다.' });
    } catch (error) {
        console.error('사용자 데이터 삭제 오류:', error);
        res.status(500).json({ error: '데이터를 삭제하는 중 오류가 발생했습니다.' });
    }
});
```

## 서버 구성 요소 설명

### 1. 서버 설정 및 미들웨어

```javascript
// Express 애플리케이션 생성
const app = express();
const PORT = 3000;

// 미들웨어 설정
app.use(cors()); // CORS 활성화 (다른 도메인에서의 요청 허용)
app.use(bodyParser.json()); // JSON 요청 본문 파싱
app.use(express.static(__dirname)); // 정적 파일 제공
```

### 2. 데이터 저장소 설정

```javascript
// 데이터 저장 파일 경로
const DATA_FILE = path.join(__dirname, 'data', 'users.json');

// 데이터 디렉토리 확인 및 생성
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// 데이터 파일 확인 및 생성
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
}
```

## 실행 방법

1. 필요한 패키지 설치:
   ```
   npm install
   ```

2. 서버 실행:
   ```
   node server.js
   ```

3. 웹 브라우저에서 `http://localhost:3000` 접속

## 학습 포인트

1. **Node.js와 Express**: 서버 구축, 라우팅, 미들웨어 활용
2. **REST API**: HTTP 메서드(GET, POST, DELETE)를 활용한 API 설계
3. **비동기 통신**: Fetch API를 사용한 클라이언트-서버 통신
4. **파일 시스템**: Node.js의 fs 모듈을 활용한 데이터 영속성
5. **이벤트 기반 프로그래밍**: 커스텀 이벤트를 활용한 컴포넌트 간 통신
6. **에러 처리**: 클라이언트와 서버 양쪽에서의 예외 처리
