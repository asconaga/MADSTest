import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/optionsScreen')}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Options</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  button: {
    width: '50%',            // half the screen width
    alignSelf: 'flex-start', // left justified
    backgroundColor: '#4A90E2',
    borderRadius: 12,        // rounded edges
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});
