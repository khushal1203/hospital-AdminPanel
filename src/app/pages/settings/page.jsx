"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { PersonalInfoForm } from "./_components/personal-info";
import { UploadPhotoForm } from "./_components/upload-photo";
import { useSearchParams } from "next/navigation";

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  return (
    <div className="mx-auto w-full max-w-[1080px]">
      <Breadcrumb pageName="Settings" />

      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <PersonalInfoForm userId={userId} />
        </div>
        <div className="col-span-5 xl:col-span-2">
          <UploadPhotoForm userId={userId} />
        </div>
      </div>
    </div>
  );
}
