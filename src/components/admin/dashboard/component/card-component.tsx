import { Card } from "@/components/ui/card";
import wallet from "@/assets/wallet.svg";
const CardComponent = () => {
  const cardData = [
    {
      title: "Revenue this month",
      value: "$53,000",
      percentage: "+55%",
      percentageColor: "text-green-400",
      icon: <img src={wallet} className="w-6 h-6" alt="wallet" />,
    },
    {
      title: "Active Clients",
      value: "2,300",
      percentage: "+5%",
      percentageColor: "text-green-400",
      icon: (
        <i className="fa-solid fa-globe h-6 w-6 flex justify-center items-center"></i>
      ),
    },
    {
      title: "New Client",
      value: "+30,52",
      percentage: "-14%",
      percentageColor: "text-red-400",
      icon: (
        <i className="fa-solid fa-file h-6 w-6 flex justify-center items-center"></i>
      ),
    },
    {
      title: "Total Sales",
      value: "$173,000",
      percentage: "+8%",
      percentageColor: "text-green-400",
      icon: (
        <i className="fa-solid fa-cart-shopping h-6 w-6 flex justify-center items-center"></i>
      ),
    },
  ];

  return (
    <div className="px-3 gap-2 grid grid-cols-2 xlg:grid-cols-4 justify-between items-center">
      {cardData.map((card, index) => (
        <Card key={index} className="flex flex-row p-3 py-4 w-full  ">
          <div className="flex flex-row justify-between items-center w-full ">
            <div>
              <p className="text-xs text-gray-400 font-bold">{card.title}</p>
              <div className="flex flex-row justify-start  gap-1 items-center ">
                <h2 className="font-bold text-xl">{card.value}</h2>
                <p
                  className={`${card.percentageColor} pr-1 text-sm font-semibold`}
                >
                  {card.percentage}
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center w-10 h-10 rounded-lg bg-primary">
              {card.icon}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CardComponent;
