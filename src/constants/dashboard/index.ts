export const demoSidePanel = [
    {
        "id": 1,
        "name": "Dashboard",
        "code": "dashboard",
        "parent": null,
        "is_parent": true,
        "is_root": true,
        "index": 1,
        "link": "/admin/dashboard",
        "icon": "fa fa-chart-line",
        "access_type": "full_access",
        "children": []
    },
    {
        "id": 4,
        "name": "Staff",
        "code": "staff",
        "parent": null,
        "is_parent": true,
        "is_root": true,
        "index": 4,
        "link": "/admin/staff",
        "icon": "fa fa-user",
        "access_type": "full_access",
        "children": []
    },
    {
        "id": 10,
        "name": "System Setting",
        "code": "sys_set",
        "parent": null,
        "is_parent": true,
        "is_root": true,
        "index": 9,
        "link": "/",
        "icon": "fa fa-gear",
        "access_type": null,
        "children": [
            {
                "id": 5,
                "name": "Role & Access Management",
                "code": "role",
                "parent": "sys_set",
                "is_parent": false,
                "is_root": false,
                "index": 14,
                "link": "/admin/roles",
                "icon": "fa fa-user-lock",
                "access_type": "full_access",
                "children": []
            },
        ]
    },
]