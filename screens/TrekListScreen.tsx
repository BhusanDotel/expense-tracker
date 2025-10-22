import InitialTrekForm from "@/components/InitialTrekForm";
import { TrekContext } from "@/context/AppProvider";
import TrekDetailScreen from "@/screens/TrekDetailScreen";
import TrekExpensesScreen from "@/screens/TrekExpensesScreen";
import TrekPersonsScreen from "@/screens/TrekPersonsScreen";
import React, { useContext, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TrekListScreen() {
  const { state, removeTrek } = useContext(TrekContext);
  const [showHeaderForm, setShowHeaderForm] = useState(false);
  const [selectedTrekSlug, setSelectedTrekSlug] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<
    "summary" | "persons" | "expenses"
  >("summary");
  const [showPersonsList, setShowPersonsList] = useState(false);
  const [showExpensesList, setShowExpensesList] = useState(false);

  // Render persons screen when requested
  if (selectedTrekSlug && showPersonsList)
    return (
      <View style={{ flex: 1 }}>
        <TrekPersonsScreen
          trekSlug={selectedTrekSlug}
          onClose={() => {
            setSelectedTrekSlug(null);
            setShowPersonsList(false);
          }}
        />
      </View>
    );

  // Render expenses screen when requested
  if (selectedTrekSlug && showExpensesList)
    return (
      <View style={{ flex: 1 }}>
        <TrekExpensesScreen
          trekSlug={selectedTrekSlug}
          onClose={() => {
            setSelectedTrekSlug(null);
            setShowExpensesList(false);
          }}
        />
      </View>
    );

  // Default: show full trek detail
  if (selectedTrekSlug)
    return (
      <View style={{ flex: 1 }}>
        <TrekDetailScreen
          trekSlug={selectedTrekSlug}
          onClose={() => setSelectedTrekSlug(null)}
          initialTab={selectedTab}
        />
      </View>
    );

  return (
    <View style={{ flex: 1, marginTop: 30 }}>
      <View
        style={{
          padding: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>
            Treks
          </Text>
        </View>

        <TouchableOpacity
          style={styles.smallBtn}
          onPress={() => setShowHeaderForm((s) => !s)}
        >
          <Text style={styles.smallBtnText}>
            {showHeaderForm ? "Close" : "Add"}
          </Text>
        </TouchableOpacity>
      </View>

      {showHeaderForm && (
        <InitialTrekForm onCreated={() => setShowHeaderForm(false)} />
      )}

      <FlatList
        data={state.treks}
        keyExtractor={(item) => item.trekSlug}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.rowTop}>
              <TouchableOpacity
                onPress={() => setSelectedTrekSlug(item.trekSlug)}
              >
                <Text style={styles.title}>{item.trekName}</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity
                  accessibilityLabel="persons"
                  style={styles.iconBtn}
                  onPress={() => {
                    setSelectedTrekSlug(item.trekSlug);
                    setSelectedTab("persons");
                    setShowPersonsList(true);
                    setShowExpensesList(false);
                  }}
                >
                  <Text>👥</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  accessibilityLabel="expenses"
                  style={styles.iconBtn}
                  onPress={() => {
                    setSelectedTrekSlug(item.trekSlug);
                    setSelectedTab("expenses");
                    setShowExpensesList(true);
                    setShowPersonsList(false);
                  }}
                >
                  <Text>🧾</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={() => removeTrek(item.trekSlug)}
                >
                  <Text>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
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
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { color: "#fff", fontWeight: "700", fontSize: 16 },
  smallBtn: { padding: 8, borderRadius: 6, backgroundColor: "#0ea5a4" },
  smallBtnText: { color: "#022" },
  iconBtn: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#0b1220",
    alignItems: "center",
    justifyContent: "center",
  },
  listSection: { marginTop: 10 },
  sectionTitle: { color: "#94a3b8", marginBottom: 6 },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  itemText: { color: "#e6eef8" },
  remove: { color: "#f87171" },
});
