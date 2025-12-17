import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import HomePage from "@/components/HomePage/index";

export const metadata = {
    title: "Home",
};

const Homepage = () => {
    return (
        <>
            <Breadcrumb pageName="Home" />
            <HomePage />
        </>
    );
};

export default Homepage;
