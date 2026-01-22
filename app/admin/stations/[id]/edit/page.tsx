"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save } from "lucide-react";

export default function EditStationPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/stations/${id}`)
      .then(res => res.json())
      .then(data => setFormData(data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch(`/api/stations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    router.push("/admin/stations");
  };

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Edit Station</h1>

      <input
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
        className="w-full border p-3 rounded"
      />

      <select
        value={formData.status}
        onChange={e => setFormData({ ...formData, status: e.target.value })}
        className="w-full border p-3 rounded"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="archived">Archived</option>
      </select>

      <button className="bg-blue-600 text-white px-6 py-3 rounded flex gap-2">
        <Save /> Save Changes
      </button>
    </form>
  );
}
