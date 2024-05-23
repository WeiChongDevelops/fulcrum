import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  defaultAnimateLayoutChanges,
} from "@dnd-kit/sortable";
import { GroupItemEntity } from "@/utility/types.ts";
import { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components-v2/ui/button.tsx";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components-v2/ui/sheet.tsx";
import { Label } from "@/components-v2/ui/label.tsx";
import { Input } from "@/components-v2/ui/input.tsx";
import { ScrollArea, ScrollBar } from "@/components-v2/ui/scroll-area";
import { Separator } from "@/components-v2/ui/separator";

const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <>
            <div key={tag} className="text-sm">
              {tag}
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  );
}

interface PlaygroundGroupProps {
  groupItem: GroupItemEntity;
  // setGroupArray: Dispatch<SetStateAction<GroupItemEntity[]>>;
}

export function PlaygroundGroup({ groupItem }: PlaygroundGroupProps) {
  function animateLayoutChanges(args: any) {
    const { isSorting, wasSorting } = args;

    if (isSorting || wasSorting) {
      return defaultAnimateLayoutChanges(args);
    }

    return true;
  }

  const id = groupItem.id;
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    touchAction: "none",
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.alert("hi");
    // setGroupArray((prevGroupArray) => prevGroupArray.filter((group) => group.id !== id));
  };

  return (
    <div
      className={"flex flex-row justify-around items-center text-white font-bold rounded-lg w-[90vw] h-20 focus:outline"}
      key={groupItem.id}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ ...style, backgroundColor: groupItem.colour, filter: "saturate(35%)" }}
    >
      <p>{groupItem.group}</p>
      <p>Index: {groupItem.id}</p>
      <Button onClick={handleDelete}>Bye</Button>
    </div>
  );
}

export default function Playground() {
  const groupItems: GroupItemEntity[] = [
    {
      group: "Group 1",
      colour: "red",
      timestamp: new Date(),
      id: 1,
    },
    {
      group: "Group 2",
      colour: "blue",
      timestamp: new Date(),
      id: 2,
    },
    {
      group: "Group 3",
      colour: "green",
      timestamp: new Date(),
      id: 3,
    },
    {
      group: "Group 4",
      colour: "yellow",
      timestamp: new Date(),
      id: 4,
    },
    {
      group: "Group 5",
      colour: "purple",
      timestamp: new Date(),
      id: 5,
    },
  ];

  const [groupArray, setGroupArray] = useState(groupItems);

  const getIndexOf = (id: UniqueIdentifier | number) => {
    return groupArray.findIndex((groupItem) => groupItem.id === (id as number));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id === over?.id) return;
    setGroupArray((prevGroupArray) => {
      return !!over ? arrayMove(prevGroupArray, getIndexOf(active.id), getIndexOf(over.id)) : prevGroupArray;
    });
  };

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  return (
    // <div className={"flex flex-col justify-start items-center"}>
    // <ScrollAreaDemo />
    // </div>

    <ScrollArea className="h-screen w-screen bg-emerald-200 border-8 border-fuchsia-200">
      <ScrollBar orientation={"vertical"} />
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <>
            <div key={tag} className="text-sm outline outline-slate-700">
              {tag}
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  );
}
