import TrexExpenseForm from "@/components/TrexExpenseForm";
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
  trekSlug: string;
  onClose: () => void;
};

export default function TrekExpensesScreen({ trekSlug, onClose }: Props) {
  const { state, removeExpense } = useContext(TrekContext);
  const trek = state.treks.find((t) => t.trekSlug === trekSlug);
  if (!trek) return null;

  const totalContributed = trek.trekExpenseData.persons.reduce(
    (s, p) => s + (p.contributionAmount || 0),
    0
  );

  const totalExpenses = trek.trekExpenseData.expense.reduce(
    (s, e) => s + (e.isActive ? e.amount || 0 : 0),
    0
  );

  const remaining = totalContributed - totalExpenses;

  return (
    <View style={{ flex: 1, marginTop: 30, padding: 12 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={{ color: "#06b6d4" }}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Expenses — {trek.trekName}</Text>
        <View style={{ width: 48 }} />
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total contributed: ₹{totalContributed}
        </Text>
        <Text style={styles.summaryText}>Total expenses: ₹{totalExpenses}</Text>
        <Text style={styles.summaryText}>Remaining: ₹{remaining}</Text>
      </View>

      <TrexExpenseForm trekSlug={trekSlug} />

      <View style={{ marginTop: 12 }}>
        <Text style={styles.section}>Expenses</Text>
        <FlatList
          data={trek.trekExpenseData.expense}
          keyExtractor={(e) => e.name + e.timestamp}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.text}>
                {item.name} — ₹{item.amount}
              </Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Text style={{ color: item.isActive ? "#06b6d4" : "#94a3b8" }}>
                  {item.isActive ? "Active" : "Inactive"}
                </Text>
                <TouchableOpacity
                  onPress={() => removeExpense(trekSlug, item.name)}
                >
                  <Text style={styles.remove}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: { color: "#fff", fontWeight: "700", fontSize: 18 },
  summary: {
    backgroundColor: "#071323",
    padding: 12,
    borderRadius: 8,
  },
  summaryText: { color: "#cfeaf7", marginBottom: 4 },
  section: { color: "#94a3b8", fontWeight: "700", marginBottom: 6 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  text: { color: "#e6eef8" },
  remove: { color: "#f87171" },
});
