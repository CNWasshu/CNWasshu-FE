import { useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import type {
    ActivityHomeSort,
    HomeItemType,
    RestaurantHomeSort,
} from '@/types/home';

type HomeSort =
  | ActivityHomeSort
  | RestaurantHomeSort;

type HomeSortDropdownProps = {
  selectedType: HomeItemType;
  selectedSort: HomeSort;
  onSelectSort: (sort: HomeSort) => void;
};

type SortOption = {
  label: string;
  value: HomeSort;
};

const ACTIVITY_SORT_OPTIONS: SortOption[] = [
  {
    label: '기본순',
    value: 'DEFAULT',
  },
  {
    label: '추천순',
    value: 'RECOMMENDED',
  },
  {
    label: '예약 많은 순',
    value: 'RESERVATION',
  },
  {
    label: '찜 많은 순',
    value: 'BOOKMARK',
  },
];

const RESTAURANT_SORT_OPTIONS: SortOption[] = [
  {
    label: '가나다순',
    value: 'NAME',
  },
  {
    label: '찜 많은 순',
    value: 'BOOKMARK',
  },
];

export function HomeSortDropdown({
  selectedType,
  selectedSort,
  onSelectSort,
}: HomeSortDropdownProps) {
  const [open, setOpen] = useState(false);

  const options =
    selectedType === 'ACTIVITY'
      ? ACTIVITY_SORT_OPTIONS
      : RESTAURANT_SORT_OPTIONS;

  const selectedOption =
    options.find(
      (option) =>
        option.value === selectedSort
    ) ?? options[0];

  const handleSelect = (
    option: SortOption
  ) => {
    onSelectSort(option.value);
    setOpen(false);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.trigger,
          open && styles.triggerOpen,
        ]}
        onPress={() =>
          setOpen((previous) => !previous)
        }
      >
        <Text style={styles.triggerText}>
          {selectedOption.label}
        </Text>

        <Text
          style={[
            styles.arrow,
            open && styles.arrowOpen,
          ]}
        >
          ▾
        </Text>
      </Pressable>

      {open && (
        <View style={styles.menu}>
          {options.map((option) => {
            const active =
              selectedSort === option.value;

            return (
              <Pressable
                key={option.value}
                style={[
                  styles.menuItem,
                  active &&
                    styles.menuItemActive,
                ]}
                onPress={() =>
                  handleSelect(option)
                }
              >
                <View style={styles.checkArea}>
                  {active && (
                    <Text style={styles.check}>
                      ✓
                    </Text>
                  )}
                </View>

                <Text
                  style={[
                    styles.menuItemText,
                    active &&
                      styles.menuItemTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 30,
  },

  trigger: {
    minWidth: 112,
    height: 36,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E7D9C1',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },

  triggerOpen: {
    borderColor: '#9ABC8D',
  },

  triggerText: {
    color: '#5E5139',
    fontSize: 13,
    fontWeight: '800',
  },

  arrow: {
    color: '#7B6B4F',
    fontSize: 12,
  },

  arrowOpen: {
    transform: [
      {
        rotate: '180deg',
      },
    ],
  },

  menu: {
    position: 'absolute',
    top: 42,
    right: 0,
    width: 148,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E7D9C1',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    zIndex: 50,
  },

  menuItem: {
    minHeight: 38,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 9,
  },

  menuItemActive: {
    backgroundColor: '#EEF7EB',
  },

  checkArea: {
    width: 20,
    alignItems: 'flex-start',
  },

  check: {
    color: '#3F7045',
    fontSize: 12,
    fontWeight: '900',
  },

  menuItemText: {
    color: '#5F5139',
    fontSize: 13,
    fontWeight: '700',
  },

  menuItemTextActive: {
    color: '#3F7045',
    fontWeight: '900',
  },
});