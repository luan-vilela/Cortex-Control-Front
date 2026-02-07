import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginationConfig } from "./DataTable";

export function DataTablePagination(config: PaginationConfig) {
  const {
    page,
    limit,
    total,
    totalPages: calculatedTotalPages,
    onPageChange,
  } = config;
  const totalPages = calculatedTotalPages || Math.ceil(total / limit);

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="px-4 py-6 border-t border-border">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando <strong>{startItem}</strong> até <strong>{endItem}</strong>{" "}
          de <strong>{total}</strong> resultados
        </p>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, page - 1))}
                className={
                  page === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5 && page > 3) {
                pageNum = Math.max(1, page - 2) + i;
              }
              return pageNum <= totalPages ? pageNum : null;
            })
              .filter(Boolean)
              .map((pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => onPageChange(pageNum as number)}
                    isActive={page === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                className={
                  page === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
