import TrexExpenseForm from "@/components/TrexExpenseForm";
import { TrekContext } from "@/context/AppProvider";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import React, { useContext, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Switch,
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
  const [showActive, setShowActive] = useState(true);
  const trek = state.treks.find((t) => t.trekSlug === trekSlug);
  if (!trek) return null;

  async function handleDownloadPdf(expenses: any[], trekName: string) {
    // Build simple HTML table
    const rows = expenses
      .map((e) => {
        const date = e.timestamp ? new Date(e.timestamp) : null;
        const when = date ? date.toLocaleString() : "";
        return `<tr><td style="padding:8px;border:1px solid #ddd">${when}</td><td style="padding:8px;border:1px solid #ddd">${e.name}</td><td style="padding:8px;border:1px solid #ddd">Rs ${e.amount}</td></tr>`;
      })
      .join("");

    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding:24px }
            table{ border-collapse: collapse; width:100% }
            th{ text-align:left; padding:8px; border:1px solid #ddd; background:#f3f4f6 }
          </style>
        </head>
        <body>
          <h2>${trekName} —  Expenses</h2>
          <table>
            <thead>
              <tr><th>Date</th><th>Name</th><th>Amount</th></tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Use expo-print to create a PDF file
    try {
      const { uri } = await Print.printToFileAsync({ html });

      // On web, Print.printToFileAsync returns base64 in uri? Use fallback for web
      if (Platform.OS === "web") {
        // Open new window with printable HTML so user can save as PDF
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(html);
          newWindow.document.close();
        }
        return;
      }

      // For native, share the generated file (or save it)
      const fileName = `${trekName.replace(/\s+/g, "_")}_expenses.pdf`;
      // Copy to cache or ensure extension if needed, then share
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: fileName,
        });
      } else {
        Alert.alert("Download ready", `PDF saved to: ${uri}`);
      }
    } catch (err) {
      console.warn(err);
      throw err;
    }
  }

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

      <View style={{ marginTop: 12, flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Text style={styles.section}>Expenses</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* Download button placed to left of switch */}
            {showActive && (
              <TouchableOpacity
                onPress={async () => {
                  // generate and download PDF of active expenses
                  try {
                    await handleDownloadPdf(activeExpenses, trek.trekName);
                  } catch (err) {
                    console.warn(err);
                    Alert.alert("Error", "Failed to generate PDF");
                  }
                }}
                style={{ marginRight: 12 }}
              >
                <Text style={{ color: "#06b6d4" }}>Download</Text>
              </TouchableOpacity>
            )}

            <Text style={{ color: "#94a3b8", marginRight: 8 }}>
              {showActive ? "Active" : "Archived"}
            </Text>
            <Switch value={showActive} onValueChange={setShowActive} />
          </View>
        </View>

        <View style={{ flex: 1 }}>
          {/* Conditional: show active OR archived list based on switch */}
          {!showActive ? (
            archivedExpenses.length ? (
              <View style={{ marginTop: 6 }}>
                <FlatList
                  data={archivedExpenses}
                  keyExtractor={(e) => e.name + e.timestamp}
                  renderItem={({ item }) => {
                    const date = item.timestamp
                      ? new Date(item.timestamp)
                      : null;
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
                            onPress={() =>
                              Alert.alert(
                                "Restore expense",
                                `Restore "${item.name}"?`,
                                [
                                  { text: "Cancel", style: "cancel" },
                                  {
                                    text: "Restore",
                                    onPress: () =>
                                      toggleExpenseActive(trekSlug, item.slug),
                                  },
                                ]
                              )
                            }
                          >
                            <Text style={{ color: "#94a3b8" }}>Restore</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                />
              </View>
            ) : (
              <Text style={{ color: "#94a3b8" }}>No archived expenses</Text>
            )
          ) : activeExpenses.length ? (
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
                      {when ? (
                        <Text style={styles.dateText}>{when}</Text>
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
                        onPress={() =>
                          Alert.alert(
                            "Archive expense",
                            `Archive "${item.name}"?`,
                            [
                              { text: "Cancel", style: "cancel" },
                              {
                                text: "Archive",
                                onPress: () =>
                                  toggleExpenseActive(trekSlug, item.slug),
                                style: "destructive",
                              },
                            ]
                          )
                        }
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
        </View>
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
