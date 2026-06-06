import { Button, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function VantScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Vant</ThemedText>

      <TextInput placeholder="Non kliyan" style={styles.input} />
      <TextInput placeholder="Non pwodwi" style={styles.input} />
      <TextInput placeholder="Pri" style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Kantite" style={styles.input} keyboardType="numeric" />

      <Button title="Anrejistre Vant" onPress={() => alert('Test Vant')} />
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