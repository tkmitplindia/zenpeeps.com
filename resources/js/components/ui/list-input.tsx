import * as React from "react"
import { GripVertical, ListIcon, Plus, Trash2 } from "lucide-react"
import { Input } from "./input"
import { Button } from "./button"
import { cn } from "@/lib/utils"

export interface ListInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "value" | "onChange"> {
  value: string[]
  onChange: (value: string[]) => void
}

export function ListInput({ value, onChange, className, ...props }: ListInputProps) {
  const [newItem, setNewItem] = React.useState("")
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null)

  const handleAdd = () => {
    if (newItem.trim()) {
      onChange([...value, newItem.trim()])
      setNewItem("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAdd()
    }
  }

  const handleEdit = (index: number, newValue: string) => {
    const newValues = [...value]
    newValues[index] = newValue
    onChange(newValues)
  }

  const handleRemove = (index: number) => {
    const newValues = [...value]
    newValues.splice(index, 1)
    onChange(newValues)
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
    // Required for Firefox
    e.dataTransfer.setData("text/plain", index.toString())
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newValues = [...value]
    const draggedItem = newValues[draggedIndex]
    
    newValues.splice(draggedIndex, 1)
    newValues.splice(index, 0, draggedItem)
    
    onChange(newValues)
    setDraggedIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <div className="flex flex-col gap-2">
        {value.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-2 rounded-md bg-background transition-colors",
              draggedIndex === index && "opacity-50"
            )}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4" />
            </Button>
            <Input
              value={item}
              onChange={(e) => handleEdit(index, e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleRemove(index)}              
              className="text-red-500"
            >
              <Trash2 />
            </Button>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <span className="w-9" />
        <Input
          placeholder="Add an item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleAdd}
          disabled={!newItem.trim()}
        >
          <Plus />
        </Button>
      </div>
    </div>
  )
}
