import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
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
import useUpdateUserPreferences from "@/hooks/mutations/other/useUpdateUserPreferences.ts";
import useUploadProfileImage from "@/hooks/mutations/other/useUploadProfileImage.ts";
import Loader from "@/components-v2/subcomponents/other/Loader.tsx";
import { Skeleton } from "@/components-v2/ui/skeleton.tsx";
import useWipeProfileImageData from "@/hooks/mutations/other/useWipeProfileImageData.ts";

export default function UpdateAvatarFormV2() {
  const maxFileSize = 16 * 1024 * 1024; // 16MB

  const [avatarFormOpen, setAvatarFormOpen] = useState(false);
  const userPreferences: UserPreferences = useQueryClient().getQueryData(["userPreferences", useEmail()])!;
  const profileImageURL: string = useQueryClient().getQueryData(["profileImageURL", useEmail()])!;

  const [formData, setFormData] = useState<{
    avatarFileName: string | null;
    avatarByteArray: ArrayBuffer | null;
  }>({
    avatarFileName: userPreferences.profileIconFileName,
    avatarByteArray: null,
  });
  const [triggerHovered, setTriggerHovered] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(profileImageURL);
  const [error, setError] = useState<string | null>(null);

  const { mutate: updateUserPreferences } = useUpdateUserPreferences();
  const { mutate: uploadProfileImage } = useUploadProfileImage();
  const { mutate: removeProfileImages } = useWipeProfileImageData();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!fileInputRef.current || !fileInputRef.current.value) {
      removeProfileImages();
      setAvatarFormOpen(false);
      return;
    }

    if (userPreferences.profileIconFileName === formData.avatarFileName) {
      console.log("File name unchanged.");
      setAvatarFormOpen(false);
      return;
    }

    uploadProfileImage({
      optimisticURL: imagePreview!,
      byteArray: formData.avatarByteArray!,
      fileName: formData.avatarFileName!,
    });
    setAvatarFormOpen(false);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImage = e.target.files[0];

      if (selectedImage.size > maxFileSize) {
        setImagePreview("");
        setError("File size should not exceed 16MB.");
        return;
      }
      setError(null);

      const previewReader = new FileReader();
      previewReader.readAsDataURL(selectedImage);
      previewReader.onloadend = () => {
        const preview = previewReader.result as string;
        setImagePreview(preview);
      };

      const formDataReader = new FileReader();
      formDataReader.readAsArrayBuffer(selectedImage);
      formDataReader.onloadend = () => {
        const formDataResult = formDataReader.result as ArrayBuffer;
        setFormData((prevFormData) => ({
          ...prevFormData,
          avatarFileName: selectedImage.name,
          avatarByteArray: formDataResult,
        }));
      };
    }
  };

  const handleClickRemoveAvatar = (e: React.MouseEvent) => {
    e.preventDefault();
    setFormData({
      avatarFileName: null,
      avatarByteArray: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError(null);
    setImagePreview(null);
  };

  const handleClickCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    setAvatarFormOpen(false);
  };

  useEffect(() => {
    setImagePreview(profileImageURL);
  }, [avatarFormOpen]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

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
                  sideOffset={20}
                  className={"ml-10 py-0.5 px-2 bg-background text-primary rounded-sm"}
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
          <SheetDescription>The accepted formats are jpg, png and gif.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4 mt-4">
          <div className={"grid grid-cols-4 items-center gap-5 relative"}>
            <Label htmlFor="avatar" className={"text-right"}>
              Image
            </Label>
            <Input
              type="file"
              accept={"image/*"}
              className={"col-span-3 hover:cursor-pointer hover:opacity-75 bg-[#002E38] text-left text-white font-medium"}
              onChange={handleImageChange}
              ref={fileInputRef}
              name="avatar"
              id="avatar"
            />
          </div>
          {imagePreview && <img src={imagePreview} className={"w-24 max-h-48 ml-auto"} alt={""} />}
          {error && <p className={"ml-auto text-red-500"}>{error}</p>}
          <div className={"flex flex-row gap-3 items-center mt-2 self-end"}>
            <Button onClick={handleClickCancel} variant={"secondary"} type={"button"}>
              Cancel
            </Button>
            {imagePreview && (
              <Button onClick={handleClickRemoveAvatar} variant={"destructive"}>
                Remove
              </Button>
            )}

            <Button variant={"default"}>Save Changes</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
