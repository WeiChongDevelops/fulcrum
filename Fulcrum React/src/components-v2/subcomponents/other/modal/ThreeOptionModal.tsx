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
import { Dispatch, ReactNode, SetStateAction } from "react";
import { UserPreferences } from "@/utility/types.ts";
import { useQueryClient } from "@tanstack/react-query";
import { cn, useEmail } from "@/utility/util.ts";

interface ThreeOptionModalProps {
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  dialogTitle: string;
  dialogDescription?: string;

  leftButtonFunction: () => void;
  leftButtonVariant?: "default" | "destructive" | "link" | "outline" | "secondary" | "ghost" | "empty";
  leftButtonText: string;

  rightButtonFunction: () => void;
  rightButtonVariant?: "default" | "destructive" | "link" | "outline" | "secondary" | "ghost" | "empty";
  rightButtonText: string;

  midButtonFunction: () => void;
  midButtonVariant?: "default" | "destructive" | "link" | "outline" | "secondary" | "ghost" | "empty";
  midButtonText: string;

  buttonTriggerComponent?: ReactNode;
}

export default function ThreeOptionModal({
  dialogOpen,
  setDialogOpen,
  dialogTitle,
  dialogDescription = "",
  leftButtonVariant = "secondary",
  midButtonVariant = "default",
  rightButtonVariant = "destructive",
  leftButtonFunction,
  midButtonFunction,
  rightButtonFunction,
  leftButtonText,
  midButtonText,
  rightButtonText,
  buttonTriggerComponent,
}: ThreeOptionModalProps) {
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;

  return (
    <div className={"col-start-3 col-span-3"}>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {!!buttonTriggerComponent && (
          <DialogTrigger asChild className={"flex w-full"}>
            {buttonTriggerComponent}
          </DialogTrigger>
        )}
        <DialogContent className={cn("w-[80vw] flex flex-col gap-8", userPreferences.darkModeEnabled && "dark")}>
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription className={"pt-3"}>
              <span>{dialogDescription}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className={"flex flex-row justify-end items-center"}>
            <Button variant={leftButtonVariant} onClick={leftButtonFunction} type={"button"}>
              {leftButtonText}
            </Button>
            <Button variant={midButtonVariant} onClick={midButtonFunction}>
              {midButtonText}
            </Button>
            <Button variant={rightButtonVariant} onClick={rightButtonFunction}>
              {rightButtonText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
