import { useEffect, useState } from "react";
import API from "../services/api";

export default function DonorDashboard() {
  const [form, setForm] = useState({
    foodName: "",
    quantity: "",
    pickupLocation: "",
    expiryTime: "",
    phone: "",
  });

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchMyDonations = async () => {
    try {
      const res = await API.get("/donations/mine");
      setDonations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("foodName", form.foodName);
      formData.append("quantity", form.quantity);
      formData.append("pickupLocation", form.pickupLocation);
      formData.append("expiryTime", form.expiryTime);
      formData.append("phone", form.phone);
      if (imageFile) {
        formData.append("foodImage", imageFile);
      }

      await API.post("/donations", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setForm({
        foodName: "",
        quantity: "",
        pickupLocation: "",
        expiryTime: "",
        phone: "",
      });
      setImageFile(null);

      fetchMyDonations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to donate");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, []);

  const badge = (status) => {
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Accepted") return "bg-blue-100 text-blue-700";
    return "bg-green-100 text-green-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Donor Dashboard 🍱</h1>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Donation Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">Donate Food</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="foodName"
                value={form.foodName}
                onChange={handleChange}
                placeholder="Food Name"
                className="w-full p-3 border rounded-lg"
                required
              />

              <input
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Quantity (e.g. 10 plates)"
                className="w-full p-3 border rounded-lg"
                required
              />

              <input
                name="pickupLocation"
                value={form.pickupLocation}
                onChange={handleChange}
                placeholder="Pickup Location"
                className="w-full p-3 border rounded-lg"
                required
              />

              <input
                name="expiryTime"
                value={form.expiryTime}
                onChange={handleChange}
                placeholder="Expiry Time (e.g. Today 9 PM)"
                className="w-full p-3 border rounded-lg"
                required
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full p-3 border rounded-lg"
                required
              />

              {/* 📸 Image upload (system + camera) */}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full p-2 border rounded-lg"
              />

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                disabled={loading}
                className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"
              >
                {loading ? "Submitting..." : "Donate"}
              </button>
            </form>
          </div>

          {/* Donations List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-4">My Donations</h2>

            {donations.length === 0 ? (
              <p className="text-gray-500">No donations yet.</p>
            ) : (
              <div className="space-y-4">
                {donations.map((d) => (
                  <div
                    key={d._id}
                    className="border rounded-xl p-4 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-semibold">{d.foodName}</h3>
                      <p className="text-sm text-gray-600">
                        {d.quantity} • {d.pickupLocation}
                      </p>
                      <p className="text-xs text-gray-500">
                        Expiry: {d.expiryTime}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${badge(
                        d.status
                      )}`}
                    >
                      {d.status}
                    </span>
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
