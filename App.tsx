import "./global.css";
import { StatusBar } from "expo-status-bar";
import { RootNavigator } from "./src/core/navigation/RootNavigator";
import "react-native-gesture-handler";

export default function App() {
  return (
    <>
      <RootNavigator />
      <StatusBar style="auto" />
    </>
  );
}
