import {Dispatch, SetStateAction} from "react";


//  EXPENSE ENTITIES //
export interface ExpenseItemEntity {
    expenseId: string
    category: string
    amount: number
    timestamp: Date
}

export interface ExpenseCreationFormData {
    category: string,
    amount: number
}


export interface ExpenseUpdatingFormData {
    category: string;
    amount: number;
}


export interface PreviousExpenseBeingEdited {
    expenseId: string;
    oldCategory: string;
    oldAmount: number;
}

// BUDGET ENTITIES //

export interface BudgetItemEntity {
    category: string
    amount: number
    iconPath: string
    group: string
    timestamp: Date | null;
}

export interface PreviousBudgetBeingEdited {
    oldAmount: number;
    oldCategory: string;
    oldGroup: string;
}
export interface BudgetCreationFormData {
    category: string,
    amount: number,
    iconPath: string,
    group: string
}

export interface BudgetUpdatingFormData {
    category: string;
    amount: number;
    group: string;
    iconPath: string;
}


// GROUP ENTITIES

export interface GroupItemEntity {
    group: string;
    colour: string;
    timestamp: Date;
}

export interface BasicGroupData {
    group: string;
    colour: string | null;
}

export interface PreviousGroupBeingEdited  {
    oldColour: string;
    oldGroupName: string;
}

// FORM AND MODAL VISIBILITY ENTITIES //

export interface BudgetFormVisibility {
    isCreateBudgetVisible: boolean,
    isUpdateBudgetVisible: boolean,
    isCreateGroupVisible: boolean,
    isUpdateGroupVisible: boolean,
}

export interface BudgetModalVisibility {
    isDeleteOptionsModalVisible: boolean;
    isConfirmGroupDestructionModalVisible: boolean;
    isConfirmCategoryDestructionModalVisible: boolean;
}


export interface ExpenseFormVisibility {
    isCreateExpenseVisible: boolean;
    isUpdateExpenseVisible: boolean;
}

export interface ExpenseModalVisibility {
    isConfirmExpenseDestructionModalVisible: boolean;
}

// MISCELLANEOUS ENTITIES //

export interface SelectorOptionsFormattedData {
    value: string;
    label: string;
    colour: string | null;
}


const dot = (color = 'transparent') => ({
    alignItems: 'center',
    display: 'flex',

    ':before': {
        backgroundColor: color,
        borderRadius: 10,
        content: '" "',
        display: 'block',
        marginRight: 8,
        height: 10,
        width: 10,
    },
});

export const colourStyles = {
    control: (styles: any) => ({ ...styles, fontWeight: "bold", backgroundColor: "white" }),
    option: (styles: any, {data}: any) => {
        return { ...styles, color: (data.value !== "Other" || data.value !== "Miscellaneous") && data.colour || "white", backgroundColor: "#1b1c1c", fontWeight: "bold" };
    },
    input: (styles: any) => ({ ...styles, ...dot() }),
    placeholder: (styles: any) => ({ ...styles, ...dot('#ccc') }),
    singleValue: (styles: any, {data}: any) => ({ ...styles, ...dot(data.colour) }),
};

export function getColourOfGroup(groupName: string, groupArray: GroupItemEntity[]) {
    const groupOption = groupArray.filter(groupItemEntity => groupItemEntity.group === groupName)[0];
    return groupOption.colour ? groupOption.colour : null;
}

export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export async function getExpenseList() {
    try {
        const response = await fetch("http://localhost:8080/api/getExpenses", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.status === 401) {
            console.error("JWT token expiry detected. Logging out.")
            window.alert("Login expired. Please log in again.")
            logoutOnClick()
                .then(() => {
                    window.location.href === "/login" && (window.location.href = "/login")
                } )
        }
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);
        return responseData.sort(expenseSort)

    } catch (error) {
        console.error("Error:", error);
    }
}

