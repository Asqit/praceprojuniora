"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Filter } from "lucide-react"
import { useState } from "react"

interface Props {
  onSearch(value: string): void
  onLocationChange(location: string): void
  onSort(by: string): void
}

export function ListFilters(props: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <>
      {/* Mobile: bottom sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button className="min-w-[150px] md:hidden">
            <Filter /> Filtry
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="rounded-t-2xl px-0 pb-0"
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
          </div>

          <SheetHeader className="px-4 pb-2">
            <SheetTitle className="text-base">Filtry</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-3 px-4">
            <Filters {...props} layout="column" />
          </div>

          <SheetFooter className="px-4 pt-4 pb-6">
            <SheetClose asChild>
              <Button className="w-full">Použít filtry</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Desktop: inline row */}
      <div className="hidden w-full gap-2 md:flex">
        <Filters {...props} layout="row" />
      </div>
    </>
  )
}

function Filters({
  onLocationChange,
  onSearch,
  onSort,
  layout = "row",
}: Props & { layout?: "row" | "column" }) {
  const selectClass = layout === "column" ? "w-full" : "w-full max-w-48"

  return (
    <>
      <Input
        onInput={(e) => onSearch(e.currentTarget.value)}
        type="text"
        placeholder="Hledat pozici nebo firmu..."
      />
      <Select
        defaultValue="all"
        onValueChange={(value) => onLocationChange(value)}
      >
        <SelectTrigger className={selectClass}>
          <SelectValue placeholder="Všechny lokace" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">Všechny lokace</SelectItem>
            <SelectItem value="Praha">Praha</SelectItem>
            <SelectItem value="Brno">Brno</SelectItem>
            <SelectItem value="Ostrava">Ostrava</SelectItem>
            <SelectItem value="Plzeň">Plzeň</SelectItem>
            <SelectItem value="Liberec">Liberec</SelectItem>
            <SelectItem value="Olomouc">Olomouc</SelectItem>
            <SelectItem value="České Budějovice">České Budějovice</SelectItem>
            <SelectItem value="Hradec Králové">Hradec Králové</SelectItem>
            <SelectItem value="Pardubice">Pardubice</SelectItem>
            <SelectItem value="Zlín">Zlín</SelectItem>
            <SelectItem value="Ústí nad Labem">Ústí nad Labem</SelectItem>
            <SelectItem value="Karlovy Vary">Karlovy Vary</SelectItem>
            <SelectItem value="Jihlava">Jihlava</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select defaultValue="newest" onValueChange={(value) => onSort(value)}>
        <SelectTrigger className={selectClass}>
          <SelectValue placeholder="Nejnovější" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="newest">Nejnovější</SelectItem>
            <SelectItem value="popularity">Nejpopulárnější</SelectItem>
            <SelectItem value="expiration">Brzy končící</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  )
}
