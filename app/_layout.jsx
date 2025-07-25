import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { initializeStatus } from "./services/statusDB";

// change the following to not show the header for index

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    initializeStatus();
  }, []);

  return (
    <Stack
      screenOptions={{
        // Global header styles
        headerBackButtonDisplayMode: 'minimal', // for iOS hide the back header name
        headerStyle: { backgroundColor: '#4A90E2' },  // light blue header background
        headerTintColor: '#FFFFFF',                    // white back button and title text
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'MADS Test',
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                router.push('/optionsScreen')}
              hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
              style={styles.button}>
              <Ionicons name="settings-outline" size={22} color="white" />
            </TouchableOpacity>
          )
        }}
      />
      <Stack.Screen name="optionsScreen" options={{ title: 'Options' }} />
      <Stack.Screen name="userListScreen" options={{ title: 'Users' }} />
      <Stack.Screen name="statusListScreen" options={{ title: 'Status' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
    borderColor: '#fff', // You've got the color!
    borderWidth: 1,      // Add this line for a visible border
    borderRadius: 5,     // Optional: for rounded corners
    paddingLeft: 2,
    paddingRight: 2,
  },
  button: {
    ...Platform.select({
      web: {
        marginRight: 12,
      },
      default: {
        marginRight: -12
      },
    }),
  },
});