export async function handleExpenseCreation(setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>,
                                            setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>,
                                            newExpenseItem: ExpenseItemEntity) {
    try {
        const response = await fetch("http://localhost:8080/api/createExpense", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                expenseId: newExpenseItem.expenseId,
                category: newExpenseItem.category,
                amount: newExpenseItem.amount,
                timestamp: newExpenseItem.timestamp
            })
        });

        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
            window.alert("Expense entry invalid.")
            setExpenseArray(current => {
                const indexOfInvalidItem = current.map(item => item.expenseId).lastIndexOf(newExpenseItem.expenseId)
                if (indexOfInvalidItem !== -1) {
                    return [...current.slice(0, indexOfInvalidItem), ...current.slice(indexOfInvalidItem + 1)]
                }
                return current;
            })
        }
        const responseData = await response.json();
        console.log(responseData);
        setExpenseArray(await getExpenseList());
        setBudgetArray(await getBudgetList());

    } catch (error) {
        console.error("Error:", error);
    }
}

export async function handleExpenseDeletion(expenseId: string,
                                            setExpenseArray: Dispatch<SetStateAction<ExpenseItemEntity[]>>,
                                            setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>) {
    setExpenseArray(expenseArray => expenseArray.filter( expenseItem => {
        return expenseItem.expenseId !== expenseId
        }
    ))
    try {
        const response = await fetch("http://localhost:8080/api/deleteExpense", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "expenseId": expenseId,
            })
        })

        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);

    } catch(error) {
        console.error("Error:", error);
    }
    getExpenseList().then( expenseList => setExpenseArray(expenseList))
    getBudgetList().then( budgetList => setBudgetArray(budgetList))
}

export async function getBudgetList() {
    try {
        const response = await fetch("http://localhost:8080/api/getBudget", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.status === 401) {
            console.error("JWT token expiry detected. Logging out.")
            window.alert("Login expired. Please log in again.")
            logoutOnClick()
                .then(() => {
                    window.location.href === "/login" && (window.location.href = "/login")
                } )
        }
        else if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData.sort(budgetSort));
        return responseData.sort(budgetSort)

    } catch (error) {
        console.error("Error:", error);
    }
}

export async function handleBudgetDeletion(category: string, setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>) {
    setBudgetArray(prevState => prevState.filter(budgetItem => budgetItem.category !== category))
    try {
        const response = await fetch("http://localhost:8080/api/deleteBudget", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "category": category,
            })
        })

        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);

    } catch(error) {
        console.error("Error:", error);
    }

    getBudgetList().then( budgetList => setBudgetArray(budgetList))
}

export async function handleBudgetCreation(setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>, newBudgetItem: BudgetItemEntity) {
    try {
        const response = await fetch("http://localhost:8080/api/createBudget", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category: newBudgetItem.category,
                amount: newBudgetItem.amount ? newBudgetItem.amount : 0,
                iconPath: newBudgetItem.iconPath != "" ? newBudgetItem.iconPath : "/src/assets/category-icons/category-default-icon.svg",
                group: newBudgetItem.group ? newBudgetItem.group : "Miscellaneous"
            })
        });

        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
            window.alert("Category name is invalid or already has assigned budget; or $999,999,999 limit exceeded.")
            setBudgetArray(current => {
                const indexOfInvalidItem = current.map(item => item.category).lastIndexOf(newBudgetItem.category);
                if (indexOfInvalidItem !== -1) {
                    return [...current.slice(0, indexOfInvalidItem), ...current.slice(indexOfInvalidItem + 1)]
                }
                return current;
            })
        }
        const responseData = await response.json()
        console.log(responseData);
        setBudgetArray(await getBudgetList());

    } catch (error) {
        console.error("Error:", error);
    }
}

export async function handleBudgetUpdating(category: string | null, formData: BudgetUpdatingFormData) {
    try {
        const response = await fetch("http://localhost:8080/api/updateBudget", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "category": category,
                "newCategoryName": formData.category,
                "amount": formData.amount,
                "group": formData.group,
                "iconPath": formData.iconPath
            })
        })
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
            const responseData = await response.json();
            console.log(responseData);
        }
        const responseData = await response.json();
        console.log(responseData);

    } catch (error) {
        console.error("Error:", error);
    }
}

export async function handleExpenseUpdating(expenseId: string, formData: ExpenseUpdatingFormData) {
    try {
        const response = await fetch("http://localhost:8080/api/updateExpense", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "expenseId": expenseId,
                "category": formData.category,
                "amount": formData.amount
            })
        })
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);

    } catch (error) {
        console.error("Error:", error);
    }
}

