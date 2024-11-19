export interface CounterInput {
    query: string;
    org_id?: number;
}

export interface CounterTableType {
    data: CounterDataType[];
    total_counts: number;
    filtered_counts: number;
  }

  export interface CounterDataType {
    id?: number;
    name: string;
    staff: {
      id: number;
      name: string;
    }[];
    staff_ids?: number[];
    staff_id?: number | null;
    status?: string;
    is_open?: boolean;
  }

  export interface CreateCounter {
    id?: number | null;
    name?: string;
    staff_ids?: number[];
    status?: string;
    staff_id?: number | null;
    is_open?: boolean;
  }