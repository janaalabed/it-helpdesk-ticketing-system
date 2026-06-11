//using HelpDesk.Data;
//using HelpDesk.Models;

//namespace HelpDesk.Infrastructure.Data
//{
//    public class SeedData
//    {
//        public static async Task SeedTicketsAsync(HelpDeskDbContext context)
//        {
//            if (context.Tickets.Any()) return;

//            var tickets = new List<Ticket>
//            {
//                new Ticket
//                {
//                    Id           = Guid.NewGuid(),
//                    ReferenceNo  = "TKT-0001",
//                    Title        = "Laptop won't turn on after update",
//                    Description  = "My laptop stopped booting after the Windows update that ran last night. Stuck on a black screen with a blinking cursor.",
//                    SubmittedBy  = Guid.Parse("08f5338f-ae77-4bf9-936f-8aa7c271a40e"),
//                    AssignedTo   = Guid.Parse("0e96f07d-2b38-4be7-beb2-9440158cf652"),
//                    CategoryId   = 1, // Hardware
//                    PriorityId   = 3, // High
//                    StatusId     = 2, // In Progress
//                    CreatedAt    = new DateTime(2026, 5, 1, 9, 0, 0, DateTimeKind.Utc),
//                    UpdatedAt    = new DateTime(2026, 5, 1, 11, 0, 0, DateTimeKind.Utc)
//                }
//                 };

//            context.Tickets.AddRange(tickets);
//            await context.SaveChangesAsync();
//        }
//        }
//}
