using HelpDesk.Core.DTOs;
using HelpDesk.Core.Models;
using HelpDesk.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HelpDesk.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KnowledgeBaseController : ControllerBase
    {
        HelpDeskDbContext _db;
        public KnowledgeBaseController(HelpDeskDbContext db) {
            _db = db;
        }


        [HttpPost("addArticle")]
        [Authorize(Roles = "Manager,Admin")]
        public async Task<IActionResult> addArticle(ArticleDto dto)
        {
            if (!ModelState.IsValid || dto == null)
            {
                return BadRequest(ModelState);
            }


            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            var userId = Guid.Parse(userIdClaim);

            var article = new KnowledgeBaseArticle
            {
                Title = dto.Title,
                Content = dto.Content,
                CategoryId = dto.CategoryId,
                AuthorId = userId,
                CreatedAt = DateTime.UtcNow,
            };
            await _db.KnowledgeBaseArticles.AddAsync(article);
            await _db.SaveChangesAsync();
            return Ok(new {message = "article created successfully"});

        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> getArticles()
        {
            var articles = await _db.KnowledgeBaseArticles.Select(a => new
            {
                a.Id,
                a.Title,
                a.Content,
                a.ViewCount,
                a.CreatedAt,
                a.UpdatedAt,
                Category = a.Category.Name,
                author = a.user.FullName,
            }).ToListAsync();

            if(articles == null)
            {
                return BadRequest(new { message = "there is no articles yet"});
            }

            return Ok(articles);
        }

        [HttpPost("{id}/increment-view")]
        [Authorize]
        public async Task<IActionResult> IncrementViewCount(int id)
        {
            var article = await _db.KnowledgeBaseArticles.FindAsync(id);

            if (article == null)
            {
                return NotFound(new { message = "Article not found" });
            }

            article.ViewCount += 1;

            await _db.SaveChangesAsync();

            return Ok(new { currentViews = article.ViewCount });
        }
    }
}
