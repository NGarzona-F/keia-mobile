import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default function HomeScreen({ route, navigation }) {
  const { level, runTest } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a KeIA</Text>
      <Text style={{ marginTop: 12 }}>Nivel: {level || "Por definir"}</Text>
      {runTest ? <Text style={{ marginTop: 8 }}>Se iniciaría el test ahora (por implementar)</Text> : null}
      <View style={{ height: 20 }} />
      <Button title="Cerrar sesión" onPress={() => { signOut(auth); navigation.replace("Login"); }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22 }
});
