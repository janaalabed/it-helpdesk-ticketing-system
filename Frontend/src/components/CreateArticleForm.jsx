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
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-4 mb-8"
    >
      <h2 className="text-xl font-bold text-gray-800">
        Create Knowledge Base Article
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Article Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          placeholder="e.g., How to connect to Corporate Wi-Fi"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          disabled={fetchingCategories}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border disabled:bg-gray-100"
        >
          <option value="">
            {fetchingCategories ? "Loading categories..." : "Select a category"}
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Resolution Steps / Detailed Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
          placeholder="Provide explicit troubleshooting instructions..."
        />
      </div>

      <button
        type="submit"
        disabled={submitting || fetchingCategories}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
      >
        {submitting ? "Saving..." : "Submit Article"}
      </button>
    </form>
  );
}
