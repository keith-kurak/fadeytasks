import { useAtom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const storage = createJSONStorage<Todo[]>(() => AsyncStorage);

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  timestamp?: string;
  timeLimit?: number;
  abandoned?: boolean;
}

const todoAtom = atomWithStorage<Todo[]>("todos-v1", [], storage);

export const useTodos = () => {
  const [todos, setTodos] = useAtom(todoAtom);
  return { todos, setTodos };
};
