import TrekPersonForm from "@/components/TrekPersonForm";
import TrexExpenseForm from "@/components/TrexExpenseForm";
import { TrekContext } from "@/context/AppProvider";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  trekSlug: string;
  onClose: () => void;
  initialTab?: "summary" | "persons" | "expenses";
};

export default function TrekDetailScreen({
  trekSlug,
  onClose,
  initialTab = "summary",
}: Props) {
  const { state, removePerson, removeExpense, toggleExpenseActive } =
    useContext(TrekContext);
  const [showAddPerson, setShowAddPerson] = useState(initialTab === "persons");
  const [showAddExpense, setShowAddExpense] = useState(
    initialTab === "expenses"
  );

  const scrollRef = useRef<ScrollView | null>(null);
  const [personsY, setPersonsY] = useState<number | null>(null);
  const [expensesY, setExpensesY] = useState<number | null>(null);

  useEffect(() => {
    // when opened with an initial tab, scroll to that section once layout measurements are available
    if (initialTab === "persons" && personsY !== null && scrollRef.current) {
      scrollRef.current.scrollTo({ y: personsY, animated: true });
    }
    if (initialTab === "expenses" && expensesY !== null && scrollRef.current) {
      scrollRef.current.scrollTo({ y: expensesY, animated: true });
    }
  }, [initialTab, personsY, expensesY]);

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
    <View style={[styles.container, { marginTop: 30 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={{ color: "#06b6d4" }}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{trek.trekName}</Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        <TrekPersonForm trekSlug={trekSlug} />

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

        <View
          style={{ marginTop: 12 }}
          onLayout={(e) => setPersonsY(e.nativeEvent.layout.y)}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.section}>People</Text>
            <TouchableOpacity
              style={{
                paddingVertical: 6,
                paddingHorizontal: 10,
                backgroundColor: "#06b6d4",
                borderRadius: 6,
              }}
              onPress={() => {
                setShowAddPerson(true);
                setShowAddExpense(false);
              }}
            >
              <Text style={{ color: "#022", fontWeight: "700" }}>Add</Text>
            </TouchableOpacity>
          </View>
          {trek.trekExpenseData.persons.map((p) => (
            <View key={p.name} style={styles.row}>
              <Text style={styles.text}>
                {p.name} — Rs {p.contributionAmount}
              </Text>
              <TouchableOpacity onPress={() => removePerson(trekSlug, p.name)}>
                <Text style={styles.remove}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View
          style={{ marginTop: 12 }}
          onLayout={(e) => setExpensesY(e.nativeEvent.layout.y)}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.section}>Expenses</Text>
            <TouchableOpacity
              style={{
                paddingVertical: 6,
                paddingHorizontal: 10,
                backgroundColor: "#06b6d4",
                borderRadius: 6,
              }}
              onPress={() => {
                setShowAddExpense(true);
                setShowAddPerson(false);
              }}
            >
              <Text style={{ color: "#022", fontWeight: "700" }}>Add</Text>
            </TouchableOpacity>
          </View>
          {trek.trekExpenseData.expense.map((e) => {
            const date = e.timestamp ? new Date(e.timestamp) : null;
            const when = date ? date.toLocaleString() : "";
            return (
              <View key={e.name + e.timestamp} style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.text}>
                    {e.name} — Rs {e.amount}
                  </Text>
                  {when ? <Text style={styles.dateText}>{when}</Text> : null}
                </View>
                <View
                  style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
                >
                  <TouchableOpacity
                    onPress={() => toggleExpenseActive(trekSlug, e.name)}
                  >
                    <Text style={{ color: e.isActive ? "#06b6d4" : "#94a3b8" }}>
                      {e.isActive ? "Active" : "Inactive"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => removeExpense(trekSlug, e.name)}
                  >
                    <Text style={styles.remove}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
      {/* bottom add bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => {
            setShowAddPerson((s) => !s);
            setShowAddExpense(false);
          }}
        >
          <Text style={styles.bottomBtnText}>+ Add Person</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => {
            setShowAddExpense((s) => !s);
            setShowAddPerson(false);
          }}
        >
          <Text style={styles.bottomBtnText}>+ Add Expense</Text>
        </TouchableOpacity>
      </View>

      {showAddPerson && (
        <View style={styles.panel}>
          <TrekPersonForm trekSlug={trekSlug} />
        </View>
      )}

      {showAddExpense && (
        <View style={styles.panel}>
          <TrexExpenseForm trekSlug={trekSlug} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: { color: "#fff", fontWeight: "700", fontSize: 18 },
  close: { color: "#94a3b8" },
  summary: {
    backgroundColor: "#071323",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  summaryText: { color: "#cfeaf7", marginBottom: 4 },
  section: { color: "#94a3b8", fontWeight: "700", marginBottom: 6 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  text: { color: "#e6eef8" },
  dateText: { color: "#94a3b8", fontSize: 12, marginTop: 4 },
  remove: { color: "#f87171" },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    backgroundColor: "rgba(2,6,23,0.9)",
  },
  bottomBtn: {
    backgroundColor: "#06b6d4",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  bottomBtnText: { color: "#04202a", fontWeight: "700" },
  panel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 64,
    backgroundColor: "#071323",
    padding: 12,
  },
});
