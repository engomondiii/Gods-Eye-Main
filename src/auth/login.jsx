import React, { useState, useContext } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { AuthContext } from "./authContext";

export default function Login({ navigation }) {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      login({ email });
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />

      <Button title="Login" onPress={handleLogin} />

      <Text onPress={() => navigation.navigate("Register")}>
        Don't have an account? Register
      </Text>
    </View>
  );
}