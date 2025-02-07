import CreateWeek from '../components/weeks/CreateWeek';
import WeeksList from '../components/weeks/GetWeeks';
import Week from '../components/weeks/Week';
const Weeks = () => {
  return (
    <div>
      {/* <CreateWeek />
       */}
      <Week />
      <WeeksList />
    </div>
  );
};
export default Weeks;
