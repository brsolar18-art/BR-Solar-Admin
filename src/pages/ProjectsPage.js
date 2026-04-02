import React, { useEffect, useState } from "react";
import "./ProjectsPage.css";

const API_BASE = "https://br-solar-backend.vercel.app";

export default function ProjectsPage() {
  const [formData, setFormData] = useState({
    client_name: "",
    installation_location: "",
    project_description: ""
  });

  const [images, setImages] = useState({
    image_1: null,
    image_2: null,
    image_3: null
  });

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProjects = async () => {
    try {
      setFetching(true);
      const response = await fetch(`${API_BASE}/api/admin/projects`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch projects");
      }

      setProjects(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      alert(error.message || "Failed to fetch projects");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    setImages((prev) => ({
      ...prev,
      [name]: files[0] || null
    }));
  };

  const resetForm = () => {
    setFormData({
      client_name: "",
      installation_location: "",
      project_description: ""
    });

    setImages({
      image_1: null,
      image_2: null,
      image_3: null
    });

    const fileInputs = document.querySelectorAll(".projects-file-input");
    fileInputs.forEach((input) => {
      input.value = "";
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!images.image_1 || !images.image_2 || !images.image_3) {
      alert("Please upload all 3 images");
      return;
    }

    try {
      setLoading(true);

      const body = new FormData();
      body.append("client_name", formData.client_name);
      body.append("installation_location", formData.installation_location);
      body.append("project_description", formData.project_description);
      body.append("image_1", images.image_1);
      body.append("image_2", images.image_2);
      body.append("image_3", images.image_3);

      const response = await fetch(`${API_BASE}/api/admin/projects`, {
        method: "POST",
        body
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create project");
      }

      resetForm();
      fetchProjects();
      alert("Project added successfully");
    } catch (error) {
      alert(error.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    try {
      setDeletingId(id);

      const response = await fetch(`${API_BASE}/api/admin/projects/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete project");
      }

      setProjects((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      alert(error.message || "Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="projects-page">
      <div className="projects-shell">
        <div className="projects-header">
          <div className="projects-header-text">
            <span className="projects-kicker">BR Solar Admin</span>
            <h1>Projects Management</h1>
            <p>Add completed installation projects and manage the existing portfolio with a clean and responsive layout.</p>
          </div>
        </div>

        <div className="projects-layout">
          <div className="projects-form-card">
            <div className="projects-card-head">
              <div>
                <span className="projects-section-tag">Create</span>
                <h2>Add New Project</h2>
                <p>Fill in the project details and upload exactly three site images.</p>
              </div>
            </div>

            <form className="projects-form" onSubmit={handleSubmit}>
              <div className="projects-form-grid">
                <div className="projects-field">
                  <label htmlFor="client_name">Client Name</label>
                  <input
                    id="client_name"
                    type="text"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleChange}
                    placeholder="Enter client name"
                    required
                  />
                </div>

                <div className="projects-field">
                  <label htmlFor="installation_location">Installation Location</label>
                  <input
                    id="installation_location"
                    type="text"
                    name="installation_location"
                    value={formData.installation_location}
                    onChange={handleChange}
                    placeholder="Enter installation location"
                    required
                  />
                </div>

                <div className="projects-field projects-field-full">
                  <label htmlFor="project_description">Project Description</label>
                  <textarea
                    id="project_description"
                    name="project_description"
                    value={formData.project_description}
                    onChange={handleChange}
                    placeholder="Enter project description"
                    rows="6"
                    required
                  />
                </div>

                <div className="projects-upload-grid">
                  <div className="projects-field">
                    <label htmlFor="image_1">Image 1</label>
                    <input
                      id="image_1"
                      className="projects-file-input"
                      type="file"
                      name="image_1"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                  </div>

                  <div className="projects-field">
                    <label htmlFor="image_2">Image 2</label>
                    <input
                      id="image_2"
                      className="projects-file-input"
                      type="file"
                      name="image_2"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                  </div>

                  <div className="projects-field">
                    <label htmlFor="image_3">Image 3</label>
                    <input
                      id="image_3"
                      className="projects-file-input"
                      type="file"
                      name="image_3"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="projects-submit-btn" disabled={loading}>
                {loading ? "Saving..." : "Add Project"}
              </button>
            </form>
          </div>

          <div className="projects-list-card">
            <div className="projects-list-head">
              <div>
                <span className="projects-section-tag">Manage</span>
                <h2>Project List</h2>
                <p>View and remove existing projects.</p>
              </div>

              <button className="projects-refresh-btn" onClick={fetchProjects} type="button">
                Refresh
              </button>
            </div>

            {fetching ? (
              <div className="projects-empty">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="projects-empty">No projects found.</div>
            ) : (
              <div className="projects-grid">
                {projects.map((project) => (
                  <div className="project-card" key={project.id}>
                    <div className="project-card-body">
                      <div className="project-card-top">
                        <span className="project-card-id">Project #{project.id}</span>
                      </div>

                      <div className="project-card-content">
                        <h3>{project.client_name}</h3>
                        <p className="project-location">{project.installation_location}</p>
                        <p className="project-description">{project.project_description}</p>
                      </div>

                      <div className="project-images">
                        {project.image_1 && <img src={project.image_1} alt={`${project.client_name} view 1`} />}
                        {project.image_2 && <img src={project.image_2} alt={`${project.client_name} view 2`} />}
                        {project.image_3 && <img src={project.image_3} alt={`${project.client_name} view 3`} />}
                      </div>

                      <button
                        className="project-delete-btn"
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        type="button"
                      >
                        {deletingId === project.id ? "Deleting..." : "Delete Project"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}