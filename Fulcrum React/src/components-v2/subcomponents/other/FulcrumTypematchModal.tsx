import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components-v2/ui/dialog.tsx";
import { Button } from "@/components-v2/ui/button.tsx";
import { ChangeEvent, Dispatch, FormEvent, ReactNode, SetStateAction, useState } from "react";
import { Input } from "@/components-v2/ui/input.tsx";
import { toast } from "sonner";

interface FulcrumTypematchModalProps {
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  dialogTitle: string;
  dialogDescription?: string;

  leftButtonFunction: () => void;
  leftButtonVariant?: "default" | "destructive" | "link" | "outline" | "secondary" | "ghost" | "empty";
  rightButtonText: string;

  rightButtonFunction: () => void;
  leftButtonText: string;
  rightButtonVariant?: "default" | "destructive" | "link" | "outline" | "secondary" | "ghost" | "empty";

  buttonTriggerComponent?: ReactNode;

  typeMatchString: string;
}

export default function FulcrumTypematchModal({
  dialogOpen,
  setDialogOpen,
  dialogTitle,
  dialogDescription = "",
  leftButtonVariant = "default",
  rightButtonVariant = "destructive",
  leftButtonFunction,
  rightButtonFunction,
  leftButtonText,
  rightButtonText,
  buttonTriggerComponent,
  typeMatchString,
}: FulcrumTypematchModalProps) {
  const [typeMatchValue, setTypeMatchValue] = useState("");

  const handleTypeMatchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTypeMatchValue(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (typeMatchValue !== typeMatchString) {
      toast.warning("Please ensure that the text matches.");
      return;
    }
    rightButtonFunction();
  };

  return (
    <div className={"col-start-3 col-span-3"}>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {!!buttonTriggerComponent && (
          <DialogTrigger asChild className={"flex w-full"}>
            {buttonTriggerComponent}
          </DialogTrigger>
        )}
        <DialogContent className={"w-[80vw] flex flex-col gap-8"}>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription className={"pt-1"}>
              <span>{dialogDescription}</span>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <p>
              Enter '<b>{typeMatchString}</b>' below to proceed.
            </p>
            <Input type={"text"} value={typeMatchValue} onChange={handleTypeMatchInputChange} className={"mt-3"} />
            <DialogFooter className={"flex flex-row justify-end items-center pt-8"}>
              <Button variant={leftButtonVariant} onClick={leftButtonFunction} type={"button"}>
                {leftButtonText}
              </Button>
              <Button variant={rightButtonVariant} type={"submit"}>
                {rightButtonText}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
