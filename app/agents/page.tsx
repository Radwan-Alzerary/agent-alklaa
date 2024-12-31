import { Suspense } from "react";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/DataTable"; // The specialized DataTable from your snippet
import { Button } from "@/components/ui/button";
import { getAgents } from "@/lib/api"; // Your API call
import Link from "next/link";
import { Agent } from "@/types";

import { columns } from "./columns"; // Import the columns we just defined

export default function AgentsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">إدارة المندوبين</h1>
        <Button asChild>
          <Link href="/agents/new">
            <Plus className="mr-2 h-4 w-4" /> إضافة وكيل
          </Link>
        </Button>
      </div>
      <Suspense fallback={<div>جاري التحميل...</div>}>
        <AgentListWrapper />
      </Suspense>
    </div>
  );
}

async function AgentList() {
  
  const agents = await getAgents();
  return <DataTable columns={columns} data={agents} searchKey="name" />;
}

function AgentListWrapper() {
  return (
    <Suspense fallback={<div>جاري تحميل قائمة الوكلاء...</div>}>
      {/* @ts-expect-error Server Component */}
      <AgentList />
    </Suspense>
  );
}
