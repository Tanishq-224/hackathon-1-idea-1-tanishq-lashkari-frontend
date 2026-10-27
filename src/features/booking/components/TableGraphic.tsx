import type { TableStatus } from '../types/booking';

type TableGraphicProps = {
  status: TableStatus;
  capacity?: number;
  className?: string;
};

/**
 * @description Renders a clean SVG visual of a dining table with chairs,
 * color-coded according to the table's availability status.
 *
 * @param {TableGraphicProps} props - Component props.
 * @returns {JSX.Element} SVG table illustration.
 */
export function TableGraphic({ status, className = 'w-10 h-7' }: TableGraphicProps) {
  // Color configuration based on status
  const colors: Record<
    TableStatus,
    { table: string; chairs: string; fill: string }
  > = {
    available: {
      table: '#15803D', // Emerald-700
      chairs: '#15803D',
      fill: '#DCFCE7', // Emerald-100
    },
    selected: {
      table: '#2563EB', // Blue-600
      chairs: '#2563EB',
      fill: '#DBEAFE', // Blue-100
    },
    booked: {
      table: '#DC2626', // Red-600
      chairs: '#DC2626',
      fill: '#FEE2E2', // Red-100
    },
    unavailable: {
      table: '#9CA3AF', // Gray-400
      chairs: '#9CA3AF',
      fill: '#F3F4F6', // Gray-100
    },
  };

  const scheme = colors[status] ?? colors.available;

  return (
    <svg
      viewBox="0 0 54 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Top Chairs */}
      <rect
        x="13"
        y="1"
        width="11"
        height="4"
        rx="2"
        stroke={scheme.chairs}
        strokeWidth="1.75"
        fill={scheme.fill}
      />
      <rect
        x="30"
        y="1"
        width="11"
        height="4"
        rx="2"
        stroke={scheme.chairs}
        strokeWidth="1.75"
        fill={scheme.fill}
      />

      {/* Main Table Top */}
      <rect
        x="8"
        y="8"
        width="38"
        height="20"
        rx="4"
        stroke={scheme.table}
        strokeWidth="2"
        fill={scheme.fill}
      />

      {/* Table Center Plank Lines (Cider house wooden table feel) */}
      <line
        x1="12"
        y1="18"
        x2="42"
        y2="18"
        stroke={scheme.table}
        strokeWidth="1.25"
        strokeDasharray="2 2"
        opacity="0.6"
      />

      {/* Bottom Chairs */}
      <rect
        x="13"
        y="31"
        width="11"
        height="4"
        rx="2"
        stroke={scheme.chairs}
        strokeWidth="1.75"
        fill={scheme.fill}
      />
      <rect
        x="30"
        y="31"
        width="11"
        height="4"
        rx="2"
        stroke={scheme.chairs}
        strokeWidth="1.75"
        fill={scheme.fill}
      />

      {/* Left and Right Edge Chair Accents */}
      <rect
        x="1"
        y="13"
        width="4"
        height="10"
        rx="2"
        stroke={scheme.chairs}
        strokeWidth="1.75"
        fill={scheme.fill}
      />
      <rect
        x="49"
        y="13"
        width="4"
        height="10"
        rx="2"
        stroke={scheme.chairs}
        strokeWidth="1.75"
        fill={scheme.fill}
      />
    </svg>
  );
}
