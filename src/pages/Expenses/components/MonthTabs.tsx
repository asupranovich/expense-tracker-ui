import React, {useMemo} from "react";

type Props = {
  activeMonth: string,
  setActiveMonth: (month: string) => void,
}

function MonthTabs({activeMonth, setActiveMonth}: Props) {
  const months = useMemo(() => {
    const list = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const label = date.toLocaleString(undefined, {month: 'long', year: 'numeric'});
      list.push({key, label});
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