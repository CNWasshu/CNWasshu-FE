import { Ionicons } from '@expo/vector-icons';

import {
    Pressable,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';

import type {
    HomeItemType,
} from '@/types/home';

type HomeSearchBarProps = {
  value: string;
  selectedType: HomeItemType;
  onChangeText: (
    value: string
  ) => void;
  onClear: () => void;
};

export function HomeSearchBar({
  value,
  selectedType,
  onChangeText,
  onClear,
}: HomeSearchBarProps) {
  const placeholder =
    selectedType === 'ACTIVITY'
      ? '체험을 검색해보세요'
      : '맛집을 검색해보세요';

  return (
    <View style={styles.container}>
      <View
        style={
          styles.searchIconWrapper
        }
      >
        <Ionicons
          name="search-outline"
          size={20}
          color="#3F7D46"
        />
      </View>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A69B8A"
        style={styles.input}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />

      {value.length > 0 && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="검색어 지우기"
          style={({ pressed }) => [
            styles.clearButton,
            pressed &&
              styles.clearButtonPressed,
          ]}
          onPress={onClear}
        >
          <Ionicons
            name="close"
            size={18}
            color="#777777"
          />
        </Pressable>
      )}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      height: 48,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: '#E8DCC8',
      borderRadius: 16,
      backgroundColor: '#FFFFFF',
    },

    searchIconWrapper: {
      width: 24,
      height: 48,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },

    input: {
      flex: 1,
      height: 48,
      borderWidth: 0,
      outlineStyle: 'none' as any,
      paddingVertical: 0,
      color: '#29251E',
      fontSize: 14,
      fontWeight: '500',
    },

    clearButton: {
      width: 28,
      height: 28,
      marginLeft: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
      backgroundColor: '#F4EEE4',
    },

    clearButtonPressed: {
      opacity: 0.7,
    },
  });
