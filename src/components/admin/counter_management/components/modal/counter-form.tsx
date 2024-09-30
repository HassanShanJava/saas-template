import { RootState } from "@/app/store";
import { counterDataType } from "@/app/types";
import { useGetStaffListQuery } from "@/services/staffsApi";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loadingButton/loadingButton";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { FloatingInput, FloatingLabelInput } from "@/components/ui/floatinglable/floating";
import { MultiSelect } from "@/components/ui/multiselect/multiselectCheckbox";


const status = [
    { value: "active", label: "Active", color: "bg-green-500" },
    { value: "inactive", label: "Inactive", color: "bg-blue-500" },
];


interface counterForm {
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    action: string;
    setAction: React.Dispatch<React.SetStateAction<"add" | "edit">>;
    refetch?: any;
    setData?: any;
    data: counterDataType | undefined;
}

const CounterForm = ({
    isOpen,
    setOpen,
    action,
    setAction,
    refetch,
    // data,
    // setData,
}: counterForm) => {
    const orgId =
        useSelector((state: RootState) => state.auth.userInfo?.user?.org_id) || 0;
    const { data: staffList } = useGetStaffListQuery(orgId);
    const [staffOptions, setOptions] = useState<Record<string,any>[]>([])

    useEffect(() => {
        if (staffList) {
            const newStaffList = staffList?.map((staff: any) => ({ value: staff.id, label: staff.name }));

            // const newStaffList=staffList.every(
            //     (item) => item.id === 0 && item.name.trim() === ""
            //   )
            //     ? []
            //     : staffList.map((item) => item.id);

            setOptions(newStaffList);
        }
    }, [staffList])
    console.log({ staffOptions });
    return (
        <div>
            <Sheet
                open={isOpen}
                onOpenChange={setOpen}
            >
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>
                            {action = "add" ? "Create" : "Edit"} Counter
                        </SheetTitle>
                        <SheetDescription>
                            <Separator className=" h-[1px] font-thin rounded-full" />

                            {/* <Form {...form}> */}
                            <form
                                // onSubmit={form.handleSubmit(onSubmit, onError)}
                                className="flex flex-col py-4 gap-4"
                                noValidate
                            >

                                <FloatingLabelInput
                                    id="name"
                                    label="Counter Name"
                                />

                                {/* <Controller
          name="status"
          rules={{ required: "Required" }}
          control={control}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { invalid, error },
          }) => {
            const statusLabel = status.filter((r) => r.value == value)[0];
            return ( */}
                                <Select
                                    // onValueChange={(value) => onChange(value)}
                                    defaultValue={"active"}
                                >
                                    <SelectTrigger floatingLabel="Status*">
                                        <SelectValue
                                            placeholder="Select status"
                                            className="text-gray-400"
                                        >
                                            <span className="flex gap-2 items-center">
                                                <span
                                                    className={`${status[0]?.color} rounded-[50%] w-4 h-4`}
                                                ></span>
                                                <span>{status[0]?.label}</span>
                                            </span>
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {status.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {/* );
                              }}
                            /> */}



                                <MultiSelect
                                    floatingLabel={"Assign Cashiers"}
                                    options={
                                        staffOptions as {
                                            value: number;
                                            label: string;
                                        }[]
                                    }
                                    defaultValue={[2]} // Ensure defaultValue is always an array
                                    onValueChange={(selectedValues) => {
                                        console.log("Selected Values: ", selectedValues); // Debugging step
                                        // onChange(selectedValues); // Pass selected values to state handler
                                    }}
                                    placeholder={"Select cashiers"}
                                    variant="inverted"
                                    maxCount={1}
                                    className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 "
                                />




                            </form>
                            {/* </Form> */}
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default CounterForm