import { Card } from '@/components/ui/card'
import { setCode, setCounter } from '@/features/counter/counterSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CounterSelection = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const selectCounter = (counter_number: number) => {
        dispatch(setCounter(counter_number))
        dispatch(setCode("pos"))
        navigate('/admin/pos/sell')
    }

    return (
        <div className='min-h-screen bg-outletcolor p-5'>
            <Card className="w-full p-5 space-y-4">
                <p>Please select counter to start selling</p>
                <div className="grid grid-cols-3 gap-3 ">

                    {[1, 2, 3, 4, 5, 6].map((item: any, i: number) => (
                        <div key={i} onClick={() => selectCounter(item)} className="cursor-pointer rounded-md w-full h-32 flex justify-center items-center rouned-md bg-outletcolor">
                            <p className="text-center text-lg ">Counter {item}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}

export default CounterSelection