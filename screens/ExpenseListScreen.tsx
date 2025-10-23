import { TrekContext } from "@/context/AppProvider";
import React, { useContext } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  onBack?: () => void;
};

export default function ExpenseListScreen({ onBack }: Props) {
  const { state, removeExpense, removePerson } = useContext(TrekContext);
  const handleBack = () => {
    if (onBack) onBack();
  };

  return (
    <View style={{ flex: 1, marginTop: 30 }}>
      <View style={{ padding: 12 }}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={{ color: "#06b6d4" }}>← Back</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={state.treks}
        keyExtractor={(t) => t.trekSlug}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.trekName}</Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trekkers</Text>
              {item.trekExpenseData.persons.map((p) => (
                <View key={p.name} style={styles.row}>
                  <Text style={styles.text}>{p.name}</Text>
                  <TouchableOpacity
                    onPress={() => removePerson(item.trekSlug, p.name)}
                  >
                    <Text style={styles.remove}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Expenses</Text>
              {item.trekExpenseData.expense.map((e) => (
                <View key={e.name + e.timestamp} style={styles.row}>
                  <Text style={styles.text}>
                    {e.name} — Rs {e.amount}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeExpense(item.trekSlug, e.slug)}
                  >
                    <Text style={styles.remove}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No treks yet — create one</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    margin: 12,
    backgroundColor: "#071023",
    borderRadius: 10,
  },
  title: { color: "#fff", fontWeight: "700", marginBottom: 8 },
  section: { marginTop: 8 },
  sectionTitle: { color: "#94a3b8", marginBottom: 6 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  text: { color: "#e6eef8" },
  remove: { color: "#f87171" },
  empty: { padding: 24, alignItems: "center" },
  emptyText: { color: "#94a3b8" },
});
