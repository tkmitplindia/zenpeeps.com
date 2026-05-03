import * as React from "react"
import { GripVertical, Plus, Trash2 } from "lucide-react"
import {
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Input } from "./input"
import { Button } from "./button"
import { cn } from "@/lib/utils"

export interface ListInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange"> {
    value: string[]
    onChange: (value: string[]) => void
}

interface Item {
    id: string
    text: string
}

function SortableRow({
    item,
    onEdit,
    onRemove,
}: {
    item: Item
    onEdit: (text: string) => void
    onRemove: () => void
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: item.id,
    })

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "flex items-center gap-2 rounded-md bg-background",
                isDragging && "relative z-10 shadow-lg"
            )}
        >
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="h-4 w-4" />
            </Button>
            <Input
                value={item.text}
                onChange={(e) => onEdit(e.target.value)}
                className="flex-1"
            />
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onRemove}
                className="text-red-500"
            >
                <Trash2 />
            </Button>
        </div>
    )
}

export function ListInput({ value, onChange, className, ...props }: ListInputProps) {
    const dndId = React.useId()
    const [newItem, setNewItem] = React.useState("")
    const [items, setItems] = React.useState<Item[]>(() =>
        value.map((text, i) => ({ id: `${dndId}-i${i}`, text }))
    )

    React.useEffect(() => {
        setItems((prev) => {
            if (prev.length === value.length && prev.every((item, i) => item.text === value[i])) {
                return prev
            }
            return value.map((text, i) => ({
                id: prev[i]?.id ?? crypto.randomUUID(),
                text,
            }))
        })
    }, [value])

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const commit = (next: Item[]) => {
        setItems(next)
        onChange(next.map((item) => item.text))
    }

    const handleAdd = () => {
        if (newItem.trim()) {
            commit([...items, { id: crypto.randomUUID(), text: newItem.trim() }])
            setNewItem("")
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            handleAdd()
        }
    }

    const handleEdit = (id: string, text: string) => {
        commit(items.map((item) => (item.id === id ? { ...item, text } : item)))
    }

    const handleRemove = (id: string) => {
        commit(items.filter((item) => item.id !== id))
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id)
            const newIndex = items.findIndex((item) => item.id === over.id)
            if (oldIndex !== -1 && newIndex !== -1) {
                commit(arrayMove(items, oldIndex, newIndex))
            }
        }
    }

    return (
        <div className={cn("flex flex-col gap-2", className)} {...props}>
            <DndContext
                id={dndId}
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map((item) => item.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex flex-col gap-2">
                        {items.map((item) => (
                            <SortableRow
                                key={item.id}
                                item={item}
                                onEdit={(text) => handleEdit(item.id, text)}
                                onRemove={() => handleRemove(item.id)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <Input
                placeholder="Add an item..."
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={handleKeyDown}
                
            />
        </div>
    )
}
