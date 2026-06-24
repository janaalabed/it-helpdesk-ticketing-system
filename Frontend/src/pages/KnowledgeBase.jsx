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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 font-medium">
          Loading articles...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-center shadow-sm">
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Form only renders for Manager and Admin */}
      {canCreateArticle && (
        <CreateArticleForm onArticleCreated={fetchArticles} />
      )}

      {/* Article list — visible to everyone */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center border-b pb-4 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Knowledge Base Documentation
          </h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {articles.length} {articles.length === 1 ? "Article" : "Articles"}{" "}
            available
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          {articles.map((article) => (
            <article
              key={article.id}
              className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <h3
                  onClick={() => handleArticleClick(article)}
                  className="text-xl font-semibold text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                >
                  {article.title}
                </h3>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {article.createdAt
                    ? new Date(article.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap line-clamp-2 mb-4">
                {article.content}
              </div>
              <div className="flex items-center text-xs text-gray-500 space-x-4 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-1">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span>{article.viewCount || 0} views</span>
                </div>
                {article.categoryId && (
                  <span className="bg-gray-100 text-gray-700 font-medium px-2 py-0.5 rounded">
                    Category ID: {article.categoryId}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedArticle && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white max-w-3xl w-full rounded-lg shadow-xl max-h-[85vh] flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {selectedArticle.title}
              </h3>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
              {selectedArticle.content}
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 rounded-b-lg flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 bg-gray-600 text-white font-medium text-xs rounded hover:bg-gray-700 transition"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
