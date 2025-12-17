import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CalendarBox from "@/components/CalenderBox";

export const metadata = {
  title: "Calendar Page",
};

const CalendarPage = () => {
  return (
    <>
      <Breadcrumb pageName="Calendar" />
      <CalendarBox />
    </>
  );
};

export default CalendarPage;

