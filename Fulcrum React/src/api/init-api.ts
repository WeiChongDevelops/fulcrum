import { consolePostgrestError, getActiveUserId, supabaseClient } from "@/utility/supabase-client.ts";

export async function rowsExistFor(table: string) {
  try {
    const activeUserId = await getActiveUserId();
    const { data, error: checkError } = await supabaseClient.from(table).select().eq("userId", activeUserId);
    if (checkError) {
      consolePostgrestError(checkError);
      throw new Error(checkError.message);
    }
    return data !== null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when checking for existing rows in ${table}: ${error.message}`);
    } else {
      throw new Error(`Error encountered when checking for existing rows in ${table}.`);
    }
  }
}

export async function initialiseDefaultUserPreferences() {
  try {
    const activeUserId = await getActiveUserId();
    if (await rowsExistFor("user_preferences")) {
      await supabaseClient.from("user_preferences").delete().eq("userId", activeUserId);
    }

    const { data: newUserPrefs, error: initError } = await supabaseClient
      .from("user_preferences")
      .insert({ userId: activeUserId })
      .select();
    if (initError) {
      consolePostgrestError(initError);
      throw new Error(initError.message);
    }
    if (newUserPrefs === null) {
      throw new Error("Default user preferences were not added.");
    }
    console.log({ initialisedUserPreferences: newUserPrefs });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when initialising default user preferences: ${error.message}`);
    } else {
      throw new Error("Error encountered when initialising default user preferences.");
    }
  }
}

export async function initialiseDefaultIncome() {
  try {
    const activeUserId = await getActiveUserId();
    if (await rowsExistFor("total_income")) {
      await supabaseClient.from("total_income").delete().eq("userId", activeUserId);
    }

    const { data: newTotalIncome, error: initError } = await supabaseClient
      .from("total_income")
      .insert({ totalIncome: 10_000, userId: activeUserId })
      .select();
    if (initError) {
      consolePostgrestError(initError);
      throw new Error(initError.message);
    }
    if (newTotalIncome === null) {
      throw new Error("Default income was not added.");
    }
    console.log({ initialisedTotalIncome: newTotalIncome });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when initialising default income: ${error.message}`);
    } else {
      throw new Error("Error encountered when initialising default income.");
    }
  }
}

export async function initialiseDefaultGroups() {
  try {
    const activeUserId = await getActiveUserId();
    if (await rowsExistFor("groups")) {
      await supabaseClient.from("groups").delete().eq("userId", activeUserId);
    }

    const { data: insertedGroups, error: groupInsertionError } = await supabaseClient
      .from("groups")
      .insert(getDefaultGroups(activeUserId, false))
      .select();
    if (groupInsertionError) {
      consolePostgrestError(groupInsertionError);
      throw new Error(groupInsertionError.message);
    }
    if (insertedGroups === null) {
      throw new Error("Default groups were not added.");
    }
    console.log({ initialisedGroups: insertedGroups });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when initialising default groups: ${error.message}`);
    } else {
      throw new Error("Error encountered when initialising default groups.");
    }
  }
}

