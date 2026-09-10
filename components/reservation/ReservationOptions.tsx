import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

interface ReservationOptionsProps {
  peopleCount: number;
  maxParticipants: number | null;
  withChild: boolean;

  onPeopleCountChange: (
    count: number
  ) => void;

  onWithChildChange: (
    value: boolean
  ) => void;
}

const DEFAULT_MAX_COUNT = 10;

export function ReservationOptions({
  peopleCount,
  maxParticipants,
  withChild,
  onPeopleCountChange,
  onWithChildChange,
}: ReservationOptionsProps) {
  const maxCount =
    maxParticipants ??
    DEFAULT_MAX_COUNT;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>
            예약 인원
          </Text>

          {maxParticipants !== null && (
            <Text style={styles.sub}>
              최대 {maxParticipants}명
            </Text>
          )}
        </View>

        <View style={styles.counter}>
          <Pressable
            disabled={peopleCount <= 1}
            onPress={() =>
              onPeopleCountChange(
                peopleCount - 1
              )
            }
            style={[
              styles.counterButton,
              peopleCount <= 1 &&
                styles.counterDisabled,
            ]}
          >
            <Text
              style={
                styles.counterText
              }
            >
              −
            </Text>
          </Pressable>

          <Text style={styles.count}>
            {peopleCount}명
          </Text>

          <Pressable
            disabled={
              peopleCount >= maxCount
            }
            onPress={() =>
              onPeopleCountChange(
                peopleCount + 1
              )
            }
            style={[
              styles.counterButton,
              peopleCount >= maxCount &&
                styles.counterDisabled,
            ]}
          >
            <Text
              style={
                styles.counterText
              }
            >
              +
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.label}>
        아이 동반 여부
      </Text>

      <Text style={styles.sub}>
        아이와 함께 방문하시나요?
      </Text>

      <View style={styles.choiceRow}>
        <Pressable
          onPress={() =>
            onWithChildChange(true)
          }
          style={[
            styles.choice,
            withChild &&
              styles.choiceSelected,
          ]}
        >
          <Text
            style={[
              styles.choiceText,
              withChild &&
                styles.choiceSelectedText,
            ]}
          >
            아이 동반
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            onWithChildChange(false)
          }
          style={[
            styles.choice,
            !withChild &&
              styles.choiceSelected,
          ]}
        >
          <Text
            style={[
              styles.choiceText,
              !withChild &&
                styles.choiceSelectedText,
            ]}
          >
            미동반
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#efe3ce',
    borderRadius: 22,
    backgroundColor: '#ffffff',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
    gap: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: '800',
    color: '#29251e',
  },

  sub: {
    marginTop: 4,
    fontSize: 13,
    color: '#817664',
  },

  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  counterButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#f1e6d3',
  },

  counterDisabled: {
    opacity: 0.4,
  },

  counterText: {
    width: 36,
    height: 36,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 20,
    lineHeight: 34,
    fontWeight: '700',
    color: '#5d4a2a',
  },

  count: {
    minWidth: 44,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '800',
    color: '#3f7d46',
  },

  divider: {
    height: 1,
    marginVertical: 16,
    backgroundColor: '#efe3ce',
  },

  choiceRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },

  choice: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#eadcc4',
    borderRadius: 999,
    backgroundColor: '#ffffff',
  },

  choiceSelected: {
    borderColor: '#3f7d46',
    backgroundColor: '#e8f5e4',
  },

  choiceText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b5730',
  },

  choiceSelectedText: {
    color: '#3f7d46',
  },
});