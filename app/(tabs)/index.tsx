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
  const [achaPri, setAchaPri] = useState('');
  const [achaKantite, setAchaKantite] = useState('');
  const [filtreTranzaksyon, setFiltreTranzaksyon] = useState<
    'Tout' | 'Vant' | 'Acha' | 'Kredi'
  >('Tout');
  const [isHydrated, setIsHydrated] = useState(false);

  const total = Number(pri) * Number(kantite);
  const totalAcha = Number(achaPri) * Number(achaKantite);

  const totalJeneral = vantYo.reduce(
    (sum, vant) => sum + vant.total,
    0
  );

  const netwayeNonPwodwi = (val: string) =>
    val.trim().toLowerCase();

  const jwennMontan = (val: unknown) => {
    const n = Number(val);
    return Number.isFinite(n) ? n : 0;
  };

  const jwennDatJodiA = (dat: Date = new Date()) => {
    const ane = dat.getFullYear();
    const mwa = String(dat.getMonth() + 1).padStart(2, '0');
    const jou = String(dat.getDate()).padStart(2, '0');
    return `${ane}-${mwa}-${jou}`;
  };

  const kreyeDatTranzaksyon = () => {
    const kounyeA = new Date();
    return {
      dat: kounyeA.toLocaleString(),
      datJour: jwennDatJodiA(kounyeA),
      datTimestamp: kounyeA.getTime(),
    };
  };

  const normalizeTip = (tranzaksyon: {
    tip?: string;
    priAcha?: unknown;
  }): 'Vant' | 'Acha' => {
    const tip = String(tranzaksyon.tip ?? '').trim();
    if (tip === 'Vant' || tip === 'Acha') {
      return tip;
    }
    if (
      tranzaksyon.priAcha !== null &&
      tranzaksyon.priAcha !== undefined &&
      tranzaksyon.priAcha !== ''
    ) {
      return 'Acha';
    }
    return 'Vant';
  };

  const seTipVant = (tranzaksyon: { tip?: string; priAcha?: unknown }) =>
    normalizeTip(tranzaksyon) === 'Vant';

  const seTipAcha = (tranzaksyon: { tip?: string; priAcha?: unknown }) =>
    normalizeTip(tranzaksyon) === 'Acha';

  const prepareTranzaksyon = (liste: any[]) =>
    liste.map((t) => {
      const tip = normalizeTip(t);
      let datJour = t.datJour;
      if (!datJour && typeof t.datTimestamp === 'number') {
        datJour = jwennDatJodiA(new Date(t.datTimestamp));
      }
      if (!datJour && t.dat) {
        const parsed = Date.parse(t.dat);
        if (!Number.isNaN(parsed)) {
          datJour = jwennDatJodiA(new Date(parsed));
        }
      }
      return {
        ...t,
        tip,
        datJour,
        total: jwennMontan(t.total),
      };
    });

  const seJodiA = (tranzaksyon: {
    dat?: string;
    datJour?: string;
    datTimestamp?: number;
  }) => {
    const jodiAKle = jwennDatJodiA();
    if (tranzaksyon.datJour === jodiAKle) {
      return true;
    }
    if (typeof tranzaksyon.datTimestamp === 'number') {
      return (
        jwennDatJodiA(new Date(tranzaksyon.datTimestamp)) === jodiAKle
      );
    }
    if (!tranzaksyon.dat) {
      return false;
    }
    const parsed = Date.parse(tranzaksyon.dat);
    if (!Number.isNaN(parsed)) {
      return jwennDatJodiA(new Date(parsed)) === jodiAKle;
    }
    const datLokal = new Date().toLocaleDateString();
    return (
      tranzaksyon.dat.startsWith(datLokal) ||
      tranzaksyon.dat.includes(datLokal)
    );
  };

  const jwennTotalTranzaksyon = (tranzaksyon: {
    tip?: string;
    total?: unknown;
    priAcha?: unknown;
    kantite?: unknown;
  }) => {
    if (normalizeTip(tranzaksyon) === 'Acha') {
      if (
        tranzaksyon.total !== null &&
        tranzaksyon.total !== undefined &&
        tranzaksyon.total !== ''
      ) {
        return jwennMontan(tranzaksyon.total);
      }
      return (
        jwennMontan(tranzaksyon.priAcha) *
        jwennMontan(tranzaksyon.kantite)
      );
    }
    return jwennMontan(tranzaksyon.total);
  };

  const jwennStockPwodwi = (nonPwodwi: string) => {
    const kle = netwayeNonPwodwi(nonPwodwi);

    return stockYo.find(
      (stock) => netwayeNonPwodwi(stock.pwodwi) === kle
    );
  };

  const filtreTranzaksyonYo = (liste: any[]) => {
    switch (filtreTranzaksyon) {
      case 'Vant':
        return liste.filter((t) => seTipVant(t));
      case 'Acha':
        return liste.filter((t) => seTipAcha(t));
      case 'Kredi':
        return liste.filter(
          (t) => seTipVant(t) && t.kredi === 'Wi'
        );
      default:
        return liste;
    }
  };

  const tranzaksyonAfiche = filtreTranzaksyonYo(tranzaksyonYo);

  const tranzaksyonJodiA = tranzaksyonYo.filter((t) => seJodiA(t));

  const tranzaksyonVantJodiA = tranzaksyonYo.filter(
    (t) => seTipVant(t) && seJodiA(t)
  );

  const tranzaksyonAchaJodiA = tranzaksyonYo.filter(
    (t) => seTipAcha(t) && seJodiA(t)
  );

  const totalVantJodiA = tranzaksyonVantJodiA.reduce(
    (sum, t) => sum + jwennMontan(t.total),
    0
  );

  const totalDepansAchaJodiA = tranzaksyonAchaJodiA.reduce(
    (sum, t) => sum + jwennTotalTranzaksyon(t),
    0
  );

  const pwofiJodiA = totalVantJodiA - totalDepansAchaJodiA;

  const totalKrediJodiA = tranzaksyonYo
    .filter((t) => seTipVant(t) && t.kredi === 'Wi' && seJodiA(t))
    .reduce((sum, t) => sum + jwennMontan(t.total), 0);

  const kantiteTranzaksyonJodiA = tranzaksyonJodiA.length;

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

          const raw = JSON.parse(tranzaksyonYoSove);

          if (!Array.isArray(raw)) {
            return current;
          }

          const parsed = prepareTranzaksyon(raw);

          if (current.length === 0) {
            return parsed;
          }

          return prepareTranzaksyon([...current, ...parsed]);

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

      <ThemedView style={styles.dashboardCard}>
        <ThemedText style={styles.dashboardTitle}>
          Tablo Jodi a
        </ThemedText>
        <ThemedText style={styles.dashboardLine}>
          Total vant jodi a: {jwennMontan(totalVantJodiA)}
        </ThemedText>
        <ThemedText style={styles.dashboardLine}>
          Total depans acha jodi a: {jwennMontan(totalDepansAchaJodiA)}
        </ThemedText>
        <ThemedText style={styles.dashboardLine}>
          Pwofi jodi a: {jwennMontan(pwofiJodiA)}
        </ThemedText>
        <ThemedText style={styles.dashboardLine}>
          Total kredi jodi a: {jwennMontan(totalKrediJodiA)}
        </ThemedText>
        <ThemedText style={styles.dashboardLine}>
          Kantite tranzaksyon jodi a: {jwennMontan(kantiteTranzaksyonJodiA)}
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

          const totalVant = jwennMontan(
            Number(pri) * Number(kantiteVann)
          );
          const { dat, datJour, datTimestamp } =
            kreyeDatTranzaksyon();

          const nouvoVant = {
            nonKliyan: nonKliyan,
            pwodwi: pwodwi,
            pri: pri,
            kantite: kantite,
            total: totalVant,
            kredi: kredi,
            datKredi: datKredi,
            dat: dat,
          };

          setVantYo([...vantYo, nouvoVant]);
          setTranzaksyonYo((current) => [
            {
              tip: 'Vant',
              pwodwi: pwodwi,
              kantite: kantiteVann,
              total: totalVant,
              nonKliyan: nonKliyan,
              kredi: kredi,
              datKredi: datKredi,
              dat: dat,
              datJour: datJour,
              datTimestamp: datTimestamp,
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
        placeholder="Pri acha"
        style={styles.input}
        value={achaPri}
        onChangeText={setAchaPri}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Kantite acha"
        style={styles.input}
        value={achaKantite}
        onChangeText={setAchaKantite}
        keyboardType="numeric"
      />

      <ThemedText style={styles.totalText}>
        Total acha: {totalAcha}
      </ThemedText>

      <Button
        title="Anrejistre Acha"
        onPress={() => {
          const nonPwodwiAcha = achaPwodwi.trim();
          const priAchaVal = Number(achaPri);
          const kantiteAchaVal = Number(achaKantite);
          const totalAchaVal = priAchaVal * kantiteAchaVal;
          const { dat, datJour, datTimestamp } =
            kreyeDatTranzaksyon();

          if (!nonPwodwiAcha) {
            alert('Tanpri antre non pwodwi pou acha');
            return;
          }

          if (Number.isNaN(priAchaVal) || priAchaVal < 0) {
            alert('Tanpri antre yon pri acha ki valab');
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
              priAcha: priAchaVal,
              total: totalAchaVal,
              nonKliyan: '',
              dat: dat,
              datJour: datJour,
              datTimestamp: datTimestamp,
            },
            ...current,
          ]);

          setAchaPwodwi('');
          setAchaPri('');
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

      <ThemedView style={styles.filtreContainer}>
        {(['Tout', 'Vant', 'Acha', 'Kredi'] as const).map((filtre) => (
          <TouchableOpacity
            key={filtre}
            style={[
              styles.boutonFiltre,
              filtreTranzaksyon === filtre && styles.boutonFiltreActif,
            ]}
            onPress={() => setFiltreTranzaksyon(filtre)}
          >
            <ThemedText style={styles.textBouton}>
              {filtre}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>

      {tranzaksyonYo.length === 0 ? (
        <ThemedText>Pa gen tranzaksyon anrejistre.</ThemedText>
      ) : tranzaksyonAfiche.length === 0 ? (
        <ThemedText>Pa gen tranzaksyon pou filtre sa a.</ThemedText>
      ) : (
        tranzaksyonAfiche.map((tranzaksyon, index) => (
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
            {tranzaksyon.tip === 'Acha' && (
              <ThemedText>
                Pri acha: {tranzaksyon.priAcha ?? 'Pa defini'}
              </ThemedText>
            )}
            <ThemedText>
              Kliyan: {tranzaksyon.nonKliyan || 'Pa aplikab'}
            </ThemedText>
            {tranzaksyon.tip === 'Vant' && (
              <ThemedText>
                Kredi: {tranzaksyon.kredi || 'Pa defini'}
              </ThemedText>
            )}
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

  dashboardCard: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#e8f4fc',
    gap: 8,
  },

  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  dashboardLine: {
    fontSize: 16,
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

  filtreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },

  boutonFiltre: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  boutonFiltreActif: {
    backgroundColor: 'green',
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