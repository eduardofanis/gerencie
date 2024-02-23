import IncomeMonthChart from "./Cards/IncomeMonthChart";
import CostumersChart from "./Cards/CostumersChart";
import IncomeByPeriodChart from "./Cards/IncomeByPeriodChart";
import OperationsDayChart from "./Cards/OperationsDayChart";
import OperationsMonthChart from "./Cards/OperationsMonthChart";
import LastOperationsCard from "./Cards/LastOperationsCard";

export default function Dashboard() {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <IncomeMonthChart />
        <OperationsMonthChart />
        <OperationsDayChart />
        <CostumersChart />
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 mt-4 gap-4">
        <IncomeByPeriodChart />
        <LastOperationsCard />
      </div>
    </div>
  );
}
