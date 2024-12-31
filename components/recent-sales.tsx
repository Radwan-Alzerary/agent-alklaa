import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>أم</AvatarFallback>
        </Avatar>
        <div className="mr-4 space-y-1">
          <p className="text-sm font-medium leading-none">أحمد محمد</p>
          <p className="text-sm text-muted-foreground">
            ahmed.mohammed@email.com
          </p>
        </div>
        <div className="mr-auto font-medium">+1,999.00 ر.س</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/avatars/02.png" alt="Avatar" />
          <AvatarFallback>جع</AvatarFallback>
        </Avatar>
        <div className="mr-4 space-y-1">
          <p className="text-sm font-medium leading-none">جمال عبد الناصر</p>
          <p className="text-sm text-muted-foreground">jamal.nasser@email.com</p>
        </div>
        <div className="mr-auto font-medium">+39.00 ر.س</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Avatar" />
          <AvatarFallback>فط</AvatarFallback>
        </Avatar>
        <div className="mr-4 space-y-1">
          <p className="text-sm font-medium leading-none">فاطمة الزهراء</p>
          <p className="text-sm text-muted-foreground">
            fatima.zahra@email.com
          </p>
        </div>
        <div className="mr-auto font-medium">+299.00 ر.س</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/04.png" alt="Avatar" />
          <AvatarFallback>وخ</AvatarFallback>
        </Avatar>
        <div className="mr-4 space-y-1">
          <p className="text-sm font-medium leading-none">وليد خالد</p>
          <p className="text-sm text-muted-foreground">waleed.khaled@email.com</p>
        </div>
        <div className="mr-auto font-medium">+99.00 ر.س</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/05.png" alt="Avatar" />
          <AvatarFallback>سع</AvatarFallback>
        </Avatar>
        <div className="mr-4 space-y-1">
          <p className="text-sm font-medium leading-none">سارة عبد الله</p>
          <p className="text-sm text-muted-foreground">sara.abdullah@email.com</p>
        </div>
        <div className="mr-auto font-medium">+39.00 ر.س</div>
      </div>
    </div>
  )
}

