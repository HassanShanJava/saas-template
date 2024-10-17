import { MemberTableDatatypes } from "@/app/types";
import { Button } from "@/components/ui/button";
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Command } from "lucide-react";
import { Check } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

interface customerComboboxTypes {
    list: MemberTableDatatypes[];
    customerList?: MemberTableDatatypes[];
    setCustomer: any;
    customer: any;
    label?: string
  }
  
  export function CustomerCombobox({ list, setCustomer, customer, label }: customerComboboxTypes) {
    const modifiedList = list?.map((item: any) => ({ value: item.id, label: item.first_name + " " + item.last_name }))
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    useEffect(() => {
      if (customer) {
        setValue(`${customer.id}`)
      }
    }, [customer])
    console.log({ value, customer }, "customer")
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="capitalize w-full justify-between bg-white rounded-sm border-[1px]"
          >
            {value
              ? modifiedList?.find((customer: any) => customer.value == value)?.label
              : label}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent  className=" w-[330px] p-0 custom-scrollbar">
          <Command>
            <CommandInput placeholder={label} />
            <CommandList className="custom-scrollbar">
              <CommandEmpty>No customer found.</CommandEmpty>
              <CommandGroup className="">
                {modifiedList?.map((customer: any) => (
                  <CommandItem
                    key={customer.value + ""}
                    value={customer.value + ""}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      const customer = list?.find((item: any) => item.id == currentValue)
                      setCustomer(customer)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === customer.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {customer.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
  
  export function RetriveSaleCombobox({ list, setCustomer, customer, label, customerList }: customerComboboxTypes) {
    const modifiedList = list?.map((item: any) => ({ value: item.member_id, label: item.member_name }))
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    console.log({ value, customer }, "retrived")
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild >
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className=" capitalize w-full justify-center items-center gap-2  bg-white rounded-sm border-[1px]"
          >
            <i className="fa fa-share"></i>
            {label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className=" w-[240px] p-0" side="bottom">
          <Command>
            {/* <CommandInput placeholder={"Search customer"} /> */}
            <CommandList className="">
              <CommandEmpty>No customer found.</CommandEmpty>
              <CommandGroup className="">
                {modifiedList?.map((customer: any) => (
                  <CommandItem
                    key={customer.value + ""}
                    value={customer.value + ""}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      const customer = customerList?.find((item: any) => item.id == currentValue)
                      setCustomer(customer)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === customer.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {customer.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
  