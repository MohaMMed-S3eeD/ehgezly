import { getServiceById } from "@/app/providerDashboard/_actions/Service.action";
import React from "react";
import ServiceDetails from "./_components/ServiceDetails";

interface PageProps {
  params: Promise<{
    serviceId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { serviceId } = await params;
  const res = await getServiceById(serviceId);
  const service = res.data;

  if (!service) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-xl font-semibold">Service does not exist</h1>  
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <ServiceDetails service={service} />
    </div>
  );
};

export default Page;
