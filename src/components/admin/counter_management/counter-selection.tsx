import { Card } from '@/components/ui/card'
import { setCode, setCounter } from '@/features/counter/counterSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import cashcounter from '@/assets/cashier-counter.svg'
import { useGetCountersQuery } from '@/services/counterApi'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/store'
import { useEffect, useMemo } from 'react'
import { counterDataType } from '@/app/types'
const CounterSelection = () => {
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const selectCounter = (counter: counterDataType) => {
        dispatch(setCounter(counter.id as number))
        dispatch(setCode("pos"))
        navigate('/admin/pos/sell')
    }
    const { data: assignedCounter, isLoading } = useGetCountersQuery({ query: `staff_id=${userInfo?.user?.id}&status=active` })

    const assignedCounterData = useMemo(() => {
        return Array.isArray(assignedCounter?.data) ? assignedCounter?.data : [];
      }, [assignedCounter]);

    useEffect(() => {
        if (assignedCounterData && assignedCounterData?.length == 1) {
            const singleCounter = assignedCounterData[0]
            console.log({singleCounter}, "assignedCounter.data")
            dispatch(setCounter(singleCounter.id as number))
            dispatch(setCode("pos"))
            navigate('/admin/pos/sell')
        }
    }, [assignedCounterData])

    return (
        <div className='min-h-screen bg-outletcolor p-5'>
            {!isLoading && <Card className="w-full p-5 space-y-4 max-w-2xl mx-auto ">
                <p>Please select counter to start selling</p>
                <div className="grid grid-cols-3 gap-3 w-fit mx-auto justify-center items-center  ">

                    {assignedCounterData && assignedCounterData.length > 0 && assignedCounterData.map((item: any, i: number) => (
                        <div key={i} onClick={() => selectCounter(item)} className="cursor-pointer rounded-md size-48 flex flex-col justify-center items-center rouned-md bg-outletcolor">
                            <img src={cashcounter} alt='/' className='p-0 size-36' />
                            <p className="text-center text-lg ">Counter {item.name}</p>
                        </div>
                    ))}
                </div>
            </Card>}
        </div>
    )
}

export default CounterSelection