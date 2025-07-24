import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>

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
