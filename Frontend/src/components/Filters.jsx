import { useState, useEffect } from "react";

export function Filters({
  selectedCategory,
  selectedPriority,
  selectedStatus,
  onCategoryChange,
  onPriorityChange,
  onStatusChange,
}) {
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);
  useEffect(() => {
    getPriorities();
  }, []);
  useEffect(() => {
    getStatuses();
  }, []);

  const getPriorities = async () => {
    try {
      const response = await fetch(
        "https://localhost:7010/api/lookups/priorities",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
      setPriorities(await response.json());
    } catch (error) {
      console.error(error);
    }
  };

  const getStatuses = async () => {
    try {
      const response = await fetch(
        "https://localhost:7010/api/lookups/statuses",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
      setStatuses(await response.json());
    } catch (error) {
      console.error(error);
    }
  };

  const getCategories = async () => {
    try {
      const response = await fetch(
        "https://localhost:7010/api/lookups/categories",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );
      setCategories(await response.json());
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = () => {
    onCategoryChange("");
    onPriorityChange("");
    onStatusChange("");
  };

  return (
    <div className="flex items-center gap-[10px] flex-wrap px-[14px] py-[10px] bg-white border border-[#E2E8F0] rounded-[8px]">
      {/* Category */}
      <div className="flex flex-col gap-[3px]">
        <span className="text-[11px] text-[#94A3B8] uppercase tracking-wider">
          Category
        </span>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="h-[32px] min-w-[140px] text-[13px] px-[10px] border border-[#E2E8F0] rounded-[8px] bg-[#F8FAFC] text-[#2D3E52] focus:outline-none focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20"
        >
          <option value="">All Categories</option>
          {categories.map((el) => (
            <option key={el.id} value={el.name}>
              {el.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-px h-[32px] bg-[#E2E8F0] mx-[2px]" />

      {/* Priority */}
      <div className="flex flex-col gap-[3px]">
        <span className="text-[11px] text-[#94A3B8] uppercase tracking-wider">
          Priority
        </span>
        <select
          value={selectedPriority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="h-[32px] min-w-[140px] text-[13px] px-[10px] border border-[#E2E8F0] rounded-[8px] bg-[#F8FAFC] text-[#2D3E52] focus:outline-none focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20"
        >
          <option value="">All Priorities</option>
          {priorities.map((el) => (
            <option key={el.id} value={el.level}>
              {el.level}
            </option>
          ))}
        </select>
      </div>

      <div className="w-px h-[32px] bg-[#E2E8F0] mx-[2px]" />

      {/* Status */}
      <div className="flex flex-col gap-[3px]">
        <span className="text-[11px] text-[#94A3B8] uppercase tracking-wider">
          Status
        </span>
        <select
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-[32px] min-w-[140px] text-[13px] px-[10px] border border-[#E2E8F0] rounded-[8px] bg-[#F8FAFC] text-[#2D3E52] focus:outline-none focus:border-[#06B6D4] focus:ring-2 focus:ring-[#06B6D4]/20"
        >
          <option value="">All Statuses</option>
          {statuses.map((el) => (
            <option key={el.id} value={el.label}>
              {el.label}
            </option>
          ))}
        </select>
      </div>

      <div className="w-px h-[32px] bg-[#E2E8F0] mx-[2px]" />

      {/* Reset */}
      <button
        onClick={handleReset}
        className="mt-4 h-[32px] px-[12px] text-[12px] text-[#94A3B8] bg-transparent border border-[#E2E8F0] rounded-[8px] flex items-center gap-[5px] hover:bg-[#F8FAFC] hover:text-[#475569] transition-colors"
      >
        ↺ Reset
      </button>
    </div>
  );
}
