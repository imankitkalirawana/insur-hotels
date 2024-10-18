'use client';

import {
  humanReadableDate,
  humanReadableTime,
  isImage
} from '@/functions/utility';
import { PHOTOMAXSIZE, VIDEOMAXSIZE } from '@/lib/config';
import { Hotel } from '@/lib/interface';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Input,
  Select,
  SelectItem,
  Textarea
} from '@nextui-org/react';
import { IconPencil } from '@tabler/icons-react';
import { useFormik } from 'formik';
import React from 'react';
import { toast } from 'sonner';
import * as Yup from 'yup';
import Image from 'next/image';

interface Props {
  hotel: Hotel;
}

export default function Overview({ hotel }: Props) {
  const [file, setFile] = React.useState<File | null>(null);
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    slug: Yup.string().required('Slug is required'),
    location: Yup.string().required('Location is required')
  });

  const formik = useFormik({
    initialValues: {
      _id: hotel._id,
      name: hotel.name,
      description: hotel.description,
      email: hotel.email,
      phone: hotel.phone,
      address: hotel.address,
      slug: hotel.slug,
      og: hotel.og,
      src: hotel.src,
      url: hotel.url,
      status: hotel.status,
      location: hotel.location,
      instagram: hotel.instagram || '',
      coordinates: hotel.coordinates,
      pageTitle: hotel.pageTitle,
      keywords: hotel.keywords,
      metaDescription: hotel.metaDescription,
      previewPhoto: '',
      ogpreview: '',
      ogfile: new File([''], '', { type: 'image/jpeg' })
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (values.previewPhoto) {
          const filename = `hotels/${hotel.slug}/src.${file?.name.split('.').pop()}`;
          const formData = new FormData();
          formData.append('file', file as File);
          formData.append('filename', filename);
          await fetch(`/api/s3-upload`, {
            method: 'POST',
            body: formData
          }).then(async (res) => {
            const data = await res.json();
            values.src = data.url;
          });
        }
        if (values.ogpreview) {
          const filename = `hotels/${hotel.slug}/og.${values.ogfile?.name.split('.').pop()}`;
          const formData = new FormData();
          formData.append('file', values.ogfile);
          formData.append('filename', filename);
          await fetch(`/api/s3-upload`, {
            method: 'POST',
            body: formData
          }).then(async (res) => {
            const data = await res.json();
            values.og = data.url;
          });
        }
        await fetch(`/api/hotels/id/${hotel._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values)
        }).then(() => {
          toast.success('Hotel updated successfully');
        });
      } catch (error: any) {
        toast.error(error.message);
        console.error(error);
      }
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile: File = e.target.files[0];
      if (selectedFile.size > PHOTOMAXSIZE) {
        toast.error('File size should be less than 1MB');
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        formik.setValues({
          ...formik.values,
          previewPhoto: imageData
        });
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={formik.handleSubmit} className="mt-6">
          <div className="flex gap-4 py-4">
            <input
              id="photo"
              name="photo"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange(e)}
            />
            <Badge
              classNames={{
                badge: 'w-5 h-5'
              }}
              color="primary"
              content={
                <Button
                  isIconOnly
                  className="p-0 text-primary-foreground"
                  radius="full"
                  size="sm"
                  variant="light"
                  as={'label'}
                  htmlFor="photo"
                >
                  <IconPencil size={12} />
                </Button>
              }
              placement="bottom-right"
              shape="circle"
            >
              <Avatar
                className="h-14 w-14"
                src={
                  formik.values.previewPhoto
                    ? formik.values.previewPhoto
                    : hotel.src
                }
              />
            </Badge>
          </div>
          <p className="text-small text-default-400">
            This image will be used as the thumbnail image for the hotel.
          </p>
          <dl className="divide-y divide-default">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Name</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.name && formik.errors.name ? true : false
                  }
                  errorMessage={formik.errors.name}
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
              <dt className="text-sm font-medium leading-6">Email</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.email && formik.errors.email ? true : false
                  }
                  errorMessage={formik.errors.email}
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Phone</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.phone && formik.errors.phone ? true : false
                  }
                  errorMessage={formik.errors.phone}
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Location</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  name="location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.location && formik.errors.location
                      ? true
                      : false
                  }
                  errorMessage={formik.errors.location}
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Instagram</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  className="pl-0"
                  name="instagram"
                  value={formik.values.instagram}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.instagram && formik.errors.instagram
                      ? true
                      : false
                  }
                  startContent={
                    <span className="text-default-500">www.instagram.com/</span>
                  }
                  errorMessage={formik.errors.instagram}
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Coordinates</dt>
              <dd className="mt-1 space-y-2 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  label="Latitude"
                  name="coordinates.latitude"
                  value={formik.values.coordinates.latitude as any}
                  type="number"
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.coordinates?.latitude &&
                    formik.errors.coordinates?.latitude
                      ? true
                      : false
                  }
                  errorMessage={formik.errors.coordinates?.latitude}
                  size="sm"
                />
                <Input
                  label="Longitude"
                  name="coordinates.longitude"
                  value={formik.values.coordinates.longitude as any}
                  type="number"
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.coordinates?.longitude &&
                    formik.errors.coordinates?.longitude
                      ? true
                      : false
                  }
                  errorMessage={formik.errors.coordinates?.longitude}
                  size="sm"
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Full Address</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Textarea
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.address && formik.errors.address
                      ? true
                      : false
                  }
                  errorMessage={formik.errors.address}
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Status</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Select
                  aria-label="Status"
                  selectedKeys={[formik.values.status]}
                  name="status"
                  onSelectionChange={(key) => {
                    formik.setFieldValue('status', key.currentKey);
                  }}
                >
                  <SelectItem color="success" key="open">
                    Open
                  </SelectItem>
                  <SelectItem color="danger" key="closed">
                    Closed
                  </SelectItem>
                  <SelectItem color="warning" key="maintainance">
                    Maintainance
                  </SelectItem>
                </Select>
              </dd>
            </div>
          </dl>
          <Divider />
          <dl className="divide-y divide-default">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Page Title</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  name="pageTitle"
                  value={formik.values.pageTitle}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.pageTitle && formik.errors.pageTitle
                      ? true
                      : false
                  }
                  errorMessage={formik.errors.pageTitle}
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">
                Meta Description
              </dt>

              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  name="metaDescription"
                  value={formik.values.metaDescription}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.metaDescription &&
                    formik.errors.metaDescription
                      ? true
                      : false
                  }
                  errorMessage={formik.errors.metaDescription}
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Keywords</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  name="keywords"
                  value={formik.values.keywords}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.keywords && formik.errors.keywords
                      ? true
                      : false
                  }
                  errorMessage={formik.errors.keywords}
                />
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">OG</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <div className="relative w-96 rounded-2xl bg-default">
                  <input
                    id="og-photo"
                    name="og-photo"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const selectedFile: File = e.target.files[0];
                        formik.setFieldValue('ogfile', selectedFile);
                        const reader = new FileReader();
                        reader.onload = () => {
                          const imageData = reader.result as string;
                          formik.setFieldValue('ogpreview', imageData);
                        };
                        reader.readAsDataURL(selectedFile);
                      }
                    }}
                  />
                  <Image
                    className="aspect-video min-w-96 rounded-2xl object-cover object-center"
                    src={
                      formik.values.ogpreview
                        ? formik.values.ogpreview
                        : formik.values.og
                    }
                    alt="og"
                    width={384}
                    height={192}
                  />
                  <label
                    htmlFor="og-photo"
                    className="absolute inset-0 z-10 flex h-full w-full items-center justify-center rounded-2xl opacity-0 transition-all hover:bg-black/30 hover:opacity-100"
                  >
                    <IconPencil size={56} className="text-white" />
                  </label>
                </div>
              </dd>
            </div>
          </dl>
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
                {hotel.modifiedBy} on{' '}
                {humanReadableDate(hotel.updatedAt) +
                  ' at ' +
                  humanReadableTime(hotel.updatedAt)}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Added By</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {hotel.addedBy} on{' '}
                {humanReadableDate(hotel.createdAt) +
                  ' at ' +
                  humanReadableTime(hotel.createdAt)}
              </dd>
            </div>
          </dl>
        </form>
      </div>
    </>
  );
}
