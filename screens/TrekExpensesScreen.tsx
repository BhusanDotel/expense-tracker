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
  const { state, toggleExpenseActive } = useContext(TrekContext);
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

  const activeExpenses = trek.trekExpenseData.expense.filter((e) => e.isActive);
  const archivedExpenses = trek.trekExpenseData.expense.filter(
    (e) => !e.isActive
  );

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
          Total contributed: Rs {totalContributed}
        </Text>
        <Text style={styles.summaryText}>
          Total expenses: Rs {totalExpenses}
        </Text>
        <Text style={styles.summaryText}>Remaining: Rs {remaining}</Text>
      </View>

      <TrexExpenseForm trekSlug={trekSlug} />

      <View style={{ marginTop: 12 }}>
        <Text style={styles.section}>Expenses</Text>

        {/* Active expenses */}
        {activeExpenses.length ? (
          <FlatList
            data={activeExpenses}
            keyExtractor={(e) => e.name + e.timestamp}
            renderItem={({ item }) => {
              const date = item.timestamp ? new Date(item.timestamp) : null;
              const when = date ? date.toLocaleString() : "";
              return (
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.text}>
                      {item.name} — Rs {item.amount}
                    </Text>
                    {when ? <Text style={styles.dateText}>{when}</Text> : null}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => toggleExpenseActive(trekSlug, item.name)}
                    ></TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => toggleExpenseActive(trekSlug, item.name)}
                    >
                      <Text style={styles.remove}>Archive</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <Text style={{ color: "#94a3b8" }}>No active expenses</Text>
        )}

        {/* Inactive / archived expenses */}
        {archivedExpenses.length ? (
          <View style={{ marginTop: 25 }}>
            <Text style={[styles.section, { marginBottom: 6 }]}>Archived</Text>
            <FlatList
              data={archivedExpenses}
              keyExtractor={(e) => e.name + e.timestamp}
              renderItem={({ item }) => {
                const date = item.timestamp ? new Date(item.timestamp) : null;
                const when = date ? date.toLocaleString() : "";
                return (
                  <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.archiveText}>
                        {item.name} — Rs {item.amount}
                      </Text>
                      {when ? (
                        <Text style={styles.archiveDateText}>{when}</Text>
                      ) : null}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => toggleExpenseActive(trekSlug, item.name)}
                      >
                        <Text style={{ color: "#94a3b8" }}>Inactive</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        ) : null}
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
  archiveText: { color: "gray", fontSize: 12 },
  dateText: { color: "#94a3b8", fontSize: 12, marginTop: 4 },
  archiveDateText: { color: "#94a3b8", fontSize: 8, marginTop: 4 },
  remove: { color: "#f87171" },
});
