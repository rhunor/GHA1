import React, { useState, useEffect } from "react";
import { Calendar, Check, X, Save, Lock, Unlock } from "lucide-react";

interface AvailabilityManagerProps {
  propertyId: string;
}

interface DateAvailability {
  date: string;
  isAvailable: boolean;
}

interface Booking {
  _id: string;
  name: string;
  email: string;
  phone: string;
  reference: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  paymentStatus: string;
  createdAt: Date;
}

const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({ propertyId }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<DateAvailability[]>([]);
  const [isPropertyBookable, setIsPropertyBookable] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true);

        const availabilityResponse = await fetch(`/api/properties/${propertyId}/availability`);

        if (!availabilityResponse.ok) {
          throw new Error("Failed to fetch availability");
        }

        const availabilityData = await availabilityResponse.json();
        setUnavailableDates(availabilityData.unavailableDates || []);
        setIsPropertyBookable(availabilityData.isBookable ?? true);

        const bookingsResponse = await fetch(
          `/api/bookings?propertyId=${propertyId}&status=completed`
        );

        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setBookings(bookingsData.bookings || []);
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to load availability data");
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchAvailability();
    }
  }, [propertyId]);

  const togglePropertyBookable = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`/api/properties/${propertyId}/availability`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isBookable: !isPropertyBookable,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update property status");
      }

      setIsPropertyBookable(!isPropertyBookable);
      setSuccess(`Property is now ${!isPropertyBookable ? "available" : "unavailable"} for booking`);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to update property status");
    } finally {
      setSaving(false);
    }
  };

  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const firstDayIndex = firstDay.getDay();

    const lastDay = new Date(year, month + 1, 0);
    const lastDate = lastDay.getDate();

    const prevMonthLastDate = new Date(year, month, 0).getDate();
    const prevMonthDays = [];
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDate - i);
      prevMonthDays.push({
        date,
        isCurrentMonth: false,
        isUnavailable: isDateUnavailable(date),
        isBooked: isDateBooked(date),
      });
    }

    const currentMonthDays = [];
    for (let i = 1; i <= lastDate; i++) {
      const date = new Date(year, month, i);
      currentMonthDays.push({
        date,
        isCurrentMonth: true,
        isUnavailable: isDateUnavailable(date),
        isBooked: isDateBooked(date),
      });
    }

    const nextMonthDays = [];
    const remainingDays = 42 - (prevMonthDays.length + currentMonthDays.length);
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      nextMonthDays.push({
        date,
        isCurrentMonth: false,
        isUnavailable: isDateUnavailable(date),
        isBooked: isDateBooked(date),
      });
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const isDateUnavailable = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return unavailableDates.includes(dateStr);
  };

  const isDateBooked = (date: Date) => {
    return bookings.some((booking) => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const current = new Date(date);

      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);
      current.setHours(0, 0, 0, 0);

      return current >= checkIn && current < checkOut;
    });
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const toggleDateSelection = (date: Date, isCurrentMonth: boolean, isBooked: boolean) => {
    if (!isCurrentMonth) return;
    
    // Allow selecting booked dates (removed the isBooked restriction)
    const dateStr = formatDate(date);
    const isUnavailable = isDateUnavailable(date);

    const existingIndex = selectedDates.findIndex((d) => d.date === dateStr);

    if (existingIndex >= 0) {
      setSelectedDates((prev) => prev.filter((_, i) => i !== existingIndex));
    } else {
      setSelectedDates((prev) => [...prev, { date: dateStr, isAvailable: isUnavailable }]);
    }

    // If the date is booked, warn the admin
    if (isBooked && existingIndex < 0) {
      setSuccess(null); // Clear any existing success message
      setError("Warning: You're modifying a date with an existing booking. This will affect the guest's reservation.");
    }
  };

  const isDateSelected = (date: Date) => {
    const dateStr = formatDate(date);
    return selectedDates.some((d) => d.date === dateStr);
  };

  const getNewAvailabilityStatus = (date: Date) => {
    const dateStr = formatDate(date);
    const selected = selectedDates.find((d) => d.date === dateStr);

    if (selected) {
      return selected.isAvailable;
    }

    return !isDateUnavailable(date);
  };

  const saveAvailabilityChanges = async () => {
    if (selectedDates.length === 0) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`/api/properties/${propertyId}/availability`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dates: selectedDates,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update availability");
      }

      const newUnavailableDates = [...unavailableDates];

      for (const { date, isAvailable } of selectedDates) {
        if (isAvailable) {
          const index = newUnavailableDates.indexOf(date);
          if (index >= 0) {
            newUnavailableDates.splice(index, 1);
          }
        } else {
          if (!newUnavailableDates.includes(date)) {
            newUnavailableDates.push(date);
          }
        }
      }

      setUnavailableDates(newUnavailableDates);
      setSelectedDates([]);
      setSuccess("Availability updated successfully");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to update availability");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }
      
      // Update the local state to remove the deleted booking
      setBookings(bookings.filter(booking => booking._id !== bookingId));
      
      // Refresh availability data
      const availabilityResponse = await fetch(`/api/properties/${propertyId}/availability`);
      if (availabilityResponse.ok) {
        const availabilityData = await availabilityResponse.json();
        setUnavailableDates(availabilityData.unavailableDates || []);
      }
      
      setSuccess("Booking deleted successfully. The dates are now available for new bookings.");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to delete booking. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleBulkDateSelection = (makeAvailable: boolean) => {
    const startDateInput = document.getElementById('bulkStartDate') as HTMLInputElement;
    const endDateInput = document.getElementById('bulkEndDate') as HTMLInputElement;
    
    if (!startDateInput.value || !endDateInput.value) {
      setError("Please select both start and end dates");
      return;
    }
    
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    
    if (endDate < startDate) {
      setError("End date must be after start date");
      return;
    }
    
    const newSelectedDates: DateAvailability[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      newSelectedDates.push({
        date: formatDate(current),
        isAvailable: makeAvailable
      });
      current.setDate(current.getDate() + 1);
    }
    
    setSelectedDates(newSelectedDates);
    setError(null);
    setSuccess(`Selected ${newSelectedDates.length} dates. Click "Save Changes" to apply.`);
  };

  const renderBulkDateSelection = () => {
    return (
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Bulk Date Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input 
              type="date"
              id="bulkStartDate"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input 
              type="date"
              id="bulkEndDate"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-600 dark:text-white"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => handleBulkDateSelection(false)}
            className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200"
          >
            Mark Unavailable
          </button>
          <button
            onClick={() => handleBulkDateSelection(true)}
            className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200"
          >
            Mark Available
          </button>
        </div>
      </div>
    );
  };

  const renderBookingsSection = () => {
    return (
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Existing Bookings</h3>
        
        {bookings.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No bookings found for this property.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Guest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Check In</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Check Out</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{booking.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(booking.checkIn).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{booking.reference}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleDeleteBooking(booking._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const getDayOfMonth = (date: Date) => {
    return date.getDate();
  };

  const getMonthAndYear = () => {
    const options: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };
    return currentMonth.toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            Manage Availability
          </h2>

          <button
            onClick={togglePropertyBookable}
            disabled={saving}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
              isPropertyBookable
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {isPropertyBookable ? (
              <>
                <Lock className="h-4 w-4 mr-1" />
                Make Unavailable
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4 mr-1" />
                Make Available
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{success}</div>
        )}

        <div
          className={`mb-6 p-4 rounded-md ${
            isPropertyBookable
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <div className="flex items-start">
            {isPropertyBookable ? (
              <Check className="h-5 w-5 mr-2 mt-0.5" />
            ) : (
              <X className="h-5 w-5 mr-2 mt-0.5" />
            )}
            <div>
              <p className="font-medium">
                This property is currently {isPropertyBookable ? "available" : "unavailable"} for booking
              </p>
              <p className="text-sm opacity-90 mt-1">
                {isPropertyBookable
                  ? "Guests can book this property if specific dates are available."
                  : "This property is hidden from booking. Existing bookings are not affected."}
              </p>
            </div>
          </div>
        </div>

        {selectedDates.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center justify-between">
              <p className="text-blue-700">
                <span className="font-medium">{selectedDates.length}</span>{" "}
                {selectedDates.length === 1 ? "date" : "dates"} selected
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedDates([])}
                  className="px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                >
                  Clear
                </button>
                <button
                  onClick={saveAvailabilityChanges}
                  disabled={saving}
                  className="px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90 flex items-center"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-1"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3 w-3 mr-1" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        {renderBulkDateSelection()}

        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              className="h-5 w-5 text-gray-600 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{getMonthAndYear()}</h3>

          <button
            onClick={goToNextMonth}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              className="h-5 w-5 text-gray-600 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
            >
              {day}
            </div>
          ))}

          {getCalendarDays().map((day, index) => {
            const isSelected = isDateSelected(day.date);
            const newStatus = getNewAvailabilityStatus(day.date);

            return (
              <button
                key={index}
                onClick={() => toggleDateSelection(day.date, day.isCurrentMonth, day.isBooked)}
                disabled={!day.isCurrentMonth}
                className={`
                  relative h-12 p-1 rounded-md transition-colors
                  ${!day.isCurrentMonth ? "opacity-30" : ""}
                  ${
                    isSelected
                      ? newStatus
                        ? "bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/40"
                        : "bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40"
                      : day.isBooked
                        ? "bg-blue-100 dark:bg-blue-900/30"
                        : day.isUnavailable
                          ? "bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-800/30"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                `}
              >
                <span
                  className={`
                    flex justify-center items-center h-full w-full text-sm rounded-md
                    ${
                      day.isBooked
                        ? "text-blue-700 dark:text-blue-400 font-medium"
                        : day.isUnavailable && day.isCurrentMonth
                          ? "text-red-700 dark:text-red-400"
                          : "text-gray-700 dark:text-gray-300"
                    }
                  `}
                >
                  {getDayOfMonth(day.date)}
                </span>

                {day.isCurrentMonth && (
                  <>
                    {day.isBooked && (
                      <span className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 text-xs text-blue-700 dark:text-blue-400 font-medium">
                        booked
                      </span>
                    )}

                    {isSelected && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center">
            <div className="h-4 w-4 mr-2 bg-blue-100 dark:bg-blue-900/30 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">Booked</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 mr-2 bg-red-50 dark:bg-red-900/20 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">Unavailable</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 mr-2 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"></div>
            <span className="text-gray-700 dark:text-gray-300">Available</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 mr-2 border border-gray-300 dark:border-gray-600 rounded opacity-30"></div>
            <span className="text-gray-700 dark:text-gray-300">Other Months</span>
          </div>
        </div>

        {renderBookingsSection()}
      </div>
    </div>
  );
};

export default AvailabilityManager;