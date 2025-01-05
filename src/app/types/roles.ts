import { Status } from "../shared_enums/enums";

export interface TranformedResourceRsp {
    allResourceData: ResourceTypes[];
    count: number;
}


export interface GetRolesType {
    name: string;
    status: Status;
    id: number;
}

export interface CreateRoleTypes {
    id?: number;
    status: Status;
    name: string;
    resource_id: Array<number>;
    access_type: Array<string>;
}

export interface UpdateRoleTypes extends CreateRoleTypes {
    id: number;
}
export interface ResourceTypes {
    id: number;
    name: string;
    code: string;
    parent: string | undefined;
    subRows?: ResourceTypes[];
    access_type?: string;
    children?: ResourceTypes[];
    is_parent: boolean;
    show_menu: boolean;
    index: number;
    is_root: boolean;
    link: string;
    icon: string;
}
