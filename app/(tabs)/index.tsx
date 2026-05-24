import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, TextInput } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {

  const [pwodwi, setPwodwi] = useState('');
  const [pri, setPri] = useState('');
  const [kantite, setKantite] = useState('');

  const [kredi, setKredi] = useState('');
  const [datKredi, setDatKredi] = useState('');

  const [vantYo, setVantYo] = useState<any[]>([]);

  const total = Number(pri) * Number(kantite);

  const totalJeneral = vantYo.reduce(
    (sum, vant) => sum + vant.total,
    0
  );

  const sauvegarderVantYo = async () => {

    await AsyncStorage.setItem(
      'vantYo',
      JSON.stringify(vantYo)
    );

  };

  const chajeVantYo = async () => {

    const vantYoSove =
      await AsyncStorage.getItem('vantYo');

    if (vantYoSove) {

      setVantYo(JSON.parse(vantYoSove));

    }

  };

  useEffect(() => {

    chajeVantYo();

  }, []);

  useEffect(() => {

    if (vantYo.length > 0) {

      sauvegarderVantYo();

    }

  }, [vantYo]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">
          Biznis App
        </ThemedText>
      </ThemedView>

      <TextInput
        placeholder="Non pwodwi"
        style={styles.input}
        value={pwodwi}
        onChangeText={setPwodwi}
      />

      <TextInput
        placeholder="Pri"
        style={styles.input}
        value={pri}
        onChangeText={setPri}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Kantite"
        style={styles.input}
        value={kantite}
        onChangeText={setKantite}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Kredi? (Wi/Non)"
        style={styles.input}
        value={kredi}
        onChangeText={setKredi}
      />

      <TextInput
        placeholder="Dat kredi"
        style={styles.input}
        value={datKredi}
        onChangeText={setDatKredi}
      />

      <ThemedText style={styles.totalText}>
        Total: {total}
      </ThemedText>

      <Button
        title="Anrejistre Vant"
        onPress={() => {

          const nouvoVant = {
            pwodwi: pwodwi,
            pri: pri,
            kantite: kantite,
            total: total,
            kredi: kredi,
            datKredi: datKredi,
          };

          setVantYo([...vantYo, nouvoVant]);

          setPwodwi('');
          setPri('');
          setKantite('');
          setKredi('');
          setDatKredi('');

          alert('Vant anrejistre');

        }}
      />

      <ThemedText style={styles.totalGeneral}>
        Total Jeneral: {totalJeneral}
      </ThemedText>

      <Button
        title="Efase Tout Vant Yo"
        onPress={() => setVantYo([])}
      />

      {vantYo.map((vant, index) => (
        <ThemedView key={index} style={styles.vantCard}>

          <ThemedText>
            Pwodwi: {vant.pwodwi}
          </ThemedText>

          <ThemedText>
            Pri: {vant.pri}
          </ThemedText>

          <ThemedText>
            Kantite: {vant.kantite}
          </ThemedText>

          <ThemedText>
            Total: {vant.total}
          </ThemedText>

          <ThemedText>
            Kredi: {vant.kredi}
          </ThemedText>

          <ThemedText>
            Dat Kredi: {vant.datKredi}
          </ThemedText>

          <Button
            title="Efase"
            onPress={() => {

              const nouvoVantYo = vantYo.filter(
                (_, i) => i !== index
              );

              setVantYo(nouvoVantYo);

            }}
          />

        </ThemedView>
      ))}

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    marginTop: 15,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },

  totalText: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 18,
  },

  totalGeneral: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
  },

  vantCard: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
  },

  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },

});