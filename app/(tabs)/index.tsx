import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import {
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {

  const [nonKliyan, setNonKliyan] = useState('');
  const [pwodwi, setPwodwi] = useState('');
  const [pri, setPri] = useState('');
  const [kantite, setKantite] = useState('');

  const [kredi, setKredi] = useState('');
  const [datKredi, setDatKredi] = useState('');

  const [vantYo, setVantYo] = useState<any[]>([]);
  const [stockYo, setStockYo] = useState<any[]>([]);
  const [tranzaksyonYo, setTranzaksyonYo] = useState<any[]>([]);
  const [achaPwodwi, setAchaPwodwi] = useState('');
  const [achaKantite, setAchaKantite] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  const total = Number(pri) * Number(kantite);

  const totalJeneral = vantYo.reduce(
    (sum, vant) => sum + vant.total,
    0
  );

  const netwayeNonPwodwi = (val: string) =>
    val.trim().toLowerCase();

  const jwennStockPwodwi = (nonPwodwi: string) => {
    const kle = netwayeNonPwodwi(nonPwodwi);

    return stockYo.find(
      (stock) => netwayeNonPwodwi(stock.pwodwi) === kle
    );
  };

  const sauvegarderDoneYo = async () => {

    await AsyncStorage.setItem(
      'vantYo',
      JSON.stringify(vantYo)
    );
    await AsyncStorage.setItem(
      'stockYo',
      JSON.stringify(stockYo)
    );
    await AsyncStorage.setItem(
      'tranzaksyonYo',
      JSON.stringify(tranzaksyonYo)
    );

  };

  useEffect(() => {

    let cancelled = false;

    (async () => {

      const [
        vantYoSove,
        stockYoSove,
        tranzaksyonYoSove,
      ] =
        await Promise.all([
          AsyncStorage.getItem('vantYo'),
          AsyncStorage.getItem('stockYo'),
          AsyncStorage.getItem('tranzaksyonYo'),
        ]);

      if (cancelled) {
        return;
      }

      setVantYo((current) => {

        if (!vantYoSove) {
          return current;
        }

        try {

          const parsed = JSON.parse(vantYoSove);

          if (!Array.isArray(parsed)) {
            return current;
          }

          if (current.length === 0) {
            return parsed;
          }

          return [...parsed, ...current];

        } catch {

          return current;

        }

      });

      setStockYo((current) => {

        if (!stockYoSove) {
          return current;
        }

        try {

          const parsed = JSON.parse(stockYoSove);

          if (!Array.isArray(parsed)) {
            return current;
          }

          if (current.length === 0) {
            return parsed;
          }

          return [...parsed, ...current];

        } catch {

          return current;

        }

      });

      setTranzaksyonYo((current) => {

        if (!tranzaksyonYoSove) {
          return current;
        }

        try {

          const parsed = JSON.parse(tranzaksyonYoSove);

          if (!Array.isArray(parsed)) {
            return current;
          }

          if (current.length === 0) {
            return parsed;
          }

          return [...current, ...parsed];

        } catch {

          return current;

        }

      });

      if (cancelled) {
        return;
      }

      setIsHydrated(true);

    })();

    return () => {
      cancelled = true;
    };

  }, []);

  useEffect(() => {

    if (!isHydrated) {
      return;
    }

    sauvegarderDoneYo();

  }, [vantYo, stockYo, tranzaksyonYo, isHydrated]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: '#A1CEDC',
        dark: '#1D3D47'
      }}

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
        placeholder="Non kliyan"
        style={styles.input}
        value={nonKliyan}
        onChangeText={setNonKliyan}
      />

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

      <ThemedText style={styles.label}>
        Eske se kredi?
      </ThemedText>

      <ThemedView style={styles.boutonContainer}>

        <TouchableOpacity
          style={[
            styles.boutonKredi,
            kredi === 'Wi' && styles.boutonActif
          ]}
          onPress={() => setKredi('Wi')}
        >
          <ThemedText style={styles.textBouton}>
            Wi
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.boutonKredi,
            kredi === 'Non' && styles.boutonNon
          ]}
          onPress={() => setKredi('Non')}
        >
          <ThemedText style={styles.textBouton}>
            Non
          </ThemedText>
        </TouchableOpacity>

      </ThemedView>

      <TextInput
        placeholder="Dat kredi"
        style={styles.input}
        value={datKredi}
        onChangeText={setDatKredi}
      />

      <ThemedText style={styles.totalText}>
        Total: {total}
      </ThemedText>

      <ThemedText style={styles.stockInfo}>
        Stock aktyel pou pwodwi sa a: {jwennStockPwodwi(pwodwi)?.kantite ?? 0}
      </ThemedText>

      <Button
        title="Anrejistre Vant"
        onPress={() => {
          const kantiteVann = Number(kantite);
          const stockPwodwi = jwennStockPwodwi(pwodwi);
          const stockDisponib = stockPwodwi?.kantite ?? 0;

          if (!pwodwi.trim()) {
            alert('Tanpri antre non pwodwi a');
            return;
          }

          if (Number.isNaN(kantiteVann) || kantiteVann <= 0) {
            alert('Tanpri antre yon kantite ki valab');
            return;
          }

          if (stockDisponib < kantiteVann) {
            alert('Stock pa sifi pou vann sa');
            return;
          }

          const datJodiA =
            new Date().toLocaleString();

          const nouvoVant = {
            nonKliyan: nonKliyan,
            pwodwi: pwodwi,
            pri: pri,
            kantite: kantite,
            total: total,
            kredi: kredi,
            datKredi: datKredi,
            dat: datJodiA,
          };

          setVantYo([...vantYo, nouvoVant]);
          setTranzaksyonYo((current) => [
            {
              tip: 'Vant',
              pwodwi: pwodwi,
              kantite: kantiteVann,
              total: total,
              nonKliyan: nonKliyan,
              dat: datJodiA,
            },
            ...current,
          ]);
          setStockYo((current) =>
            current.map((stock) => {
              if (
                netwayeNonPwodwi(stock.pwodwi) ===
                netwayeNonPwodwi(pwodwi)
              ) {
                return {
                  ...stock,
                  kantite: stock.kantite - kantiteVann,
                };
              }

              return stock;
            })
          );

          setNonKliyan('');
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

      <ThemedText style={styles.label}>
        Acha Stock
      </ThemedText>

      <TextInput
        placeholder="Non pwodwi pou acha"
        style={styles.input}
        value={achaPwodwi}
        onChangeText={setAchaPwodwi}
      />

      <TextInput
        placeholder="Kantite acha"
        style={styles.input}
        value={achaKantite}
        onChangeText={setAchaKantite}
        keyboardType="numeric"
      />

      <Button
        title="Anrejistre Acha"
        onPress={() => {
          const nonPwodwiAcha = achaPwodwi.trim();
          const kantiteAchaVal = Number(achaKantite);
          const datJodiA = new Date().toLocaleString();

          if (!nonPwodwiAcha) {
            alert('Tanpri antre non pwodwi pou acha');
            return;
          }

          if (Number.isNaN(kantiteAchaVal) || kantiteAchaVal <= 0) {
            alert('Tanpri antre yon kantite acha ki valab');
            return;
          }

          setStockYo((current) => {
            const indexStock = current.findIndex(
              (stock) =>
                netwayeNonPwodwi(stock.pwodwi) ===
                netwayeNonPwodwi(nonPwodwiAcha)
            );

            if (indexStock === -1) {
              return [
                ...current,
                {
                  pwodwi: nonPwodwiAcha,
                  kantite: kantiteAchaVal,
                },
              ];
            }

            return current.map((stock, index) => {
              if (index !== indexStock) {
                return stock;
              }

              return {
                ...stock,
                kantite: stock.kantite + kantiteAchaVal,
              };
            });
          });
          setTranzaksyonYo((current) => [
            {
              tip: 'Acha',
              pwodwi: nonPwodwiAcha,
              kantite: kantiteAchaVal,
              total: null,
              nonKliyan: '',
              dat: datJodiA,
            },
            ...current,
          ]);

          setAchaPwodwi('');
          setAchaKantite('');
          alert('Acha anrejistre');
        }}
      />

      <ThemedText style={styles.totalGeneral}>
        Lis Stock
      </ThemedText>

      {stockYo.length === 0 ? (
        <ThemedText>Pa gen stock anrejistre.</ThemedText>
      ) : (
        stockYo.map((stock, index) => (
          <ThemedView
            key={`${stock.pwodwi}-${index}`}
            style={styles.vantCard}
          >
            <ThemedText>
              Pwodwi: {stock.pwodwi}
            </ThemedText>
            <ThemedText>
              Stock: {stock.kantite}
            </ThemedText>
          </ThemedView>
        ))
      )}

      <ThemedText style={styles.totalGeneral}>
        Istorik Tranzaksyon
      </ThemedText>

      {tranzaksyonYo.length === 0 ? (
        <ThemedText>Pa gen tranzaksyon anrejistre.</ThemedText>
      ) : (
        tranzaksyonYo.map((tranzaksyon, index) => (
          <ThemedView
            key={`${tranzaksyon.tip}-${tranzaksyon.dat}-${index}`}
            style={styles.vantCard}
          >
            <ThemedText>
              Tip: {tranzaksyon.tip}
            </ThemedText>
            <ThemedText>
              Dat: {tranzaksyon.dat}
            </ThemedText>
            <ThemedText>
              Pwodwi: {tranzaksyon.pwodwi}
            </ThemedText>
            <ThemedText>
              Kantite: {tranzaksyon.kantite}
            </ThemedText>
            <ThemedText>
              Total: {tranzaksyon.total ?? 'Pa aplikab'}
            </ThemedText>
            <ThemedText>
              Kliyan: {tranzaksyon.nonKliyan || 'Pa aplikab'}
            </ThemedText>
          </ThemedView>
        ))
      )}

      {vantYo.map((vant, index) => (
        <ThemedView
          key={index}
          style={styles.vantCard}
        >

          <ThemedText>
            Dat: {vant.dat}
          </ThemedText>

          <ThemedText>
            Kliyan: {vant.nonKliyan}
          </ThemedText>

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

              const nouvoVantYo =
                vantYo.filter(
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

  label: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },

  boutonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },

  boutonKredi: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },

  boutonActif: {
    backgroundColor: 'green',
  },

  boutonNon: {
    backgroundColor: 'red',
  },

  textBouton: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  totalText: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
  },

  stockInfo: {
    marginBottom: 20,
    fontSize: 16,
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