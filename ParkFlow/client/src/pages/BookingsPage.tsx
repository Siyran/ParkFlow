import { useEffect, useMemo, useState } from 'react';
import { createBooking, listMyBookings, listSpots, type Booking, type ParkingSpot } from '../lib/api';
import Button from '../components/Button';
import Card from '../components/Card';
import { IconMap, IconClock } from '../components/Icon';

export default function BookingsPage() {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [spotId, setSpotId] = useState('');
  const [durationHours, setDurationHours] = useState(1);
  const [message, setMessage] = useState('');

  const selectedSpot = useMemo(() => spots.find((spot) => spot.id === spotId) ?? spots[0], [spots, spotId]);

  async function loadData() {
    const [spotsResponse, bookingsResponse] = await Promise.all([listSpots(), listMyBookings()]);

    if (spotsResponse.success && spotsResponse.data) {
      setSpots(spotsResponse.data.spots);
      setSpotId((current) => current || spotsResponse.data.spots[0]?.id || '');
    }

    if (bookingsResponse.success && bookingsResponse.data) {
      setBookings(bookingsResponse.data.bookings);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedSpot) {
      setMessage('No parking spots available yet.');
      return;
    }

    const response = await createBooking({
      spotId: selectedSpot.id,
      durationHours,
      paymentMethod: 'wallet',
    });

    setMessage(response.message);

    if (response.success) {
      await loadData();
    }
  }

  return (
    <section>
      <h2 className="text-lg font-bold">Bookings</h2>
      <form onSubmit={handleSubmit} className="grid gap-3 max-w-lg mt-3">
        <label>
          Choose spot
          <select value={spotId} onChange={(event) => setSpotId(event.target.value)}>
            {spots.map((spot) => (
              <option key={spot.id} value={spot.id}>
                {spot.name} — {spot.availableSlots} slots left
              </option>
            ))}
          </select>
        </label>

        <label>
          Duration
          <select value={durationHours} onChange={(event) => setDurationHours(Number(event.target.value))}>
            <option value={1}>1 hour — Rs. 60</option>
            <option value={2}>2 hours — Rs. 120</option>
            <option value={3}>3 hours — Rs. 180</option>
            <option value={10}>Full day (10 hours) — Rs. 400</option>
          </select>
        </label>

        <div className="flex gap-3">
          <Button type="submit"><IconClock variant="solid"/> Book spot</Button>
          <Button type="button" variant="ghost" onClick={() => setMessage('')}>Clear</Button>
        </div>
      </form>

      {message ? <p style={{ marginTop: 12 }}>{message}</p> : null}

      <div className="mt-6">
        <h3 className="text-md font-semibold">Available spots</h3>
        <ul className="list-clean mt-3 space-y-3">
          {spots.map((spot) => (
            <li key={spot.id} className="list-item">
              <Card>
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{spot.name}</div>
                    <div className="text-sm text-gray-500">{spot.address}</div>
                  </div>
                  <div className="text-sm text-gray-600">{spot.availableSlots}/{spot.totalSlots} slots</div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-semibold">My bookings</h3>
        <ul className="list-clean mt-3 space-y-3">
          {bookings.map((booking) => (
            <li key={booking.id} className="list-item">
              <Card>
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{booking.spotName}</div>
                    <div className="text-sm text-gray-500">{booking.durationHours}h • {booking.startTime}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">Rs. {booking.amountPaid.toFixed(2)}</div>
                    <div className="text-sm text-gray-500">{booking.status}</div>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
