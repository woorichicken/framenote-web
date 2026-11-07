"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, LogOut, X, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

// --- Types ---

type Status = "in-progress" | "planned" | "completed";

interface RoadmapItem {
  id: number;
  title: string;
  description: string;
  status: Status;
  category: string;
  date: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

type FormData = Omit<RoadmapItem, "id" | "createdAt" | "updatedAt">;

const EMPTY_FORM: FormData = {
  title: "",
  description: "",
  status: "planned",
  category: "",
  date: "",
  order: 0,
};

// --- Components ---

function StatusBadge({ status }: { status: Status }) {
  const styles = {
    "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
    planned: "bg-gray-100 text-gray-600 border-gray-200",
    completed: "bg-green-100 text-green-700 border-green-200",
  };

  const labels = {
    "in-progress": "In Progress",
    planned: "Planned",
    completed: "Completed",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export default function AdminRoadmapPage() {
  // Auth state
  const [apiKey, setApiKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  // Data state
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  // Check saved API key
  useEffect(() => {
    const savedKey = localStorage.getItem("admin_api_key");
    if (savedKey) {
      setApiKey(savedKey);
      setIsAuthenticated(true);
    }
  }, []);

  // Load data after auth
  useEffect(() => {
    if (isAuthenticated) {
      fetchRoadmaps();
    }
  }, [isAuthenticated]);

  // API call helper
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
  };

  // Login handler
  const handleLogin = async () => {
    setAuthError("");
    setLoading(true);

    try {
      // Verify API key by attempting a POST request
      const res = await fetch("/api/roadmaps", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (res.status !== 401) {
        localStorage.setItem("admin_api_key", apiKey);
        setIsAuthenticated(true);
      } else {
        setAuthError("Invalid API key.");
      }
    } catch (error) {
      setAuthError("An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("admin_api_key");
    setApiKey("");
    setIsAuthenticated(false);
    setRoadmapItems([]);
  };

  // Fetch roadmaps
  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/roadmaps");
      const data = await res.json();
      setRoadmapItems(data);
    } catch (error) {
      console.error("Failed to fetch roadmaps:", error);
    } finally {
      setLoading(false);
    }
  };

  // Open modal (create/edit)
  const openModal = (item?: RoadmapItem) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        title: item.title,
        description: item.description,
        status: item.status,
        category: item.category,
        date: item.date || "",
        order: item.order,
      });
    } else {
      setEditingId(null);
      setFormData(EMPTY_FORM);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  // Save (create/update)
  const handleSave = async () => {
    setLoading(true);
    try {
      const url = editingId
        ? `/api/roadmaps/${editingId}`
        : "/api/roadmaps";
      const method = editingId ? "PUT" : "POST";

      const res = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        closeModal();
        fetchRoadmaps();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to save.");
      }
    } catch (error) {
      alert("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    setLoading(true);
    try {
      const res = await fetchWithAuth(`/api/roadmaps/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchRoadmaps();
      } else {
        alert("Failed to delete.");
      }
    } catch (error) {
      alert("An error occurred while deleting.");
    } finally {
      setLoading(false);
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Roadmap Admin Login
          </h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Admin API Key"
              />
            </div>
            {authError && (
              <p className="text-red-500 text-sm">{authError}</p>
            )}
            <button
              onClick={handleLogin}
              disabled={loading || !apiKey}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </div>
          <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
                Back to Home
              </Link>
          </div>
        </div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/" className="text-gray-500 hover:text-gray-900">
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-xl font-bold text-gray-900">
                    Roadmap Admin
                </h1>
            </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              New Item
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* List */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading && roadmapItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : roadmapItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No roadmap items available.
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50 border-b">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                    </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {roadmapItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.title}
                        <div className="text-xs text-gray-500 font-normal truncate max-w-md mt-1">
                            {item.description}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.category}
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.date || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                        onClick={() => openModal(item)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                        >
                        <Edit2 size={16} />
                        </button>
                        <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                        >
                        <Trash2 size={16} />
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? "Edit Item" : "New Item"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Feature name"
                />
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value as Status }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="planned">Planned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Feature, Backend, Admin"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    value={formData.date || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Q1 2026, Dec 2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Brief description"
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading || !formData.title || !formData.description || !formData.category}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={16} />
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
