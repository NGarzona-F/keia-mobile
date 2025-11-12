// src/screens/Auth/RegisterScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidForm = () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!isValidForm()) return;

    setLoading(true);
    console.log("[register] Starting registration flow...");

    try {
      // 1) crear usuario en Firebase Auth
      console.log("[register] Creating Firebase Auth user...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("[register] Usuario creado:", user.uid);

      // 2) actualizar displayName
      try {
        await updateProfile(user, { displayName: username });
        console.log("[register] displayName actualizado.");
      } catch (err) {
        console.warn("[register] updateProfile no disponible:", err);
      }

      // 3) guardar documento en Firestore
      try {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          username: username.trim().toLowerCase(),
          email: user.email,
          displayName: username,
          createdAt: serverTimestamp(),
          level: null,
          levelConfidence: 0,
          xp: 0,
          streak: { count: 0, lastActive: null },
          avatar: "default.png",
        });
        console.log("[register] Documento creado correctamente en Firestore.");
      } catch (err) {
        console.warn("[register] Error guardando en Firestore (pero el usuario ya existe en Auth):", err);
        // Puedes decidir si quieres borrar el usuario en Auth aquí (rollback) o permitir continuar.
      }

      setLoading(false);
      Alert.alert("Éxito", "Cuenta creada correctamente 🎉");

      // ❗ Usa el nombre EXACTO que tienes en RootNavigator (LevelQuestion)
      navigation.replace("LevelQuestion");
    } catch (error) {
      setLoading(false);
      console.error("[register] Error al registrarse:", error);
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "El correo ya está en uso. Intenta iniciar sesión o usa otro correo.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "El correo ingresado no es válido.");
      } else {
        Alert.alert("Error", error.message || "Ocurrió un error al crear la cuenta.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña (min 6 caracteres)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, loading ? styles.buttonDisabled : null]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Registrarse</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>

      <View style={{ height: 20 }} />
      <Text style={styles.small}>
        Al registrarte aceptas los términos. (Esto es demo — agrega política real antes de producción.)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#4a90e2",
    padding: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  link: { color: "#4a90e2", marginTop: 15 },
  small: { fontSize: 12, color: "#666", textAlign: "center", marginTop: 10 },
});