export async function getGroupList() {
    try {
        const response = await fetch("http://localhost:8080/api/getGroups", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        if (response.status === 401) {
            console.error("JWT token expiry detected. Logging out.")
            window.alert("Login expired. Please log in again.")
            logoutOnClick()
                .then(() => {
                    window.location.href === "/login" && (window.location.href = "/login")
                } )
        } else if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        } else {
            const responseData = await response.json();
            console.log(responseData)
            return responseData.sort(groupSort);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function groupSort (a: GroupItemEntity, b: GroupItemEntity){
    if (a.group === "Miscellaneous") return 1;
    if (b.group === "Miscellaneous") return -1;
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
}

function expenseSort(a: ExpenseItemEntity, b: ExpenseItemEntity) {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
}

export function groupListAsOptions(groupArray: GroupItemEntity[]): SelectorOptionsFormattedData[] {
    return groupArray.map( groupItemEntity => {
        return { value: groupItemEntity.group, label: groupItemEntity.group, colour: groupItemEntity.colour }
    });
}

export function categoryListAsOptions(budgetArray: BudgetItemEntity[], groupArray: GroupItemEntity[]) {
    return budgetArray.map( budgetItemEntity => {
        const groupOfCategory = getGroupOfCategory(budgetArray, budgetItemEntity.category)
        return {
            value: budgetItemEntity.category,
            label: budgetItemEntity.category,
            colour: groupOfCategory ? getColourOfGroup(groupOfCategory, groupArray) : "#17423f"
        }
    })
}

export async function handleGroupCreation(group: string, colour: string, setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>, newGroupItem: GroupItemEntity) {
    try {
        const response = await fetch("http://localhost:8080/api/createGroup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                group: group,
                colour: colour
            })
        });
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
            window.alert("Group name is invalid or already exists.")
            setGroupArray((currentGroupArray) => {
                const indexOfInvalidItem = currentGroupArray.map(item => item.group).lastIndexOf(newGroupItem.group);
                if (indexOfInvalidItem !== -1) {
                    return [...currentGroupArray.slice(0, indexOfInvalidItem), ...currentGroupArray.slice(indexOfInvalidItem + 1)]
                }
                return currentGroupArray;
            })
        }
        const responseData = await response.json()
        console.log(responseData);
        setGroupArray(await getGroupList());
    } catch (error) {
        console.error("Failed to create group:", error);
    }
}

export async function handleGroupDeletion(groupName: string,
                                          setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>,
                                          setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>,
                                          keepContainedBudgets: boolean) {
    setGroupArray(prevState => prevState.filter(groupItem => groupItem.group !== groupName))
    try {
        const response = await fetch("http://localhost:8080/api/deleteGroup", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                group: groupName,
                keepContainedBudgets: keepContainedBudgets
            })
        })

        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);

    } catch(error) {
        console.error("Error:", error);
    }

    await getGroupList()
        .then( options => setGroupArray(options))
        .then( () => getBudgetList().then( budgets => setBudgetArray(budgets)))
}

export async function handleGroupUpdating(originalGroupName: string, originalColour: string, formData: BasicGroupData, setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>, groupArray: GroupItemEntity[]) {
        if (originalGroupName === formData.group || !groupArray.map(groupItem => groupItem.group).includes(formData.group)) {
        setGroupArray(currentGroupArray => {
            return currentGroupArray.map(groupItem => groupItem.group == originalGroupName ? {
                colour: formData.colour ? formData.colour : groupItem.colour,
                group: formData.group,
                timestamp: groupItem.timestamp
            } : groupItem)
        })
        try {
            const response = await fetch("http://localhost:8080/api/updateGroup", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify( {
                    originalGroupName: originalGroupName,
                    newGroupName: formData.group,
                    newColour: formData.colour ? formData.colour : ""
                })
            });
            if (!response.ok) {
                console.error(`HTTP error - status: ${response.status}`)
                window.alert("Updated group is invalid.")
                setGroupArray(currentGroupArray => {

                    const revertedGroupOptions = [...currentGroupArray]
                    const indexOfInvalidlyEditedOption = currentGroupArray.map(groupItem => groupItem.group).lastIndexOf(formData.group);
                    if (indexOfInvalidlyEditedOption !== -1) {
                        revertedGroupOptions[indexOfInvalidlyEditedOption] = {
                            group: originalGroupName,
                            colour: originalColour,
                            timestamp: revertedGroupOptions[indexOfInvalidlyEditedOption].timestamp
                        }
                    }
                    return revertedGroupOptions;
                })
            } else {
                console.log("Group successfully updated.")
                setGroupArray(await getGroupList());
            }
        } catch (error) {
            console.error("Failed to update group:", error)
        }
    } else {
        console.error("Selected group name already taken.")
        window.alert("Selected group name already taken.")
    }
}

