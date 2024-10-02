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

    const [assignCounter, { isLoading: isUpdating }] = useUpdateCountersMutation()

    const assignSingleCounter = async (counter: counterDataType) => {
        if ((counter.staff && counter.staff.length === 1)) {
            // staff array
            const singleCounter = counter.staff[0];
            console.log({ singleCounter }, "assignedCounter.data");
            
            try {
                const payload = {
                    id: counter.id,
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
                    dispatch(setCounter(counter.id as number));
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
        } else if (assignedCounterData?.length > 1) {
            const findOpenedCounter = assignedCounterData.find((counter) => counter.staff_id == userInfo?.user.id && counter.is_open)
            assignSingleCounter(findOpenedCounter as counterDataType);
        }
    }, [assignedCounterData, assignCounter, dispatch, navigate, userInfo]);

    console.log({ assignedCounterData })
    return (
        <div className='min-h-screen bg-outletcolor p-5'>
            {!isLoading && (
                <>
                    {assignedCounterData.length > 1 ? (
                        <Card className="w-full p-5 space-y-4 max-w-2xl mx-auto">
                            <p>Please select a counter to start selling</p>
                            <div className="grid grid-cols-3 gap-3 w-fit mx-auto justify-center items-center">
                                {assignedCounterData.map((item: any, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => assignSingleCounter(item)}
                                        className={`cursor-pointer rounded-md size-48 flex flex-col justify-center items-center bg-outletcolor ${item.is_open ? "bg-black/10 cursor-not-allowed" : ""
                                            }`}
                                    >
                                        <img src={cashcounter} alt="/" className="p-0 size-28" />
                                        <p className="text-center text-lg">Counter {item.name}</p>
                                    </button>
                                ))}
                            </div>
                        </Card>
                    ) : (
                        assignedCounterData.length === 0 && (
                            <Card className="w-full p-5 space-y-4 max-w-2xl mx-auto">
                                <p className="w-full text-center">
                                    No Counter has been assigned to you.
                                    <br />
                                    Please contact your admin supervisor.
                                </p>
                            </Card>
                        )
                    )}
                </>
            )}

            {assignedCounterData.length === 1 && (
                <div className="fixed top-0 left-0 z-40 w-full h-screen flex justify-center items-center bg-black/40">
                    <i className="animate-spin text-primary text-3xl font-bold text-main fas fa-spinner"></i>
                </div>
            )}

        </div>
    )
}

export default CounterSelection