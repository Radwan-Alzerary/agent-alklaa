"use client"

import { useState } from "react"
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DateRangeSelectorProps {
  onRangeChange: (range: DateRange | undefined) => void
  onIntervalChange: (interval: string) => void
}

export function DateRangeSelector({ onRangeChange, onIntervalChange }: DateRangeSelectorProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  })

  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="ml-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale: ar })} -{" "}
                  {format(date.to, "LLL dd, y", { locale: ar })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: ar })
              )
            ) : (
              <span>اختر المدى الزمني</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate)
              onRangeChange(newDate)
            }}
            numberOfMonths={2}
            locale={ar}
          />
        </PopoverContent>
      </Popover>

      <Select onValueChange={onIntervalChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="الفترة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">يومي</SelectItem>
          <SelectItem value="month">شهري</SelectItem>
          <SelectItem value="year">سنوي</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

