import { render, fireEvent, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Group from "../child/budget/main-data-hierarchy/Group.tsx";
import { monthStringArray } from "../../utility/util.ts";

describe("Group", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  const mockSetOldGroupBeingEdited = jest.fn();
  const mockSetGroupToDelete = jest.fn();
  const mockSetBudgetFormVisibility = jest.fn();
  const mockSetModalFormVisibility = jest.fn();
  const mockSetCategoryToDelete = jest.fn();
  const mockSetGroupNameOfNewItem = jest.fn();

  const queryClient = new QueryClient();

  const props = {
    groupName: "Utilities",
    groupColour: "#ffcc00",
    filteredBudgetArray: [
      { category: "Water", amount: 30, iconPath: "water-icon.svg", group: "Miscellaneous", timestamp: new Date(), id: 0 },
      {
        category: "Electricity",
        amount: 70,
        iconPath: "electricity-icon.svg",
        group: "Miscellaneous",
        timestamp: new Date(),
        id: 1,
      },
    ],
    expenseArray: [
      { expenseId: "exp1", category: "Water", amount: 20, timestamp: new Date(), recurringExpenseId: "rec1" },
      { expenseId: "exp2", category: "Electricity", amount: 50, timestamp: new Date(), recurringExpenseId: "rec2" },
    ],
    setGroupNameOfNewItem: mockSetGroupNameOfNewItem,
    setOldGroupBeingEdited: mockSetOldGroupBeingEdited,
    setOldBudgetBeingEdited: jest.fn(),
    setBudgetFormVisibility: mockSetBudgetFormVisibility,
    setGroupToDelete: mockSetGroupToDelete,
    setCategoryToDelete: mockSetCategoryToDelete,
    setModalFormVisibility: mockSetModalFormVisibility,
    perCategoryExpenseTotalThisMonth: new Map([
      ["Water", 20],
      ["Electricity", 50],
    ]),
    userPreferences: {
      createdAt: new Date(),
      currency: "AUD",
      profileIconFileName: "profile-icon-default",
      darkModeEnabled: false,
      accessibilityEnabled: false,
      prefersDefaultAvatar: true,
    },
  };

  it("renders correctly with initial properties", () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <Group {...props} />
      </QueryClientProvider>,
    );
    expect(container.querySelector(".group")).toHaveStyle("background-color: #ffcc00");
    expect(screen.getByText("Utilities")).toBeInTheDocument();
    const currentMonth = monthStringArray[new Date().getMonth()];
    expect(screen.getByText(`Spent: $70.00 of $100.00 (${currentMonth})`)).toBeInTheDocument();
  });

  it("handles edit group button click", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Group {...props} />
      </QueryClientProvider>,
    );
    fireEvent.click(screen.getByRole("img", { name: "Group edit icon" }));
    expect(mockSetOldGroupBeingEdited).toHaveBeenCalledWith({
      oldGroupName: "Utilities",
      oldColour: "#ffcc00",
    });
  });

  it("handles delete group button click with no budgets", () => {
    const modifiedProps = {
      ...props,
      filteredBudgetArray: [],
    };
    render(
      <QueryClientProvider client={queryClient}>
        <Group {...modifiedProps} />
      </QueryClientProvider>,
    );
    fireEvent.click(screen.getByRole("img", { name: "Group delete icon" }));
    expect(mockSetGroupToDelete).toHaveBeenCalledWith("Utilities");
  });
});
