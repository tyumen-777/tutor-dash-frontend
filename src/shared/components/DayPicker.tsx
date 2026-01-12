import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/kit/form";
import { ControllerRenderProps } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/kit/popover";
import { Button } from "../ui/kit/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/kit/calendar";
import { useState } from "react";
import { ru } from "react-day-picker/locale";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import utc from "dayjs/plugin/utc";
import { cn } from "@/lib/utils";

dayjs.locale("ru");
dayjs.extend(utc);

type TSingleDatePickerProps = {
  label?: string;
  field: ControllerRenderProps;
};

export const SingleDatePicker = ({ label, field }: TSingleDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const dateValue = field.value ? dayjs.utc(field.value).toDate() : undefined;
  const formattedDate = field.value
    ? dayjs.utc(field.value).format("D MMMM YYYY")
    : "Выберите дату";

  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <Popover open={isOpen} onOpenChange={setIsOpen} modal>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-between font-normal",
                !field.value && "text-muted-foreground",
              )}
            >
              {formattedDate}
              <CalendarIcon />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="p-0 overflow-hidden" align="center">
          <Calendar
            mode="single"
            locale={ru}
            selected={dateValue}
            defaultMonth={dateValue}
            onSelect={(date) => {
              field.onChange(date);
              setIsOpen(false);
            }}
            captionLayout="dropdown"
            autoFocus
            className="rounded-lg border shadow-sm w-full"
            timeZone="UTC"
          />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
};
