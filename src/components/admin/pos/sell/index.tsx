import { Card } from "@/components/ui/card";

const Sell = () => {
  const counter_number  = JSON.parse(localStorage.getItem("counter_number") as string);
  return (
    <div className="w-full p-5 ">
      <Card className="p-3">
        Sell
        {counter_number && (<p className="p-2 font-bold">Selected counter: {counter_number}</p>)}
      </Card>
    </div>
  );
};

export default Sell;
