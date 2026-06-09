export const Links = [
    {
        label: "Dashboard",
        path: "/dashboard",
        allowedRoles: ["Admin", "Manager", "It Support Agent", "Employee"]
    },
    {
        label: "New Ticket",
        path: "/dashboard/NewTicket",
        allowedRoles: ["Admin", "Manager", "It Support Agent", "Employee"]
    },
    {
        label: "Tickets",
        path: "/dashboard/Tickets",
        allowedRoles: ["Admin", "Manager", "Employee"]
    },  
    {
        label: "My Tickets",
        path: "/dashboard/MyTickets",
        allowedRoles: ["It Support Agent"]
    },
    {
        label: "Notifications",
        path: "/dashboard/Notifications",
        allowedRoles: ["Admin", "Manager", "It Support Agent", "Employee"]
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
        allowedRoles: ["Admin"]
    },
         {
        label: "Profile",
        path: "/dashboard/Profile",
        allowedRoles: ["Admin", "Manager", "It Support Agent", "Employee"]
    },
    {
        label: "Settings",
        path: "/dashboard/Settings",
        allowedRoles: ["Admin"]
    },
];