import { useState, useEffect } from "react";
import { CreateArticleForm } from "../components/CreateArticleForm";

const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];
  } catch {
    return null;
  }
};

export function KnowledgeBase() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const role = getUserRole();
  const canCreateArticle = role === "Manager" || role === "Admin";

  const fetchArticles = async () => {
    try {
      const response = await fetch("https://localhost:7010/api/KnowledgeBase", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      } else if (response.status === 401) {
        setError("You are unauthorized. Please log in.");
      } else {
        setError("Failed to load articles from the server.");
      }
    } catch (err) {
      setError("An error occurred while connecting to the network.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleArticleClick = async (article) => {
    setSelectedArticle(article);
    try {
      const response = await fetch(
        `https://localhost:7010/api/KnowledgeBase/${article.id}/increment-view`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.ok) {
        setArticles((prev) =>
          prev.map((a) =>
            a.id === article.id
              ? { ...a, viewCount: (a.viewCount || 0) + 1 }
              : a,
          ),
        );
      }
    } catch (err) {
      console.error("Failed to increment view count:", err);
    }
  };


  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center bg-[#F8FAFC]">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[#06B6D4]"></div>
        <span className="ml-3 font-sans text-[13px] font-medium text-[#475569]">
          Loading articles...
        </span>
      </div>
    );
  }


  if (error) {
    return (
      <div className="mx-auto mt-6 max-w-4xl rounded-md border border-red-200 bg-red-50 p-4 text-center shadow-sm">
        <p className="font-sans text-[13px] font-medium text-red-800">
          {error}
        </p>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#F8FAFC] px-4 py-[14px] font-sans antialiased">
      {/* Form Context wrapper for high-level user permissions */}
      {canCreateArticle && (
        <div className="mx-auto mb-6 max-w-4xl">
          <CreateArticleForm onArticleCreated={fetchArticles} />
        </div>
      )}

      {/* Main Documentation panel layout */}
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header Block matching explicit Typography tokens */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <h1 className="text-[20px] font-medium text-[#1E2A38]">
            Knowledge Base Documentation
          </h1>
          <span className="rounded-full bg-[#ECFEFF] px-2.5 py-0.5 text-[11px] font-medium text-[#06B6D4] border-[0.5px] border-[#06B6D4]">
            {articles.length} {articles.length === 1 ? "Article" : "Articles"}{" "}
            available
          </span>
        </div>

        {/* Content Card grid block layout */}
        <div className="grid gap-4">
          {articles.map((article) => (
            <article
              key={article.id}
              className="rounded-lg border-[0.5px] border-[#E2E8F0] bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between">
                {/* Title mapping directly to Cyan-500 standard UI accent */}
                <h2
                  onClick={() => handleArticleClick(article)}
                  className="cursor-pointer text-[14px] font-medium text-[#06B6D4] hover:text-[#22D3EE] hover:underline"
                >
                  {article.title}
                </h2>
                <span className="ml-4 whitespace-nowrap text-[11px] text-[#94A3B8]">
                  {article.createdAt
                    ? new Date(article.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              {/* Body documentation layout summary formatting */}
              <p className="line-clamp-2 mb-4 whitespace-pre-wrap text-[13px] leading-relaxed text-[#2D3E52]">
                {article.content}
              </p>

              {/* Bottom operational metadata tracking summary */}
              <div className="flex items-center space-x-4 border-t border-[#F1F5F9] pt-3 text-[11px] text-[#475569]">
                <div className="flex items-center space-x-1">
                  <svg
                    className="h-3.5 w-3.5 text-[#94A3B8]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span>{article.viewCount || 0} views</span>
                </div>
                {article.categoryId && (
                  <span className="rounded bg-[#F1F5F9] px-2 py-0.5 font-medium text-[#2D3E52]">
                    Category ID: {article.categoryId}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal Overlay matching precise 12px modal edge rule requirements */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in">
          <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-[12px] border-[0.5px] border-[#E2E8F0] bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] p-6">
              <h3 className="text-[14px] font-medium text-[#1E2A38]">
                {selectedArticle.title}
              </h3>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-[#94A3B8] hover:text-[#475569] text-lg font-bold p-1 focus:outline-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Content container layout */}
            <div className="overflow-y-auto p-6 text-[13px] leading-relaxed text-[#2D3E52] whitespace-pre-wrap">
              {selectedArticle.content}
            </div>

            {/* Modal Control Action panel footer */}
            <div className="flex justify-end bg-[#F8FAFC] p-4 border-t border-[#E2E8F0] rounded-b-[12px]">
              <button
                onClick={() => setSelectedArticle(null)}
                className="h-8 rounded-[6px] bg-[#475569] hover:bg-[#2D3E52] px-4 text-[13px] font-medium text-white transition-colors focus:outline-none"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
