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
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ animateLayoutChanges, id });

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
      className={"flex flex-row justify-around items-center bg-fuchsia-300 rounded-lg w-[90vw] h-20 focus:outline"}
      key={groupItem.id}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
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
    <div className={"flex flex-col justify-start items-center"}>
      <Button
        onClick={() => setGroupArray((prevGroupArray) => prevGroupArray.filter((item) => item.id !== prevGroupArray[0].id))}
      >
        Take
      </Button>
      <Button
        onClick={() =>
          setGroupArray([
            {
              group: "Group 6",
              colour: "purple",
              timestamp: new Date(),
              id: groupArray[0].id - 1,
            },
            ...groupArray,
          ])
        }
      >
        Give
      </Button>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <h1 className={"font-bold text-xl my-12"}>Category Groups</h1>
        <SortableContext items={groupArray} strategy={verticalListSortingStrategy}>
          <div className={"flex flex-col justify-start items-center gap-4 transition-all"}>
            {groupArray.map((groupItem, index) => (
              <PlaygroundGroup groupItem={groupItem} key={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
