import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { UserPreferences } from "@/utility/types.ts";
import { useQueryClient } from "@tanstack/react-query";
import { getCurrencySymbol, handleInputChangeOnFormWithAmount, useEmail } from "@/utility/util.ts";
import useUpdateTotalIncome from "@/hooks/mutations/budget/useUpdateTotalIncome.ts";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components-v2/ui/sheet.tsx";
import { Button } from "@/components-v2/ui/button.tsx";
import { Label } from "@/components-v2/ui/label.tsx";
import { Input } from "@/components-v2/ui/input.tsx";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components-v2/ui/tooltip";
import { cn } from "@/lib/utils.ts";

export default function UpdateAvatarFormV2() {
  const [avatarFormOpen, setAvatarFormOpen] = useState(false);
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;

  const [formData, setFormData] = useState<{ avatarBytes: File | null }>({ avatarBytes: null });
  const [triggerHovered, setTriggerHovered] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // const { mutate: updateTotalIncome } = useUpdateTotalIncome();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // updateTotalIncome(formData.amount);
    setAvatarFormOpen(false);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImage = e.target.files[0];
      if (e.target.files) {
        setFormData({ avatarBytes: selectedImage });
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedImage);
      console.log("Image submitted:", selectedImage);
    }
  };

  useEffect(() => {
    setFormData({ avatarBytes: null });
  }, [avatarFormOpen]);

  return (
    <Sheet open={avatarFormOpen} onOpenChange={setAvatarFormOpen}>
      <SheetTrigger
        asChild
        onMouseEnter={() => setTriggerHovered(true)}
        onMouseLeave={() => setTriggerHovered(false)}
        className={"hover:bg-white/30"}
      >
        <div className={"absolute inset-0 z-30 size-9 rounded-[50%] bg-transparent hover:cursor-pointer"}>
          {triggerHovered && (
            <TooltipProvider>
              <Tooltip open={triggerHovered} onOpenChange={setTriggerHovered}>
                <TooltipTrigger></TooltipTrigger>
                <TooltipContent
                  side={"bottom"}
                  sideOffset={30}
                  className={"ml-4 py-0.5 px-2 bg-background text-primary rounded-sm"}
                >
                  <span className={"text-[0.6rem]"}>Change Avatar</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </SheetTrigger>
      <SheetContent className={cn(userPreferences.darkModeEnabled && "dark")}>
        <SheetHeader>
          <SheetTitle>Edit Profile Picture</SheetTitle>
          <SheetDescription>Select a new avatar.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4 mt-4">
          <div className={"grid grid-cols-4 items-center gap-5 relative"}>
            <Label htmlFor="avatar" className={"text-right"}>
              Image
            </Label>
            <Input
              type="file"
              accept={"image/*"}
              className={"col-span-3 hover:cursor-pointer hover:opacity-75 bg-[#223136] text-left text-white"}
              onChange={handleImageChange}
              name="avatar"
              id="avatar"
              required
            />
          </div>
          {imagePreview && <img src={imagePreview} className={"w-24 max-h-48 ml-auto"} alt="Preview" />}

          <Button className={"mt-2 self-end"}>Save Changes</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
