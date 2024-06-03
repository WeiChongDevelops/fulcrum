// import { render, fireEvent, screen, cleanup } from "@testing-library/react";
// import ExpenseItem from "../../components/child/expenses/main-data-hierarchy/ExpenseItem.tsx";
// import "@testing-library/jest-dom";
//
// describe("ExpenseItem", () => {
//   afterEach(() => {
//     cleanup();
//     jest.clearAllMocks();
//   });
//
//   const mockSetOldExpenseBeingEdited = jest.fn();
//   const mockSetExpenseFormVisibility = jest.fn();
//   const mockSetExpenseModalVisibility = jest.fn();
//   const mockSetExpenseItemToDelete = jest.fn();
//
//   const props = {
//     expenseId: "exp123",
//     category: "Transport",
//     amount: 100,
//     iconPath: "transport-icon.svg",
//     timestamp: new Date(),
//     recurringExpenseId: null,
//     groupName: "Monthly Necessities",
//     groupColour: "#ffcc00",
//     setExpenseFormVisibility: mockSetExpenseFormVisibility,
//     setExpenseModalVisibility: mockSetExpenseModalVisibility,
//     setOldExpenseBeingEdited: mockSetOldExpenseBeingEdited,
//     setExpenseItemToDelete: mockSetExpenseItemToDelete,
//     userPreferences: {
//       createdAt: new Date(),
//       currency: "AUD",
//       profileIconFileName: "profile-icon-default",
//       darkModeEnabled: false,
//       accessibilityEnabled: false,
//       prefersUploadedAvatar: true,
//     },
//   };
//
//   it("renders correctly with initial properties", () => {
//     const { container } = render(<ExpenseItem {...props} />);
//     expect(container.querySelector(".expense-item")).toHaveStyle("background-color: #ffcc00");
//     expect(screen.getByText("Transport")).toBeInTheDocument();
//     expect(screen.getByText("Monthly Necessities")).toBeInTheDocument();
//     expect(screen.getByText("$100.00")).toBeInTheDocument();
//   });
//
//   it("handles edit button click for non-recurring expense", () => {
//     render(<ExpenseItem {...props} />);
//     fireEvent.click(screen.getByRole("button", { name: "Expense edit icon" }));
//     expect(mockSetOldExpenseBeingEdited).toHaveBeenCalledWith({
//       expenseId: "exp123",
//       recurringExpenseId: null,
//       oldCategory: "Transport",
//       oldAmount: 100,
//       oldTimestamp: props.timestamp,
//     });
//   });
//
//   it("handles delete button click", () => {
//     render(<ExpenseItem {...props} />);
//     fireEvent.click(screen.getByRole("button", { name: "Expense delete icon" }));
//     expect(mockSetExpenseItemToDelete).toHaveBeenCalledWith({
//       expenseId: "exp123",
//       category: "Transport",
//       amount: 100,
//       timestamp: props.timestamp,
//       recurringExpenseId: null,
//     });
//   });
//
//   it("edit and delete functionality for recurring expenses", () => {
//     const recurringProps = {
//       ...props,
//       recurringExpenseId: "rec123",
//     };
//     render(<ExpenseItem {...recurringProps} />);
//     fireEvent.click(screen.getByRole("button", { name: "Expense edit icon" }));
//     fireEvent.click(screen.getByRole("button", { name: "Expense delete icon" }));
//     expect(mockSetOldExpenseBeingEdited).toHaveBeenCalledWith({
//       expenseId: "exp123",
//       recurringExpenseId: "rec123",
//       oldCategory: "Transport",
//       oldAmount: 100,
//       oldTimestamp: props.timestamp,
//     });
//     expect(mockSetExpenseItemToDelete).toHaveBeenCalledWith({
//       expenseId: "exp123",
//       category: "Transport",
//       amount: 100,
//       timestamp: props.timestamp,
//       recurringExpenseId: "rec123",
//     });
//   });
// });
