import { TrekContext } from "@/context/AppProvider";
import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = { trekSlug: string };

type FormValues = { name: string; amount: string };

export default function TrexExpenseForm({ trekSlug }: Props) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: "", amount: "" },
  });
  const { addExpense } = useContext(TrekContext);
  // trek not needed for expense form now (no payer selection)

  const onSubmit = (data: FormValues) => {
    if (!data.name || !data.amount) return;
    const amountNum = Number(data.amount);
    if (Number.isNaN(amountNum)) return;
    // Expense type requires description, timestamp, isActive
    addExpense(trekSlug, {
      name: data.name.trim(),
      amount: amountNum,
      description: "",
      timestamp: new Date().toISOString(),
      isActive: true,
    });
    setValue("name", "");
    setValue("amount", "");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Expense</Text>

      <Text style={styles.label}>Title</Text>
      <Controller
        control={control}
        name="name"
        rules={{ required: "Expense name required" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Dinner, Fuel, etc"
            placeholderTextColor="#9ca3af"
            style={[styles.inputArea, errors.name && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            multiline={true}
            numberOfLines={4} // Optional
            textAlignVertical="top" // Keeps text at top on Android
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <Text style={styles.label}>Amount</Text>
      <Controller
        control={control}
        name="amount"
        rules={{ required: "Amount required" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="e.g. 1200"
            placeholderTextColor="#9ca3af"
            style={[styles.input, errors.amount && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="numeric"
          />
        )}
      />
      {errors.amount && (
        <Text style={styles.error}>{errors.amount.message}</Text>
      )}

      <TouchableOpacity style={styles.btn} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.btnText}>Add expense</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  title: { color: "#fff", fontWeight: "700", marginBottom: 8 },
  label: { color: "#94a3b8", marginBottom: 6 },
  input: {
    backgroundColor: "#020617",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1f2937",
    marginBottom: 8,
  },
  inputError: { borderColor: "#ef4444" },
  error: { color: "#f87171", marginBottom: 6 },
  btn: {
    backgroundColor: "#06b6d4",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  btnText: { color: "#04202a", fontWeight: "700" },
  chip: {
    backgroundColor: "#111827",
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  chipText: { color: "#cbd5e1" },
  small: { color: "#64748b" },
  inputArea: {
    backgroundColor: "#020617",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1f2937",
    marginBottom: 8,
    height: 150,
  },
});
