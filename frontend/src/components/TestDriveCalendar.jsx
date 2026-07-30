import Calendar from "react-calendar";
import "../styles/Calendar.css";
export default function TestDriveCalendar({
  slots,
  selectedDate,
  setSelectedDate,
  selectedSlot,
  setSelectedSlot,
}) {
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // Group slots by date
  const availableDates = slots.reduce((acc, slot) => {
    const date = formatDate(new Date(slot));

    if (!acc[date]) {
      acc[date] = [];
    }

    acc[date].push(slot);

    return acc;
  }, {});

  const selectedDateSlots = availableDates[formatDate(selectedDate)] || [];

  console.log("Selected Date:", formatDate(selectedDate));
  console.log(slots);
  console.log("Available Dates:", availableDates);

  return (
    <div>
      <Calendar
        value={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
          setSelectedSlot(null);
        }}
        tileDisabled={({ date }) => {
          const key = formatDate(date);

          return !availableDates[key];
        }}
        className="
          rounded-2xl
          border-none
          shadow-sm
        "
      />

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Available Time Slots</h3>

        {selectedDateSlots.length === 0 ? (
          <p className="text-gray-500">Select a date with availability.</p>
        ) : (
          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-4
            "
          >
            {selectedDateSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => {
                  console.log("Clicked slot:", slot);
                  setSelectedSlot(slot);
                }}
                className={`
                    p-4
                    rounded-2xl
                    border
                    font-medium
                    ${
                      selectedSlot === slot
                        ? "bg-gray-950 text-white"
                        : "bg-white hover:border-gray-900"
                    }
                `}
              >
                {new Date(slot).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
