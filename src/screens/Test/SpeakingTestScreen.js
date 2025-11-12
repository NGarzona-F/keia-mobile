// src/screens/Test/SpeakingTestScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, Button, ActivityIndicator, Alert } from "react-native";
import * as Audio from "expo-av";
import { uploadAudioAndAssess } from "../../services/api";
import { auth, db } from "../../firebaseConfig";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

export default function SpeakingTestScreen({ navigation }) {
  const [recording, setRecording] = useState(null);
  const [loading, setLoading] = useState(false);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    return () => {
      if (recording) recording.stopAndUnloadAsync();
    };
  }, [recording]);

  async function startRecording() {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Necesitamos permiso para grabar audio.");
        return;
      }
      await Audio.Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const r = new Audio.Recording();
      await r.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await r.startAsync();
      setRecording(r);
    } catch (err) {
      console.error("startRecording error", err);
    }
  }

  async function stopRecordingAndUpload() {
    try {
      setLoading(true);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const formData = new FormData();
      formData.append("file", { uri, name: "speech.wav", type: "audio/wav" });
      formData.append("uid", uid);

      const resp = await uploadAudioAndAssess(formData);
      if (!resp.ok) throw new Error(resp.error || "No response");

      const result = resp.result;
      if (uid) {
        await updateDoc(doc(db, "users", uid), {
          level: result.level,
          levelConfidence: result.confidence,
          lastAssessmentAt: serverTimestamp()
        });
      }

      Alert.alert("Resultado (speaking):", `${result.level} (conf ${Math.round(result.confidence*100)}%)`);
      navigation.replace("Home", { level: result.level });
    } catch (err) {
      console.error("speaking upload error", err);
      Alert.alert("Error", err.message || "No se pudo evaluar el audio.");
    } finally {
      setLoading(false);
      setRecording(null);
    }
  }

  return (
    <View style={{ flex:1, padding:20 }}>
      <Text style={{fontSize:18,fontWeight:"bold",marginBottom:12}}>Prueba de speaking (30–60s)</Text>
      {!recording ? (
        <Button title="Iniciar grabación" onPress={startRecording} />
      ) : (
        <Button title="Detener y enviar" onPress={stopRecordingAndUpload} />
      )}
      {loading && <ActivityIndicator />}
    </View>
  );
}
