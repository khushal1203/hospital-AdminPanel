"use client";

import { useState, useEffect } from "react";
import { MdClose, MdPerson, MdBloodtype, MdHeight, MdMonitorWeight, MdSearch } from "react-icons/md";

export default function DonorSelectionModal({ isOpen, onClose, onSelect, requestId }) {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen && requestId) {
      fetchMatchingDonors();
    }
  }, [isOpen, requestId]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDonors(donors);
    } else {
      const filtered = donors.filter(donor => 
        donor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.cast?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.nationality?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDonors(filtered);
    }
  }, [searchTerm, donors]);

  const fetchMatchingDonors = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_END_POINT}/donor-requests/${requestId}/matching-donors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        console.log('Donor data:', data.donors[0]); // Debug log
        setDonors(data.donors || []);
        setFilteredDonors(data.donors || []);
        if (data.donors.length === 0) {
          setError("No matching donors found for this request criteria.");
        }
      } else {
        setError(data.message || "Failed to fetch matching donors");
      }
    } catch (error) {
      console.error("Error fetching matching donors:", error);
      setError("Failed to fetch matching donors");
    } finally {
      setLoading(false);
    }
  };

  const handleAllot = () => {
    if (selectedDonor) {
      onSelect(requestId, selectedDonor);
      onClose();
      setSelectedDonor(null);
      setSearchTerm("");
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedDonor(null);
    setError("");
    setSearchTerm("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-5xl max-h-[90vh] rounded-lg bg-white shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3" style={{ backgroundColor: "#f3f0f7" }}>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Select Donor</h3>
            <p className="text-xs text-gray-600">Donor Allotment</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <MdClose className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Search donors by name, blood group, cast, or nationality..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none text-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600">Finding matching donors...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <MdPerson className="h-full w-full" />
              </div>
              <p className="mt-4 text-gray-500">{error}</p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                {searchTerm ? `Found ${filteredDonors.length} donor${filteredDonors.length !== 1 ? 's' : ''} matching "${searchTerm}"` : `Found ${donors.length} matching donor${donors.length !== 1 ? 's' : ''}`}
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {filteredDonors.length === 0 ? (
                  <div className="text-center py-8">
                    <MdPerson className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-4 text-gray-500">{searchTerm ? 'No donors found matching your search' : 'No matching donors found'}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredDonors.map((donor) => (
                      <div
                        key={donor._id}
                        className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                          selectedDonor?._id === donor._id
                            ? "border-green-500 bg-green-50 shadow-md"
                            : "border-gray-200 hover:bg-gray-50 hover:shadow-sm"
                        }`}
                        onClick={() => setSelectedDonor(donor)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            {donor.donorImage ? (
                              <img
                                src={donor.donorImage}
                                alt={donor.fullName}
                                className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                              />
                            ) : (
                              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 border-2 border-gray-200">
                                <MdPerson className="h-8 w-8 text-green-600" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {donor.fullName}
                              </h4>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                                <span>{donor.age || 'N/A'} years</span>
                                <span>|</span>
                                <span className="flex items-center gap-1">
                                  <MdBloodtype className="h-4 w-4 text-red-500" />
                                  {donor.bloodGroup || 'N/A'}
                                </span>
                                <span>|</span>
                                <span>{donor.eyeColor || 'N/A'} eyes</span>
                                <span>|</span>
                                <span>{donor.hairColor || 'N/A'} hair</span>
                                <span>|</span>
                                <span>{donor.weight || 'N/A'} kg</span>
                                <span>|</span>
                                <span>{donor.height || 'N/A'} cm</span>
                                <span>|</span>
                                <span>{donor.cast || 'N/A'}</span>
                                <span>|</span>
                                <span>{donor.nationality || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAllot}
              disabled={!selectedDonor || loading}
              className="rounded-lg px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#402575" }}
            >
              Allot Donor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}