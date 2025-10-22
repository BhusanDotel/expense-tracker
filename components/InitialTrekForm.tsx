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

type FormValues = {
  trekName: string;
  trekSlug: string;
};

type Props = {
  onCreated?: () => void;
};

export default function InitialTrekForm({ onCreated }: Props) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      trekName: "",
      trekSlug: "",
    },
  });

  const { state, addTrek, clearAll, loading } = useContext(TrekContext);

  // Auto-generate slug from name
  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // remove special chars
      .replace(/\s+/g, "-") // replace spaces with -
      .replace(/-+/g, "-");

  const onSubmit = (data: FormValues) => {
    if (!data.trekName) return;
    const slug = data.trekSlug?.trim() || generateSlug(data.trekName);
    addTrek({
      trekName: data.trekName.trim(),
      trekSlug: slug,
      trekExpenseData: {
        persons: [],
        expense: [],
      },
    });
    // reset fields
    setValue("trekName", "");
    setValue("trekSlug", "");
    // notify parent (e.g. to close form)
    if (onCreated) onCreated();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Create a new Trek</Text>

      <Text style={styles.label}>Trek name</Text>
      <Controller
        control={control}
        name="trekName"
        rules={{ required: "Trek name is required" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="e.g. Annapurna Base Camp"
            placeholderTextColor="#9ca3af"
            style={[styles.input, errors.trekName && styles.inputError]}
            onBlur={onBlur}
            onChangeText={(text) => {
              onChange(text);
              // auto set slug unless user has typed a slug manually
              const currentSlug = generateSlug(text || "");
              setValue("trekSlug", currentSlug);
            }}
            value={value}
          />
        )}
      />
      {errors.trekName && (
        <Text style={styles.errorText}>{errors.trekName.message}</Text>
      )}

      <Text style={styles.label}>Slug (unique id)</Text>
      <Controller
        control={control}
        name="trekSlug"
        rules={{ required: "Slug is required" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="e.g. annapurna-base-camp"
            placeholderTextColor="#9ca3af"
            style={[styles.input, errors.trekSlug && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
          />
        )}
      />
      {errors.trekSlug && (
        <Text style={styles.errorText}>{errors.trekSlug.message}</Text>
      )}

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.primaryButtonText}>Create Trek</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ghostButton} onPress={() => clearAll()}>
          <Text style={styles.ghostButtonText}>Clear all</Text>
        </TouchableOpacity>
      </View>

      <Text
        style={styles.small}
      >{`Saved treks: ${state.treks.length} ${loading ? "(loading)" : ""}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 12,
    margin: 12,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  label: {
    color: "#cbd5e1",
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#020617",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1f2937",
    marginBottom: 8,
  },
  inputError: {
    borderColor: "#ef4444",
  },
  errorText: {
    color: "#f87171",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#06b6d4",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: { color: "#04202a", fontWeight: "700" },
  ghostButton: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  ghostButtonText: { color: "#94a3b8" },
  small: { color: "#94a3b8", marginTop: 10, fontSize: 12 },
});
