import { withLayoutContext } from "expo-router";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

export const Tabs = withLayoutContext(
  createBottomTabNavigator().Navigator
); 