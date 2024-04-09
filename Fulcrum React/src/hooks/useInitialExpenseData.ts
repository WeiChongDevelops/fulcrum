import { useContext, useEffect, useMemo, useState } from "react";
import {
  BlacklistedExpenseItemEntity,
  checkForOpenModalOrForm,
  EmailContext,
  ExpenseItemEntity,
  ExpenseModalVisibility,
  getStructuredExpenseData,
  handleBatchExpenseDeletion,
  handleExpenseCreation,
  MonthExpenseGroupEntity,
  PreviousExpenseBeingEdited,
  RecurringExpenseItemEntity,
  updateRecurringExpenseInstances,
} from "../util.ts";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

interface useInitialExpenseDataProps {
  expenseArray: ExpenseItemEntity[];
  blacklistedExpenseArray: BlacklistedExpenseItemEntity[];
  recurringExpenseArray: RecurringExpenseItemEntity[];
}

export default function useInitialExpenseData({
  expenseArray,
  blacklistedExpenseArray,
  recurringExpenseArray,
}: useInitialExpenseDataProps) {
  const [expenseFormVisibility, setExpenseFormVisibility] = useState({
    isCreateExpenseVisible: false,
    isUpdateExpenseVisible: false,
    isUpdateRecurringExpenseInstanceVisible: false,
  });
  const [expenseModalVisibility, setExpenseModalVisibility] = useState<ExpenseModalVisibility>({
    isConfirmExpenseDeletionModalVisible: false,
  });
  const [isExpenseFormOrModalOpen, setIsExpenseFormOrModalOpen] = useState(false);
  const [oldExpenseBeingEdited, setOldExpenseBeingEdited] = useState<PreviousExpenseBeingEdited>({
    expenseId: "",
    recurringExpenseId: "",
    oldCategory: "",
    oldTimestamp: new Date(),
    oldAmount: 0,
  });
  const [expenseItemToDelete, setExpenseItemToDelete] = useState<ExpenseItemEntity>({
    expenseId: "",
    category: "",
    amount: 0,
    timestamp: new Date(),
    recurringExpenseId: null,
  });
  const [defaultCalendarDate, setDefaultCalendarDate] = useState(new Date());

  useEffect(() => {
    setIsExpenseFormOrModalOpen(checkForOpenModalOrForm(expenseFormVisibility, expenseModalVisibility));
  }, [expenseFormVisibility, expenseModalVisibility]);

  const email = useContext(EmailContext);
  const queryClient = useQueryClient();

  const expenseCreationMutation = useMutation({
    mutationFn: (newExpenseItem: ExpenseItemEntity) => {
      console.log("MUTATION OBJECT");
      console.log(newExpenseItem);
      return handleExpenseCreation(newExpenseItem);
    },
    onMutate: async (newExpenseItem: ExpenseItemEntity) => {
      await queryClient.cancelQueries({ queryKey: ["expenseArray", email] });
      const dataBeforeOptimisticUpdate = await queryClient.getQueryData(["expenseArray", email]);
      await queryClient.setQueryData(["expenseArray", email], (prevExpenseCache: ExpenseItemEntity[]) => {
        return [newExpenseItem, ...prevExpenseCache];
      });
      return { dataBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      return queryClient.setQueryData(["expenseArray", email], context?.dataBeforeOptimisticUpdate);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseArray", email] });
    },
  });

  const batchExpenseDeletionMutation = useMutation({
    mutationFn: (expenseIdsToDelete: string[]) => {
      return handleBatchExpenseDeletion(expenseIdsToDelete);
    },
    onMutate: async (expenseIdsToDelete: string[]) => {
      await queryClient.cancelQueries({ queryKey: ["expenseArray", email] });
      const expenseArrayBeforeOptimisticUpdate = await queryClient.getQueryData(["expenseArray", email]);
      await queryClient.setQueryData(["expenseArray", email], (prevExpenseCache: ExpenseItemEntity[]) => {
        return prevExpenseCache.filter((expenseItem) => !(expenseItem.expenseId in expenseIdsToDelete));
      });
      return { expenseArrayBeforeOptimisticUpdate };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(["expenseArray", email], context?.expenseArrayBeforeOptimisticUpdate);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseArray", email] });
    },
  });

  const [isLoading, setIsLoading] = useState(true);

  // let structuredExpenseDataQuery = useQuery({
  //   queryKey: ["structuredExpenseData", email],
  //   queryFn: async () => {
  //     await updateRecurringExpenseInstances(
  //       recurringExpenseArray,
  //       expenseArray,
  //       blacklistedExpenseArray,
  //       expenseCreationMutation as UseMutationResult,
  //       batchExpenseDeletionMutation as UseMutationResult,
  //     );
  //     return await getStructuredExpenseData(expenseArray);
  //   },
  // });

  // useEffect(() => {
  //   async function updateExpenseDisplay() {
  //     await updateRecurringExpenseInstances(
  //       recurringExpenseArray,
  //       expenseArray,
  //       blacklistedExpenseArray,
  //       expenseCreationMutation as UseMutationResult,
  //       batchExpenseDeletionMutation as UseMutationResult,
  //     );
  //     setStructuredExpenseData(await getStructuredExpenseData(expenseArray));
  //   }
  //   updateExpenseDisplay();
  // }, [expenseArray]);

  const [structuredExpenseData, setStructuredExpenseData] = useState<MonthExpenseGroupEntity[]>();

  useMemo(() => {
    const updateStructuredExpenseData = async () => {
      setStructuredExpenseData(await getStructuredExpenseData(expenseArray));
    };
    updateStructuredExpenseData().then(() => setIsLoading(false));
  }, [expenseArray]);

  useMemo(() => {
    updateRecurringExpenseInstances(
      recurringExpenseArray,
      expenseArray,
      blacklistedExpenseArray,
      expenseCreationMutation as UseMutationResult,
      batchExpenseDeletionMutation as UseMutationResult,
    );
  }, [recurringExpenseArray]);

  return {
    structuredExpenseData,
    expenseFormVisibility,
    setExpenseFormVisibility,
    expenseModalVisibility,
    setExpenseModalVisibility,
    isExpenseFormOrModalOpen,
    oldExpenseBeingEdited,
    setOldExpenseBeingEdited,
    expenseItemToDelete,
    setExpenseItemToDelete,
    defaultCalendarDate,
    setDefaultCalendarDate,
    isLoading,
  };
}
