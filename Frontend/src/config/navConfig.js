export const Links = [
    {
        label: "Dashboard",
        path: "/dashboard",
        allowedRoles: ["Admin", "Manager", "IT Support Agent", "Employee"]
    },
    {
        label: "New Ticket",
        path: "/dashboard/NewTicket",
        allowedRoles: ["Admin", "Manager", "Employee"]
    },
    {
        label: "Tickets",
        path: "/dashboard/Tickets",
        allowedRoles: ["Admin", "Manager"]
    },  
    {
        label: "My Tickets",
        path: "/dashboard/MyTickets",
        allowedRoles: ["IT Support Agent","Manager"]
    },
    {
        label: "Notifications",
        path: "/dashboard/Notifications",
        allowedRoles: [ "Manager", "IT Support Agent", "Employee"]
    },
        {
        label: "Users",
        path: "/dashboard/Users",
        allowedRoles: ["Admin"]
    },
    {
        label: "Reports",
        path: "/dashboard/Reports",
        allowedRoles: ["Admin", "Manager"]
    },
    {
        label: "Knowledge Base",
        path: "/dashboard/KnowledgeBase",
        allowedRoles: ["Admin", "Manager", "IT Support Agent", "Employee"]
    },
         {
        label: "Profile",
        path: "/dashboard/Profile",
        allowedRoles: ["Admin", "Manager", "IT Support Agent", "Employee"]
    },
    {
        label: "Settings",
        path: "/dashboard/Settings",
        allowedRoles: ["Admin"]
    },
];