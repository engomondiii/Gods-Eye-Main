import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (email && password) {
      navigation.navigate("Login");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Register</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}