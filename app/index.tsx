import React, { useState } from "react";
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

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  timestamp?: string;
}

const ToDoScreen: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");

  const getCurrentTimestamp = (): string => {
    return new Date().toISOString().slice(0, 19).replace("T", " ");
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now().toString(),
          text: newTodo,
          completed: false,
          timestamp: getCurrentTimestamp(),
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

  const renderTodo = ({ item }: { item: Todo }) => (
    <View style={$todoItem}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => toggleComplete(item.id)}
      >
        <Text style={item.completed ? $completedText : $todoText}>
          {item.text}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={$container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={$container}
      >
        <FlatList
          data={todos}
          renderItem={renderTodo}
          keyExtractor={(item) => item.id}
          ListFooterComponent={
            <View style={$footer}>
              <TextInput
                style={$input}
                value={newTodo}
                onChangeText={setNewTodo}
                placeholder="Add new task..."
              />
              <TouchableOpacity style={$addButton} onPress={addTodo}>
                <Text style={$addButtonText}>Add</Text>
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
  padding: 8,
  borderBottomWidth: 1,
  borderColor: "#ccc",
  width: "100%",
};

const $todoText: TextStyle = {
  marginLeft: 8,
  fontSize: 16,
  flex: 1,
};

const $completedText: TextStyle = {
  marginLeft: 8,
  fontSize: 16,
  textDecorationLine: "line-through",
};

const $footer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 16,
};

const $input: TextStyle = {
  flex: 1,
  borderWidth: 1,
  borderColor: "#ccc",
  padding: 8,
  marginRight: 8,
  borderRadius: 4,
};

const $addButton: ViewStyle = {
  backgroundColor: "#007bff",
  borderRadius: 50,
  paddingVertical: 8,
  paddingHorizontal: 16,
};

const $addButtonText: TextStyle = {
  color: "#fff",
  fontSize: 16,
};

export default ToDoScreen;
