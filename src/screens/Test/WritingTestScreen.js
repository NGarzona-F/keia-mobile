// src/screens/Test/WritingTestScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { assessWriting } from "../../services/api";
import { auth, db } from "../../firebaseConfig";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

export default function WritingTestScreen({ navigation }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const uid = auth.currentUser?.uid;

  const handleSubmit = async () => {
    if (!text || text.trim().length < 20) {
      Alert.alert("Escribe más", "Por favor escribe al menos 20 caracteres para evaluar.");
      return;
    }
    setLoading(true);
    try {
      const resp = await assessWriting(text, uid); // llama la cloud function
      if (!resp.ok) throw new Error(resp.error || "Error en evaluación");

      const result = resp.result;
      // Guardar resultado de test en una subcolección o actualizar user
      if (uid) {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, {
          level: result.level,
          levelConfidence: result.confidence,
          lastAssessmentAt: serverTimestamp()
        });
      }

      // Mostrar resultado al usuario
      Alert.alert("Resultado:", `Nivel: ${result.level} (confianza ${Math.round(result.confidence*100)}%)`);
      // Navega a Home o a SpeakingTest si quieres evaluar speaking también
      navigation.replace("Home", { level: result.level });
    } catch (err) {
      console.error("WritingTest error:", err);
      Alert.alert("Error", err.message || "No se pudo evaluar en este momento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prueba de escritura — describe tu día (60–120 palabras)</Text>
      <TextInput
        style={styles.input}
        multiline
        value={text}
        onChangeText={setText}
        placeholder="Write here..."
        numberOfLines={8}
      />
      {loading ? <ActivityIndicator /> : <Button title="Enviar y evaluar" onPress={handleSubmit} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:20},
  title:{fontSize:18,fontWeight:"bold",marginBottom:10},
  input:{borderWidth:1,borderColor:"#ccc",borderRadius:8,padding:12,minHeight:140,textAlignVertical:"top"}
});
