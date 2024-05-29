import { render, fireEvent, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import RecurringExpenseItem from "../child/tools/recurring-expenses/RecurringExpenseItem.tsx";
import { RecurringExpenseFrequency } from "../../utility/types.ts";

describe("RecurringExpenseItem", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  const mockSetOldRecurringExpenseBeingEdited = jest.fn();
  const mockSetRecurringExpenseFormVisibility = jest.fn();
  const mockSetRecurringExpenseModalVisibility = jest.fn();
  const mockSetRecurringExpenseIdToDelete = jest.fn();

  const props = {
    recurringExpenseId: "rec123",
    category: "Utilities",
    amount: 120,
    iconPath: "utilities-icon.svg",
    timestamp: new Date(),
    frequency: "monthly" as RecurringExpenseFrequency,
    groupName: "Fixed Outgoings",
    groupColour: "#88cc00",
    setRecurringExpenseFormVisibility: mockSetRecurringExpenseFormVisibility,
    setRecurringExpenseModalVisibility: mockSetRecurringExpenseModalVisibility,
    setOldRecurringExpenseBeingEdited: mockSetOldRecurringExpenseBeingEdited,
    setRecurringExpenseIdToDelete: mockSetRecurringExpenseIdToDelete,
    userPreferences: {
      createdAt: new Date(),
      currency: "AUD",
      profileIconFileName: "profile-icon-default",
      darkModeEnabled: false,
      accessibilityEnabled: false,
    },
  };

  it("renders correctly with initial properties", () => {
    const { container } = render(<RecurringExpenseItem {...props} />);
    expect(container.querySelector(".expense-item")).toHaveStyle("background-color: #88cc00");
    expect(screen.getByText("Utilities")).toBeInTheDocument();
    expect(screen.getByText("Fixed Outgoings")).toBeInTheDocument();
    expect(screen.getByText("Monthly")).toBeInTheDocument();
    expect(screen.getByText("$120.00")).toBeInTheDocument();
  });

  it("handles edit button click", () => {
    render(<RecurringExpenseItem {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Recurring edit icon" }));
    expect(mockSetOldRecurringExpenseBeingEdited).toHaveBeenCalledWith({
      recurringExpenseId: "rec123",
      oldCategory: "Utilities",
      oldAmount: 120,
      oldTimestamp: props.timestamp,
      oldFrequency: "monthly",
    });
  });

  it("handles delete button click", () => {
    render(<RecurringExpenseItem {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Recurring delete icon" }));
    expect(mockSetRecurringExpenseIdToDelete).toHaveBeenCalledWith("rec123");
  });
});
