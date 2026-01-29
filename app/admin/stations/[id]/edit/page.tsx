"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Radio, Tv, Upload } from "lucide-react";

type StationType = "radio" | "tv";
type StationStatus = "active" | "inactive" | "archived";

interface StationFormData {
  name: string;
  type: StationType;
  frequency: string;
  region: string;
  logoUrl: string;
  description: string;
  status: StationStatus;
}

export default function EditStationPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<StationFormData>({
    name: "",
    type: "radio",
    frequency: "",
    region: "",
    logoUrl: "",
    description: "",
    status: "active",
  });

  /* ---------------- Fetch existing station ---------------- */
  useEffect(() => {
    if (!id) return;

    const fetchStation = async () => {
      try {
        const res = await fetch(`/api/stations/${id}`);
        if (!res.ok) throw new Error("Failed to fetch station");

        const data = await res.json();

        setFormData({
          name: data.name ?? "",
          type: data.type ?? "radio",
          frequency: data.frequency ?? "",
          region: data.region ?? "",
          logoUrl: data.logoUrl ?? "",
          description: data.description ?? "",
          status: data.status ?? "active",
        });
      } catch (err) {
        setError("Unable to load station data");
      } finally {
        setLoading(false);
      }
    };

    fetchStation();
  }, [id]);

  /* ---------------- Handlers ---------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/stations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || "Update failed");
      }

      router.push("/admin/stations");
    } catch (err: any) {
      setError(err.message || "Failed to update station");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- States ---------------- */
  if (loading) {
    return <p className="p-6">Loading station…</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6">
      <div className="mb-8">
        <Link
          href="/admin/stations"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Stations
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Edit Station
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Update station details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column */}
            <div className="space-y-6">
              {/* Station Type */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Station Type *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, type: "radio" }))}
                    className={`flex items-center justify-center gap-3 p-4 border-2 rounded-lg ${
                      formData.type === "radio"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <Radio />
                    Radio
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, type: "tv" }))}
                    className={`flex items-center justify-center gap-3 p-4 border-2 rounded-lg ${
                      formData.type === "tv"
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    <Tv />
                    TV
                  </button>
                </div>
              </div>

              {/* Name */}
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Station name"
                required
                className="w-full px-4 py-3 border rounded-lg"
              />

              {/* Frequency */}
              <input
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                placeholder="Frequency"
                required={formData.type === "radio"}
                className="w-full px-4 py-3 border rounded-lg"
              />

              {/* Region */}
              <input
                name="region"
                value={formData.region}
                onChange={handleChange}
                placeholder="Region"
                className="w-full px-4 py-3 border rounded-lg"
              />

              {/* Status */}
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Logo */}
              <input
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="Logo URL"
                className="w-full px-4 py-3 border rounded-lg"
              />

              {/* Description */}
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 border rounded-lg resize-none"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="font-semibold mb-4">Preview</h3>
            <div className="flex items-center gap-4">
              {formData.type === "radio" ? <Radio /> : <Tv />}
              <div>
                <h4 className="font-semibold">{formData.name}</h4>
                <p className="text-sm">
                  {formData.frequency} • {formData.region}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-8">
          <Link
            href="/admin/stations"
            className="px-6 py-3 border rounded-lg"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg flex gap-2"
          >
            <Save />
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