export function getRandomColour() {
    const colourArray = [
        '#fbb39a',
        '#fbdee0',
        '#f8b2bc',
        '#f1afa1',
        '#fbf5ab',
        '#e6eda0',
        '#9fd5be',
        '#c3e6df',
        '#9dc7b9',
        '#acbfa1',
        '#c6e2ba',
        '#a6c7ea',
        '#7c86bf',
        '#b2b4da',
        '#dfcde3',
        '#ceb4d9'
    ];

    const randomColourIndex = Math.floor(Math.random() * colourArray.length);
    return colourArray[randomColourIndex];
}

export function addIconSelectionFunctionality(setFormData:
                                                  Dispatch<SetStateAction<BudgetUpdatingFormData>>
                                                  | Dispatch<SetStateAction<BudgetCreationFormData>>) {
    const categoryIcons: NodeListOf<HTMLImageElement> = document.querySelectorAll(".category-icon-selectable");
    categoryIcons.forEach((icon): void => {
        icon.addEventListener("click", (e: MouseEvent) => {
            e.preventDefault();
            const iconPath = `/src/assets/category-icons/${icon.getAttribute("data-value")!}`;

            setFormData((currentFormData: any) => {
                return {...currentFormData, ["iconPath"]: iconPath}
            });
            console.log(`iconPath: ${iconPath}`)

            document.querySelectorAll('.category-icon-selectable').forEach(btn => btn.classList.remove("selected-icon"));
            icon.classList.add("selected-icon");
        });
    });
}

export function addColourSelectionFunctionality(setFormData: Dispatch<SetStateAction<BasicGroupData>>) {
    const colourElementList: NodeListOf<HTMLImageElement> = document.querySelectorAll(".group-colour-selectable-container");
    colourElementList.forEach(colourSelectable => {
        colourSelectable.addEventListener("click", (e: MouseEvent) => {
            const triangleElement = colourSelectable.firstChild as HTMLDivElement;

            e.preventDefault();
            setFormData((current: BasicGroupData) => {
                return {...current, ["colour"]: triangleElement.getAttribute("data-value")}
            });

            colourElementList.forEach(colourSelectable => {
                const triangle = colourSelectable.firstChild as HTMLDivElement;
                triangle.classList.remove("selectedColour")
            });
            triangleElement.classList.add("selectedColour");
        })
    })
}

export function dynamicallySizeBudgetNameDisplays() {
    const budgetNameElements = document.querySelectorAll(".budget-name") as NodeListOf<HTMLElement>;
    budgetNameElements.forEach(budgetNameElement => {
        let dynamicFontSize = ""
        const budgetNameLength = budgetNameElement.textContent?.length!;
        if (budgetNameLength <= 10) {
            dynamicFontSize = "18px";
        } else if (budgetNameLength <= 14) {
            dynamicFontSize = "14px";
        } else if (budgetNameLength <= 18) {
            dynamicFontSize = "11px";
        }
        // console.log(`The size of ${budgetNameElement.innerText} (${budgetNameLength} characters) is ${dynamicFontSize}`);
        budgetNameElement.style.fontSize = dynamicFontSize;
    })
}

export function getAmountBudgeted(budgetArray: BudgetItemEntity[]) {
    const amountArray = budgetArray.map( budgetItem => (
        budgetItem.amount
    ))
    // console.log(amountArray)
    return amountArray.reduce((accumulator, currentValue) => (
        accumulator + currentValue
    ), 0)
}

export function formatDollarAmount(number: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(number);
}

function getOrdinalSuffix(day: number) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

