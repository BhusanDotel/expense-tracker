import { Expense, Person, Trek } from "@/types/trekTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { Toast } from "toastify-react-native";

type State = {
  treks: Trek[];
};

type TrekContextType = {
  state: State;
  addTrek: (trek: Trek) => void;
  removeTrek: (trekSlug: string) => void;
  addPerson: (trekSlug: string, person: Person) => void;
  removePerson: (trekSlug: string, personName: string) => void;
  addExpense: (trekSlug: string, expense: Expense) => void;
  removeExpense: (trekSlug: string, expenseName: string) => void;
  clearAll: () => void;
  loading: boolean;
};

// Context
export const TrekContext = createContext<TrekContextType>({
  state: { treks: [] },
  addTrek: () => {},
  removeTrek: () => {},
  addPerson: () => {},
  removePerson: () => {},
  addExpense: () => {},
  removeExpense: () => {},
  clearAll: () => {},
  loading: true,
});

// Provider Props
type Props = {
  children: ReactNode;
};

export const AppProvider = ({ children }: Props) => {
  const [state, setState] = useState<State>({ treks: [] });
  const [loading, setLoading] = useState(true);

  // Load from AsyncStorage
  useEffect(() => {
    const loadTreks = async () => {
      try {
        const storedTreks = await AsyncStorage.getItem("treks");
        if (storedTreks) setState({ treks: JSON.parse(storedTreks) });
      } catch (err) {
        console.log("Failed to load treks:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTreks();
  }, []);

  // Helper to update state + AsyncStorage
  const updateState = async (updater: (prev: State) => State) => {
    setState((prev) => {
      const next = updater(prev);
      AsyncStorage.setItem("treks", JSON.stringify(next.treks)).catch(
        console.log
      );
      return next;
    });
  };

  // Actions
  const addTrek = (trek: Trek) => {
    updateState((prev) => {
      const exists = prev.treks.some((t) => t.trekSlug === trek.trekSlug);
      if (exists) {
        Toast.error("Trek already exists!");
        return prev; // Do not add duplicate
      }
      return { treks: [...prev.treks, trek] };
    });
  };

  const removeTrek = (trekSlug: string) => {
    updateState((prev) => ({
      treks: prev.treks.filter((t) => t.trekSlug !== trekSlug),
    }));
  };

  const addPerson = (trekSlug: string, person: Person) => {
    updateState((prev) => ({
      treks: prev.treks.map((t) =>
        t.trekSlug === trekSlug
          ? {
              ...t,
              trekExpenseData: {
                ...t.trekExpenseData,
                persons: [...t.trekExpenseData.persons, person],
              },
            }
          : t
      ),
    }));
  };

  const removePerson = (trekSlug: string, personName: string) => {
    updateState((prev) => ({
      treks: prev.treks.map((t) =>
        t.trekSlug === trekSlug
          ? {
              ...t,
              trekExpenseData: {
                ...t.trekExpenseData,
                persons: t.trekExpenseData.persons.filter(
                  (p) => p.name !== personName
                ),
              },
            }
          : t
      ),
    }));
  };

  const addExpense = (trekSlug: string, expense: Expense) => {
    updateState((prev) => ({
      treks: prev.treks.map((t) =>
        t.trekSlug === trekSlug
          ? {
              ...t,
              trekExpenseData: {
                ...t.trekExpenseData,
                expense: [...t.trekExpenseData.expense, expense],
              },
            }
          : t
      ),
    }));
  };

  const removeExpense = (trekSlug: string, expenseName: string) => {
    updateState((prev) => ({
      treks: prev.treks.map((t) =>
        t.trekSlug === trekSlug
          ? {
              ...t,
              trekExpenseData: {
                ...t.trekExpenseData,
                expense: t.trekExpenseData.expense.filter(
                  (e) => e.name !== expenseName
                ),
              },
            }
          : t
      ),
    }));
  };

  const clearAll = () => {
    updateState(() => ({ treks: [] }));
  };

  return (
    <TrekContext.Provider
      value={{
        state,
        addTrek,
        removeTrek,
        addPerson,
        removePerson,
        addExpense,
        removeExpense,
        clearAll,
        loading,
      }}
    >
      {children}
    </TrekContext.Provider>
  );
};
