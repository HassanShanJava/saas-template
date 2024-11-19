export interface TranformedResourceRsp {
    allResourceData: ResourceTypes[];
    count: number;
}


export interface GetRolesType {
    name: string;
    status?: boolean;
    id: number;
}

export interface CreateRoleTypes {
    org_id: number;
    status: string;
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
    code: string | undefined;
    parent: string | undefined;
    subRows?: ResourceTypes[];
    access_type?: string;
    children?: ResourceTypes[];
    is_parent: boolean;
    index: number;
    is_root: boolean;
    link: string;
    icon: string;
}
