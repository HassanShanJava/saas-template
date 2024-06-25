import FullCalender from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./styles.css";

const Events = () => {
	const events = [
		{ title: 'Meeting', start: new Date(), end: new Date().setHours(new Date().getHours() + 1) },
		{ title: 'Workshop', start: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), end: new Date(new Date().getTime() + 3 * 60 * 60 * 1000) },
		{ title: 'Conference', start: new Date(new Date().getTime() + 4 * 60 * 60 * 1000), end: new Date(new Date().getTime() + 5 * 60 * 60 * 1000) },
		{ title: 'Lunch', start: new Date(new Date().getTime() + 6 * 60 * 60 * 1000), end: new Date(new Date().getTime() + 7 * 60 * 60 * 1000) },
		{ title: 'Interview', start: new Date(new Date().getTime() + 8 * 60 * 60 * 1000), end: new Date(new Date().getTime() + 9 * 60 * 60 * 1000) },
		{ title: 'Webinar', start: new Date(new Date().getTime() + 10 * 60 * 60 * 1000), end: new Date(new Date().getTime() + 11 * 60 * 60 * 1000) },
		{ title: 'Team Building', start: new Date(new Date().getTime() + 12 * 60 * 60 * 1000), end: new Date(new Date().getTime() + 13 * 60 * 60 * 1000) },
		{ title: 'Training', start: new Date(new Date().getTime() + 14 * 60 * 60 * 1000), end: new Date(new Date().getTime() + 15 * 60 * 60 * 1000) },
		{ title: 'Presentation', start: new Date(new Date().getTime() + 16 * 60 * 60 * 1000), end: new Date(new Date().getTime() + 17 * 60 * 60 * 1000) },
		{ title: 'Discussion', start: new Date(new Date().getTime() + 18 * 60 * 60 * 1000), end: new Date(new Date().getTime() + 19 * 60 * 60 * 1000) }
	]
	return (
		<div className="w-full p-12">
			<div className="flex"><div><h1 className="">All Saturday June</h1></div></div>
			<FullCalender
				plugins={[timeGridPlugin]}
				allDaySlot={false}
				nowIndicator={true}
				initialView='timeGridWeek'
				eventColor={"transparent"}
				slotDuration={"00:60:01"}
				dayHeaderContent={arg => {
					const dayName=["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
					return <span className="text-xs text-neutral-500 h-20 flex items-center justify-center">{dayName[arg.date.getDay()]} {arg.date.getDate()}</span>;
				}}
				slotLabelContent={arg => <span className="text-xs">{(arg.date.getHours()+"").length == 1 ? "0" + arg.date.getHours() : arg.date.getHours()}</span>}
				events={events}
				eventContent={(eventInfo) => (
				<div className="p-2 w-full h-full bg-transparent border-2 border-red-500 text-black rounded-lg bg-red-500/5">
					<span className="p-1 text-white text-[10px] bg-red-500 rounded-2xl">{eventInfo.timeText}</span>
					<p>{eventInfo.event.title}</p>
				</div>
				)}
			/>
		</div>
	)
}
export default Events;
