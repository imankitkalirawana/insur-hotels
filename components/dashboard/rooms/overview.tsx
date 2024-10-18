'use client';

import { humanReadableDate, humanReadableTime } from '@/functions/utility';
import { Room, RoomType } from '@/lib/interface';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Button,
  Checkbox,
  Divider,
  Input,
  Select,
  SelectItem,
  Textarea
} from '@nextui-org/react';
import { useFormik } from 'formik';
import React from 'react';
import { toast } from 'sonner';
import * as Yup from 'yup';

interface Props {
  room: Room;
  roomType: RoomType[];
}

export default function Overview({ room, roomType }: Props) {
  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().required('Price is required'),
    discount: Yup.object().shape({
      type: Yup.string().required('Discount type is required'),
      value: Yup.number().required('Discount value is required')
    })
  });

  const formik = useFormik({
    initialValues: {
      _id: room._id,
      title: room.title,
      description: room.description,
      price: room.price,
      size: room.size,
      discount: room.discount,
      available: room.available,
      maxGuests: room.maxGuests,
      type: room.type
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await fetch(`/api/rooms/${room._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        }).then(() => {
          toast.success('Room updated successfully');
        });
      } catch (error: any) {
        toast.error(error.message);
        console.error(error);
      }
    }
  });

  return (
    <>
      <div>
        <form onSubmit={formik.handleSubmit} className="mt-6">
          <dl className="divide-y divide-default">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Title</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.title && formik.errors.title ? true : false
                  }
                  errorMessage={formik.errors.title}
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Description</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.description && formik.errors.description
                      ? true
                      : false
                  }
                  errorMessage={formik.errors.description}
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Area</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  name="size"
                  value={
                    formik.values.size !== undefined
                      ? String(formik.values.size)
                      : ''
                  }
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : '';
                    formik.setFieldValue('size', value);
                  }}
                  isInvalid={
                    formik.touched.size && formik.errors.size ? true : false
                  }
                  errorMessage={formik.errors.size}
                  endContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-small text-default-400">sq.ft</span>
                    </div>
                  }
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Price</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  name="price"
                  value={
                    formik.values.price !== undefined
                      ? String(formik.values.price)
                      : ''
                  }
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : '';
                    formik.setFieldValue('price', value);
                  }}
                  isInvalid={
                    formik.touched.price && formik.errors.price ? true : false
                  }
                  errorMessage={formik.errors.price}
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-small text-default-400">₹</span>
                    </div>
                  }
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Discount</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  name="discount.value"
                  type="number"
                  value={
                    formik.values.discount !== undefined
                      ? String(formik.values.discount.value)
                      : ''
                  }
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : '';
                    formik.setFieldValue('discount.value', value);
                  }}
                  isInvalid={
                    formik.touched.discount?.value &&
                    formik.errors.discount?.value
                      ? true
                      : false
                  }
                  errorMessage={formik.errors.discount?.value}
                  endContent={
                    <select
                      className="border-0 bg-transparent text-small text-default-400 outline-none"
                      name="discount.type"
                      value={formik.values.discount.type}
                      onChange={formik.handleChange}
                    >
                      <option value="percentage">%</option>
                      <option value="flat">₹</option>
                    </select>
                  }
                  description={`Effective Price: ₹${formik.values.discount.type === 'percentage' ? (formik.values.price - (formik.values.price * formik.values.discount.value) / 100).toLocaleString('en-IN') : (formik.values.price - formik.values.discount.value).toLocaleString('en-IN')}`}
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Room Type</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Select
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  selectedKeys={[formik.values.type]}
                >
                  {roomType.map((type) => (
                    <SelectItem key={type.rid}>{type.name}</SelectItem>
                  ))}
                </Select>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Max Guests</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  name="maxGuests"
                  value={
                    formik.values.maxGuests !== undefined
                      ? String(formik.values.maxGuests)
                      : ''
                  }
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : '';
                    formik.setFieldValue('maxGuests', value);
                  }}
                  isInvalid={
                    formik.touched.maxGuests && formik.errors.maxGuests
                      ? true
                      : false
                  }
                  errorMessage={formik.errors.maxGuests}
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Available</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Checkbox
                  isSelected={formik.values.available}
                  name="available"
                  onChange={formik.handleChange}
                >
                  {formik.values.available ? 'Yes' : 'No'}
                </Checkbox>
              </dd>
            </div>
          </dl>
          <Divider />

          <div className="flex items-center justify-end py-4">
            <Button
              type="submit"
              color="primary"
              endContent={<Icon icon="tabler:check" />}
              isLoading={formik.isSubmitting}
            >
              Update
            </Button>
          </div>
          <dl>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Modified By</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {room.modifiedBy} on{' '}
                {humanReadableDate(room.updatedAt) +
                  ' at ' +
                  humanReadableTime(room.updatedAt)}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Added By</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {room.addedBy} on{' '}
                {humanReadableDate(room.createdAt) +
                  ' at ' +
                  humanReadableTime(room.createdAt)}
              </dd>
            </div>
          </dl>
        </form>
      </div>
    </>
  );
}
