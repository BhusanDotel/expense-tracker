import { TrekContext } from "@/context/AppProvider";
// import toast from "@/toast";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Button, Text, View } from "react-native";

export default function InitialTrekForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const { state, addTrek, addPerson, addExpense, clearAll, loading } =
    useContext(TrekContext);

  const onSubmit = (data: any) => {
    // console.log("Form Data:", data);
    addTrek({
      trekName: "Neww Trek",
      trekSlug: "neww-trek",
      trekExpenseData: {
        persons: [],
        expense: [],
      },
    });
    // toast.success("Form submitted successfully!");
    // Toast.success("Success message!");
    // clearAll();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text className="text-white">{JSON.stringify(state)}</Text>
      {/* <Text>Name:</Text>
      <Controller
        control={control}
        name="name"
        rules={{ required: "Name is required" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={{ borderWidth: 1, padding: 10, marginBottom: 5 }}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.name && (
        <Text style={{ color: "red" }}>{errors.name.message}</Text>
      )}

      <Text>Email:</Text>
      <Controller
        control={control}
        name="email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Email is invalid",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={{ borderWidth: 1, padding: 10, marginBottom: 5 }}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && (
        <Text style={{ color: "red" }}>{errors.email.message}</Text>
      )} */}

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
