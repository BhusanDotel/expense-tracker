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

type Props = {
  trekSlug: string;
};

type FormValues = {
  name: string;
  contributionAmount?: string;
};

export default function TrekPersonForm({ trekSlug }: Props) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: "", contributionAmount: "" },
  });
  const { addPerson } = useContext(TrekContext);

  const onSubmit = (data: FormValues) => {
    if (!data.name) return;
    const contribution = Number(data.contributionAmount || 0) || 0;
    addPerson(trekSlug, {
      name: data.name.trim(),
      contributionAmount: contribution,
      isActive: true,
    });
    setValue("name", "");
    setValue("contributionAmount", "");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Trekker</Text>

      <Text style={styles.label}>Name</Text>
      <Controller
        control={control}
        name="name"
        rules={{ required: "Name is required" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Person name"
            placeholderTextColor="#9ca3af"
            style={[styles.input, errors.name && styles.inputError]}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

      <Text style={styles.label}>Contribution amount</Text>
      <Controller
        control={control}
        name="contributionAmount"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="e.g. 5000"
            placeholderTextColor="#9ca3af"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="numeric"
          />
        )}
      />

      <TouchableOpacity style={styles.btn} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.btnText}>Add person</Text>
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
    backgroundColor: "#10b981",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#052e21", fontWeight: "700" },
});
