import React from "react";
import { View, Text, Button, Alert } from "react-native";
import { markAttendance } from "../services/attendanceService";

const TestAttendanceScreen = () => {

  const handleMarkPresent = async () => {
    const student = {
      id: "S001",
      name: "Test Student",
      class: "Grade 6",
      guardianPhone: "+254700000000" // replace later
    };

    const result = await markAttendance(student, "present");

    if (result.success) {
      Alert.alert("Success", "Attendance saved ✔");
    } else {
      Alert.alert("Error", "Failed to save attendance");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Test Attendance System
      </Text>

      <Button title="Mark Present" onPress={handleMarkPresent} />
    </View>
  );
};

export default TestAttendanceScreen;