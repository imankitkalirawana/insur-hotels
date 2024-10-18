'use client';
import {
  capitalize,
  humanReadableDate,
  humanReadableTime
} from '@/functions/utility';
import { Room } from '@/lib/interface';
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
import { useFormik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import slugify from 'slugify';
import { toast } from 'sonner';

const statusColorMap: Record<string, ChipProps['color']> = {
  available: 'success',
  'not-available': 'danger'
};

interface RoomProps {
  rooms: Room[];
}

const INITIAL_VISIBLE_COLUMNS = [
  'title',
  'description',
  'status',
  'updatedAt',
  'actions'
];

export default function Rooms({ rooms }: RoomProps) {
  const deleteModal = useDisclosure();
  const router = useRouter();
  const [selected, setSelected] = React.useState<Room | null>(null);
  const [filterValue, setFilterValue] = React.useState('');
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

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredRooms = [...rooms];

    if (hasSearchFilter) {
      filteredRooms = filteredRooms.filter(
        (room) =>
          room.title.toLowerCase().includes(filterValue.toLowerCase()) ||
          room.description.toLowerCase().includes(filterValue.toLowerCase()) ||
          room.hotelId.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredRooms;
  }, [rooms, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Room, b: Room) => {
      const first = a[sortDescriptor.column as keyof Room] as string;
      const second = b[sortDescriptor.column as keyof Room] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((room: Room, columnKey: React.Key) => {
    const cellValue = room[columnKey as keyof Room];
    switch (columnKey) {
      case 'title':
        return (
          <>
            <div className="flex items-center gap-2">
              <Avatar src={room.images[0].src} />
              <div className="flex flex-col">
                <p className="text-bold whitespace-nowrap text-sm capitalize">
                  {room.title}
                </p>
                <p className="text-bold whitespace-nowrap text-sm capitalize text-default-400">
                  {room.hotelId}
                </p>
              </div>
            </div>
          </>
        );
      case 'description':
        return (
          <div className="flex flex-col">
            <p className="text-bold max-w-sm overflow-hidden text-ellipsis whitespace-nowrap text-sm capitalize text-default-400">
              {room.description}
            </p>
          </div>
        );
      case 'status':
        return (
          <Chip
            className="capitalize"
            color={
              statusColorMap[room.available ? 'available' : 'not-available']
            }
            size="sm"
            variant="flat"
          >
            {room.available ? 'available' : 'Unavailable'}
          </Chip>
        );
      case 'updatedAt':
        return (
          <>
            <p className="text-bold whitespace-nowrap text-sm capitalize">
              {humanReadableDate(room.updatedAt)}
            </p>
            <p className="text-bold whitespace-nowrap text-sm capitalize text-default-400">
              {humanReadableTime(room.updatedAt)}
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
                key={'edit'}
                startContent={<Icon icon="tabler:edit" fontSize={20} />}
                as={Link}
                href={`/dashboard/rooms/${room._id}`}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                key={'delete'}
                startContent={<Icon icon="tabler:trash" fontSize={20} />}
                className="text-danger"
                color="danger"
                onPress={() => {
                  setSelected(room);
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
              href="/dashboard/rooms/new"
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {rooms.length} rooms
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
    rooms.length,
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

  const formikDelete = useFormik({
    initialValues: {},
    onSubmit: async () => {
      await fetch(`/api/rooms/${selected?._id}`, {
        method: 'DELETE'
      });
      const folderPath = `hotels/${selected?.hotelId}/rooms/${slugify(selected?.title || '', { lower: true })}`;
      await fetch(`/api/s3-upload/folder`, {
        method: 'DELETE',
        body: JSON.stringify({
          folderPath: folderPath
        })
      });
      toast.success('Room deleted successfully');
      deleteModal.onClose();
      router.refresh();
    }
  });

  return (
    <>
      <Table
        aria-label="Rooms List"
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
          router.push(`/dashboard/rooms/${key}`);
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
        <TableBody items={sortedItems} emptyContent={'No rooms found'}>
          {(item) => (
            <TableRow
              key={item._id}
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
                  Are you sure you permanently want to delete {selected?.title}{' '}
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
                  isLoading={formikDelete.isSubmitting}
                  onPress={() => formikDelete.handleSubmit()}
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
  { name: 'TITLE', uid: 'title', sortable: true },
  { name: 'DESCRIPTION', uid: 'description' },
  { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'UPDATED AT', uid: 'updatedAt', sortable: true },
  { name: 'ACTIONS', uid: 'actions' }
];
