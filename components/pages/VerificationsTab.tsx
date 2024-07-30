"use client";

import Table from "@/components/table/Table";
import { getVerifications } from "@/lib/queries/verifications";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { UserVerification, Verification } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

interface VerificationType extends Verification {
  users: UserVerification[];
}

const VerificationsTab = () => {
  const { data: verifications, isLoading } = useQuery({
    queryFn: getVerifications,
    queryKey: ["verifications"],
  });

  return (
    <div className="w-full mt-6">
      <div className="pt-6">
        <Table
          isLoading={isLoading}
          data={verifications || []}
          columns={{
            styles: {
              contaierStyle:
                "grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
              itemStyle: "flex w-full",
            },
            render: (row: VerificationType) => (
              <div className="w-full bg-white p-5 rounded-md flex flex-col gap-6 justify-between">
                <div className="flex flex-col gap-2">
                  <div className="font-bold text-gray-900">{row.name}</div>
                  <div className="text-xs">{row.description}</div>
                  <div className="flex gap-2 items-center text-xs">
                    {row.requiredDocs
                      .filter((doc) => doc.length > 0)
                      .slice(0, 1)
                      .map((doc: string, index: number) => (
                        <div key={index} className="py-1 text-xs rounded-md">
                          {doc}
                        </div>
                      ))}

                    {row.requiredDocs.length > 1
                      ? `+ ${row.requiredDocs.length - 1} more doc`
                      : ""}
                  </div>
                  <div className="flex items-center gap-3">
                    <UserGroupIcon className="text-green-500 w-5" />{" "}
                    {row.users.length} users
                  </div>
                </div>
                {/* <Status
                  status={row.isAutoApproved ? true : null}
                  trueText="Auto approved"
                  pendingText="Approval Required"
                /> */}
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default VerificationsTab;
