import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategoriesNoLimit } from "@/lib/actions/category.actions";
import { Search } from "lucide-react";

const SearchRoot = async () => {
  const catagories = await getAllCategoriesNoLimit({
    query: "",
  });

  return (
    <form action={"/search"} method="GET">
      <div className="flex">
        {/* <Select name="category">
          <SelectTrigger>
            <SelectValue placeholder="所有分类" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem key={"所有分类"} value="所有分类">
                所有分类
              </SelectItem>
              {catagories.data.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select> */}

        <div className="relative">
          <Input
            type="text"
            name="query"
            placeholder="搜索..."
            className="pr-12 md:w-25 lg:w-72"
          />
          <Button
            size="icon"
            type="submit"
            className="absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer"
            variant="ghost"
          >
            <Search className="transform text-gray-400" size={18} />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchRoot;
