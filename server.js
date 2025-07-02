// Express 서버 관련 모듈 가져오기
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Express 애플리케이션 생성
const app = express();
const PORT = 3000;

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

// 미들웨어 설정
app.use(cors()); // CORS 활성화
app.use(bodyParser.json()); // JSON 요청 본문 파싱
app.use(express.static(__dirname)); // 정적 파일 제공

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

// 서버 시작
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
