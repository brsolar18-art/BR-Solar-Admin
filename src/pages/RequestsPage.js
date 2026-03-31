import React, { useEffect, useMemo, useState } from "react";
import "./RequestsPage.css";

const API_BASE = "https://br-solar-backend.vercel.app";

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/admin/contact-messages`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch requests");
      }

      setRequests(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      alert(error.message || "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      const matchesSearch =
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.email?.toLowerCase().includes(search.toLowerCase()) ||
        item.phone?.toLowerCase().includes(search.toLowerCase()) ||
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: requests.length,
      newCount: requests.filter((item) => item.status === "new").length,
      progressCount: requests.filter((item) => item.status === "in_progress").length,
      closedCount: requests.filter((item) => item.status === "closed").length
    };
  }, [requests]);

  const deleteRequest = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this request?");
    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(`${API_BASE}/api/admin/contact-messages/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete request");
      }

      setRequests((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      alert(error.message || "Failed to delete request");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="requests-page">
      <div className="requests-header">
        <div>
          <h1>Customers / Requests</h1>
          <p>Manage website enquiries and customer requests from one place.</p>
        </div>
        <button className="requests-refresh-btn" onClick={fetchRequests}>
          Refresh
        </button>
      </div>

      <div className="requests-stats">
        <div className="requests-stat-card">
          <span>Total</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="requests-stat-card">
          <span>New</span>
          <strong>{stats.newCount}</strong>
        </div>
        <div className="requests-stat-card">
          <span>In Progress</span>
          <strong>{stats.progressCount}</strong>
        </div>
        <div className="requests-stat-card">
          <span>Closed</span>
          <strong>{stats.closedCount}</strong>
        </div>
      </div>

      <div className="requests-toolbar">
        <input
          type="text"
          placeholder="Search by name, email, phone, subject or service"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="requests-search"
        />

        <select
          className="requests-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="in_progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="requests-table-card">
        {loading ? (
          <div className="requests-empty">Loading requests...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="requests-empty">No requests found.</div>
        ) : (
          <div className="requests-table-wrap">
            <table className="requests-table">
              <thead>
                <tr>
                  <th className="col-id">ID</th>
                  <th className="col-main">Name</th>
                  <th className="col-main">Phone</th>
                  <th className="col-main">Email</th>
                  <th className="col-main">Subject</th>
                  <th className="col-main">Service</th>
                  <th className="col-main">Message</th>
                  <th className="col-date">Date</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((item) => (
                  <tr key={item.id}>
                    <td className="col-id">{item.id}</td>
                    <td className="col-main">{item.name}</td>
                    <td className="col-main">{item.phone}</td>
                    <td className="col-main">{item.email}</td>
                    <td className="col-main">{item.title}</td>
                    <td className="col-main">{item.category}</td>
                    <td className="col-main requests-message-cell">{item.message}</td>
                    <td className="col-date">{new Date(item.submitted_at).toLocaleString()}</td>
                    <td className="col-actions">
                      <div className="requests-actions">
                        <button
                          className="requests-delete-btn"
                          onClick={() => deleteRequest(item.id)}
                          disabled={deletingId === item.id}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}