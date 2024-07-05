import {
  Card,
} from "@/components/ui/card";

const CardComponent = () => {
  return (
    <div className="px-3 gap-[0.125rem] flex flex-row justify-between items-center">
      <div className=" flex flex-row justify-between items-center">
        <Card className="flex flex-row py-6 px-3 w-64 justify-between">
          <div className="flex flex-row justify-between items-center w-full">
            <div>
              <p className="text-xs text-gray-400 font-bold">
                Revenue this month
              </p>
              <div className="flex flex-row justify-cener gap-1 items-center w-32">
                <h2 className="font-bold text-xl">$53,000</h2>
                <p className="text-green-400 text-sm font-semibold">+55%</p>
              </div>
            </div>
            <div className=" flex justify-center items-center w-10 h-10 rounded-lg bg-primary">
              <img src="/wallet.svg" className={`w-6 h-6 items-center `}></img>
            </div>
          </div>
        </Card>
      </div>
      <div className=" flex flex-row justify-between items-center">
        <Card className="flex flex-row py-6 px-3 w-64 justify-between">
          <div className="flex flex-row justify-between items-center w-full">
            <div>
              <p className="text-xs text-gray-400 font-bold">Active Clients</p>
              <div className="flex flex-row justify-cener gap-1 items-center w-32">
                <h2 className="font-bold text-xl">2,300</h2>
                <p className="text-green-400 text-sm font-semibold">+5%</p>
              </div>
            </div>
            <div className=" flex justify-center items-center w-10 h-10 rounded-lg bg-primary">
              <i className="fa-solid fa-globe h-6 w-6 flex justify-center items-center"></i>
            </div>
          </div>
        </Card>
      </div>
      <div className=" flex flex-row justify-between items-center">
        <Card className="flex flex-row py-6 px-3 w-64 justify-between">
          <div className="flex flex-row justify-between items-center w-full">
            <div>
              <p className="text-xs text-gray-400 font-bold">New Client</p>
              <div className="flex flex-row justify-cener gap-1 items-center w-32">
                <h2 className="font-bold text-xl">+30,52</h2>
                <p className="text-red-400 text-sm font-semibold">-14%</p>
              </div>
            </div>
            <div className=" flex justify-center items-center w-10 h-10 rounded-lg bg-primary">
              <i className="fa-solid fa-file h-6 w-6 flex justify-center items-center"></i>
            </div>
          </div>
        </Card>
      </div>
      <div className=" flex flex-row justify-between items-center">
        <Card className="flex flex-row py-6 px-3 w-64 justify-between">
          <div className="flex flex-row justify-between items-center w-full">
            <div>
              <p className="text-xs text-gray-400 font-bold">Total Sales</p>
              <div className="flex flex-row justify-cener gap-1 items-center w-32">
                <h2 className="font-bold text-xl">$173,000</h2>
                <p className="text-green-400 text-sm font-semibold">+8%</p>
              </div>
            </div>
            <div className=" flex justify-center items-center w-10 h-10 rounded-lg bg-primary">
              <i className="fa-solid fa-cart-shopping h-6 w-6 flex justify-center items-center"></i>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CardComponent;
