import IncomeMonthCard from "./Cards/IncomeMonthCard";
import CostumersCard from "./Cards/CostumersCard";
import IncomeByPeriodCard from "./Cards/IncomeByPeriodCard";
import OperationsDayCard from "./Cards/OperationsDayCard";
import OperationsMonthCard from "./Cards/OperationsMonthCard";
import LastOperationsCard from "./Cards/LastOperationsCard";

export default function Dashboard() {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <IncomeMonthCard />
        <OperationsMonthCard />
        <OperationsDayCard />
        <CostumersCard />
      </div>
      <div className="grid grid-cols-2 2xl:grid-cols-3 mt-4 gap-4">
        <IncomeByPeriodCard />
        <LastOperationsCard />
      </div>
    </div>
  );
}
