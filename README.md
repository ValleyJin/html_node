# 웹 기초 학습 프로젝트

이 프로젝트는 HTML, CSS, JavaScript를 사용한 기본적인 웹 애플리케이션으로, Node.js 서버와 통신하여 사용자 데이터를 저장하고 불러오는 기능을 제공합니다.

## 데이터 처리 흐름

### 1. '제출' 버튼 클릭 시 데이터 처리 과정

사용자가 폼을 작성하고 '제출' 버튼을 클릭하면 다음과 같은 과정이 진행됩니다:

#### 클라이언트 측 처리 (script.js)

1. **이벤트 리스너 등록**
   ```javascript
   userForm.addEventListener('submit', function(event) {
       // 기본 제출 동작 방지 (페이지 새로고침 방지)
       event.preventDefault();
       
       // 입력값 가져오기
       const username = usernameInput.value.trim();
       const age = ageInput.value;
       const favoriteColor = colorSelect.value;
       
       // 입력 유효성 검사
       // ...
       
       // 유효한 입력이면 결과 표시
       displayResult(username, age, favoriteColor);
       
       // 폼 초기화
       userForm.reset();
   });
   ```

2. **결과 표시 함수 (displayResult)**
   ```javascript
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
       
       // 사용자 데이터 객체 생성
       const userData = {
           username: name,
           age: parseInt(age),
           favoriteColor: color
       };
       
       // 사용자 데이터 표시 이벤트 발생 (다른 스크립트에서 사용하기 위해)
       const userDataEvent = new CustomEvent('userDataDisplayed', {
           detail: userData
       });
       document.dispatchEvent(userDataEvent);
   }
   ```

3. **API.js에서 이벤트 수신**
   ```javascript
   document.addEventListener('userDataDisplayed', function(event) {
       // 이벤트에서 사용자 데이터 가져오기
       currentUserData = event.detail;
   });
   ```

### 2. '서버에 저장' 버튼 클릭 시 데이터 처리 과정

사용자가 '서버에 저장' 버튼을 클릭하면 다음과 같은 과정이 진행됩니다:

#### 클라이언트 측 처리 (api.js)

1. **저장 버튼 클릭 이벤트 리스너**
   ```javascript
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
   ```

2. **서버에 데이터 저장 함수 (saveUserData)**
   ```javascript
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

#### 서버 측 처리 (server.js)

1. **사용자 데이터 저장 API 엔드포인트**
   ```javascript
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

### 3. '저장된 데이터 불러오기' 버튼 클릭 시 데이터 처리 과정

사용자가 '저장된 데이터 불러오기' 버튼을 클릭하면 다음과 같은 과정이 진행됩니다:

#### 클라이언트 측 처리 (api.js)

1. **불러오기 버튼 클릭 이벤트 리스너**
   ```javascript
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

2. **서버에서 데이터 불러오기 함수 (loadUserData)**
   ```javascript
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

3. **불러온 데이터 표시 함수 (displaySavedUsers)**
   ```javascript
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

#### 서버 측 처리 (server.js)

1. **사용자 데이터 가져오기 API 엔드포인트**
   ```javascript
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

## 데이터 흐름 요약

1. **제출 버튼 클릭 시**:
   - 사용자 입력 데이터 수집 및 유효성 검사
   - 화면에 결과 표시
   - 사용자 데이터 객체 생성 및 이벤트 발생

2. **서버에 저장 버튼 클릭 시**:
   - 현재 사용자 데이터 확인
   - 서버에 POST 요청 전송
   - 서버에서 데이터 검증 및 파일에 저장
   - 저장 성공/실패 알림 표시

3. **저장된 데이터 불러오기 버튼 클릭 시**:
   - 저장된 데이터 섹션 표시/숨김 전환
   - 서버에 GET 요청 전송
   - 서버에서 파일 데이터 읽기
   - 불러온 데이터를 화면에 목록으로 표시

이 프로젝트는 클라이언트-서버 통신의 기본 원리를 보여주며, 사용자 데이터의 입력, 저장, 불러오기, 삭제 등의 CRUD(Create, Read, Update, Delete) 작업을 구현하고 있습니다.
