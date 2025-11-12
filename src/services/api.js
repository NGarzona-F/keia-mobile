// src/services/api.js
import axios from "axios";
import Constants from "expo-constants";

const EXTRAS = (Constants.expoConfig && Constants.expoConfig.extra) || Constants.manifest?.extra || {};
const BASE_URL = EXTRAS.CLOUD_FUNCTION_BASE_URL || "<TU_CLOUD_FUNCTION_BASE_URL>"; 
// ejemplo: https://us-central1-tu-proyecto.cloudfunctions.net

export async function assessWriting(textSample, uid) {
  const url = `${BASE_URL}/assessWriting`;
  const resp = await axios.post(url, { textSample, uid }, { timeout: 30000 });
  return resp.data; // espera { ok: true, result: {...} }
}

export async function uploadAudioAndAssess(formData) {
  const url = `${BASE_URL}/assessSpeaking`;
  const resp = await axios.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000
  });
  return resp.data;
}
