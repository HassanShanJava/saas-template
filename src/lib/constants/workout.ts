import { useEffect, useState } from "react";

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
export const difficultyOptions = [
	{value: "Novice", label: "Novice"},
	{value: "Beginner", label: "Beginner"},
	{value: "Intermediate", label: "Intermediate"},
	{value: "Advance", label: "Advance"},
	{value: "Expert", label: "Expert"},
]

export const createdByOptions = [
	{value: "Created by me", label: "Created by me"},
	{value: "Created by anyone", label: "Created by anyone"},
]

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

export function useGetAllWorkoutDayQuery() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(workout_day_data);
      setIsLoading(false);
    }, 6000); 

    return () => clearTimeout(timer); 
  }, []);

  return { data, isLoading };
}

export const workout_day_exercise_data = [
  {
      "exercise_name": "Exercise Sample",
      "visible_for": "Staff of My Club",
      "org_id": 9,
      "exercise_type": "Repetition Based",
      "exercise_intensity": "Max Intensity",
      "intensity_value": 0,
      "difficulty": "Beginner",
      "sets": 1,
      "seconds_per_set": [
        120, 105
      ],
      "repetitions_per_set": [],
      "rest_between_set": [
        60, 45
      ],
      "distance": 0,
      "speed": 0,
      "met_id": 1,
      "gif_url": "abc",
      "video_url_male": "abc",
      "video_url_female": "acb",
      "thumbnail_male": "https://uploads.fitnfi.com/images/6f1cbec8-58bf-497a-8e9e-4c4a043ad968-image%2067.png",
      "thumbnail_female": "",
      "image_url_female": "",
      "image_url_male": "",
      "id": 51,
      "category_id": 2,
      "created_at": "2024-08-08T11:52:59.029068",
      "category_name": "cardio_new",
      "equipments": [
        {
          "id": 60,
          "name": "airpad"
        },
        {
          "id": 61,
          "name": "aquabag"
        }
      ],
      "primary_muscles": [
        {
          "id": 2,
          "name": "Abs"
        },
        {
          "id": 3,
          "name": "Abs - Straight Abs"
        }
      ],
      "secondary_muscles": [
        {
          "id": 3,
          "name": "Abs - Straight Abs"
        }
      ],
      "primary_joints": [
        {
          "id": 2,
          "name": "combination"
        },
        {
          "id": 3,
          "name": "core"
        }
      ]
    },
    {
      "exercise_name": "testing exercise",
      "visible_for": "Members of My Club",
      "org_id": 9,
      "exercise_type": "Time Based",
      "exercise_intensity": null,
      "intensity_value": 10,
      "difficulty": "Advance",
      "sets": 2,
      "seconds_per_set": [
        10,
        15
      ],
      "repetitions_per_set": [],
      "rest_between_set": [
        10,
        40
      ],
      "distance": 12,
      "speed": 12,
      "met_id": 3,
      "gif_url": "c5fbc469-ff0c-401f-ac1c-61ff247fa38f-new.gif",
      "video_url_male": "https://calendar.q-sols.com/qrcodegenerator",
      "video_url_female": "https://calendar.q-sols.com/qrcodegenerator",
      "thumbnail_male": "https://uploads.fitnfi.com/images/f6f30a26-56c7-4189-8a43-0a65edd1f84b-VLAArrayNiteClouds_RGB.jpg",
      "thumbnail_female": "",
      "image_url_female": null,
      "image_url_male": null,
      "id": 57,
      "category_id": 4,
      "created_at": "2024-08-21T18:45:26.159561",
      "category_name": "cardio_interval",
      "equipments": [
        {
          "id": 59,
          "name": "aerial_hoop"
        },
        {
          "id": 60,
          "name": "airpad"
        }
      ],
      "primary_muscles": [
        {
          "id": 1,
          "name": "Abs - Obliques"
        },
        {
          "id": 2,
          "name": "Abs"
        }
      ],
      "secondary_muscles": [
        {
          "id": 1,
          "name": "Abs - Obliques"
        },
        {
          "id": 2,
          "name": "Abs"
        }
      ],
      "primary_joints": [
        {
          "id": 2,
          "name": "combination"
        },
        {
          "id": 1,
          "name": "ankle"
        }
      ]
    },
	]
