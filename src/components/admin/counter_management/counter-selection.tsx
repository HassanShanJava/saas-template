import { Card } from '@/components/ui/card'
import { setCode, setCounter } from '@/features/counter/counterSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import cashcounter from '@/assets/cashier-counter.svg'
import { useGetCountersQuery, useUpdateCountersMutation } from '@/services/counterApi'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/store'
import { useEffect, useMemo } from 'react'
import { counterDataType, ErrorType } from '@/app/types'
import { toast } from '@/components/ui/use-toast'
const CounterSelection = () => {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { data: assignedCounter, isLoading } = useGetCountersQuery({ query: `staff_id=${userInfo?.user?.id}&status=active` })

    const assignedCounterData = useMemo(() => {
        return Array.isArray(assignedCounter?.data) ? assignedCounter?.data : [];
    }, [assignedCounter]);

    const [assignCounter] = useUpdateCountersMutation()

    const assignSingleCounter = async (counter: counterDataType) => {
        if (counter.staff && counter.staff.length === 1) {
            // staff array
            const singleCounter = counter.staff[0];
            console.log({ singleCounter }, "assignedCounter.data");

            try {
                const payload = {
                    id: singleCounter.id,
                    staff_id: userInfo?.user?.id,
                    is_open: true,
                };
                const resp = await assignCounter(payload).unwrap();
                if (!resp.error) {
                    console.log({ resp })
                    toast({
                        variant: "success",
                        title: "Counter Opened Successfully",
                    })
                    dispatch(setCounter(singleCounter.id as number));
                    dispatch(setCode("pos"));
                    navigate('/admin/pos/sell');
                } else {
                    throw resp.error
                }


            } catch (error) {
                console.error("Error", { error });
                if (error && typeof error === "object" && "data" in error) {
                    const typedError = error as ErrorType;
                    toast({
                        variant: "destructive",
                        title: "Error in Submission",
                        description: `${typedError.data?.detail}`,
                    });
                } else {
                    toast({
                        variant: "destructive",
                        title: "Error in Submission",
                        description: `Something Went Wrong.`,
                    });
                }
            }

        }
    };

    useEffect(() => {
        if (assignedCounterData?.length === 1) {
            assignSingleCounter(assignedCounterData[0]);
        }
    }, [assignedCounterData, assignCounter, dispatch, navigate, userInfo]);

    console.log({ assignedCounterData })
    return (
        <div className='min-h-screen bg-outletcolor p-5'>
            {(!isLoading) && <Card className="w-full p-5 space-y-4 max-w-2xl mx-auto ">
                <p>Please select counter to start selling</p>
                <div className="grid grid-cols-3 gap-3 w-fit mx-auto justify-center items-center  ">

                    {assignedCounterData && assignedCounterData.length > 0 && assignedCounterData.map((item: any, i: number) => (
                        <button key={i} onClick={() => assignSingleCounter(item)} className={`${item.is_open && "bg-black/10 cursor-not-allowed "}cursor-pointer rounded-md size-48 flex flex-col justify-center items-center rouned-md bg-outletcolor`}>
                            <img src={cashcounter} alt='/' className='p-0 size-36' />
                            <p className="text-center text-lg ">Counter {item.name}</p>
                        </button>
                    ))}
                </div>
            </Card>}
        </div>
    )
}

export default CounterSelection