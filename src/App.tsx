import { useState, useEffect } from "react";

interface Job {
  id: number;
  company: string;
  role: string;
  status: "Applied" | "Interview" | "Rejected" | "Offer";
  date: string;
  notes: string;
}

type FilterStatus = "All" | Job["status"];

export default function App() {
  // Load from localStorage on first render
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem("jobs");
    return saved ? JSON.parse(saved) : [];
  });
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("All");

  // Save to localStorage every time jobs change
  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  function addJob() {
    if (!company || !role) return;
    const newJob: Job = {
      id: Date.now(),
      company,
      role,
      status: "Applied",
      date: new Date().toLocaleDateString(),
      notes,
    };
    setJobs([...jobs, newJob]);
    setCompany("");
    setRole("");
    setNotes("");
  }

  function updateStatus(id: number, status: Job["status"]) {
    setJobs(jobs.map((job) => (job.id === id ? { ...job, status } : job)));
  }

  function deleteJob(id: number) {
    setJobs(jobs.filter((job) => job.id !== id));
  }

  const statusColor = {
    Applied: "bg-blue-100 text-blue-800",
    Interview: "bg-yellow-100 text-yellow-800",
    Rejected: "bg-red-100 text-red-800",
    Offer: "bg-green-100 text-green-800",
  };

  const filterButtons: FilterStatus[] = [
    "All",
    "Applied",
    "Interview",
    "Offer",
    "Rejected",
  ];

  const filteredJobs =
    filter === "All" ? jobs : jobs.filter((job) => job.status === filter);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Job Application Tracker
          </h1>
          <p className="text-gray-500">
            Track your applications, interviews and offers
          </p>
        </div>

        {/* Add Job Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Add New Application
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <input
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Role / Job title"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            placeholder="Notes (optional) — e.g. salary range, contact name, deadline"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button
            onClick={addJob}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg text-sm transition-colors"
          >
            + Add Application
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {(
            ["Applied", "Interview", "Offer", "Rejected"] as Job["status"][]
          ).map((s) => (
            <div
              key={s}
              className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm cursor-pointer hover:border-blue-400 transition-colors"
              onClick={() => setFilter(s)}
            >
              <p className="text-2xl font-bold text-gray-800">
                {jobs.filter((j) => j.status === s).length}
              </p>
              <p className="text-xs text-gray-500 mt-1">{s}</p>
            </div>
          ))}
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {filterButtons.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-gray-300 text-gray-600 hover:border-blue-400"
              }`}
            >
              {f}{" "}
              {f === "All"
                ? `(${jobs.length})`
                : `(${jobs.filter((j) => j.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Job List */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">
              {filter === "All"
                ? "No applications yet"
                : `No ${filter} applications`}
            </p>
            <p className="text-sm mt-1">
              {filter === "All"
                ? "Add your first job application above"
                : "Try a different filter or add a new application"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="font-semibold text-gray-800">
                      {job.company}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[job.status]}`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{job.role}</p>
                  {job.notes && (
                    <p className="text-xs text-gray-400 mt-1 italic">
                      {job.notes}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Added: {job.date}
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-end shrink-0">
                  <select
                    value={job.status}
                    onChange={(e) =>
                      updateStatus(job.id, e.target.value as Job["status"])
                    }
                    className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>
                  <button
                    onClick={() => deleteJob(job.id)}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-12">
          {jobs.length} total application{jobs.length !== 1 ? "s" : ""} · Data
          saved locally in your browser
        </p>
      </div>
    </div>
  );
}
