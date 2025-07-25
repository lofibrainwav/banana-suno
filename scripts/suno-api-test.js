// 비공식 Suno API 테스트 스크립트
const axios = require('axios');

const headers = {
  'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
  'Content-Type': 'application/json'
};

const data = {
  prompt: "A sad lo-fi song about rainy nights and loneliness",
  tags: ["lofi", "rain", "female vocal"],
  mv: false,
  continue_clip_id: null
};

axios.post('https://studio-api.suno.ai/api/generate/v2/', data, { headers })
  .then(response => {
    console.log("🎧 생성 요청 완료:", response.data);
  })
  .catch(error => {
    console.error("❌ 오류 발생:", error.message);
  });