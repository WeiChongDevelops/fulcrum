import { render, fireEvent, screen, cleanup } from "@testing-library/react";
import BudgetTile from "../child/budget/main-data-hierarchy/BudgetTile.tsx";
import "@testing-library/jest-dom";

describe("BudgetTile", () => {
  beforeEach(() => {
    document.body.innerHTML = `
    <div class="budgeting-values-container">
      <span>Some text to measure</span>
    </div>
  `;
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  const mockSetOldBudgetBeingEdited = jest.fn();
  const mockSetBudgetFormVisibility = jest.fn();
  const mockSetModalFormVisibility = jest.fn();
  const mockSetCategoryToDelete = jest.fn();

  const props = {
    category: "Groceries",
    amount: 300,
    group: "Monthly Necessities",
    icon: "grocery-icon.svg",
    setOldBudgetBeingEdited: mockSetOldBudgetBeingEdited,
    setBudgetFormVisibility: mockSetBudgetFormVisibility,
    setModalFormVisibility: mockSetModalFormVisibility,
    setCategoryToDelete: mockSetCategoryToDelete,
    perCategoryExpenseTotalThisMonth: new Map([["Groceries", 150]]),
    userPreferences: {
      createdAt: new Date(),
      currency: "AUD",
      profileIconFileName: "profile-icon-default",
      darkModeEnabled: false,
      accessibilityEnabled: false,
    },
  };

  it("renders correctly with initial properties", () => {
    const { container } = render(<BudgetTile {...props} />);
    expect(container.querySelector(".budget-tile")).toHaveStyle("background-color: #44b775");
    expect(screen.getByText("GROCERIES")).toBeInTheDocument();
    expect(screen.getByText("Spent: $150.00 of $300.00")).toBeInTheDocument();
    expect(screen.getByText("Left: $150.00")).toBeInTheDocument();
  });

  it("checks budget exceeded condition", () => {
    const newProps = {
      ...props,
      perCategoryExpenseTotalThisMonth: new Map([["Groceries", 350]]),
    };
    render(<BudgetTile {...newProps} />);
    expect(screen.getByText("Spent: $350.00 of $300.00")).toBeInTheDocument();
    expect(screen.getByText("Left: $-50.00")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Category icon" })).toHaveAttribute(
      "src",
      "/static/assets-v2/category-icons/grocery-icon.svg",
    );
    expect(screen.getByRole("button", { name: "Budget edit icon" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Budget delete icon" })).toBeInTheDocument();
  });

  it("handles edit button click", () => {
    render(<BudgetTile {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Budget edit icon" }));
    expect(mockSetOldBudgetBeingEdited).toHaveBeenCalledWith({
      oldCategory: "Groceries",
      oldAmount: 300,
      oldGroup: "Monthly Necessities",
      oldIconPath: "grocery-icon.svg",
    });
  });

  it("handles delete button click", () => {
    render(<BudgetTile {...props} />);
    fireEvent.click(screen.getByRole("button", { name: "Budget delete icon" }));
    expect(mockSetCategoryToDelete).toHaveBeenCalledWith("Groceries");
  });
});
