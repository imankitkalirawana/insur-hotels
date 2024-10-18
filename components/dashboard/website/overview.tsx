import React from 'react';
import { Website } from '@/lib/interface';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Input,
  Textarea
} from '@nextui-org/react';
import { useFormik } from 'formik';
import { toast } from 'sonner';
import { IconPencil } from '@tabler/icons-react';
import Image from 'next/image';
import { isImage } from '@/functions/utility';
import { PHOTOMAXSIZE, VIDEOMAXSIZE } from '@/lib/config';

interface Props {
  website: Website;
}

export default function Overview({ website }: Props) {
  const formik = useFormik({
    initialValues: {
      pageTitle: website.pageTitle,
      metaDescription: website.metaDescription,
      og: website.og,
      keywords: website.keywords,
      title: website.name,
      description: website.description,
      url: website.url,
      email: website.email,
      phone: website.phone,
      preview: '',
      file: new File([''], '', { type: 'image/jpeg' })
    },
    onSubmit: async (values) => {
      try {
        if (values.preview) {
          let filename = `website/og.${values.file?.name.split('.').pop()}`;
          const formData = new FormData();
          formData.append('file', values.file);
          formData.append('filename', filename);
          await fetch(`/api/s3-upload`, {
            method: 'POST',
            body: formData
          }).then(async (res) => {
            const data = await res.json();
            values.og = data.url;
          });
        }
        const res = await fetch(`/api/website`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });
        if (res.ok) {
          let data = await res.json();
          toast.success(data.message);
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error.response?.data?.message || 'Something went wrong');
      }
    }
  });
  return (
    <>
      <div>
        <form onSubmit={formik.handleSubmit} className="mt-6">
          <dl className="divide-y divide-default">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Name</dt>
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
              <dt className="text-sm font-medium leading-6">URL</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Input
                  name="url"
                  value={formik.values.url}
                  onChange={formik.handleChange}
                  isInvalid={
                    formik.touched.url && formik.errors.url ? true : false
                  }
                  errorMessage={formik.errors.url}
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
                    id="photo"
                    name="photo"
                    type="file"
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const selectedFile: File = e.target.files[0];
                        if (
                          isImage(selectedFile.name) &&
                          selectedFile.size > PHOTOMAXSIZE
                        ) {
                          toast.error(`Image size should be less than 1MB`);
                          return;
                        } else if (selectedFile.size > VIDEOMAXSIZE) {
                          toast.error(`Video size should be less than 10MB`);
                          return;
                        }
                        formik.setFieldValue('file', selectedFile);
                        const reader = new FileReader();
                        reader.onload = () => {
                          const imageData = reader.result as string;
                          formik.setFieldValue('preview', imageData);
                        };
                        reader.readAsDataURL(selectedFile);
                      }
                    }}
                  />
                  <Image
                    className="aspect-video min-w-96 rounded-2xl object-cover object-center"
                    src={
                      formik.values.preview
                        ? formik.values.preview
                        : formik.values.og
                    }
                    alt="og"
                    width={384}
                    height={192}
                  />
                  <label
                    htmlFor="photo"
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
        </form>
      </div>
    </>
  );
}
