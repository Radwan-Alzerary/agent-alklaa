import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Product } from "@/types";
interface CustomProductSearchProps {
  products: Product[];
  onSelect: (product: Product) => void;
  placeholder?: string;
}

export function CustomProductSearch({ products, onSelect, placeholder = "ابحث عن منتج..." }: CustomProductSearchProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full"
      />
      {isOpen && filteredProducts.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onSelect(product);
                setSearch("");
                setIsOpen(false);
              }}
            >
              <div className="font-medium">{product.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
