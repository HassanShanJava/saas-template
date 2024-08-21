export const visibleFor = [
	{ value: "only_me", label: "Only me" },
	{ value: "members", label: "Members in my gym" },
	{ value: "coaches_and_staff", label: "Coaches and Staff in my gym" },
	{ value: "everyone", label: "Everyone in my gym" },
];

//const status = [
//  { value: "Only myself", label: "Only myself" },
//  { value: "Coaches of my gym", label: "Coaches of my gym" },
//  { value: "Members of my gym", label: "Members of my gym" },
//  { value: "Everyone in my gym (Coaches+  Members)", label: "Everyone in my gym (Coaches+  Members)" },
//];

export const workoutGoals = [
	{ value: "lose_weight", label: "Lose Weight" },
	{ value: "build_muscle", label: "Build Muscle" },
	{ value: "improved_well_being", label: "Improved well being" },
	{ value: "improve_performance", label: "Improve Performance" },
	{ value: "rehabilitation", label: "Rehabilitation" },
	{ value: "get_fit", label: "Get Fit" },
	{ value: "shape_and_tone", label: "Shape and Tone" },
];
// Novice, Beginner, Intermediate, Advanced, Expert
export const workoutLevels = [
	{ value: "novice", label: "Novice" },
	{ value: "beginner", label: "Beginner" },
	{ value: "intermediate", label: "Intermediate" },
	{ value: "advanced", label: "Advanced" },
	{ value: "expert", label: "Expert" },
];

export const workout_day_data = [
	{
		week: 1,
		days: [
			{
				"workout_id": 12,
				"day_name": "chest day",
				"week": 1,
				"day": 1,
				"id": 8,
				"created_at": "2024-08-04T20:06:11.532553",
				"updated_at": "2024-08-04T22:05:21.318784",
				"created_by": 2,
				"updated_by": 2,
				"is_deleted": false
			},
			{
				"workout_id": 12,
				"day_name": "Push Day",
				"week": 1,
				"day": 2,
				"id": 9,
				"created_at": "2024-08-06T08:18:56.349085",
				"updated_at": "2024-08-06T08:18:56.349085",
				"created_by": 2,
				"updated_by": null,
				"is_deleted": false
			}
		]
	}
]
