import {Expense} from "@/types";
import {PieChart, Pie, Cell, Tooltip, Legend} from 'recharts';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6699', '#33CCFF', '#66CC66', '#FF6666',
  '#9966FF', '#FF9933', '#0074D9', '#2ECC40', '#FF851B', '#FF4136', '#B10DC9', '#3D9970',
  '#85144b', '#111111', '#AAAAAA',
];

interface Props {
  expenses: Expense[],
}

function Statistics({expenses}: Props) {
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2);
  const categoryAmounts = new Map<string, number>();
  expenses.forEach(expense => {
    const category = expense.category;
    const categoryAmount = categoryAmounts.get(category.name);
    if (categoryAmount) {
      categoryAmounts.set(category.name, categoryAmount + expense.amount);
    } else {
      categoryAmounts.set(category.name, expense.amount);
    }
  });

  const data = Array.from(categoryAmounts.entries()).map(([name, amount]) => ({
    name,
    value: amount
  }));

  return (
      <fieldset>
        <legend>Statistics</legend>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
            </tr>
            </thead>
            <tbody>
            {Array.from(categoryAmounts.entries()).sort((a, b) => b[1] - a[1]).map(([categoryName, amount]) => (
                <tr key={categoryName}>
                  <td>{categoryName}</td>
                  <td>${amount.toFixed(2)}</td>
                </tr>
            ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total Amount</td>
                <td>${totalAmount}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <PieChart width={350} height={300}>
          <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
          >
            {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]}/>
            ))}
          </Pie>
          <Tooltip formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name]}/>
          <Legend/>
        </PieChart>

      </fieldset>
  );
}

export default Statistics;