export function formatDate(date: Date) {
    const formattedDayOfWeek = new Intl.DateTimeFormat('en-AU', { weekday: "long" }).format(date);
    const formattedDayOfMonth = date.getDate();
    const formattedMonth = new Intl.DateTimeFormat('en-AU', { month: "long" }).format(date);
    const formattedYear = new Intl.DateTimeFormat('en-AU', { year: "numeric" }).format(date);

    const ordinalSuffix = getOrdinalSuffix(formattedDayOfMonth);

    return `${formattedDayOfWeek}, ${formattedDayOfMonth}${ordinalSuffix} ${formattedMonth} ${formattedYear}`
}

export async function implementDynamicBackgroundHeight() {
    function adjustBackgroundHeight() {
        const bodyHeight = document.body.scrollHeight;
        const backgroundDiv: HTMLDivElement = document.querySelector('.background')!;
        if (bodyHeight > window.innerHeight) {
            backgroundDiv!.style.height = bodyHeight + 'px';
        }
    }

// Select the node to be observed
    const targetNode = document.body;

// Set up the observer options
    const config = {
        childList: true,    // Detect direct children changes
        subtree: true,      // Detect all descendant changes
        attributes: true    // Detect changes in attributes
    };

// Callback function to execute when changes are observed
    const callback = function() {
        adjustBackgroundHeight();
    };


// Create an instance of the observer
    const observer = new MutationObserver(callback);

// Start observing the target node
    observer.observe(targetNode, config);
}

export function getGroupOfCategory(budgetArray: BudgetItemEntity[], category: string) {
    try {
        return budgetArray.filter(budgetItemEntity => budgetItemEntity.category === category)[0].group
    } catch (e) {
        console.log(`Failed to retrieve the group of category ${category}. Temporarily assuming Miscellaneous.`)
        console.log("Below is index 0:")
        console.log(budgetArray.filter(budgetItemEntity => budgetItemEntity.category === category)[0])
        console.log("Below is the budgetArray:")
        console.log(budgetArray)
        return null;
    }
}

export function getWindowLocation() {
    const urlArray = window.location.href.split("/");
    return urlArray[urlArray.length - 1];
}

export async function logoutOnClick() {
    try {
        await fetch("http://localhost:8080/api/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({jwt: localStorage.getItem("jwt")})
        })
            .then( () => window.location.href = "/login")
            .catch( error => console.error(error))
    } catch {
        console.error("Error: Logout failed")
    }
}

export async function checkForUser() {
    try {
        const response = await fetch("http://localhost:8080/api/checkForUser", {
            method: "GET",
        });
        if (response.status === 400) {
            console.error("Failed to check for user status.")
        } else if (response.status === 401) {
            console.error("JWT token expiry detected. Logging out.")
            window.alert("Login expired. Please log in again.")
            logoutOnClick()
                .then(() => {
                    window.location.href === "/login" && (window.location.href = "/login")
                } )
        }
        else {
            const userStatus = await response.json();
            console.log(userStatus)
            return userStatus;
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

export function checkForOpenExpenseModalOrForm(expenseFormVisibility: ExpenseFormVisibility, expenseModalVisibility: ExpenseModalVisibility) {
    return Object.values(expenseFormVisibility).includes(true) || Object.values(expenseModalVisibility).includes(true)
}

export function checkForOpenBudgetModalOrForm(budgetFormVisibility: BudgetFormVisibility, budgetModalVisibility: BudgetModalVisibility) {
    return Object.values(budgetFormVisibility).includes(true) || Object.values(budgetModalVisibility).includes(true)
}

function budgetSort(budgetItemA: BudgetItemEntity, budgetItemB: BudgetItemEntity) {
    try {
        return new Date(budgetItemA.timestamp!).getTime() - new Date(budgetItemB.timestamp!).getTime();
    } catch (e) {
        console.error("Failed to perform budget sort. Below is budgetItemA and B.")
        console.log(budgetItemA);
        console.log(budgetItemB);
    }
}


export function getLineAngle(percentageIncomeRemaining: number) {
    const functionalPercentageIncomeRemaining = percentageIncomeRemaining <= -100 ? -100 : percentageIncomeRemaining >= 100 ? 100 : percentageIncomeRemaining
    return functionalPercentageIncomeRemaining <= -100 ? 14.5 :
        functionalPercentageIncomeRemaining === 100 ? -14.5 :
            functionalPercentageIncomeRemaining / (100 / 14.5);
}