'use client';
import {
  capitalize,
  humanReadableDate,
  humanReadableTime
} from '@/functions/utility';
import { Hotel } from '@/lib/interface';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Table,
  ChipProps,
  Chip,
  Selection,
  Avatar,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
  SortDescriptor,
  Input,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure
} from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

const statusColorMap: Record<string, ChipProps['color']> = {
  open: 'success',
  closed: 'danger',
  maintainance: 'warning'
};

interface HotelProps {
  hotels: Hotel[];
}

const INITIAL_VISIBLE_COLUMNS = [
  'name',
  'description',
  'status',
  'updatedAt',
  'actions'
];

export default function Hotels({ hotels }: HotelProps) {
  const deleteModal = useDisclosure();
  const router = useRouter();
  const [selected, setSelected] = React.useState<Hotel | null>(null);
  const [filterValue, setFilterValue] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState<Selection>('all');
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending'
  });

  const handleDeleteHotel = async (hotel: Hotel) => {
    setIsDeleting(true);
    try {
      await fetch(`/api/hotels/id/${hotel._id}`, {
        method: 'DELETE'
      });
      const folderPath = `hotels/${selected?.slug}`;
      await fetch(`/api/s3-upload/folder`, {
        method: 'DELETE',
        body: JSON.stringify({
          folderPath: folderPath
        })
      });

      toast.success('Hotel deleted successfully');
      deleteModal.onClose();
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete hotel');
    }
    setIsDeleting(false);
  };

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredHotels = [...hotels];

    if (hasSearchFilter) {
      filteredHotels = filteredHotels.filter((hotel) =>
        hotel.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== 'all' &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredHotels = filteredHotels.filter((hotel) =>
        Array.from(statusFilter).includes(hotel.status)
      );
    }

    return filteredHotels;
  }, [hotels, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Hotel, b: Hotel) => {
      const first = a[sortDescriptor.column as keyof Hotel] as string;
      const second = b[sortDescriptor.column as keyof Hotel] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((hotel: Hotel, columnKey: React.Key) => {
    const cellValue = hotel[columnKey as keyof Hotel];
    switch (columnKey) {
      case 'name':
        return (
          <>
            <div className="flex items-center gap-2">
              <Avatar src={hotel.src} />
              <div className="flex flex-col">
                <p className="text-bold whitespace-nowrap text-sm capitalize">
                  {hotel.name}
                </p>
                <p className="text-bold whitespace-nowrap text-sm capitalize text-default-400">
                  {hotel.location}
                </p>
              </div>
            </div>
          </>
        );
      case 'description':
        return (
          <div className="flex flex-col">
            <p className="text-bold max-w-sm overflow-hidden text-ellipsis whitespace-nowrap text-sm capitalize text-default-400">
              {hotel.description}
            </p>
          </div>
        );
      case 'status':
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[hotel.status]}
            size="sm"
            variant="flat"
          >
            {hotel.status}
          </Chip>
        );
      case 'updatedAt':
        return (
          <>
            <p className="text-bold whitespace-nowrap text-sm capitalize">
              {humanReadableDate(hotel.updatedAt)}
            </p>
            <p className="text-bold whitespace-nowrap text-sm capitalize text-default-400">
              {humanReadableTime(hotel.updatedAt)}
            </p>
          </>
        );
      case 'actions':
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button variant="light" isIconOnly>
                <Icon icon="tabler:dots-vertical" fontSize={18} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                key={'view'}
                startContent={<Icon icon="ic:round-view-in-ar" fontSize={20} />}
                as={Link}
                href={`/${hotel.slug}`}
              >
                View
              </DropdownItem>
              <DropdownItem
                key={'edit'}
                startContent={<Icon icon="tabler:edit" fontSize={20} />}
                as={Link}
                href={`/dashboard/hotels/${hotel.slug}`}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                key={'delete'}
                startContent={<Icon icon="tabler:trash" fontSize={20} />}
                className="text-danger"
                color="danger"
                onPress={() => {
                  setSelected(hotel);
                  deleteModal.onOpen();
                }}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            // startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  variant="flat"
                  endContent={
                    <Icon icon={'tabler:chevron-down'} fontSize={16} />
                  }
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={
                    <Icon icon={'tabler:chevron-down'} fontSize={16} />
                  }
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button
              color="primary"
              endContent={<Icon icon={'tabler:plus'} />}
              as={Link}
              href="/dashboard/hotels/new"
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {hotels.length} hotels
          </span>
          <label className="flex items-center text-small text-default-400">
            Rows per page:
            <select
              className="bg-transparent text-small text-default-400 outline-none"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    hotels.length,
    hasSearchFilter
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden w-[30%] justify-end gap-2 sm:flex">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <>
      <Table
        aria-label="Hotels List"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: 'max-h-[382px]'
        }}
        selectedKeys={selectedKeys}
        //   selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
        onRowAction={(key) => {
          const promise = () =>
            new Promise((resolve) =>
              setTimeout(() => resolve({ name: 'Sonner' }), 2000)
            );

          toast.promise(promise, {
            loading: 'Loading...',
            error: 'Error',
            duration: 1500
          });
          router.push(`/dashboard/hotels/${key}`);
        }}
        className="cursor-pointer"
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={sortedItems} emptyContent={'No hotels found'}>
          {(item) => (
            <TableRow
              key={item.slug}
              className="transition-all hover:bg-default-100"
            >
              {(columnKey) => (
                // @ts-ignore
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal
        backdrop="blur"
        scrollBehavior="inside"
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex-col items-center">
                <Icon
                  icon="tabler:trash-x"
                  fontSize={54}
                  className="text-danger"
                />
                <h2 className="mt-4 max-w-xs text-center text-base">
                  Are you sure you permanently want to delete {selected?.name}{' '}
                  from the Database?
                </h2>
              </ModalHeader>
              <ModalBody className="items-center text-sm">
                You can&apos;t undo this action.
              </ModalBody>
              <ModalFooter className="flex-col-reverse sm:flex-row">
                <Button fullWidth variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  fullWidth
                  isLoading={isDeleting}
                  onPress={() => handleDeleteHotel(selected as Hotel)}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

const columns = [
  { name: 'NAME', uid: 'name', sortable: true },
  { name: 'DESCRIPTION', uid: 'description' },
  { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'UPDATED AT', uid: 'updatedAt', sortable: true },
  { name: 'ACTIONS', uid: 'actions' }
];

const statusOptions = [
  { name: 'OPEN', uid: 'open' },
  { name: 'CLOSED', uid: 'closed' },
  { name: 'MAINTAINANCE', uid: 'maintainance' }
];
