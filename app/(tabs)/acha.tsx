import { Button, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function AchaScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Acha</ThemedText>

      <TextInput placeholder="Non pwodwi pou acha" style={styles.input} />
      <TextInput placeholder="Pri acha" style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Kantite acha" style={styles.input} keyboardType="numeric" />

      <Button title="Anrejistre Acha" onPress={() => alert('Test Acha')} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  input: {
    borderWidth: 1,
    marginTop: 15,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
});