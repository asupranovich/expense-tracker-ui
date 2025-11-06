import React, {useMemo} from "react";

type Props = {
  activeMonth: string,
  setActiveMonth: (month: string) => void,
}

export function formatMonthKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`; // YYYY-MM
}

function readableMonth(monthKey: string) {
  const [year, month] = monthKey.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleString(undefined, { month: 'long', year: 'numeric' });
}

function MonthTabs({activeMonth, setActiveMonth}: Props) {
  const months = useMemo(() => {
    const list = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = formatMonthKey(date);
      list.push({ key, label: readableMonth(key) });
    }
    return list;
  }, []);

  return (
      <div className="tabs">
        {months.map((month) => (
            <button
                key={month.key}
                className={`tab ${activeMonth === month.key ? 'active' : ''}`}
                onClick={() => setActiveMonth(month.key)}
                disabled={activeMonth === month.key}
            >
              {month.label}
            </button>
        ))}
      </div>
  );
}

export default MonthTabs;