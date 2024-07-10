import FullCalender from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./styles.css";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RxUpload } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "lucide-react";
import { FaFilter } from "react-icons/fa";

const Events = () => {
  const navigate = useNavigate();
  const today = new Date();
  const day = today.getDate();
  const Year = today.getFullYear();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayName = days[today.getDay()];
  const monthName = months[today.getMonth()];

  function handleRoute() {
    navigate("/admin/events/addevents");
  }
  const events = [
    {
      title: "Meeting",
      start: new Date(),
      end: new Date().setHours(new Date().getHours() + 1),
    },
    {
      title: "Workshop",
      start: new Date(new Date().getTime() + 2 * 60 * 60 * 1000),
      end: new Date(new Date().getTime() + 3 * 60 * 60 * 1000),
    },
    {
      title: "Conference",
      start: new Date(new Date().getTime() + 4 * 60 * 60 * 1000),
      end: new Date(new Date().getTime() + 5 * 60 * 60 * 1000),
    },
    {
      title: "Lunch",
      start: new Date(new Date().getTime() + 6 * 60 * 60 * 1000),
      end: new Date(new Date().getTime() + 7 * 60 * 60 * 1000),
    },
    {
      title: "Interview",
      start: new Date(new Date().getTime() + 8 * 60 * 60 * 1000),
      end: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
    },
    {
      title: "Webinar",
      start: new Date(new Date().getTime() + 10 * 60 * 60 * 1000),
      end: new Date(new Date().getTime() + 11 * 60 * 60 * 1000),
    },
    {
      title: "Team Building",
      start: new Date(new Date().getTime() + 12 * 60 * 60 * 1000),
      end: new Date(new Date().getTime() + 13 * 60 * 60 * 1000),
    },
    {
      title: "Training",
      start: new Date(new Date().getTime() + 14 * 60 * 60 * 1000),
      end: new Date(new Date().getTime() + 15 * 60 * 60 * 1000),
    },
    {
      title: "Presentation",
      start: new Date(new Date().getTime() + 16 * 60 * 60 * 1000),
      end: new Date(new Date().getTime() + 17 * 60 * 60 * 1000),
    },
    {
      title: "Discussion",
      start: new Date(new Date().getTime() + 18 * 60 * 60 * 1000),
      end: new Date(new Date().getTime() + 19 * 60 * 60 * 1000),
    },
  ];

  return (
    <div className="w-full p-12">
      <div className="flex justify-between items-center pb-3">
        <div>
          <h1 className="font-bold text-gray-600">
            All {dayName} {monthName} {day} {Year}
          </h1>
        </div>
        <div className="flex gap-2">
          <div className="w-[32%]">
            <Select>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Staff View" />
              </SelectTrigger>
              {/* <SelectContent> */}
              {/* <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup> */}
              {/* </SelectContent> */}
            </Select>
          </div>
          <div className="w-[32%]">
            <Select>
              <SelectTrigger className="w-[90px]">
                <SelectValue placeholder="1 Day" />
              </SelectTrigger>
              {/* <SelectContent> */}
              {/* <SelectGroup> */}
              {/* <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem> */}
              {/* </SelectGroup>
              </SelectContent> */}
            </Select>
          </div>
          <div className="w-[32%]">
            <Select>
              <SelectTrigger className="w-[90px]">
                <SelectValue placeholder="Small" />
              </SelectTrigger>
              {/* <SelectContent>
                <SelectGroup> */}
              {/* <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem> */}
              {/* </SelectGroup>
              </SelectContent> */}
            </Select>
          </div>
          <Button className="w-full text-black gap-2" onClick={handleRoute}>
            <PlusIcon className="h-4 w-4 text-black" />
            Add New Event
          </Button>
          <div className="flex justify-center items-center gap-2">
            <div>
              <div className="rounded-full w-8 h-8 flex justify-center items-center border-2 border-gray-300">
                <RxUpload className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <div className="rounded-full w-8 h-8 flex justify-center items-center border-2 border-gray-300">
                <FaFilter className="w-3 h-3 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg">
        <FullCalender
          plugins={[timeGridPlugin]}
          allDaySlot={false}
          nowIndicator={true}
          initialView="timeGridWeek"
          eventColor={"transparent"}
          slotDuration={"00:60:01"}
          dayHeaderContent={(arg) => {
            const dayName = [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ];
            return (
              <span className="text-xs text-neutral-500 h-20 flex items-center justify-center">
                {dayName[arg.date.getDay()]} {arg.date.getDate()}
              </span>
            );
          }}
          slotLabelContent={(arg) => (
            <span className="text-xs">
              {(arg.date.getHours() + "").length == 1
                ? "0" + arg.date.getHours()
                : arg.date.getHours()}
            </span>
          )}
          events={events}
          eventContent={(eventInfo) => (
            <div className="p-2 w-full h-full  border-2 border-red-500 text-black rounded-lg bg-red-500/5">
              <span className="p-1 text-white text-[10px] bg-red-500 rounded-2xl">
                {eventInfo.timeText}
              </span>
              <p>{eventInfo.event.title}</p>
            </div>
          )}
        />
      </div>
    </div>
  );
};
export default Events;
