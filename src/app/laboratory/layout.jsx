import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function LaboratoryLayout({ children }) {
    return (
        <DefaultLayout>
            <div className="mx-auto max-w-7xl">
                {children}
            </div>
        </DefaultLayout>
    );
}