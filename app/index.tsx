import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Progress from "react-native-progress";
import { useTodos, Todo } from "@/data/useTodos";

const TIME_LIMITS = [1, 15, 60, 1440];

function minutesToHeader(minutes: number): string {
  switch (minutes) {
    case 1:
      return "1 m";
    case 15:
      return "15 m";
    case 60:
      return "1 hr";
    case 1440:
      return "24 hr";
    default:
      return "15 m";
  }
}

const ToDoScreen: React.FC = () => {
  const {todos, setTodos} = useTodos();
  const [newTodo, setNewTodo] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<number>(15);

  const getCurrentTimestamp = (): string => {
    return new Date().toISOString().slice(0, 19).replace("T", " ");
  };

  const calculateProgress = (timestamp: string, timeLimit: number): number => {
    const createdTime = new Date(timestamp).getTime();
    const currentTime = new Date(getCurrentTimestamp()).getTime();
    const elapsedTime = (currentTime - createdTime) / (1000 * 60); // convert to minutes

    // Ensure progress stays between 0 and 1
    return Math.max(0, 1 - elapsedTime / timeLimit);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTodos(async (prevTodos) => {
        (await prevTodos).forEach((todo) => {
          if (todo.timeLimit && todo.timestamp) {
            const progress = calculateProgress(todo.timestamp, todo.timeLimit);
            if (progress <= 0) {
              todo.abandoned = true;
            }
          }
        });
        return [...await prevTodos];
      }); // trigger re-render
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now().toString(),
          text: newTodo,
          completed: false,
          timestamp: getCurrentTimestamp(),
          timeLimit: selectedTime,
        },
      ]);
      setNewTodo("");
    }
  };

  const toggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const renderTodo = ({ item }: { item: Todo }) => {
    const progress = calculateProgress(item.timestamp!, item.timeLimit!);
    return (
      <View style={$todoItem}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => toggleComplete(item.id)}
        >
          <Text
            style={[
              item.completed ? $completedText : $todoText,
              { opacity: 0.05 + 0.95 * progress },
            ]}
          >
            {item.text}
          </Text>
        </TouchableOpacity>
        <Progress.Pie
          progress={progress}
          size={20}
          color="#ccc"
          style={$progressIndicator}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={$container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={$container}
      >
        <View
          style={[
            $segmentedControl,
            {
              borderRadius: 10,
              borderWidth: 1,
              overflow: "hidden",
              borderColor: "#ccc",
              alignSelf: "center",
            },
          ]}
        >
          {TIME_LIMITS.map((time) => (
            <TouchableOpacity
              key={time}
              style={[
                $segmentButton,
                selectedTime === time && $selectedSegmentButton,
              ]}
              onPress={() => setSelectedTime(time)}
            >
              <Text
                style={[
                  $segmentButtonText,
                  selectedTime === time && $selectedSegmentButtonText,
                ]}
              >
                {minutesToHeader(time)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <FlatList
          data={todos.filter((todo) => todo.timeLimit === selectedTime && !todo.abandoned)}
          renderItem={renderTodo}
          keyExtractor={(item) => item.id}
          ListFooterComponent={
            <View style={$footer}>
              <TextInput
                style={$input}
                value={newTodo}
                onChangeText={setNewTodo}
                placeholder="New todo"
                placeholderTextColor={"#ccc"}
              />
              <TouchableOpacity style={$addButton} onPress={addTodo}>
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const $container: ViewStyle = {
  flex: 1,
  padding: 16,
  backgroundColor: "#fff",
};

const $todoItem: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 10,
  paddingHorizontal: 8,
  borderBottomWidth: 1,
  borderColor: "#ccc",
  width: "100%",
};

const $todoText: TextStyle = {
  fontSize: 20,
  flex: 1,
};

const $completedText: TextStyle = {
  fontSize: 20,
  color: "#ccc",
  textDecorationLine: "line-through",
};

const $footer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 16,
};

const $input: TextStyle = {
  flex: 1,
  borderBottomWidth: 1,
  borderColor: "#ccc",
  padding: 8,
  marginRight: 8,
  fontSize: 20,
};

const $addButton: ViewStyle = {
  backgroundColor: "#ccc",
  borderRadius: 50,
  padding: 8,
  justifyContent: "center",
  alignItems: "center",
  width: 40,
  height: 40,
};

const $segmentedControl: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  marginBottom: 16,
};

const $segmentButton: ViewStyle = {
  padding: 8,
};

const $selectedSegmentButton: ViewStyle = {
  backgroundColor: "#ccc",
};

const $segmentButtonText: TextStyle = {
  color: "#ccc",
};

const $selectedSegmentButtonText: TextStyle = {
  color: "#fff",
};

const $progressIndicator: ViewStyle = {
  marginLeft: 8,
};

export default ToDoScreen;
