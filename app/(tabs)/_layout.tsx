import { Tabs } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Akèy' }} />
      <Tabs.Screen name="vant" options={{ title: 'Vant' }} />
      <Tabs.Screen name="acha" options={{ title: 'Acha' }} />
      <Tabs.Screen name="stock" options={{ title: 'Stock' }} />
      <Tabs.Screen name="kredi" options={{ title: 'Kredi' }} />
      <Tabs.Screen name="istorik" options={{ title: 'Istorik' }} />

      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}