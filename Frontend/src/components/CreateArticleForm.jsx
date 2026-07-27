// CreateArticleForm.jsx
import { useState, useEffect } from "react";

export function CreateArticleForm({ onArticleCreated }) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [fetchingCategories, setFetchingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://localhost:7010/api/lookups/categories",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setFetchingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(
        "https://localhost:7010/api/KnowledgeBase/addArticle",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title,
            content,
            categoryId: parseInt(categoryId, 10),
          }),
        },
      );

      if (response.ok) {
        alert("Article created successfully!");
        setTitle("");
        setContent("");
        setCategoryId("");
        onArticleCreated();
      } else {
        alert("Failed to save article.");
      }
    } catch (error) {
      console.error("Error submitting article:", error);
      alert("An error occurred while connecting to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        {/* Header */}
        <div className="mb-6 border-b border-slate-200 pb-4">
          <h2 className="text-[20px] font-medium text-[#1E2A38]">
            Create Knowledge Base Article
          </h2>
          <p className="mt-1 text-[13px] text-slate-500">
            Create a reusable article to help resolve recurring support
            requests.
          </p>
        </div>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Article Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. How to connect to Corporate Wi-Fi"
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Category
            </label>

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              disabled={fetchingCategories}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-700 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">
                {fetchingCategories
                  ? "Loading categories..."
                  : "Select a category"}
              </option>

              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Resolution Steps
            </label>

            <textarea
              rows={7}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Provide detailed troubleshooting instructions..."
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end border-t border-slate-200 pt-5">
          <button
            type="submit"
            disabled={submitting || fetchingCategories}
            className="rounded-md bg-cyan-500 px-6 py-2 text-[13px] font-medium text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {submitting ? "Saving..." : "Submit Article"}
          </button>
        </div>
      </form>
    </div>
  );
}
