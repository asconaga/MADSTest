import { Stack, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

// change the following to not show the header for index

export default function RootLayout() {
  const router = useRouter();

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
          title: 'MADSTest', // Title for this specific screen's header
          headerRight: () => (
        <TouchableOpacity onPress={() => router.push('/optionsScreen')} style={{ marginLeft: 0 }}>
            <Text style={styles.text}>≡≡</Text>
        </TouchableOpacity>
          ) }}
      />
      <Stack.Screen name="optionsScreen" options={{ title: 'Options' }} />
      <Stack.Screen name="userListScreen" options={{ title: 'Users' }} />
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
});