export async function initialiseDefaultCategories() {
  try {
    const activeUserId = await getActiveUserId();
    if (await rowsExistFor("budgets")) {
      supabaseClient.from("budgets").delete().eq("userId", activeUserId);
    }

    const { data: insertedBudgets, error: budgetInsertionError } = await supabaseClient
      .from("budgets")
      .insert(getDefaultCategories(activeUserId))
      .select();
    if (budgetInsertionError) {
      consolePostgrestError(budgetInsertionError);
      throw new Error(budgetInsertionError.message);
    }
    if (insertedBudgets === null) {
      throw new Error("Default budgets were not added.");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error encountered when initialising default budgets: ${error.message}`);
    } else {
      throw new Error("Error encountered when initialising default budgets.");
    }
  }
}

function getDefaultGroups(userId: string, miscellaneousExists: boolean) {
  const defaultGroups = [
    {
      userId: userId,
      group: "Savings & Investment",
      colour: "#ecfdf5",
      id: 1,
    },
    {
      userId: userId,
      group: "Housing",
      colour: "#f0f9ff",
      id: 2,
    },
    {
      userId: userId,
      group: "Food & Drink",
      colour: "#f5f3ff",
      id: 3,
    },
    {
      userId: userId,
      group: "Transport",
      colour: "#fef2f2",
      id: 4,
    },
    {
      userId: userId,
      group: "Leisure",
      colour: "#fefce8",
      id: 5,
    },
    {
      userId: userId,
      group: "Utilities",
      colour: "#f7fee7",
      id: 6,
    },
  ];
  const miscellaneousGroup = {
    userId: userId,
    group: "Miscellaneous",
    colour: "#e3e3e3",
    id: 7,
  };
  return miscellaneousExists ? defaultGroups : [...defaultGroups, miscellaneousGroup];
}

function getDefaultCategories(userId: string) {
  return [
    {
      userId: userId,
      category: "Emergency Funds",
      amount: 1000.0,
      iconPath: "FireExtinguisher",
      group: "Savings & Investment",
      id: 0,
    },
    {
      userId: userId,
      category: "Vacation Savings",
      amount: 400.0,
      iconPath: "AirplaneTilt",
      group: "Savings & Investment",
      id: 1,
    },
    {
      userId: userId,
      category: "Stocks",
      amount: 600.0,
      iconPath: "ChartLine",
      group: "Savings & Investment",
      id: 2,
    },
    {
      userId: userId,
      category: "General Savings",
      amount: 3000.0,
      iconPath: "FireExtinguisher",
      group: "Savings & Investment",
      id: 3,
    },
    {
      userId: userId,
      category: "Drinks",
      amount: 200.0,
      iconPath: "Martini",
      group: "Food & Drink",
      id: 4,
    },
    {
      userId: userId,
      category: "Groceries",
      amount: 450.0,
      iconPath: "ShoppingCart",
      group: "Food & Drink",
      id: 5,
    },
    {
      userId: userId,
      category: "Restaurant",
      amount: 300.0,
      iconPath: "ForkKnife",
      group: "Food & Drink",
      id: 6,
    },
    {
      userId: userId,
      category: "Pet Food",
      amount: 60.0,
      iconPath: "PawPrint",
      group: "Food & Drink",
      id: 7,
    },
    {
      userId: userId,
      category: "Rent",
      amount: 1600.0,
      iconPath: "HouseLine",
      group: "Housing",
      id: 8,
    },
    {
      userId: userId,
      category: "Maintenance",
      amount: 250.0,
      iconPath: "Wrench",
      group: "Housing",
      id: 9,
    },
    {
      userId: userId,
      category: "Water",
      amount: 50.0,
      iconPath: "Drop",
      group: "Utilities",
      id: 10,
    },
    {
      userId: userId,
      category: "Electricity",
      amount: 100.0,
      iconPath: "Lightning",
      group: "Utilities",
      id: 11,
    },
    {
      userId: userId,
      category: "Internet",
      amount: 80.0,
      iconPath: "WifiHigh",
      group: "Utilities",
      id: 12,
    },
    {
      userId: userId,
      category: "Petrol",
      amount: 200.0,
      iconPath: "GasPump",
      group: "Transport",
      id: 13,
    },
    {
      userId: userId,
      category: "Parking",
      amount: 60.0,
      iconPath: "CarProfile",
      group: "Transport",
      id: 14,
    },
    {
      userId: userId,
      category: "Public Transport",
      amount: 120.0,
      iconPath: "Train",
      group: "Transport",
      id: 15,
    },
    {
      userId: userId,
      category: "Sports",
      amount: 80.0,
      iconPath: "Volleyball",
      group: "Leisure",
      id: 16,
    },
    {
      userId: userId,
      category: "Entertainment",
      amount: 120.0,
      iconPath: "FilmStrip",
      group: "Leisure",
      id: 17,
    },
    {
      userId: userId,
      category: "Gym",
      amount: 30.0,
      iconPath: "Barbell",
      group: "Leisure",
      id: 18,
    },
    {
      userId: userId,
      category: "Education",
      amount: 300.0,
      iconPath: "GraduationCap",
      group: "Miscellaneous",
      id: 19,
    },
    {
      userId: userId,
      category: "Personal Care",
      amount: 100.0,
      iconPath: "HandSoap",
      group: "Miscellaneous",
      id: 20,
    },
    {
      userId: userId,
      category: "Charity",
      amount: 50.0,
      iconPath: "HandHeart",
      group: "Miscellaneous",
      id: 21,
    },
    {
      userId: userId,
      category: "Other (Default)",
      amount: 850.0,
      iconPath: "Coin",
      group: "Miscellaneous",
      id: 22,
    },
  ];
}
