import { Clock, LayoutGrid, Users } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BookingDatePicker } from '../../booking/components/BookingDatePicker';
import type { BookingSelectOption } from '../../booking/components/BookingListSelect';
import { BookingListSelect } from '../../booking/components/BookingListSelect';
import { TableSelector } from '../../booking/components/TableSelector';
import { fetchDiningAreas, fetchTableAvailability } from '../../booking/lib/bookingApi';
import { AVAILABLE_TIME_SLOTS } from '../../booking/lib/bookingTimeSlots';
import { BOOKING_GUEST_COUNTS } from '../../booking/lib/guestCountOptions';
import type { DiningArea, DiningAreaId, TableWithAvailability } from '../../booking/types/booking';
import { getTodayIsoDate, getTomorrowIsoDate } from '../lib/staffDateUtils';

/**
 * @description Live floor plan using the same table cards as the public reservation flow.
 * @returns {JSX.Element} Floor section.
 */
export function StaffFloorView() {
  const { t, i18n } = useTranslation();
  const [areas, setAreas] = useState<DiningArea[]>([]);
  const [areaId, setAreaId] = useState<DiningAreaId>('restaurant');
  const [date, setDate] = useState(getTomorrowIsoDate());
  const [time, setTime] = useState('13:00');
  const [guests, setGuests] = useState(4);
  const [tables, setTables] = useState<TableWithAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    void fetchDiningAreas()
      .then((rows) => {
        if (!mounted) {
          return;
        }
        setAreas(rows);
        if (rows[0]?.id) {
          setAreaId(rows[0].id);
        }
      })
      .catch(() => {
        if (mounted) {
          setLoadError(t('staff.dashboard.floorLoadError'));
        }
      });
    return () => {
      mounted = false;
    };
  }, [t]);

  const areaOptions = useMemo((): BookingSelectOption[] => {
    return areas.map((area) => ({ value: area.id, label: area.name }));
  }, [areas]);

  const timeOptions = useMemo((): BookingSelectOption[] => {
    const lunchLabel = t('bookingPage.slots.lunch');
    const dinnerLabel = t('bookingPage.slots.dinner');
    return AVAILABLE_TIME_SLOTS.map((slot) => {
      const isLunch = slot.startsWith('13') || slot.startsWith('14') || slot.startsWith('15');
      return {
        value: slot,
        label: slot,
        group: isLunch ? lunchLabel : dinnerLabel,
      };
    });
  }, [t]);

  const guestOptions = useMemo((): BookingSelectOption[] => {
    return BOOKING_GUEST_COUNTS.map((count) => ({
      value: String(count),
      label: t('staff.dashboard.guestsCount', { count }),
    }));
  }, [t]);

  const areaName = areas.find((area) => area.id === areaId)?.name ?? areaId;

  const formattedDate = useMemo(() => {
    try {
      const [y, m, d] = date.split('-').map(Number);
      return new Date(y, m - 1, d).toLocaleDateString(i18n.language, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return date;
    }
  }, [date, i18n.language]);

  /**
   * @description Loads table availability from the booking API.
   * @returns {Promise<void>}
   */
  const loadFloor = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const rows = await fetchTableAvailability(areaId, date, time, guests, null);
      setTables(rows);
      setLoaded(true);
    } catch {
      setLoadError(t('staff.dashboard.floorAvailabilityError'));
      setTables([]);
    } finally {
      setLoading(false);
    }
  }, [areaId, date, guests, t, time]);

  useEffect(() => {
    if (areas.length > 0) {
      void loadFloor();
    }
  }, [areas.length, loadFloor]);

  return (
    <div className="staff-dashboard__page">
      <header className="staff-dashboard__page-head">
        <h1 className="staff-dashboard__page-title">{t('staff.dashboard.floorTitle')}</h1>
        <p className="staff-dashboard__page-lead">{t('staff.dashboard.floorLeadLive')}</p>
      </header>

      <div className="staff-dashboard__panel staff-dashboard__floor-toolbar booking-page__card">
        <div className="staff-dashboard__floor-fields">
          <BookingDatePicker
            label={t('staff.dashboard.floorDateLabel')}
            ariaLabel={t('staff.dashboard.floorDateLabel')}
            value={date}
            min={getTodayIsoDate()}
            onChange={setDate}
          />
          <BookingListSelect
            label={t('staff.dashboard.floorTimeLabel')}
            ariaLabel={t('staff.dashboard.floorTimeLabel')}
            value={time}
            displayValue={time}
            icon={Clock}
            options={timeOptions}
            onChange={setTime}
          />
          <BookingListSelect
            label={t('staff.dashboard.floorGuestsLabel')}
            ariaLabel={t('staff.dashboard.floorGuestsLabel')}
            value={String(guests)}
            displayValue={t('staff.dashboard.guestsCount', { count: guests })}
            icon={Users}
            options={guestOptions}
            onChange={(value) => setGuests(Number(value))}
          />
          <BookingListSelect
            label={t('staff.dashboard.floorAreaLabel')}
            ariaLabel={t('staff.dashboard.floorAreaLabel')}
            value={areaId}
            displayValue={areaName}
            icon={LayoutGrid}
            options={areaOptions}
            onChange={(value) => setAreaId(value as DiningAreaId)}
          />
        </div>
        <button
          type="button"
          className="staff-dashboard__primary-btn staff-dashboard__floor-refresh"
          disabled={loading || areas.length === 0}
          onClick={() => void loadFloor()}
        >
          {loading ? t('staff.dashboard.floorLoading') : t('staff.dashboard.floorRefresh')}
        </button>
        {loadError ? <p className="staff-dashboard__inline-error">{loadError}</p> : null}
      </div>

      {loaded ? (
        <TableSelector
          tables={tables}
          selectedTableId={null}
          formattedDate={formattedDate}
          time={time}
          guests={guests}
          areaName={areaName}
          isLoading={loading}
          readOnly
          onSelectTable={() => undefined}
        />
      ) : null}
    </div>
  );
}
