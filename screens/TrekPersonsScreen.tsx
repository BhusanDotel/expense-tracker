import TrekPersonForm from "@/components/TrekPersonForm";
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

export default function TrekPersonsScreen({ trekSlug, onClose }: Props) {
  const { state, removePerson } = useContext(TrekContext);
  const trek = state.treks.find((t) => t.trekSlug === trekSlug);
  if (!trek) return null;

  const total = trek.trekExpenseData.persons.reduce(
    (s, p) => s + (p.contributionAmount || 0),
    0
  );

  return (
    <View style={{ flex: 1, marginTop: 30, padding: 12 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={{ color: "#06b6d4" }}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>People — {trek.trekName}</Text>
        <View style={{ width: 48 }} />
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>Total collected: ₹{total}</Text>
      </View>

      <TrekPersonForm trekSlug={trekSlug} />

      <View style={{ marginTop: 12 }}>
        <Text style={styles.section}>People</Text>
        <FlatList
          data={trek.trekExpenseData.persons}
          keyExtractor={(p) => p.name}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.text}>
                {item.name} — ₹{item.contributionAmount}
              </Text>
              <TouchableOpacity
                onPress={() => removePerson(trekSlug, item.name)}
              >
                <Text style={styles.remove}>Remove</Text>
              </TouchableOpacity>
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
  summaryText: { color: "#cfeaf7" },
  section: { color: "#94a3b8", fontWeight: "700", marginBottom: 6 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  text: { color: "#e6eef8" },
  remove: { color: "#f87171" },
});
