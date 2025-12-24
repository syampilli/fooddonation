import { useEffect, useState } from "react";
import API from "../services/api";

export default function NgoDashboard() {
  const [donations, setDonations] = useState([]);
  const [history, setHistory] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");

  // 📍 NGO current location
  const [ngoLocation, setNgoLocation] = useState(null);

  // 📍 Distance per donation
  const [distanceMap, setDistanceMap] = useState({});

  /* ================= FETCH DATA ================= */

  const fetchPending = async () => {
    try {
      const res = await API.get("/donations/pending");
      setDonations(res.data);
    } catch (err) {
      setError("Failed to load donations");
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await API.get("/donations/ngo/history");
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history");
    }
  };

  /* ================= NGO LOCATION ================= */

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setNgoLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          alert("Location permission denied. Distance will not show.");
        }
      );
    }
  }, []);

  /* ================= FETCH DISTANCE ================= */

  const fetchDistance = async (donationId, pickupLocation) => {
    if (!ngoLocation) return;

    try {
      const res = await API.get("/distance", {
        params: {
          lat: ngoLocation.lat,
          lng: ngoLocation.lng,
          destination: pickupLocation,
        },
      });

      setDistanceMap((prev) => ({
        ...prev,
        [donationId]: res.data,
      }));
    } catch (err) {
      console.error("Distance fetch failed");
    }
  };

  /* ================= LOAD ON MOUNT ================= */

  useEffect(() => {
    fetchPending();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (ngoLocation && donations.length > 0) {
      donations.forEach((d) => {
        fetchDistance(d._id, d.pickupLocation);
      });
    }
  }, [ngoLocation, donations]);

  /* ================= ACTIONS ================= */

  const handleAccept = async (id) => {
    setLoadingId(id);
    try {
      await API.put(`/donations/accept/${id}`);
      fetchPending();
      fetchHistory();
    } catch (err) {
      alert("Accept failed");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDeliver = async (id) => {
    setLoadingId(id);
    try {
      await API.put(`/donations/deliver/${id}`);
      fetchPending();
      fetchHistory();
    } catch (err) {
      alert("Delivery update failed");
    } finally {
      setLoadingId(null);
    }
  };

  const badge = (status) => {
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Accepted") return "bg-blue-100 text-blue-700";
    return "bg-green-100 text-green-700";
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">NGO Dashboard 🏥</h1>
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

        {/* Pending Donations */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Pending Food Donations
          </h2>

          {donations.length === 0 ? (
            <p className="text-gray-500">No pending donations 🎉</p>
          ) : (
            <div className="space-y-4">
              {donations.map((d) => (
                <div
                  key={d._id}
                  className="border rounded-xl p-4 flex flex-col md:flex-row md:justify-between gap-4"
                >
                  {/* INFO */}
                  <div className="w-full">
                    <h3 className="font-semibold text-lg">{d.foodName}</h3>

                    <p className="text-sm text-gray-600">
                      {d.quantity} • {d.pickupLocation}
                    </p>

                    <p className="text-xs text-gray-500">
                      Expiry: {d.expiryTime}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Donor: {d.donor?.name} ({d.donor?.email})
                    </p>

                    <p className="text-sm mt-1">📞 {d.phone}</p>

                    {/* 📍 Distance */}
                    {distanceMap[d._id] && (
                      <p className="text-sm text-gray-600 mt-1">
                        📍 Distance:{" "}
                        {distanceMap[d._id]?.distance?.text} • ⏱{" "}
                        {distanceMap[d._id]?.duration?.text}
                      </p>
                    )}

                    {/* 🖼️ Food Image */}
                    {d.foodImage && (
                      <img
                         src={`https://fooddonation-1-fpe0.onrender.com${d.foodImage}`}
                        alt="Food"
                        className="w-full max-w-sm h-48 object-cover rounded-lg mt-3"
                      />
                    )}

                    {/* 🗺️ Map */}
                    {d.pickupLocation && (
                      <iframe
                        title="pickup-map"
                        className="w-full h-56 rounded-lg mt-3 border"
                        loading="lazy"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                          d.pickupLocation
                        )}&output=embed`}
                      />
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${badge(
                        d.status
                      )}`}
                    >
                      {d.status}
                    </span>

                    {d.status === "Pending" && !d.acceptedBy && (
                      <button
                        disabled={loadingId === d._id}
                        onClick={() => handleAccept(d._id)}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                      >
                        {loadingId === d._id ? "Accepting..." : "Accept"}
                      </button>
                    )}

                    {d.status === "Accepted" &&
                      d.acceptedBy ===
                        JSON.parse(localStorage.getItem("user"))?.id && (
                        <button
                          disabled={loadingId === d._id}
                          onClick={() => handleDeliver(d._id)}
                          className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                        >
                          {loadingId === d._id
                            ? "Updating..."
                            : "Deliver"}
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* NGO History */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">My History</h2>

          {history.length === 0 ? (
            <p className="text-gray-500">No history yet.</p>
          ) : (
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h._id} className="border p-4 rounded-lg">
                  <h3 className="font-semibold">{h.foodName}</h3>
                  <p className="text-sm">
                    Donor: {h.donor?.name} ({h.donor?.email})
                  </p>
                  <p className="text-sm">Quantity: {h.quantity}</p>
                  <p className="text-sm font-semibold">
                    Status: {h.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
