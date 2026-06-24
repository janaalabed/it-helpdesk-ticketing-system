namespace HelpDesk.Core.Models
{
    using HelpDesk.Models;
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

        public class KnowledgeBaseArticle
        {
            [Key]
            public int Id { get; set; }

            [Required]
            [StringLength(250)]
            public string Title { get; set; } = string.Empty;

            [Required]
            public string Content { get; set; } = string.Empty;

            public int ViewCount { get; set; } = 0;

            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

            public DateTime? UpdatedAt { get; set; }

            // --- Foreign Keys ---

            [Required]
            public int CategoryId { get; set; }

            [Required]
        public Guid AuthorId { get; set; }

        // --- Navigation Properties ---

        [ForeignKey("CategoryId")]
            public virtual Category? Category { get; set; }

            [ForeignKey("AuthorId")]
            public virtual User? user { get; set; }
        }
    }
