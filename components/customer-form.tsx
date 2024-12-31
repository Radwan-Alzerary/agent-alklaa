"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCustomer, updateCustomer, getAgents } from "@/lib/api";
import { Customer } from "@/app/customers/columns";
import { Agent, agentColumns } from "@/app/agents/columns";

const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => <p>جاري تحميل الخريطة...</p>,
});

interface CustomerFormProps {
  customer?: Customer;
}

export function CustomerForm({ customer }: CustomerFormProps) {
  const router = useRouter();
  const [name, setName] = useState(customer?.name || "");
  const [tradName, setTradName] = useState(customer?.name || "");
  const [accountNumber, setAccountNumber] = useState(customer?.name || "");
  const [email, setEmail] = useState(customer?.email || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [category, setCategory] = useState(customer?.category || "");
  const [assignedAgent, setAssignedAgent] = useState(customer?.assignedAgent || "");
  const [address, setAddress] = useState(customer?.address || "");
  const [nearestPlace, setNearestPlace] = useState(customer?.nearestPlace || "");
  const [lat, setLat] = useState(customer?.location.lat || 33.315241);
  const [lng, setLng] = useState(customer?.location.lng || 44.366145);
  const [registrationDate, setRegistrationDate] = useState(customer?.registrationDate || "");
  const [lastPurchaseDate, setLastPurchaseDate] = useState(customer?.lastPurchaseDate || "");
  const [totalPurchases, setTotalPurchases] = useState(customer?.totalPurchases?.toString() || "0");
  const [loyaltyPoints, setLoyaltyPoints] = useState(customer?.loyaltyPoints?.toString() || "0");
  const [isLoading, setIsLoading] = useState(false);
  // Inside the CustomerForm component
  const [agents, setAgents] = useState<Agent[]>([]);

  // Fetch agents on component mount
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const agentData = await getAgents(); // Fetch agents from the backend
        setAgents(agentData);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    fetchAgents();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const customerData: Omit<Customer, "id"> = {
        name,
        tradName,
        email,
        phone,
        accountNumber,
        category,
        assignedAgent,
        address,
        nearestPlace,
        location: { lat, lng },
        registrationDate,
        lastPurchaseDate,
        totalPurchases: parseInt(totalPurchases),
        loyaltyPoints: parseInt(loyaltyPoints),
        balance: customer?.balance || 0,
        debts: customer?.debts || [],
      };

      if (customer) {
        await updateCustomer(customer._id, customerData); // Update customer via API
      } else {
        await createCustomer(customerData); // Create new customer via API
      }

      alert(customer ? "تم تحديث العميل بنجاح" : "تمت إضافة العميل بنجاح");
      router.push("/customers"); // Redirect to customers page
      router.refresh(); // Refresh the page
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("حدث خطأ أثناء حفظ بيانات العميل");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMapClick = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">الاسم</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="name">الاسم التجاري</Label>
        <Input id="tradName" value={tradName} onChange={(e) => setTradName(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="accountNumber">رقم العميل</Label>
        <Input id="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="phone">رقم الهاتف</Label>
        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="category">الفئة</Label>
        <Select onValueChange={setCategory} defaultValue={category}>
          <SelectTrigger>
            <SelectValue placeholder="اختر فئة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="عادي">عادي</SelectItem>
            <SelectItem value="VIP">VIP</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="assignedAgent">الوكيل المعين</Label>
        <Select
          value={assignedAgent} // Bind the Select value to the state
          onValueChange={(value) => setAssignedAgent(value)} // Update state on selection
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر وكيل" />
          </SelectTrigger>
          <SelectContent>
            {agents.map((agent) => (
              <SelectItem key={agent._id} value={agent._id}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="address">العنوان</Label>
        <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="nearestPlace">أقرب معلم</Label>
        <Input
          id="nearestPlace"
          value={nearestPlace}
          onChange={(e) => setNearestPlace(e.target.value)}
          required
        />
      </div>
      <div>
        <Label>الموقع</Label>
        <div className="h-[400px] w-full mb-4">
          <MapComponent lat={lat} lng={lng} onLocationSelect={handleMapClick} />
        </div>
        <div className="flex space-x-4">
          <div className="w-1/2">
            <Label htmlFor="lat">خط العرض</Label>
            <Input
              id="lat"
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(parseFloat(e.target.value))}
              required
            />
          </div>
          <div className="w-1/2">
            <Label htmlFor="lng">خط الطول</Label>
            <Input
              id="lng"
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(parseFloat(e.target.value))}
              required
            />
          </div>
        </div>
      </div>
      <div>
        <Label htmlFor="registrationDate">تاريخ التسجيل</Label>
        <Input
          id="registrationDate"
          type="date"
          value={registrationDate}
          onChange={(e) => setRegistrationDate(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="lastPurchaseDate">تاريخ آخر شراء</Label>
        <Input
          id="lastPurchaseDate"
          type="date"
          value={lastPurchaseDate}
          onChange={(e) => setLastPurchaseDate(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="totalPurchases">إجمالي المشتريات</Label>
        <Input
          id="totalPurchases"
          type="number"
          value={totalPurchases}
          onChange={(e) => setTotalPurchases(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="loyaltyPoints">نقاط الولاء</Label>
        <Input
          id="loyaltyPoints"
          type="number"
          value={loyaltyPoints}
          onChange={(e) => setLoyaltyPoints(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "جاري الحفظ..." : customer ? "تحديث العميل" : "إضافة العميل"}
      </Button>
    </form>
  );
}
