import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import {
    Animated,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type {
    WeatherResponse,
} from '@/types/home';

type HomeWeatherTickerProps = {
  light?: boolean;
  weather: WeatherResponse[];
  selectedRegion: string;
};

const TICKER_INTERVAL = 3000;

const WEATHER_ICON: Record<
  WeatherResponse['condition'],
  string
> = {
  SUNNY: '☀️',
  CLOUDY: '☁️',
  RAIN: '🌧️',
  RAIN_SNOW: '🌨️',
  SNOW: '❄️',
  UNKNOWN: '🌤️',
};

export function HomeWeatherTicker({
  light = false,
  weather,
  selectedRegion,
}: HomeWeatherTickerProps) {
  const [currentIndex, setCurrentIndex] =
    useState(0);

  const translateY =
    useRef(
      new Animated.Value(0)
    ).current;

  const opacity =
    useRef(
      new Animated.Value(1)
    ).current;

  const orderedWeather =
    useMemo(() => {
      if (
        selectedRegion === '전체'
      ) {
        return weather;
      }

      const selected =
        weather.find(
          (item) =>
            item.regionName ===
            selectedRegion
        );

      if (!selected) {
        return weather;
      }

      return [
        selected,
        ...weather.filter(
          (item) =>
            item.regionName !==
            selectedRegion
        ),
      ];
    }, [
      weather,
      selectedRegion,
    ]);

  useEffect(() => {
    setCurrentIndex(0);

    translateY.setValue(0);
    opacity.setValue(1);
  }, [
    orderedWeather,
    translateY,
    opacity,
  ]);

  useEffect(() => {
    if (
      orderedWeather.length <= 1
    ) {
      return;
    }

    const interval =
      setInterval(() => {
        Animated.parallel([
          Animated.timing(
            translateY,
            {
              toValue: -10,
              duration: 220,
              useNativeDriver: false,
            }
          ),
          Animated.timing(
            opacity,
            {
              toValue: 0,
              duration: 220,
              useNativeDriver: false,
            }
          ),
        ]).start(() => {
          setCurrentIndex(
            (previousIndex) =>
              (
                previousIndex +
                1
              ) %
              orderedWeather.length
          );

          translateY.setValue(10);
          opacity.setValue(0);

          Animated.parallel([
            Animated.timing(
              translateY,
              {
                toValue: 0,
                duration: 220,
                useNativeDriver: false,
              }
            ),
            Animated.timing(
              opacity,
              {
                toValue: 1,
                duration: 220,
                useNativeDriver: false,
              }
            ),
          ]).start();
        });
      }, TICKER_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [
    orderedWeather,
    translateY,
    opacity,
  ]);

  if (
    orderedWeather.length === 0
  ) {
    return (
      <Text style={[styles.placeholder, light && styles.lightText]}>
        충남 날씨
      </Text>
    );
  }

  const currentWeather =
    orderedWeather[currentIndex];

  const regionName =
    currentWeather.regionName.replace(
      /(시|군)$/,
      ''
    );

  const temperature =
    Math.round(
      currentWeather.temperature
    );

  const icon =
    WEATHER_ICON[
      currentWeather.condition
    ];

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.weatherRow,
          {
            opacity,
            transform: [
              {
                translateY,
              },
            ],
          },
        ]}
      >
        <Text style={[styles.region, light && styles.lightRegion]}>
          {regionName}
        </Text>

        <Text style={[styles.temperature, light && styles.lightTemperature]}>
          {temperature}°
        </Text>

        <Text style={[styles.icon, light && styles.lightIcon]}>
          {icon}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 24,
    minWidth: 80,
    alignItems: 'flex-end',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },

  region: {
    color: '#5F5A52',
    fontSize: 13,
    fontWeight: '700',
  },

  temperature: {
    color: '#262822',
    fontSize: 13,
    fontWeight: '800',
  },

  icon: {
    fontSize: 15,
  },

  placeholder: {
    color: '#999999',
    fontSize: 13,
  },

  lightText: {
    color: '#FFFFFF',
  },

  lightRegion: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  lightTemperature: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },

  lightIcon: {
    fontSize: 18,
  },
});
