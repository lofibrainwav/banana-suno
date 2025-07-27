import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SUNO_TOKEN: string | undefined = process.env.SUNO_TOKEN;

if (!SUNO_TOKEN) {
  throw new Error('SUNO_TOKEN is not defined in .env');
}

interface SunoResponse {
  message: string;
}

async function callSunoApi(): Promise<SunoResponse> {
  const response: AxiosResponse<SunoResponse> = await axios.get(
    'https://api.suno.ai/v1/test',
    {
      headers: {
        Authorization: `Bearer ${SUNO_TOKEN}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
}

callSunoApi()
  .then((data) => {
    console.log('Suno API response:', data);
  })
  .catch((err) => {
    console.error('Failed to call Suno API:', err);
  });
