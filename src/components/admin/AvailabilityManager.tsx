import React, { useState, useEffect } from 'react';
import { Calendar, Check, X, Save, Lock, Unlock } from 'lucide-react';

interface AvailabilityManagerProps {
  propertyId: string;
}

interface DateAvailability {
  date: string;
  isAvailable: boolean;
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
  const [bookings, setBookings] = useState<any[]>([]);

  // Fetch availability data
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true);
        
        // Fetch property availability
        const availabilityResponse = await fetch(`/api/properties/${propertyId}/availability`);
        
        if (!availabilityResponse.ok) {
          throw new Error('Failed to fetch availability');
        }
        
        const availabilityData = await availabilityResponse.json();
        setUnavailableDates(availabilityData.unavailableDates || []);
        setIsPropertyBookable(availabilityData.isBookable ?? true);
        
        // Fetch bookings for this property
        const bookingsResponse = await fetch(`/api/bookings?propertyId=${propertyId}&status=completed`);
        
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setBookings(bookingsData.bookings || []);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load availability data');
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchAvailability();
    }
  }, [propertyId]);

  // Toggle property bookable status
  const togglePropertyBookable = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch(`/api/properties/${propertyId}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isBookable: !isPropertyBookable
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update property status');
      }
      
      setIsPropertyBookable(!isPropertyBookable);
      setSuccess(`Property is now ${!isPropertyBookable ? 'available' : 'unavailable'} for booking`);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to update property status');
    } finally {
      setSaving(false);
    }
  };

  // Generate calendar days for current month
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const firstDayIndex = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const lastDate = lastDay.getDate();
    
    // Previous month days to show
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
    
    // Current month days
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
    
    // Next month days to fill the grid
    const nextMonthDays = [];
    const remainingDays = 42 - (prevMonthDays.length + currentMonthDays.length); // 6 rows of 7 days
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

  // Check if a date is unavailable
  const isDateUnavailable = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return unavailableDates.includes(dateStr);
  };

  // Check if a date is booked
  const isDateBooked = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    
    // Check if this date falls within any booking
    return bookings.some(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      const current = new Date(date);
      
      // Reset time part for accurate comparison
      checkIn.setHours(0, 0, 0, 0);
      checkOut.setHours(0, 0, 0, 0);
      current.setHours(0, 0, 0, 0);
      
      return current >= checkIn && current < checkOut;
    });
  };

  // Go to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Go to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Toggle date selection
  const toggleDateSelection = (date: Date, isCurrentMonth: boolean, isBooked: boolean) => {
    // Don't allow toggling dates from other months or booked dates
    if (!isCurrentMonth || isBooked) return;
    
    const dateStr = formatDate(date);
    const isUnavailable = isDateUnavailable(date);
    
    // Check if this date is already in our selectedDates array
    const existingIndex = selectedDates.findIndex(d => d.date === dateStr);
    
    if (existingIndex >= 0) {
      // Remove it from selection
      setSelectedDates(prev => prev.filter((_, i) => i !== existingIndex));
    } else {
      // Add it to selection with opposite availability
      setSelectedDates(prev => [...prev, { date: dateStr, isAvailable: isUnavailable }]);
    }
  };

  // Check if a date is in the selectedDates array
  const isDateSelected = (date: Date) => {
    const dateStr = formatDate(date);
    return selectedDates.some(d => d.date === dateStr);
  };

  // Get the new availability status for a date
  const getNewAvailabilityStatus = (date: Date) => {
    const dateStr = formatDate(date);
    const selected = selectedDates.find(d => d.date === dateStr);
    
    if (selected) {
      return selected.isAvailable;
    }
    
    return !isDateUnavailable(date);
  };

  // Save availability changes
  const saveAvailabilityChanges = async () => {
    if (selectedDates.length === 0) return;
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const response = await fetch(`/api/properties/${propertyId}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dates: selectedDates,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update availability');
      }
      
      // Update local state
      const newUnavailableDates = [...unavailableDates];
      
      for (const { date, isAvailable } of selectedDates) {
        if (isAvailable) {
          // Remove from unavailable dates
          const index = newUnavailableDates.indexOf(date);
          if (index >= 0) {
            newUnavailableDates.splice(index, 1);
          }
        } else {
          // Add to unavailable dates if not already there
          if (!newUnavailableDates.includes(date)) {
            newUnavailableDates.push(date);
          }
        }
      }
      
      setUnavailableDates(newUnavailableDates);
      setSelectedDates([]);
      setSuccess('Availability updated successfully');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to update availability');
    } finally {
      setSaving(false);
    }
  };

  // Get day of the month
  const getDayOfMonth = (date: Date) => {
    return date.getDate();
  };

  // Get month name and year
  const getMonthAndYear = () => {
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
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
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
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
        
        {/* Status Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}
        
        {/* Property Availability Status */}
        <div className={`mb-6 p-4 rounded-md ${
          isPropertyBookable 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          <div className="flex items-start">
            {isPropertyBookable ? (
              <Check className="h-5 w-5 mr-2 mt-0.5" />
            ) : (
              <X className="h-5 w-5 mr-2 mt-0.5" />
            )}
            <div>
              <p className="font-medium">
                This property is currently {isPropertyBookable ? 'available' : 'unavailable'} for booking
              </p>
              <p className="text-sm opacity-90 mt-1">
                {isPropertyBookable 
                  ? 'Guests can book this property if specific dates are available.'
                  : 'This property is hidden from booking. Existing bookings are not affected.'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Selected Dates Actions */}
        {selectedDates.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center justify-between">
              <p className="text-blue-700">
                <span className="font-medium">{selectedDates.length}</span> {selectedDates.length === 1 ? 'date' : 'dates'} selected
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
      
      {/* Calendar */}
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {getMonthAndYear()}
          </h3>
          
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="h-5 w-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Weekday Headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
          
          {/* Calendar Days */}
          {getCalendarDays().map((day, index) => {
            const isSelected = isDateSelected(day.date);
            const newStatus = getNewAvailabilityStatus(day.date);
            
            return (
              <button
                key={index}
                onClick={() => toggleDateSelection(day.date, day.isCurrentMonth, day.isBooked)}
                disabled={!day.isCurrentMonth || day.isBooked}
                className={`
                  relative h-12 p-1 rounded-md transition-colors
                  ${!day.isCurrentMonth ? 'opacity-30' : ''}
                  ${isSelected 
                    ? newStatus
                      ? 'bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/40'
                      : 'bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40'
                    : day.isBooked
                      ? 'bg-blue-100 dark:bg-blue-900/30 cursor-not-allowed'
                      : day.isUnavailable
                        ? 'bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-800/30'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <span className={`
                  flex justify-center items-center h-full w-full text-sm rounded-md
                  ${day.isBooked
                    ? 'text-blue-700 dark:text-blue-400 font-medium'
                    : day.isUnavailable && day.isCurrentMonth
                      ? 'text-red-700 dark:text-red-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }
                `}>
                  {getDayOfMonth(day.date)}
                </span>
                
                {/* Indicators */}
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
        
        {/* Legend */}
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
      </div>
    </div>
  );
}

export default AvailabilityManager;