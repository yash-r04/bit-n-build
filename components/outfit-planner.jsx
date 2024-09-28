"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"

// Simulated database of images
const tops = [
  "/placeholder.svg?height=100&width=100&text=Top+1",
  "/placeholder.svg?height=100&width=100&text=Top+2",
  "/placeholder.svg?height=100&width=100&text=Top+3",
]
const bottoms = [
  "/placeholder.svg?height=100&width=100&text=Bottom+1",
  "/placeholder.svg?height=100&width=100&text=Bottom+2",
  "/placeholder.svg?height=100&width=100&text=Bottom+3",
]
const accessories = [
  "/placeholder.svg?height=100&width=100&text=Accessory+1",
  "/placeholder.svg?height=100&width=100&text=Accessory+2",
  "/placeholder.svg?height=100&width=100&text=Accessory+3",
]

export default function OutfitPlanner() {
  const [date, setDate] = useState(new Date())
  const [outfits, setOutfits] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [newOutfit, setNewOutfit] = useState({
    tops: [],
    bottoms: [],
    accessories: [],
  })

  const handleCreateOutfit = () => {
    if (date && newOutfit.tops.length > 0 && newOutfit.bottoms.length > 0) {
      setOutfits([...outfits, { date, items: newOutfit }])
      setNewOutfit({ tops: [], bottoms: [], accessories: [] })
      setIsDialogOpen(false)
      setStep(0)
    }
  }

  const getOutfitForDate = (date) => {
    if (!date) return null
    return outfits.find(
      (outfit) => outfit.date.toDateString() === date.toDateString()
    )
  }

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1)
    } else {
      handleCreateOutfit()
    }
  }

  const handleItemSelection = (item, type) => {
    setNewOutfit((prev) => {
      const updatedItems = prev[type].includes(item)
        ? prev[type].filter((i) => i !== item)
        : [...prev[type], item]
      return { ...prev, [type]: updatedItems }
    })
  }

  const renderStepContent = () => {
    const stepConfig = [
      { title: "Choose Tops", type: "tops", options: tops },
      { title: "Choose Bottoms", type: "bottoms", options: bottoms },
      { title: "Choose Accessories", type: "accessories", options: accessories },
    ][step]

    return (
      <div className="grid gap-4 py-4">
        <Label className="text-lg font-semibold">{stepConfig.title}</Label>
        <div className="grid grid-cols-3 gap-4">
          {stepConfig.options.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                id={`${stepConfig.type}-${index}`}
                checked={newOutfit[stepConfig.type].includes(item)}
                onCheckedChange={() => handleItemSelection(item, stepConfig.type)}
              />
              <Label
                htmlFor={`${stepConfig.type}-${index}`}
                className="flex flex-col items-center space-y-2 rounded-md border-2 border-muted p-2 hover:bg-muted cursor-pointer"
              >
                <Image
                  src={item}
                  alt={`${stepConfig.type} ${index + 1}`}
                  width={100}
                  height={100}
                  className="rounded-md object-cover"
                />
                <span className="text-sm font-medium">
                  {stepConfig.type.slice(0, -1)} {index + 1}
                </span>
              </Label>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderOutfitItems = (items) => {
    return items.map((item, index) => (
      <Image
        key={index}
        src={item}
        alt={`Item ${index + 1}`}
        width={50}
        height={50}
        className="object-cover rounded-md"
      />
    ))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Outfit Planner</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
        <div className="flex-1">
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) {
                setStep(0)
                setNewOutfit({ tops: [], bottoms: [], accessories: [] })
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="w-full mb-4">Create Outfit</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>
                  {step === 0
                    ? "Choose Tops"
                    : step === 1
                    ? "Choose Bottoms"
                    : "Choose Accessories"}
                </DialogTitle>
              </DialogHeader>
              {renderStepContent()}
              <div className="flex justify-between">
                <Button
                  onClick={() => setStep(Math.max(0, step - 1))}
                  disabled={step === 0}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleNext} 
                  disabled={
                    (step === 0 && newOutfit.tops.length === 0) ||
                    (step === 1 && newOutfit.bottoms.length === 0)
                  }
                >
                  {step === 2 ? "Finish" : "Next"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <div className="bg-secondary p-4 rounded-md">
            <h2 className="text-xl font-semibold mb-2">
              {date ? format(date, "MMMM d, yyyy") : "Select a date"}
            </h2>
            {date && (
              <div>
                {getOutfitForDate(date) ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">Tops</h3>
                      <div className="flex flex-wrap gap-2">
                        {renderOutfitItems(getOutfitForDate(date).items.tops)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">Bottoms</h3>
                      <div className="flex flex-wrap gap-2">
                        {renderOutfitItems(getOutfitForDate(date).items.bottoms)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">Accessories</h3>
                      {getOutfitForDate(date).items.accessories.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {renderOutfitItems(getOutfitForDate(date).items.accessories)}
                        </div>
                      ) : (
                        <p>None</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p>No outfit planned</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}