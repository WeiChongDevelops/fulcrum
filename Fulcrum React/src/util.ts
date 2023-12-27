import {Dispatch, SetStateAction} from "react";

export interface ExpenseItemEntity {
    expenseId: string
    category: string
    amount: number
    timestamp: Date
}

export interface BudgetItemEntity {
    category: string
    amount: number
    iconPath: string
    group: string
}

export interface BudgetCreationFormData {
    category: string;
    amount: number;
    iconPath: string;
    group: string;
}

export interface BudgetUpdatingFormData {
    category: string;
    amount: number;
    group: string;
    iconPath: string;
}

export interface BasicGroupData {
    group: string;
    colour: string | null;
}

export interface GroupItemEntity {
    group: string;
    colour: string;
    dateCreated: Date;
}

export interface GroupOptionsFormattedData {
    value: string;
    label: string;
    colour: string | null;
}

export interface BudgetFormVisibilityState {
    isCreateBudgetVisible: boolean,
        isUpdateBudgetVisible: boolean,
    isCreateGroupVisible: boolean,
    isUpdateGroupVisible: boolean,
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
    control: (styles: any) => ({ ...styles, backgroundColor: "white" }),
    option: (styles: any, {data}: any) => {
        return { ...styles, color: data.colour || "red" };
    },
    input: (styles: any) => ({ ...styles, ...dot() }),
    placeholder: (styles: any) => ({ ...styles, ...dot('#ccc') }),
    singleValue: (styles: any, {data}: any) => ({ ...styles, ...dot(data.colour) }),
};

export function getColourOfGroup(groupName: string, groupOptions: GroupOptionsFormattedData[]) {
    const groupOption = groupOptions.find(groupOption => groupOption.label === groupName);
    if (groupOption) {
        return groupOption.colour;
    }
    return null;
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
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log(responseData);
        return responseData

    } catch (error) {
        console.error("Error:", error);
    }
}

export async function getBudgetList() {
    try {
        const response = await fetch("http://localhost:8080/api/getBudget", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
            window.location.href = "/login"
        }
        const responseData = await response.json();
        console.log(responseData);
        return responseData

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

export async function handleGroupDeletion(groupName: string,
                                          setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>,
                                          setBudgetArray: Dispatch<SetStateAction<BudgetItemEntity[]>>) {
    setGroupArray(prevState => prevState.filter(groupItem => groupItem.group !== groupName))
    try {
        const response = await fetch("http://localhost:8080/api/deleteGroup", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "group": groupName,
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


export async function handleBudgetCreation(formData: BudgetCreationFormData, setBudgetArray: (value: (((prevState: BudgetItemEntity[]) => BudgetItemEntity[]) | BudgetItemEntity[])) => void, newBudgetItem: BudgetItemEntity) {
    try {
        const response = await fetch("http://localhost:8080/api/createBudget", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category: formData.category,
                amount: formData.amount ? formData.amount : 0,
                iconPath: formData.iconPath != "" ? formData.iconPath : "/src/assets/category-icons/category-default-icon.svg",
                group: formData.group ? formData.group : "Miscellaneous"
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
        if (!response.ok) {
            console.error(`HTTP error - status: ${response.status}`);
        } else {
            const responseData = await response.json();
            console.log(responseData)
            return responseData.sort((a: GroupItemEntity, b: GroupItemEntity) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime());
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

export function groupListAsOptions(groupList: GroupItemEntity[]) {
    return groupList.map( rawGroupDataItem => {
        return { value: rawGroupDataItem.group, label: rawGroupDataItem.group, colour: rawGroupDataItem.colour }
    });
}

export async function handleGroupCreation(formData: BasicGroupData, setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>, newGroupItem: GroupItemEntity) {
    try {
        const response = await fetch("http://localhost:8080/api/createGroup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                group: formData.group,
                colour: formData.colour
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

export async function handleGroupUpdating(originalGroupName: string, originalColour: string, formData: BasicGroupData, setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>, groupArray: GroupItemEntity[]) {
        if (originalGroupName === formData.group || !groupArray.map(groupItem => groupItem.group).includes(formData.group)) {
        setGroupArray(currentGroupArray => {
            return currentGroupArray.map(groupItem => groupItem.group == originalGroupName ? {
                colour: formData.colour ? formData.colour : groupItem.colour,
                group: formData.group,
                dateCreated: groupItem.dateCreated
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
                            dateCreated: revertedGroupOptions[indexOfInvalidlyEditedOption].dateCreated
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
        '#81e1d7', '#5cd67b', '#6087d6', '#c4696d',
        '#c08757', '#65a9c6', '#4ab6a3', '#6ec15d',
        '#5f74da', '#81d16d', '#ae7cd1', '#e49b84',
        '#71d0be', '#bb5171', '#8065c6', '#8d66b2'
    ];

    // Gives number between 0 and 1: Math.random()
    // Gives number within bounds of array size: Math.random() * colourArray.length
    // Floor it.

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
            dynamicFontSize = "16px";
        } else if (budgetNameLength <= 18) {
            dynamicFontSize = "12px";
        } else if (budgetNameLength <= 22) {
            dynamicFontSize = "10px";
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


export function formatNumberWithCommas(numberString: string) {
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};