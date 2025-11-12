import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const levels = ["A1","A2","B1","B2","C1","C2","No sé / Hacer test"];

export default function LevelQuestionScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cuál es tu nivel de inglés?</Text>
      {levels.map((lvl) => (
        <View key={lvl} style={{ marginVertical: 6 }}>
          <Button title={lvl} onPress={() => {
            if (lvl === "No sé / Hacer test") navigation.navigate("Home", { runTest: true });
            else navigation.replace("Home", { level: lvl });
          }} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 20, marginBottom: 20, textAlign: "center" }
});
